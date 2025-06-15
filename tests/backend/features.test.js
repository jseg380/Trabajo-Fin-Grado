import request from 'supertest';
import app from '../../src/backend/server.js';
import User from '../../src/backend/models/User.js';
import jwt from 'jsonwebtoken';

describe('Feature APIs - Recommendations, Stats, Maintenance', () => {
  let token;
  let userId;

  // Before all tests, create a user and seed the database using our init endpoint
  beforeAll(async () => {
    // We call our own API to set up the complex state with vehicles and trips
    await request(app).post('/api/init-db');

    const user = await User.findOne({ email: 'test@example.com' });
    userId = user._id.toString();
    token = jwt.sign({ userId: userId }, process.env.JWT_SECRET);
  });

  // Test the Recommendation Controller
  describe('GET /api/recommendations', () => {
    it('should return a sorted list of vehicle recommendations', async () => {
      const res = await request(app)
        .post('/api/recommendations')
        .set('Cookie', `jwt=${token}`)
        .send({ distance: 100 });

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(1);
      // The first car should have lower or equal totalEmissions than the second
      expect(res.body[0].totalEmissions).toBeLessThanOrEqual(res.body[1].totalEmissions);
    });

    it('should return a 400 error if distance is not provided', async () => {
        const res = await request(app)
            .post('/api/recommendations')
            .set('Cookie', `jwt=${token}`)
            .send({}); // Missing distance
        
        expect(res.statusCode).toEqual(400);
    });
  });

  // Test the Stats Controller
  describe('GET /api/stats', () => {
    it('should return aggregated stats for the user', async () => {
      const res = await request(app)
        .get('/api/stats')
        .set('Cookie', `jwt=${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('totalDistance');
      expect(res.body).toHaveProperty('totalEmissions');
      expect(res.body.tripCount).toBeGreaterThan(0);
      expect(res.body.vehicleCount).toBeGreaterThan(0);
    });
  });

  // Test the Maintenance Controller
  describe('GET /api/maintenance/summary', () => {
    it('should return a list of upcoming and overdue maintenance tasks', async () => {
      const res = await request(app)
        .get('/api/maintenance/summary')
        .set('Cookie', `jwt=${token}`);
        
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      // Based on our seeder, we expect to see some tasks
      expect(res.body.length).toBeGreaterThan(0);
      // Check for an overdue task from our seeder data
      const overdueTask = res.body.find(task => task.isOverdue === true);
      expect(overdueTask).toBeDefined();
    });
  });

  // Test the Trip Controller
  describe('POST /api/trips/log', () => {
    it('should successfully log a new trip and update vehicle/user stats', async () => {
        const vehicles = await request(app).get('/api/vehicles').set('Cookie', `jwt=${token}`);
        const vehicleIdToLog = vehicles.body[0]._id;

        const res = await request(app)
            .post('/api/trips/log')
            .set('Cookie', `jwt=${token}`)
            .send({ vehicleId: vehicleIdToLog, distance: 50 });

        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual('Trip logged successfully!');
    });
  });
});
