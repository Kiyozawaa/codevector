import express from 'express';
import pool from './db/db.js';
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
  let products;
  if (!category && (!id || !created_at)) {
    products = await pool.query(`
      SELECT * FROM products
      ORDER BY created_at DESC, id DESC
      LIMIT $1
    `, [limit]);
  }
  else if (!category && (id && created_at)) {
    products = await pool.query(`
      SELECT * FROM products
      WHERE (created_at, id) < ($1, $2)
      ORDER BY created_at DESC, id DESC
      LIMIT $3
    `, [created_at, id, limit]);
  }
  else if (category && (!id || !created_at)) {
    products = await pool.query(`
      SELECT * FROM products
      WHERE category = $1
      ORDER BY created_at DESC, id DESC
      LIMIT $2
    `, [category, limit]);
  }
  else if (category && (id && created_at)) {
    products = await pool.query(`
      SELECT * FROM products
      WHERE category = $1
      AND (created_at, id) < ($2, $3)
      ORDER BY created_at DESC, id DESC
      LIMIT $4
    `, [category, created_at, id, limit]);
  }
  
  const last = products.rows.at(-1);
  res.json({
    cursor: last ? {
      id: last.id,
      created_at: last.created_at
    } : null,
    products: products.rows
  });
});