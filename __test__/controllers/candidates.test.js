import connectDb from '../setup/connect.js';
import mockdata from '../../db/mockdata.js';
import { candidateWithIds, districtsWithIds } from '../../db/addIds.js';
import Candidate from '../../schemas/Candidate.js';
import NominationDistrict from '../../schemas/NominationDistrict.js';
import Party from '../../schemas/Party.js';
import Constituency from '../../schemas/Constituency.js';
import { getCandidates } from '../../controllers/candidates.js';
import mongoose from 'mongoose';

beforeAll(async () => {
	await connectDb();
	await Party.insertMany(mockdata.parties);
	await Constituency.insertMany(mockdata.constituencies);
	await NominationDistrict.insertMany(await districtsWithIds(mockdata.nominationDistricts));
	await Candidate.insertMany(await candidateWithIds(mockdata.candidates));
});

describe('getCandidates()', () => {
	it('should return all candidates when no query is passed', async () => {
		const candidates = await getCandidates({});
		expect(candidates).toHaveLength(mockdata.candidates.length);

		candidates.forEach(candidate => {
			expect(candidate).toEqual(expect.objectContaining({
				_id: expect.any(mongoose.Types.ObjectId),
				name: expect.any(String),
				party: expect.any(mongoose.Types.ObjectId),
				nominationDistrict: expect.any(mongoose.Types.ObjectId),
			}));
		});
	});

	it('should return candidates in a party when a party query is passed', async () => {
		const party = await Party.findOne({ name: 'Nordlisten' });
		const candidates = await getCandidates({ party: party._id });
		const partyCandidates = mockdata.candidates.filter(candidate => candidate.party === party.name);

		expect(candidates).toHaveLength(partyCandidates.length);

		candidates.forEach(candidate => {
			expect(candidate).toEqual(expect.objectContaining({
				_id: expect.any(mongoose.Types.ObjectId),
				name: expect.any(String),
				party: party._id,
				nominationDistrict: expect.any(mongoose.Types.ObjectId),
			}));
		});
	});

	it('should return candidates with populated objects when populate query is passed', async () => {
		const candidates = await getCandidates({ populate: true });
		expect(candidates).toHaveLength(mockdata.candidates.length);

		candidates.forEach(candidate => {
			expect(candidate).toEqual(expect.objectContaining({
				_id: expect.any(mongoose.Types.ObjectId),
				name: expect.any(String),
				party: expect.any(Object),
				nominationDistrict: expect.any(Object),
			}));

			expect(candidate.party).toEqual(expect.objectContaining({
				name: expect.any(String),
				list: expect.any(String),
			}));

			expect(candidate.nominationDistrict).toEqual(expect.objectContaining({
				name: expect.any(String),
				constituency: expect.any(Object),
			}));

			expect(candidate.nominationDistrict.constituency).toEqual(expect.objectContaining({
				name: expect.any(String),
			}));
		});
	});

	it('should return empty array on non-existing query', async () => {
		const candidates = await getCandidates({ invalid: 'non-existing-id' });
		expect(candidates).toHaveLength(0);
	});

	it('should throw error on invalid id', async () => {
		await expect(getCandidates({ party: 'invalid-id' })).rejects.toThrow(
			'Cast to ObjectId failed for value "invalid-id" (type string) at path "party" for model "Candidate"'
		);
	});

	it('should throw error on invalid query parameter', async () => {
		await expect(getCandidates('invalid')).rejects.toThrow(
			'Parameter "filter" to find() must be an object, got "invalid" (type string)'
		);
	});

});

afterAll(async () => {
	await Candidate.deleteMany();
	await Party.deleteMany();
	await Constituency.deleteMany();
	await NominationDistrict.deleteMany();
	await mongoose.connection.close();
});