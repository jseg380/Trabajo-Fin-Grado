import request from 'supertest';
import app from '../../src/backend/server.js';
import User from '../../src/backend/models/User.js';

describe('Auth API - /api/auth', () => {

  // This ensures that even if other tests create users, 
  // this test file has a clean slate for its specific needs.
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Auth Test User', email: 'auth@test.com', password: 'password123' });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('name', 'Auth Test User');
    expect(res.headers['set-cookie'][0]).toContain('jwt=');
  });

  it('should log in an existing user and return a cookie', async () => {
    // First, create the user directly in the database for a clean test
    await User.create({ name: 'Login User', email: 'login@test.com', password: 'password123' });
    
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.com', password: 'password123' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.email).toEqual('login@test.com');
  });
});
