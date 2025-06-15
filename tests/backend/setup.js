import { jest } from '@jest/globals';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../../src/backend/server.js';

let mongod;
let server;

// Use empty mock implementation of console.log to avoid polluting test output
jest.spyOn(console, 'log').mockImplementation(() => {});

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  server = app.listen(4000); // Run tests on a different port
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
  await server.close();
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
