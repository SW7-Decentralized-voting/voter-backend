import { connectToDb } from "./index.js";
// import env MONGO_URI from .env
import keys from '../config/keys.js';

import Candidate from "../schemas/candidate.js";


const db = connectToDb(keys.mongoURI);

// Test connection
db.once('open', () => {
	console.log('Connected to MongoDB');
});

// Test model
await Candidate.insertMany([
	{ name: 'John Doe', partyId: '1' },
	{ name: 'Jane Doe', partyId: '2' },
]);

const candidates = await Candidate.find();

console.log(candidates);

db.close();