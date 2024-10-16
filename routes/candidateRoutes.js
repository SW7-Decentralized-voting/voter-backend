import express from 'express';
import { getCandidates } from '../controllers/candidates.js';
import handleQuery from '../utils/handleQuery.js';
import Candidate from '../schemas/Candidate.js';

const router = express.Router();

/**
 * GET /candidates route to fetch candidates from the database
 * Accepts query parameters to filter the results
 * @param {Express.Request} req Query parameters to filter the results in req.query
 * @param {Express.Response} res Response object to send the candidates
 * @returns {Express.Response} Candidates fetched from the database
 */
router.get('/', async (req, res) => {
	let query; 

	try {
		query = handleQuery(req.query, Candidate);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}

	getCandidates(query)
		.then(candidates => res.json(candidates))
		.catch(error => {
			if (error.name === 'CastError') {
				return res.status(400).json({ error: error.message });
			}
			// eslint-disable-next-line no-console
			console.error(error);
			res.status(500).json({ error: 'Error fetching candidates' });
		});
});

export default router;