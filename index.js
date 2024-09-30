import express from 'express';
import router from './routes/index.js';
import process from 'process';
import { getCandidates } from './api/voting.js';

const app = express()
const PORT = process.env.PORT || 8888;

const basePath = '/api/v1';

app.get(`${basePath}/candidates`, async (req, res) => {
  try {
    const candidates = await getCandidates();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching candidates' });
  }
});

app.use('', router);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});