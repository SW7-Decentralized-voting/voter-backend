// Tests for /routes/index.js

import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import router from '../../routes/index.js'; 
import connectDb from '../setup/connect.js';

const baseRoute = '/api/v1';

const app = express();
app.use(express.json());
app.use(baseRoute, router);

const server = app.listen(0);

let db;
beforeAll(async () => {
  db = await connectDb();
});

describe('GET /api/v1', () => {
	it('should return 200 OK', async () => {
		const response = await request(app).get(baseRoute);
		expect(response.statusCode).toBe(200);
	});
});

afterAll(async () => {
	// You're my wonderwall
	await db.collection('candidates').deleteMany();
	await mongoose.connection.close();
	server.close();
});