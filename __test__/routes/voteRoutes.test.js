import request from 'supertest';
import express from 'express';
import axios from 'axios';
import { it, jest, expect } from '@jest/globals';

let router;
const baseRoute = '/api/v1/vote';

const app = express();
app.use(express.json());
app.use(baseRoute, async (req, res, next) => (await router)(req, res, next));

const server = app.listen(0);

beforeAll(async () => {
	router = (await import('../../routes/voteRoutes.js')).default;
});

jest.unstable_mockModule('../../middleware/verifyToken.js', () => {
	return {
		auth: jest.fn((req, res, next) => next()),
	};
});

describe('POST /api/v1/vote', () => {
	const testVote = async (id, expectedStatus, mockResponse, expectedBody) => {
		const spy = jest.spyOn(axios, 'post').mockImplementation(() => {
			if (expectedStatus === 200) {
				return Promise.resolve(mockResponse);
			}
			return Promise.reject(mockResponse);
		});
	
		const response = await request(app).post(baseRoute).send(id ? { id } : {});
	
		expect(response.statusCode).toBe(expectedStatus);
		expect(response.body).toEqual(expectedBody);
	
		if (id) {
			expect(spy).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({ id: expect.any(String) })
			);
		} else {
			expect(spy).not.toHaveBeenCalled();
		}
	};

	it('should return 400 Bad Request when id is missing', async () => {
		const expectedBody = { error: 'Missing id' };
		await testVote(undefined, 400, { status: 400, data: expectedBody }, expectedBody);
	});

	it('should return 200 OK and cast vote', async () => {
		const expectedBody = { message: 'Vote cast successfully', transactionHash: '0x1234' };
		await testVote('0x1', 200, { status: 200, data: expectedBody }, expectedBody);
	});
});

afterAll(() => {
	server.close();
});