import express from 'express';
import router from './routes/index.js';
import process from 'process';

const app = express();
const PORT = process.env.PORT || 8888;

app.use('', router);

app.listen(PORT, () => {
	// eslint-disable-next-line no-console
  console.log(`Example app listening on port ${PORT}`);
});