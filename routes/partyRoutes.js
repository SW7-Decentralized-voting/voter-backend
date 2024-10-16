import express from 'express';
import { getParties } from '../controllers/parties.js';
import handleQuery from '../utils/handleQuery.js';
import Party from '../schemas/Party.js';

const router = express.Router();

/**
 * GET /parties route to fetch parties from the database
 * Accepts query parameters to filter the results
 * @param {Express.Request} req Query parameters to filter the results in req.query
 * @param {Express.Response} res Response object to send the parties
 * @returns {Express.Response} Parties fetched from the database
 */
router.get('/', (req, res) => {
	let query; 

	try {
		query = handleQuery(req.query, Party);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}

	getParties(query)
		.then(parties => res.json(parties))
		.catch(error => {
			// eslint-disable-next-line no-console
			console.error(error);
			res.status(500).json({ error: 'Error fetching parties' });
		});
});

export default router;