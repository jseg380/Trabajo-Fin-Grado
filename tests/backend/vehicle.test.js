import request from 'supertest';
import app from '../../src/backend/server.js';
import User from '../../src/backend/models/User.js';
import jwt from 'jsonwebtoken';

describe('Vehicle API - /api/vehicles', () => {
  let token;
  let userId;
  let vehicleId;

  beforeAll(async () => {
    // Clean slate for this test suite
    await User.deleteMany({});

    // Create user directly instead of going through the API for setup
    const user = await User.create({
      name: 'Vehicle Tester',
      email: 'vehicle@test.com',
      password: 'password',
    });

    userId = user._id.toString();
    token = jwt.sign({ userId: userId }, process.env.JWT_SECRET);
  });

  it('should create a vehicle for an authenticated user', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Cookie', `jwt=${token}`) // Manually attach the token as a cookie
      .send({ make: 'Honda', model: 'Test-V', year: 2024, fuelType: 'gasoline', emissions: 150 });
      
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('make', 'Honda');
    vehicleId = res.body._id; // Save the ID for the next test
  });

  it('should get a list of vehicles for an authenticated user', async () => {
    const res = await request(app)
      .get('/api/vehicles')
      .set('Cookie', `jwt=${token}`); // Attach the token

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]._id).toEqual(vehicleId);
  });

  it('should delete a vehicle for an authenticated user', async () => {
    const res = await request(app)
      .delete(`/api/vehicles/${vehicleId}`)
      .set('Cookie', `jwt=${token}`); // Attach the token

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Vehicle removed');
  });
});
