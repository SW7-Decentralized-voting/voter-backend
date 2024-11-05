import express from 'express';
import getStationIdByPort from '../controllers/pollingStations.js';
import handleQuery from '../utils/handleQuery.js';

const router = express.Router();


router.get('/', async (req, res) => {
	await getStationIdByPort(req, res);
});
