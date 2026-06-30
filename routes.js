import express from 'express';
import { getProducts } from './db/repo.js';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const router = express.Router();

const __dirname = dirname(fileURLToPath(import.meta.url));

router.get('/', async (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

router.get('/api/products', async (req, res) => {
  const { id = null, created_at = null, category } = req.query;
  const limit = 50;
  const products = await getProducts(category, id, created_at, limit);
  const last = products.rows.at(-1);
  res.json({
    cursor: last ? {
      id: last.id,
      created_at: last.created_at
    } : null,
    products: products.rows
  });
});