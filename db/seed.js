import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { Pool } from 'pg';
import 'dotenv/config';

//Connect to Neon
const pool = new Pool({
  connectionString: process.env.DB_URL
});
const client = await pool.connect();
const products = [];

async function createTable() {
  //Read schema from file
  console.time('took');
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const schemaBuffer = await fs.readFile(`${__dirname}/schema.sql`);
  const schema = schemaBuffer.toString();
  await client.query(schema);
  console.timeEnd('took')
}

function generateData() {
  console.time('took')
  const companies = ['Samsung', 'Xiaomi', 'Dell', 'Nokia', 'Acer', 'HP', 'Lenovo', 'Vivo', 'Realme'];
  const series = ['Galaxy', 'Aspire', 'Note', 'Power', 'Legion'];
  const categories = ['Mobile', 'Laptop', 'Headphones'];
  
  for (let i=1; i<=200000; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const series_ = series[Math.floor(Math.random() * series.length)];
    const model = Math.floor(Math.random() * 1000);
    const category = categories[Math.floor(Math.random() * categories.length)];
    const price = Math.round(Math.random() * 100000);
    const createdAt = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
    const updatedAt = new Date(createdAt.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
    products.push({
      name: `${company} ${series_} ${model}`,
      category: category,
      price: price,
      created_at: createdAt,
      updated_at: updatedAt
    });
  }
  console.timeEnd('took')
}


async function batchSeeding() {
  console.time('batch')
  const BATCH_SIZE = 10000;
  
  for (let i = 0; i < products.length; i+=BATCH_SIZE) {
    const batch = products.slice(i, i+BATCH_SIZE);
    const values = [];
    const placeholders = [];
    batch.forEach((p, i) => {
      const offset = i * 5;
      placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5})`);
      values.push(p.name, p.category, p.price, p.created_at, p.updated_at);
    });
    
    const query = `
      INSERT INTO products(name, category, price, created_at, updated_at)
      VALUES ${placeholders.join(',')}
    `;
    await client.query(query, values);
  }
  console.timeEnd('batch');
}

async function createIndex() {
  console.time('took')
  await client.query(`
    CREATE INDEX IF NOT EXISTS products_category_created_index
    ON products(category, created_at DESC, id DESC)
  `);
  console.timeEnd('took')
}


try {
  console.log('Creating table...');
  await createTable();
  
  console.log('Generating data...');
  generateData();
  
  console.log('Seeding data...');
  await client.query('BEGIN');
  await batchSeeding();
  await client.query('COMMIT');
  
  console.log('Creating Index...');
  await createIndex();
} catch (e) {
  await client.query('ROLLBACK');
  throw e;
} finally {
  client.release();
  await pool.end();
}