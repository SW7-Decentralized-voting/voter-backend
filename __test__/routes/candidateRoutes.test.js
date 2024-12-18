import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import router from '../../routes/candidateRoutes.js'; 
import connectDb from '../setup/connect.js';
import mockdata from '../../db/mockdata.js';
import Candidate from '../../schemas/Candidate.js';
import NominationDistrict from '../../schemas/NominationDistrict.js';
import Party from '../../schemas/Party.js';
import Constituency from '../../schemas/Constituency.js';
import { jest } from '@jest/globals';
import populate from '../db/populate.js';

const baseRoute = '/api/v1/candidates';

const app = express();
app.use(express.json());
app.use(baseRoute, router);

const server = app.listen(0);

beforeAll(async () => {
	connectDb();
	await populate();
});

describe('GET /api/v1/candidates', () => {
	const testCandidates = async (query, expectedLength, expectedObject) => {
		const response = await request(app).get(baseRoute + query);
		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual(expect.any(Array));
		expect(response.body.length).toBe(expectedLength);

		response.body.forEach((object) => {
			expect(object).toEqual(expect.objectContaining(expectedObject));
		});
	};

	it('should return 200 OK and list of all candidates', async () => {
		await testCandidates('', mockdata.candidates.length, {
			_id: expect.any(String),
			name: expect.any(String),
			party: expect.any(String),
			nominationDistrict: expect.any(String),
		});
	});

	it('should return 200 OK and party members with query', async () => {
		const party = await Party.findOne({ name: 'Nordlisten' });
		await testCandidates('?party=' + party._id, mockdata.candidates.filter(candidate => candidate.party === party.name).length, {
			_id: expect.any(String),
			name: expect.any(String),
			party: party._id.toString(),
			nominationDistrict: expect.any(String),
		});
	});

	it('should return 200 OK and populate objects with query', async () => {
		await testCandidates('?populate=true', mockdata.candidates.length, {
			_id: expect.any(String),
			name: expect.any(String),
			party: expect.objectContaining({
				name: expect.any(String),
				list: expect.any(String),
			}),
			nominationDistrict: expect.objectContaining({
				name: expect.any(String),
				constituency: expect.objectContaining({
					name: expect.any(String),
				}),
			}),
		});
	});

	describe('GET /api/v1/candidates for single constituency', () => {
		let constituency, nominationDistricts, candidates;
		beforeAll(async () => {
			constituency = await Constituency.findOne({ name: 'Constituency 1' });
			nominationDistricts = await NominationDistrict.find({ constituency: constituency._id });
			candidates = mockdata.candidates.filter(candidate => nominationDistricts.map(district => district.name).includes(candidate.nominationDistrict));
		});

		const testCandidatesInConstituency = async (query) => {
			const response = await request(app).get(baseRoute + query);
			expect(response.statusCode).toBe(200);
			expect(response.body).toEqual(expect.any(Array));
			expect(response.body.length).toBe(candidates.length);

			response.body.forEach((object) => {
				expect(object).toEqual(expect.objectContaining({
					_id: expect.any(String),
					name: expect.any(String),
					party: expect.any(String),
					nominationDistrict: expect.stringMatching(nominationDistricts.map(district => district._id).join('|')),
				}));
			});
		};

		it('should return 200 OK and list of candidates in specific constituency', async () => {
			await testCandidatesInConstituency('?' + nominationDistricts.map(district => 'nominationDistrict=' + district._id).join('&'));
		});

		it('should return 200 OK and list of candidates in specific constituency with comma separation', async () => {
			await testCandidatesInConstituency('?nominationDistrict=' + nominationDistricts.map(district => district._id).join(','));
		});
	});


	it('should return 400 Bad Request if query is invalid', async () => {
		const response = await request(app).get(baseRoute + '?invalid=1');
		expect(response.statusCode).toBe(400);
		expect(response.body.error).toBeDefined();
		expect(response.body.error).toBe('Invalid query parameter: invalid');
	});

	it('should return empty array if no candidates are found', async () => {
		jest.spyOn(Candidate, 'find').mockImplementationOnce(() => []);
		const response = await request(app).get(baseRoute);
		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual([]);
	});

	it('should return 400 Bad Request if a query id is invalid', async () => {
		const response = await request(app).get(baseRoute + '?party=invalid');
		expect(response.statusCode).toBe(400);
		expect(response.body.error).toBe('Cast to ObjectId failed for value "invalid" (type string) at path "party" for model "Candidate"');
	});

	it('should return 500 Internal Server Error if an error occurs', async () => {
		jest.spyOn(Candidate, 'find').mockImplementationOnce(() => {
			throw new Error('Error fetching candidates');
		});
		jest.spyOn(console, 'error').mockImplementationOnce(() => {});
		const response = await request(app).get(baseRoute);
		expect(response.statusCode).toBe(500);
		expect(response.body.error).toBe('Error fetching candidates');
	});
});

afterAll(async () => {
	// You're my wonderwall
	await Candidate.deleteMany();
	await NominationDistrict.deleteMany();
	await Constituency.deleteMany();
	await Party.deleteMany();
	await mongoose.connection.close();
	server.close();
});