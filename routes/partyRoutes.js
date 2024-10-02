import express from 'express';
import { getParties } from '../controllers/parties.js';

const router = express.Router();

router.get('/', (req, res) => {
	getParties()
		.then(parties => res.json(parties))
		.catch(error => {
			// eslint-disable-next-line no-console
			console.error(error);
			res.status(500).json({ error: 'Error fetching parties' });
		});
});

export default router;