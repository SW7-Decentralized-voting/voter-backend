import express from 'express';
import { auth } from '../middleware/verifyToken.js';
import axios from 'axios';
import keys from '../config/keys.js';

const router = express.Router();

const baseUrl = keys.blockchainUrl;

router.post('/', auth, async (req, res) => {
	const id = req.body?.id;

	if (!id) {
		return res.status(400).json({ error: 'Missing id' });
	}

	try {
		const response = await axios.post(`${baseUrl}/vote`, { id });

		res.status(200).send(response.data);
	} catch (error) {
		if (error.response?.status === 400) {
			return res.status(400).json({ error: error.response.data.error });
		}

		if (!error.response) {
			// eslint-disable-next-line no-console
			console.error('Could not connect to blockchain service');
			return res.status(500).json({ error: 'Could not connect to blockchain service' });
		}
		// eslint-disable-next-line no-console
		console.error(error);
		res.status(500).json({ error: 'Failed to cast vote' });
	}
});

export default router;