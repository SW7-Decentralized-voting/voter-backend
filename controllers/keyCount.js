import PollingStation from '../schemas/PollingStation.js';
import Key from '../schemas/Key.js';
import mongoose from 'mongoose';

/**
 * Get the count of keys that are not used
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @returns {Response} The count of keys that are not used for the polling station
 */
async function getKeyCount(req, res) {
	const pollingStationId = req.query.pollingStation;
	if (!pollingStationId) {
		return res.status(400).json({ error: 'Polling station is required' });
	}

	if(!mongoose.Types.ObjectId.isValid(pollingStationId)) {
		return res.status(400).json({ error: 'Polling station id invalid' });
	}

	try {
		const pollingStation = await PollingStation.findById(pollingStationId);
		if (!pollingStation) {
			return res.status(400).json({ error: 'Polling station not found' });
		}

		const count = await Key.countDocuments({ isUsed: false, pollingStation: pollingStation._id });

		return res.status(200).json({ count });
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error);
		return res.status(500).json({ error: 'Unexpected error happened while fetching key count' });
	}
}

export { getKeyCount };

/**
 * @import { Request, Response } from 'express';
 */