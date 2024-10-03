import express from 'express';

const router = express.Router();

router.post('/candidate', (req, res) => {
	res.send('Voting for a candidate');
});

router.post('/party', (req, res) => {
	res.send('Voting for a party');
});

router.post('/blank', (req, res) => {
	res.send('Voting for a blank ballot');
});

export default router;