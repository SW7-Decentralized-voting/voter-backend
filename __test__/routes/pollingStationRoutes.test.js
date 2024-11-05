import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import router from '../../routes/pollingStationRoutes.js'; // Adjust the import path to where your route is located
import connectDb from '../setup/connect.js';
import populate from '../db/populate.js';
import PortMapping from '../../schemas/PortMapping.js';
import PollingStation from '../../schemas/PollingStation.js';

const baseRoute = '/api/v1/pollingStations';

const app = express();
app.use(express.json());
app.use(baseRoute, router);

const server = app.listen(0);

beforeAll(async () => {
	connectDb();
	await populate();
});

describe('GET /api/v1/pollingStations', () => {
	it('should return 200 OK and the polling station id corresponding to the port', async () => {
		const pollingStation = await PollingStation.findOne();
		expect(pollingStation).not.toBeNull();
		const mapping = await PortMapping({
			port: 3002,
			pollingStation: pollingStation._id,
		}).save();
		const response = await request(app)
			.get(baseRoute + '/3002');
		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({ 
			pollingStation: mapping.pollingStation.toString(),
			port: mapping.port,
		});
	});

	it('should return 400 Bad Request with non-numeric port', async () => {
		const response = await request(app)
			.get(baseRoute + '/invalid');
		expect(response.statusCode).toBe(400);
		expect(response.body).toEqual({ error: 'Port must be a number' });
	});

	it('should return 404 Not Found with non-existent port', async () => {
		const response = await request(app)
			.get(baseRoute + '/3003');
		expect(response.statusCode).toBe(404);
		expect(response.body).toEqual({ error: 'Port not found' });
	});
});

afterAll(async () => {
	await mongoose.connection.close();
	server.close();
});