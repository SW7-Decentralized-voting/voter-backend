import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import router from '../../routes/constituencyRoutes.js'; // Adjust the import path to where your route is located
import connectDb from '../setup/connect.js';
import mockdata from '../../db/mockdata.js';
import { jest } from '@jest/globals';
import Constituency from '../../schemas/Constituency.js';
import populate from '../db/populate.js';

const baseRoute = '/api/v1/constituencies';

const app = express();
app.use(express.json());
app.use(baseRoute, router);

const server = app.listen(0);

beforeAll(async () => {
	connectDb();

	await populate();
});

describe('GET /api/v1/constituencies', () => {
	it('should return 200 OK and list of all constituencies', async () => {
		const response = await request(app).get(baseRoute);
		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual(expect.any(Array));
		expect(response.body.length).toBe(mockdata.constituencies.length);

		response.body.forEach((constituency) => {
			expect(constituency).toMatchObject({
				_id: expect.any(String),
				name: expect.any(String),
			});
		});
	});

	it('should return 200 OK and constituency with query', async () => {
		const constituency = await Constituency.find({ name: 'Constituency 1' });
		const response = await request(app).get(baseRoute + '?name=Constituency%201');
		expect(response.statusCode).toBe(200);
		expect(response.body.length).toBe(constituency.length);

		response.body.forEach((constituency) => {
			expect(constituency).toMatchObject({
				_id: expect.any(String),
				name: 'Constituency 1',
			});
		});
	});

	it('should return 400 Bad Request with invalid query field', async () => {
		const response = await request(app).get(baseRoute + '?invalidQuery=invalid');
		expect(response.statusCode).toBe(400);
		expect(response.body).toEqual({ error: 'Invalid query parameter: invalidQuery' });
	});

	it('should return 500 Internal Server Error if an uncaught error happens', async () => {
		jest.spyOn(Constituency, 'find').mockImplementationOnce(() => {
			throw new Error('Uncaught error');
		});
		jest.spyOn(console, 'error').mockImplementationOnce(() => {});
		const response = await request(app).get(baseRoute);
		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({ error: 'Error fetching constituencies' });
	});

});

afterAll(async () => {
	// You're my wonderwall
	await Constituency.deleteMany();
	await mongoose.connection.close();
	server.close();
});