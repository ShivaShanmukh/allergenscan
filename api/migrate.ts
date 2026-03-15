import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const secret = (req.headers['x-migrate-secret'] as string | undefined)?.trim();
  const expected = (process.env.JWT_SECRET || '').trim();
  if (!secret || secret !== expected) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return res.status(200).json({ message: 'Migrations not needed for mock backend' });
}
