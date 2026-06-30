import pool from './db.js';

export async function getProducts(category, id, created_at, limit) {
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
  return products;
}