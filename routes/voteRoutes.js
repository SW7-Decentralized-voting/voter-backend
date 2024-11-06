import express from 'express';
import bodyParser from 'body-parser';

const router = express.Router();

router.use(bodyParser.json());

router.post('/', (req, res) => {
	const id = req.body.id;
	res.send('Voting for party or candidate with id: ' + id);
} );

export default router;