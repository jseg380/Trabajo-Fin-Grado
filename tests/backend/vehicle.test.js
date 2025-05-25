import request from 'supertest';
import app from '../../src/backend/index.js';
import { describe, it } from '@jest/globals';

describe('Vehicle API', () => {
  it('should return 404 for non-existent routes', async () => {
    // Test that the app exists but has no routes yet
    await request(app).get('/nonexistent').expect(404);
  });

  it('should fail to create a vehicle (no backend yet)', async () => {
    const mockVehicle = { brand: 'Volkswagen' };
    await request(app)
      .post('/api/vehicles')
      .send(mockVehicle)
      .expect(404); // Expect 404 because no route exists yet
  });
});
