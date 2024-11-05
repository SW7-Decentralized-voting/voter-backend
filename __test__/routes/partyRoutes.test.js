import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import router from '../../routes/partyRoutes.js'; // Adjust the import path to where your route is located
import connectDb from '../setup/connect.js';
import mockdata from '../../db/mockdata.js';
import Party from '../../schemas/Party.js';
import { jest } from '@jest/globals';
import populate from '../db/popiulate.js';

const baseRoute = '/api/v1/parties';

const app = express();
app.use(express.json());
app.use(baseRoute, router);

const server = app.listen(0);

beforeAll(async () => {
	connectDb();

	await populate();
});

describe('GET /api/v1/parties', () => {
	it('should return 200 OK and list of all parties', async () => {
		const response = await request(app).get(baseRoute);
		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual(expect.any(Array));
		expect(response.body.length).toBe(mockdata.parties.length);

		response.body.forEach((party) => {
			expect(party).toMatchObject({
				_id: expect.any(String),
				name: expect.any(String),
				list: expect.any(String),
			});
		});
	});

	it('should return 200 OK and party with query', async () => {
		const party = await Party.find({ name: 'Nordlisten' });
		const response = await request(app).get(baseRoute + '?name=Nordlisten');
		expect(response.statusCode).toBe(200);
		expect(response.body.length).toBe(party.length);

		response.body.forEach((party) => {
			expect(party).toMatchObject({
				_id: expect.any(String),
				name: 'Nordlisten',
				list: expect.any(String),
			});
		});
	});

	it('should return 400 Bad Request with invalid query field', async () => {
		const response = await request(app).get(baseRoute + '?invalidQuery=invalid');
		expect(response.statusCode).toBe(400);
		expect(response.body).toEqual({ error: 'Invalid query parameter: invalidQuery' });
	});

	it('should return 500 Internal Server Error if an uncaught error happens', async () => {
		jest.spyOn(Party, 'find').mockImplementationOnce(() => {
			throw new Error('Error fetching parties');
		});
		jest.spyOn(console, 'error').mockImplementationOnce(() => {});
		const response = await request(app).get(baseRoute);
		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({ error: 'Error fetching parties' });
	});
});

afterAll(async () => {
	// You're my wonderwall
	await Party.deleteMany();
	await mongoose.connection.close();
	server.close();
});