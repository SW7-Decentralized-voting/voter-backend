// Check that the database is working

import sequelize from './connectToDb.js';
import Candidate from '../models/candidates.js';
import Party from '../models/parties.js';

const printDb = async () => {
	try {
		await sequelize.authenticate();
		console.log('Connection has been established successfully.');
		// Show all tables in the database
		const parties = await Party.findAll({raw: true});

		for (const party of parties) {
			console.log('---------------------------------');
			const candidates = await Candidate.findAll({where: {partyId: party.id}, raw: true});
			console.log(`Party: ${party.party_name}`);
			console.log('Candidates:');
			candidates.forEach(candidate => {
				console.log(`- ${candidate.full_name}`);
			});
			console.log('---------------------------------');
		}

		await sequelize.close();
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
}

printDb();