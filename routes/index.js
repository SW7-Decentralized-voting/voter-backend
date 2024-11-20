import express from 'express';
const router = express.Router();

import candidateRoutes from './candidateRoutes.js';
import partyRoutes from './partyRoutes.js';
import districtRoutes from './districtRoutes.js';
import constituencyRoutes from './constituencyRoutes.js';
import pollingStationRoutes from './pollingStationRoutes.js';
import keyCountRoutes from './keyCountRoutes.js';

router.get('/', (req, res) => {
	res.send(router.stack);
});

router.use('/candidates', candidateRoutes);
router.use('/parties', partyRoutes);
router.use('/nominationDistricts', districtRoutes);
router.use('/constituencies', constituencyRoutes);
router.use('/pollingStations', pollingStationRoutes);
router.use('/keyCount', keyCountRoutes);

export default router;