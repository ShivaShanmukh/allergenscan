import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  console.log('Login request received:', req.body);
  res.status(200).json({
    token: 'fake-jwt-token-123',
    user: {
      id: 1,
      name: 'Test User',
      email: email,
      onboardingComplete: false
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { email, name } = req.body;
  console.log('Register request received:', req.body);
  res.status(200).json({
    token: 'fake-jwt-token-123',
    user: {
      id: 1,
      name: name || 'Test User',
      email: email || 'test@verdant.app',
      onboardingComplete: false
    }
  });
});

app.get('/api/me', (_req, res) => {
  res.json({
    user: {
      id: 1,
      name: 'Test User',
      email: 'test@verdant.app',
      scanCount: 5,
      onboardingComplete: false
    }
  });
});

app.get('/api/profile/allergens', (_req, res) => {
  res.json({
    allergens: [
      { id: 3, name: 'Milk' },
      { id: 6, name: 'Soy' }
    ],
    available: [
      { id: 1, name: 'Peanuts' },
      { id: 2, name: 'Tree Nuts' },
      { id: 3, name: 'Milk' },
      { id: 4, name: 'Eggs' },
      { id: 5, name: 'Wheat' },
      { id: 6, name: 'Soy' },
      { id: 7, name: 'Fish' },
      { id: 8, name: 'Shellfish' }
    ]
  });
});

app.get('/api/profile/dietary', (_req, res) => {
  res.json({
    preferences: [],
    available: [
      { id: 1, name: 'Vegan' },
      { id: 2, name: 'Vegetarian' },
      { id: 3, name: 'Keto' },
      { id: 4, name: 'Halal' }
    ]
  });
});

app.get('/api/profile/goals', (_req, res) => {
  res.json({
    goals: [{ id: 2, name: 'Manage Allergies', description: 'Safely navigate food allergies' }],
    available: [
      { id: 1, name: 'Eat Healthier', description: 'Improve nutrition' },
      { id: 2, name: 'Manage Allergies', description: 'Safely navigate food allergies' },
      { id: 3, name: 'Save Money', description: 'Find affordable options' },
      { id: 4, name: 'Go Sustainable', description: 'Choose eco-friendly foods' }
    ]
  });
});

app.put('/api/profile/allergens', (req, res) => {
  res.json({ message: 'Allergens updated', count: req.body.allergenIds?.length || 0 });
});

app.put('/api/profile/dietary', (req, res) => {
  res.json({ message: 'Dietary preferences updated', count: req.body.preferenceIds?.length || 0 });
});

app.put('/api/profile/goals', (req, res) => {
  res.json({ message: 'Health goals updated', count: req.body.goalIds?.length || 0 });
});

app.post('/api/profile/onboarding-complete', (_req, res) => {
  res.json({ message: 'Onboarding complete' });
});

app.post('/api/scan', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.includes('fake-jwt-token')) {
    return res.status(401).json({ message: 'Login required' });
  }
  const { barcode } = req.body;

  const products: Record<string, any> = {
    '3017620422003': {
      name: 'Nutella Hazelnut Spread',
      brand: 'Ferrero',
      ingredients: 'Sugar, Palm Oil, Hazelnuts, Cocoa, Skim Milk, Whey Powder, Lecithin (Soy), Vanillin',
      allergenWarnings: [
        { id: 3, name: 'Milk' },
        { id: 6, name: 'Soy' },
        { id: 2, name: 'Tree Nuts' }
      ],
      safe: false,
      riskLevel: 'high'
    },
    '5000159484695': {
      name: 'Cadbury Dairy Milk Chocolate',
      brand: 'Cadbury',
      ingredients: 'Milk, Sugar, Cocoa Butter, Cocoa Mass, Vegetable Fats, Emulsifiers (Soy Lecithin)',
      allergenWarnings: [
        { id: 3, name: 'Milk' },
        { id: 6, name: 'Soy' }
      ],
      safe: false,
      riskLevel: 'caution'
    },
    '0016000275287': {
      name: 'Organic Apple Juice',
      brand: 'Simply Organic',
      ingredients: 'Organic Apple Juice',
      allergenWarnings: [],
      safe: true,
      riskLevel: 'safe'
    }
  };

  const product = products[barcode];

  if (product) {
    res.json({
      product: { name: product.name, brand: product.brand, ingredients: product.ingredients },
      allergenWarnings: product.allergenWarnings,
      safe: product.safe,
      riskLevel: product.riskLevel
    });
  } else {
    res.json({
      product: { name: `Product ${barcode}`, brand: 'Unknown Brand', ingredients: 'Ingredients not available' },
      allergenWarnings: [],
      safe: true,
      riskLevel: 'safe'
    });
  }
});

app.get('/api/scan/history', (_req, res) => {
  res.json({
    scans: [
      {
        id: 1,
        risk_level: 'high',
        matched_allergens: JSON.stringify([{ id: 3, name: 'Milk' }, { id: 6, name: 'Soy' }]),
        safe: false,
        created_at: new Date().toISOString(),
        barcode: '3017620422003',
        product_name: 'Nutella Hazelnut Spread',
        brand: 'Ferrero',
        image_url: null
      }
    ]
  });
});

export default app;

const PORT = process.env.PORT || 4000;
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Test login: POST /api/auth/login with any email/password');
  });
}
