import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { testDbConnection, pool } from './db';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// ============================================================================
// DATABASE MIGRATIONS
// ============================================================================

async function runMigrations() {
  // Users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Allergens table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS allergens (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // User allergens junction table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_allergens (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      allergen_id INTEGER NOT NULL REFERENCES allergens(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, allergen_id)
    );
  `);

  // Products table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      barcode TEXT UNIQUE,
      name TEXT NOT NULL,
      ingredients TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Scan history table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS scan_history (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      safe BOOLEAN NOT NULL,
      allergen_warnings JSONB DEFAULT '[]',
      scanned_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  console.log('Migrations complete');
}

// ============================================================================
// MIDDLEWARE
// ============================================================================

function authMiddleware(req: any, res: any, next: any) {
  const header = req.headers['authorization'];
  if (!header) {
    return res.status(401).json({ message: 'Missing Authorization header' });
  }

  const [, token] = header.split(' ');
  if (!token) {
    return res.status(401).json({ message: 'Invalid Authorization header' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// ============================================================================
// PUBLIC ROUTES
// ============================================================================

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Register
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body as {
      name?: string;
      email?: string;
      password?: string;
    };

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required',
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email.toLowerCase(), hashed]
    );

    const user = result.rows[0];

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ user, token });
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Email already registered' });
    }
    console.error('Register error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    const result = await pool.query(
      'SELECT id, email, name, password_hash FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ============================================================================
// PROTECTED ROUTES
// ============================================================================

// Get user's allergen profile
app.get('/profile/allergens', authMiddleware, async (req: any, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT a.id, a.name
       FROM user_allergens ua
       JOIN allergens a ON ua.allergen_id = a.id
       WHERE ua.user_id = $1
       ORDER BY a.name`,
      [userId]
    );

    res.json({ allergens: result.rows });
  } catch (err) {
    console.error('Get allergens error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user's allergen profile
app.put('/profile/allergens', authMiddleware, async (req: any, res) => {
  try {
    const userId = req.user.userId;
    const { allergenIds } = req.body as { allergenIds?: number[] };

    if (!Array.isArray(allergenIds)) {
      return res.status(400).json({ message: 'allergenIds must be an array' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Clear existing allergens
      await client.query(
        'DELETE FROM user_allergens WHERE user_id = $1',
        [userId]
      );

      // Insert new allergens
      for (const allergenId of allergenIds) {
        await client.query(
          'INSERT INTO user_allergens (user_id, allergen_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [userId, allergenId]
        );
      }

      await client.query('COMMIT');

      // Return updated list
      const result = await client.query(
        `SELECT a.id, a.name
         FROM user_allergens ua
         JOIN allergens a ON ua.allergen_id = a.id
         WHERE ua.user_id = $1
         ORDER BY a.name`,
        [userId]
      );

      res.json({ allergens: result.rows });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Update allergens error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Scan product for allergens
app.post('/scan', authMiddleware, async (req: any, res) => {
  try {
    const userId = req.user.userId;
    const { barcode, name, ingredients } = req.body as {
      barcode?: string;
      name?: string;
      ingredients?: string;
    };

    if (!name || !ingredients) {
      return res.status(400).json({
        message: 'Name and ingredients are required',
      });
    }

    // Get user's allergens
    const userAllergensResult = await pool.query(
      `SELECT a.id, a.name
       FROM user_allergens ua
       JOIN allergens a ON ua.allergen_id = a.id
       WHERE ua.user_id = $1`,
      [userId]
    );

    const userAllergens = userAllergensResult.rows;

    // Check if any allergens are in the ingredients
    const ingredientsLower = ingredients.toLowerCase();
    const foundAllergens = userAllergens.filter((allergen) =>
      ingredientsLower.includes(allergen.name.toLowerCase())
    );

    // Save or update product in database
    let product;
    if (barcode) {
      const existingProduct = await pool.query(
        'SELECT * FROM products WHERE barcode = $1',
        [barcode]
      );

      if (existingProduct.rows.length > 0) {
        product = existingProduct.rows[0];
      } else {
        const insertResult = await pool.query(
          'INSERT INTO products (barcode, name, ingredients) VALUES ($1, $2, $3) RETURNING *',
          [barcode, name, ingredients]
        );
        product = insertResult.rows[0];
      }
    } else {
      const insertResult = await pool.query(
        'INSERT INTO products (name, ingredients) VALUES ($1, $2) RETURNING *',
        [name, ingredients]
      );
      product = insertResult.rows[0];
    }

    // Save scan history
    await pool.query(
      'INSERT INTO scan_history (user_id, product_id, safe, allergen_warnings) VALUES ($1, $2, $3, $4)',
      [userId, product.id, foundAllergens.length === 0, JSON.stringify(foundAllergens)]
    );

    // Return scan result
    res.json({
      product: {
        id: product.id,
        barcode: product.barcode,
        name: product.name,
        ingredients: product.ingredients,
      },
      allergenWarnings: foundAllergens,
      safe: foundAllergens.length === 0,
    });
  } catch (err) {
    console.error('Scan error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get scan history
app.get('/history', authMiddleware, async (req: any, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT 
        sh.id,
        sh.safe,
        sh.allergen_warnings,
        sh.scanned_at,
        p.id as product_id,
        p.name as product_name,
        p.barcode,
        p.ingredients
       FROM scan_history sh
       JOIN products p ON sh.product_id = p.id
       WHERE sh.user_id = $1
       ORDER BY sh.scanned_at DESC
       LIMIT 50`,
      [userId]
    );

    const history = result.rows.map((row) => ({
      id: row.id,
      product: {
        id: row.product_id,
        name: row.product_name,
        barcode: row.barcode,
        ingredients: row.ingredients,
      },
      safe: row.safe,
      allergenWarnings: row.allergen_warnings,
      scannedAt: row.scanned_at,
    }));

    res.json({ history });
  } catch (err) {
    console.error('Get history error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// ============================================================================
// SERVER STARTUP
// ============================================================================

async function start() {
  try {
    await testDbConnection();
    await runMigrations();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
