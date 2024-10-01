// Check that the database is working

import sequelize from './connectToDb.js';
import Candidate from '../models/candidates.js';
import Party from '../models/parties.js';

const printDb = async () => {
	try {
		await sequelize.authenticate();
		// eslint-disable-next-line no-console
		console.log('Connection has been established successfully.');
		// Show all tables in the database
		const parties = await Party.findAll({raw: true});

		for (const party of parties) {
			// eslint-disable-next-line no-console
			console.log('---------------------------------');
			const candidates = await Candidate.findAll({where: {partyId: party.id}, raw: true});
			// eslint-disable-next-line no-console
			console.log(`Party: ${party.party_name}`);
			// eslint-disable-next-line no-console
			console.log('Candidates:');
			candidates.forEach(candidate => {
				// eslint-disable-next-line no-console
				console.log(`- ${candidate.full_name}`);
			});
			// eslint-disable-next-line no-console
			console.log('---------------------------------');
		}

		await sequelize.close();
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('Unable to connect to the database:', error);
	}
};

printDb();