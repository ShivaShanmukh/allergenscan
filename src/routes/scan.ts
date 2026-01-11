import { Router, Request, Response } from 'express';
import { pool } from '../db';
import authMiddleware from '../middleware/auth';

type ScanBody = { barcode?: string; name: string; ingredients: string };

const router = Router();
router.use(authMiddleware);

router.post('/', async (req: Request<{}, {}, ScanBody>, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { barcode, name, ingredients } = req.body;

    const userAllergensResult = await pool.query(
      `SELECT a.id, a.name FROM user_allergens ua JOIN allergens a ON ua.allergen_id = a.id WHERE ua.user_id = $1`,
      [userId]
    );

    const userAllergens = userAllergensResult.rows;
    const ingredientsLower = ingredients.toLowerCase();
    const foundAllergens = userAllergens.filter((allergen: any) =>
      ingredientsLower.includes(allergen.name.toLowerCase())
    );

    let product;
    if (barcode) {
      const existing = await pool.query('SELECT * FROM products WHERE barcode = $1', [barcode]);
      if (existing.rows.length > 0) {
        product = existing.rows[0];
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

    await pool.query(
      'INSERT INTO scan_history (user_id, product_id, safe, allergen_warnings) VALUES ($1, $2, $3, $4)',
      [userId, product.id, foundAllergens.length === 0, JSON.stringify(foundAllergens)]
    );

    res.json({
      product: { id: product.id, barcode: product.barcode, name: product.name, ingredients: product.ingredients },
      allergenWarnings: foundAllergens,
      safe: foundAllergens.length === 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Scan failed' });
  }
});

export default router;
