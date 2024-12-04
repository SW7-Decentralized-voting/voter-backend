import connectDb from '../setup/connect.js';
import { afterAll, beforeEach, describe, it, jest } from '@jest/globals';
import populate from '../db/populate.js';
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import router from '../../routes/keyCountRoutes.js';
import PollingStation from '../../schemas/PollingStation.js';
import Key from '../../schemas/Key.js';
import { v4 as uuidv4 } from 'uuid';

const baseRoute = '/api/v1/keyCount';

const app = express();
app.use(express.json());
app.use(baseRoute, router);

const server = app.listen(0);

beforeAll(async () => {
	connectDb();
	await populate();
});

describe('GET /api/v1/keyCount', () => {
	let pollingStation;
	beforeEach(async () => {
		await Key.deleteMany();
		pollingStation = await PollingStation.findOne();
		// insert 20 keys for the polling station using uuidv4
		await Key.insertMany(Array.from({ length: 20 }, () => ({ pollingStation: pollingStation._id, keyHash: uuidv4(), isUsed: false })));
	});
	it('should return 200 OK and key count', async () => {
		const response = await request(app).get(baseRoute + '?pollingStation=' + pollingStation._id);
		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({ count: 20 });
	});

	it('should return 200 OK and count (some keys used)', async () => {
		// Update 5 keys to be used
		const keysToUpdate = await Key.find({}).limit(5);
		await Key.updateMany({ _id: { $in: keysToUpdate.map(key => key._id) } }, { isUsed: true });

		const response = await request(app).get(baseRoute + '?pollingStation=' + pollingStation._id);
		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({ count: 15 });
	});

	it('should return 400 Bad Request with no polling station', async () => {
		const response = await request(app).get(baseRoute);
		expect(response.statusCode).toBe(400);
		expect(response.body).toEqual({ error: 'Polling station is required' });
	});

	it('should return 400 Bad Request with invalid polling station', async () => {
		const response = await request(app).get(baseRoute + '?pollingStation=invalid');
		expect(response.statusCode).toBe(400);
		expect(response.body).toEqual({ error: 'Polling station id invalid' });
	});

	it('should return 400 Bad Request with polling station not found', async () => {
		const response = await request(app).get(baseRoute + '?pollingStation=' + new mongoose.Types.ObjectId());
		expect(response.statusCode).toBe(400);
		expect(response.body).toEqual({ error: 'Polling station not found' });
	});

	it('should return 500 Internal Server Error with unexpected error', async () => {
		jest.spyOn(PollingStation, 'findById').mockRejectedValue(new Error('Unexpected error'));
		jest.spyOn(console, 'error').mockImplementationOnce(() => {});
		const response = await request(app).get(baseRoute + '?pollingStation=' + pollingStation._id);
		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({ error: 'Unexpected error happened while fetching key count' });
	});
});

afterAll(async () => {
	await mongoose.connection.close();
	server.close();
});