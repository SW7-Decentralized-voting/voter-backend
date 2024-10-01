import express from 'express';
const router = express.Router();
import { getCandidates } from '../controllers/candidates.js';

router.get('/', (req, res) => {
	res.send(router.stack);
});

router.get('/candidates', async (req, res) => {
	try {
		const candidates = await getCandidates({ 
			attributes: ['id', 'full_name', 'partyId'], 
			include: [{
				association: 'party',
				attributes: ['id', 'partyName']
			}] 
		});
		res.json(candidates);
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error);
		res.status(500).json({ error: 'Error fetching candidates' });
	}
});

export default router;