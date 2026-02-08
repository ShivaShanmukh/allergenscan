import { pool } from './db';

async function initDb() {
  console.log('Running DB migrations...');

  const createTablesSql = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS allergens (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    synonyms TEXT[] DEFAULT '{}'
  );

  CREATE TABLE IF NOT EXISTS user_allergens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    allergen_id INTEGER NOT NULL REFERENCES allergens(id) ON DELETE CASCADE,
    UNIQUE (user_id, allergen_id)
  );

  CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    barcode TEXT NOT NULL UNIQUE,
    name TEXT,
    brand TEXT,
    ingredients_text TEXT,
    source_api TEXT,
    last_checked_at TIMESTAMP WITH TIME ZONE
  );

  CREATE TABLE IF NOT EXISTS scans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    risk_level TEXT NOT NULL,
    matched_allergens TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  `;

  const seedAllergensSql = `
  INSERT INTO allergens (name, synonyms) VALUES
    ('peanuts', ARRAY['peanut']),
    ('tree nuts', ARRAY['almond','walnut','cashew','hazelnut','pecan']),
    ('milk', ARRAY['milk','lactose','casein','whey']),
    ('eggs', ARRAY['egg','albumen']),
    ('wheat', ARRAY['wheat','gluten']),
    ('soy', ARRAY['soy','soya','soybean']),
    ('fish', ARRAY['fish']),
    ('shellfish', ARRAY['shrimp','prawn','crab','lobster'])
  ON CONFLICT (name) DO NOTHING;
  `;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(createTablesSql);
    await client.query(seedAllergensSql);
    await client.query('COMMIT');
    console.log('DB tables created and allergens seeded.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error running initDb:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

initDb().then(() => {
  console.log('initDb finished.');
  process.exit(0);
});
