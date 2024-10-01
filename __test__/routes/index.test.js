// Tests for /routes/index.js

import request from 'supertest';
import express from 'express';
import router from '../../routes/index.js'; // Adjust the import path to where your route is located
import Candidate from '../../models/candidates.js';
import Party from '../../models/parties.js';
import { jest } from '@jest/globals';
import { candidates, parties } from '../db/mockData.js';

const baseRoute = '/api/v1';

const app = express();
app.use(express.json());
app.use(baseRoute, router);

const server = app.listen(8888);

//jest.mock('../../models/candidates.js');

const standardCall = {
	"attributes": ["id", "full_name", "partyId"],
	"include": [
		{
			"association": "party",
			"attributes": ["id", "partyName"],
		},
	],
}

describe('GET /api/v1', () => {
	it('should return 200 OK', async () => {
		const response = await request(app).get(baseRoute);
		expect(response.statusCode).toBe(200);
	});
});

describe('GET /api/v1/candidates', () => {
	jest.spyOn(Candidate, 'findAll').mockResolvedValue(candidates);
	it('should return 200 OK', async () => {
		const response = await request(app).get(`${baseRoute}/candidates`);
		expect(response.statusCode).toBe(200);
		expect(Candidate.findAll).toHaveBeenCalledTimes(1);
		expect(response.body).toEqual(candidates);
	});


	afterEach(() => {
		Candidate.findAll.mockClear();
	});
});

afterAll(() => {
	// You're my wonderwall
	server.close();
});