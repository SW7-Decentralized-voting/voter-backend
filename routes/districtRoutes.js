import express from 'express';
import { getNominationDistricts } from '../controllers/districts.js';
import NominationDistrict from '../schemas/NominationDistrict.js';
import handleQuery from '../utils/handleQuery.js';

const router = express.Router();

router.get('/', (req, res) => {
	let query;

	try {
		query = handleQuery(req.query, NominationDistrict);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}

	getNominationDistricts(query)
		.then(districts => res.json(districts))
		.catch(error => {
			// eslint-disable-next-line no-console
			console.error(error);
			res.status(500).json({ error: 'Error fetching districts' });
		});
});

export default router;