import express, { json } from 'express';
import router from './routes/index.js';
import { getCandidates } from './api/voting.js';
const app = express()
const PORT = process.env.PORT || 8888;

app.use('', router)

app.listen(PORT, async () => { // Make the callback function async
  try {
    const candidates = await getCandidates(); // Await the promise
    console.log(`Example app listening on port ${PORT}`);
    console.log(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
  }
});