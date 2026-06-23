import express from 'express';
import { router } from './routes.js';
import 'dotenv/config';

const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.static('public'));
app.use(router);

app.listen(PORT, () => {
  console.log(`CodeVector Project running at PORT: ${PORT}`);
});