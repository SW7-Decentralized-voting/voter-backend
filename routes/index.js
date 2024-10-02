import express from 'express';
const router = express.Router();
import { getCandidates } from '../controllers/candidates.js';
import { getParties } from '../controllers/parties.js';
import handleQuery from '../utils/handleQuery.js';
import Candidate from '../models/candidates.js';
import Party from '../models/parties.js';

router.get('/', (req, res) => {
	res.send(router.stack);
});

router.get('/parties', (req, res) => {
	getParties()
		.then(parties => res.json(parties))
		.catch(error => {
			// eslint-disable-next-line no-console
			console.error(error);
			res.status(500).json({ error: 'Error fetching parties' });
		});
});

router.get('/candidates', async (req, res) => {
	let query;
	try {
		query = handleQuery(req.query, Candidate);
	} catch (error) {
		return res.status(400).send(error.message);
	}
	

	try {
		const candidates = await getCandidates({ 
			attributes: ['id', 'full_name', 'partyId'], 
			include: [{
				association: 'party',
				attributes: ['id', 'partyName']
			}],
			...query
		});
		res.json(candidates);
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error);
		res.status(500).json({ error: 'Error fetching candidates' });
	}
});

export default router;