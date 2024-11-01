import express from 'express';
import { getNominationDistricts } from '../controllers/districts.js';
import NominationDistrict from '../schemas/NominationDistrict.js';
import handleQuery from '../utils/handleQuery.js';

const router = express.Router();

/**
 * GET /nominationDistricts route to fetch nomination districts from the database
 * Accepts query parameters to filter the results
 * @param {Request} req Query parameters to filter the results in req.query
 * @param {Response} res Response object to send the nomination districts
 * @returns {Response} The nomination districts that match the query parameters
 */
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

/**
 * @import { Response, Request } from 'express';
 */