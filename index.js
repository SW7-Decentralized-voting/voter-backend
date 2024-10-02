import express from 'express';
import router from './routes/index.js';
import process from 'process';
import cors from './config/cors.js';

const app = express();
const PORT = process.env.PORT || 8888;

app.use(cors);
app.use('/api/v1', router);

app.listen(PORT, async () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}`);
});