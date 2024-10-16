import express from 'express';
import { getConstituencies } from '../controllers/constituencies.js';
import Constituency from '../schemas/Constituency.js';
import handleQuery from '../utils/handleQuery.js';

const router = express.Router();

/**
 * GET /constituencies route to fetch constituencies from the database
 * Accepts query parameters to filter the results
 * @param {Express.Request} req Query parameters to filter the results in req.query
 * @param {Express.Response} res Response object to send the constituencies
 * @returns {Express.Response} Constituencies fetched from the database
 */
router.get('/', (req, res) => {
	let query;

	try {
		query = handleQuery(req.query, Constituency);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}

	getConstituencies(query)
		.then(constituencies => res.json(constituencies))
		.catch(error => {
			// eslint-disable-next-line no-console
			console.error(error);
			res.status(500).json({ error: 'Error fetching constituencies' });
		});
});

export default router;