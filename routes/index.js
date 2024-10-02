import express from 'express';
const router = express.Router();
import candidateRoutes from './candidateRoutes.js';
import partyRoutes from './partyRoutes.js';

router.get('/', (req, res) => {
	res.send(router.stack);
});

router.use('/candidates', candidateRoutes);
router.use('/parties', partyRoutes);

export default router;