import { connectToDb } from './index.js';
// import env MONGO_URI from .env
import keys from '../config/keys.js';

import mockdata from './mockdata.js';

import Candidate from '../schemas/Candidate.js';
import Party from '../schemas/Party.js';
import NominationDistrict from '../schemas/NominationDistrict.js';
import Constituency from '../schemas/Constituency.js';


const db = connectToDb(keys.mongoURI);

// Test connection
db.once('open', () => {
	// eslint-disable-next-line no-console
	console.log('Connected to MongoDB');
});

// Clear the database if argument 'clear' is passed
if (process.argv[2] === 'clear') {
	// eslint-disable-next-line no-console
	console.log('Clearing database...');
	await Candidate.deleteMany();
	await Party.deleteMany();
	await NominationDistrict.deleteMany();
	await Constituency.deleteMany();
}

await Party.insertMany(mockdata.parties);
await Constituency.insertMany(mockdata.constituencies);
await NominationDistrict.insertMany(await districtsWithIds(mockdata.nominationDistricts));
await Candidate.insertMany(await candidateWithIds(mockdata.candidates));

const party1 = await Party.findOne({ name: 'Nordlisten' });

const candidatesInParty1 = await Candidate.find({ party: party1._id });
// eslint-disable-next-line no-console
console.log('Candidates in', party1.name, ':\n ', candidatesInParty1.map(candidate => candidate.name).join('\n  '));

db.close();


async function districtsWithIds(districts) {
	return await Promise.all(
		districts.map(async district => {
			const constituency = await Constituency.findOne({ name: district.constituency });

			return {
				...district,
				constituency: constituency._id,  // Map the ObjectId of the found constituency
			};
		})
	);
}

async function candidateWithIds(candidates) {
	return await Promise.all(
		candidates.map(async candidate => {
			const party = await Party.findOne({ name: candidate.party });
			const nominationDistrict = await NominationDistrict.findOne({ name: candidate.nominationDistrict });

			return {
				...candidate,
				party: party._id,
				nominationDistrict: nominationDistrict._id,
			};
	}));
}