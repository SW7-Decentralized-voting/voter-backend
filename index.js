import express, { json } from 'express';
import router from './routes/index.js';
const app = express()
const PORT = process.env.PORT || 8888;

app.use('', router)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})