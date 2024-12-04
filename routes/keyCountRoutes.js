import express from 'express';
import { getKeyCount } from '../controllers/keyCount.js';

const router = express.Router();

router.get('/', async (req, res) => {
	await getKeyCount(req, res);
});

export default router;