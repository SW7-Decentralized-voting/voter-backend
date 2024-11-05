import express from 'express';
import getStationIdByPort from '../controllers/pollingStations.js';

const router = express.Router();


router.get('/', async (req, res) => {
	await getStationIdByPort(req, res);
});

export default router;