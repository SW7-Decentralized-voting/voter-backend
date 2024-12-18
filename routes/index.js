import express from 'express';
const router = express.Router();

import candidateRoutes from './candidateRoutes.js';
import partyRoutes from './partyRoutes.js';
import voteRoutes from './voteRoutes.js';
import districtRoutes from './districtRoutes.js';
import constituencyRoutes from './constituencyRoutes.js';
import keyVerificationRoutes from './keyVerificationRoutes.js';
import pollingStationRoutes from './pollingStationRoutes.js';

router.get('/', (req, res) => {
	res.send(router.stack);
});

router.use('/candidates', candidateRoutes);
router.use('/parties', partyRoutes);
router.use('/nominationDistricts', districtRoutes);
router.use('/constituencies', constituencyRoutes);
router.use('/vote', voteRoutes);
router.use('/key', keyVerificationRoutes);
router.use('/pollingStations', pollingStationRoutes);

export default router;