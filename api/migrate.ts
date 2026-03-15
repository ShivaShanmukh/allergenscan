import type { VercelRequest, VercelResponse } from '@vercel/node';
import { testDbConnection } from '../allergenscan/src/db.js';
import { runMigrations } from '../allergenscan/src/migrate.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const secret = (req.headers['x-migrate-secret'] as string | undefined)?.trim();
  const expected = (process.env.JWT_SECRET || '').trim();
  if (!secret || secret !== expected) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    await testDbConnection();
    await runMigrations();
    return res.status(200).json({ message: 'Migrations completed' });
  } catch (err: any) {
    console.error('Migration error:', err);
    return res.status(500).json({ message: 'Migration failed', error: err?.message });
  }
}
