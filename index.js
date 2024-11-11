import express from 'express';
import router from './routes/index.js';
import process from 'process';
import cors from './config/cors.js';
import dotenv from 'dotenv';
import { connectToDb } from './db/index.js';
import populateDb from './db/populate.js';

dotenv.config();

if (process.env.NODE_ENV === 'docker') {
  await populateDb('docker', true);
}

connectToDb(process.env.MONGO_URI);


const app = express();
const PORT = process.env.PORT || 8888;

app.use(cors);
app.use(express.json());
app.use('/api/v1', router);

app.listen(PORT, async () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}`);
});