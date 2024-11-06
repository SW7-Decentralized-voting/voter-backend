import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import router from '../../routes/districtRoutes.js'; 
import connectDb from '../setup/connect.js';
import mockdata from '../../db/mockdata.js';
import { jest } from '@jest/globals';
import Constituency from '../../schemas/Constituency.js';
import NominationDistrict from '../../schemas/NominationDistrict.js';
import populate from '../db/populate.js';

const baseRoute = '/api/v1/districts';

const app = express();
app.use(express.json());
app.use(baseRoute, router);

const server = app.listen(0);

beforeAll(async () => {
	connectDb();

	await populate();
});

describe('GET /api/v1/districts', () => {
	it('should return 200 OK and list of all districts', async () => {
		const response = await request(app).get(baseRoute);
		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual(expect.any(Array));
		expect(response.body.length).toBe(mockdata.nominationDistricts.length);

		response.body.forEach((district) => {
			expect(district).toMatchObject({
				_id: expect.any(String),
				name: expect.any(String),
				constituency: expect.any(String),
			});
		});
	});

	it('should return 200 OK and district with query', async () => {
		const district = await NominationDistrict.find({ name: 'District 1' });
		const response = await request(app).get(baseRoute + '?name=District%201');
		expect(response.statusCode).toBe(200);
		expect(response.body.length).toBe(district.length);

		response.body.forEach((district) => {
			expect(district).toMatchObject({
				_id: expect.any(String),
				name: 'District 1',
				constituency: expect.any(String),
			});
		});
	});

	it('should return 200 OK and populate constituency with query', async () => {
		const district = await NominationDistrict.find({ name: 'District 1' });
		const response = await request(app).get(baseRoute + '?name=District%201&populate=constituency');
		expect(response.statusCode).toBe(200);
		expect(response.body.length).toBe(district.length);

		response.body.forEach((district) => {
			expect(district).toMatchObject({
				_id: expect.any(String),
				name: 'District 1',
				constituency: expect.objectContaining({
					name: expect.any(String),
				}),
			});
		});
	});

	it('should return 400 Bad Request with invalid query field', async () => {
		const response = await request(app).get(baseRoute + '?invalidQuery=invalid');
		expect(response.statusCode).toBe(400);
		expect(response.body).toEqual({ error: 'Invalid query parameter: invalidQuery' });
	});

	it('should return 500 Internal Server Error if an uncaught error happens', async () => {
		jest.spyOn(NominationDistrict, 'find').mockImplementationOnce(() => {
			throw new Error('Uncaught error');
		});
		jest.spyOn(console, 'error').mockImplementationOnce(() => {});
		const response = await request(app).get(baseRoute);
		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({ error: 'Error fetching districts' });
	});

});

afterAll(async () => {
	// You're my wonderwall
	await NominationDistrict.deleteMany();
	await Constituency.deleteMany();
	await mongoose.connection.close();
	server.close();
});