import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'test@test.com' && password === 'password123') {
    res.json({ token: 'fake-jwt-token-123' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  res.json({ token: 'fake-jwt-token-123' });
});

app.post('/api/scan', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.includes('fake-jwt-token')) {
    return res.status(401).json({ message: 'Login required' });
  }
  res.json({
    product: { name: 'Chocolate Milk', barcode: '12345678', ingredients: 'milk, soy' },
    allergenWarnings: [{ id: 1, name: 'Milk' }, { id: 2, name: 'Soy' }],
    safe: false
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('✅ Test login: POST /api/auth/login {"email":"test@test.com","password":"password123"}');
});
