import request from 'supertest';
import express from 'express';
import router from '../../routes/voteRoutes.js'; // Adjust the import path to where your route is located

const baseRoute = '/api/v1/vote';

const app = express();
app.use(express.json());
app.use(baseRoute, router);

const server = app.listen(8888);

describe('POST /api/v1/vote/candidate', () => {
	it('should return 200 OK and cast vote', async () => {
		const response = await request(app).post(baseRoute + '/candidate');
		expect(response.statusCode).toBe(200);
		expect(response.text).toEqual('Voting for a candidate');
	});
});

describe('POST /api/v1/vote/party', () => {
	it('should return 200 OK and cast vote', async () => {
		const response = await request(app).post(baseRoute + '/party');
		expect(response.statusCode).toBe(200);
		expect(response.text).toEqual('Voting for a party');
	});
});

describe('POST /api/v1/vote/blank', () => {
	it('should return 200 OK and cast vote', async () => {
		const response = await request(app).post(baseRoute + '/blank');
		expect(response.statusCode).toBe(200);
		expect(response.text).toEqual('Voting for a blank ballot');
	});
});

afterAll(() => {
	server.close();
});