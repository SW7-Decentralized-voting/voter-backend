import express from 'express';
const router = express.Router();

import candidateRoutes from './candidateRoutes.js';
import partyRoutes from './partyRoutes.js';
import voteRoutes from './voteRoutes.js';
import districtRoutes from './districtRoutes.js';
import constituencyRoutes from './constituencyRoutes.js';

router.get('/', (req, res) => {
	res.send(router.stack);
});

router.use('/candidates', candidateRoutes);
router.use('/parties', partyRoutes);
router.use('/nominationDistricts', districtRoutes);
router.use('/constituencies', constituencyRoutes);
router.use('/vote', voteRoutes);

export default router;