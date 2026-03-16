import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  res.json({
    token: 'fake-jwt-token-123',
    user: { id: 1, name: 'Test User', email, onboardingComplete: false }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { email, name } = req.body;
  res.json({
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
    user: { id: 1, name: 'Test User', email: 'test@verdant.app', scanCount: 5, onboardingComplete: false }
  });
});

app.get('/api/profile/allergens', (_req, res) => {
  res.json({
    allergens: [{ id: 3, name: 'Milk' }, { id: 6, name: 'Soy' }],
    available: [
      { id: 1, name: 'Peanuts' }, { id: 2, name: 'Tree Nuts' },
      { id: 3, name: 'Milk' }, { id: 4, name: 'Eggs' },
      { id: 5, name: 'Wheat' }, { id: 6, name: 'Soy' },
      { id: 7, name: 'Fish' }, { id: 8, name: 'Shellfish' }
    ]
  });
});

app.get('/api/profile/dietary', (_req, res) => {
  res.json({
    preferences: [],
    available: [
      { id: 1, name: 'Vegan' }, { id: 2, name: 'Vegetarian' },
      { id: 3, name: 'Keto' }, { id: 4, name: 'Halal' }
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
  const ids: number[] = req.body.allergenIds || [];
  if (ids.length > 0) userAllergenIds = new Set(ids);
  res.json({ message: 'Allergens updated', count: ids.length });
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

const ALLERGEN_TAG_MAP: Record<string, { id: number; name: string }> = {
  'en:milk': { id: 3, name: 'Milk' },
  'en:soybeans': { id: 6, name: 'Soy' },
  'en:peanuts': { id: 1, name: 'Peanuts' },
  'en:nuts': { id: 2, name: 'Tree Nuts' },
  'en:eggs': { id: 4, name: 'Eggs' },
  'en:gluten': { id: 5, name: 'Gluten' },
  'en:wheat': { id: 5, name: 'Wheat' },
  'en:fish': { id: 7, name: 'Fish' },
  'en:crustaceans': { id: 8, name: 'Shellfish' },
  'en:celery': { id: 9, name: 'Celery' },
  'en:mustard': { id: 10, name: 'Mustard' },
  'en:sesame-seeds': { id: 11, name: 'Sesame' },
  'en:lupin': { id: 12, name: 'Lupin' },
  'en:molluscs': { id: 13, name: 'Molluscs' },
  'en:sulphur-dioxide-and-sulphites': { id: 14, name: 'Sulphites' },
};

const INGREDIENT_KEYWORDS: { keywords: string[]; allergen: { id: number; name: string } }[] = [
  { keywords: ['milk', 'dairy', 'lactose', 'whey', 'casein', 'cream', 'butter', 'cheese'], allergen: { id: 3, name: 'Milk' } },
  { keywords: ['soy', 'soya', 'soybean', 'soja'], allergen: { id: 6, name: 'Soy' } },
  { keywords: ['peanut', 'arachid'], allergen: { id: 1, name: 'Peanuts' } },
  { keywords: ['almond', 'cashew', 'walnut', 'hazelnut', 'pistachio', 'pecan', 'macadamia', 'brazil nut', 'noisette'], allergen: { id: 2, name: 'Tree Nuts' } },
  { keywords: ['egg', 'oeuf'], allergen: { id: 4, name: 'Eggs' } },
  { keywords: ['wheat', 'gluten', 'flour', 'blé'], allergen: { id: 5, name: 'Gluten' } },
  { keywords: ['fish', 'cod', 'salmon', 'tuna', 'anchov', 'poisson'], allergen: { id: 7, name: 'Fish' } },
  { keywords: ['shellfish', 'shrimp', 'crab', 'lobster', 'prawn', 'crustacean'], allergen: { id: 8, name: 'Shellfish' } },
  { keywords: ['sesame', 'sésame'], allergen: { id: 11, name: 'Sesame' } },
  { keywords: ['mustard', 'moutarde'], allergen: { id: 10, name: 'Mustard' } },
  { keywords: ['celery', 'céleri'], allergen: { id: 9, name: 'Celery' } },
];

function detectAllergens(allergenTags: string[], ingredientsText: string) {
  const found: { id: number; name: string }[] = [];
  const seen = new Set<number>();

  for (const tag of allergenTags) {
    const mapped = ALLERGEN_TAG_MAP[tag.toLowerCase()];
    if (mapped && !seen.has(mapped.id)) {
      seen.add(mapped.id);
      found.push(mapped);
    }
  }

  const lower = (ingredientsText || '').toLowerCase();
  for (const { keywords, allergen } of INGREDIENT_KEYWORDS) {
    if (!seen.has(allergen.id) && keywords.some(kw => lower.includes(kw))) {
      seen.add(allergen.id);
      found.push(allergen);
    }
  }

  return found;
}

let userAllergenIds = new Set([3, 6]);

app.post('/api/scan', async (req, res) => {
  const { barcode } = req.body;
  if (!barcode) {
    return res.status(400).json({ message: 'Barcode is required' });
  }

  try {
    const offRes = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`,
      { headers: { 'User-Agent': 'VerdantAllergenScanner/1.0' } }
    );
    const offData = await offRes.json() as any;

    if (offData.status !== 1 || !offData.product) {
      return res.json({
        product: { name: `Product ${barcode}`, brand: 'Not found in database', ingredients: 'Not available' },
        allergenWarnings: [],
        safe: true,
        riskLevel: 'safe',
        source: 'not_found'
      });
    }

    const p = offData.product;
    const name = p.product_name || p.product_name_en || `Product ${barcode}`;
    const brand = p.brands || 'Unknown Brand';
    const ingredients = p.ingredients_text || p.ingredients_text_en || 'Ingredients not listed';
    const imageUrl = p.image_front_small_url || p.image_url || null;

    const allergenTags: string[] = p.allergens_tags || [];
    const detectedAllergens = detectAllergens(allergenTags, ingredients);

    const profileMatches = detectedAllergens.filter(a => userAllergenIds.has(a.id));
    const safe = profileMatches.length === 0;
    let riskLevel = 'safe';
    if (profileMatches.length >= 2) riskLevel = 'high';
    else if (profileMatches.length === 1) riskLevel = 'caution';

    res.json({
      product: { name, brand, ingredients, imageUrl },
      allergenWarnings: detectedAllergens,
      safe,
      riskLevel,
      source: 'openfoodfacts'
    });
  } catch {
    res.json({
      product: { name: `Product ${barcode}`, brand: 'Unknown', ingredients: 'Could not fetch product data' },
      allergenWarnings: [],
      safe: true,
      riskLevel: 'safe',
      source: 'error'
    });
  }
});

app.get('/api/scan/history', (_req, res) => {
  res.json({
    scans: [{
      id: 1, risk_level: 'high',
      matched_allergens: JSON.stringify([{ id: 3, name: 'Milk' }, { id: 6, name: 'Soy' }]),
      safe: false, created_at: new Date().toISOString(),
      barcode: '3017620422003', product_name: 'Nutella Hazelnut Spread',
      brand: 'Ferrero', image_url: null
    }]
  });
});

export default app;
