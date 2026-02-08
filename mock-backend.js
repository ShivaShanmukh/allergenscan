const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Mock login
app.post('/api/auth/login', (req, res) => {
    console.log('🔐 Login request received:', req.body);
    res.status(200).json({
        token: 'mock-jwt-token-123',
        user: {
            id: 1,
            name: 'Test User',
            email: req.body.email || 'test@verdant.app',
            onboardingComplete: false
        }
    });
});

// Mock register
app.post('/api/auth/register', (req, res) => {
    console.log('📝 Register request received:', req.body);
    res.status(200).json({
        token: 'mock-jwt-token-123',
        user: {
            id: 1,
            name: req.body.name || 'Test User',
            email: req.body.email || 'test@verdant.app',
            onboardingComplete: false
        }
    });
});

// Mock user profile
app.get('/api/me', (req, res) => {
    console.log('👤 /api/me request received');
    res.json({
        user: {
            id: 1,
            name: 'Test User',
            email: 'test@verdant.app',
            scanCount: 5,
            onboardingComplete: false  // Changed to false so users go through onboarding
        }
    });
});

// Mock allergens list
app.get('/api/profile/allergens', (req, res) => {
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

// Mock dietary preferences
app.get('/api/profile/dietary', (req, res) => {
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

// Mock health goals
app.get('/api/profile/goals', (req, res) => {
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

// Mock update endpoints
app.put('/api/profile/allergens', (req, res) => {
    res.json({ message: 'Allergens updated', count: req.body.allergenIds?.length || 0 });
});

app.put('/api/profile/dietary', (req, res) => {
    res.json({ message: 'Dietary preferences updated', count: req.body.preferenceIds?.length || 0 });
});

app.put('/api/profile/goals', (req, res) => {
    res.json({ message: 'Health goals updated', count: req.body.goalIds?.length || 0 });
});

app.post('/api/profile/onboarding-complete', (req, res) => {
    res.json({ message: 'Onboarding complete' });
});

// Mock barcode scan - THIS IS THE IMPORTANT ONE FOR CAMERA TESTING
app.post('/api/scan', (req, res) => {
    const { barcode } = req.body;

    // Mock product database
    const products = {
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
            product: {
                name: product.name,
                brand: product.brand,
                ingredients: product.ingredients
            },
            allergenWarnings: product.allergenWarnings,
            safe: product.safe,
            riskLevel: product.riskLevel
        });
    } else {
        // Default response for unknown barcodes
        res.json({
            product: {
                name: `Product ${barcode}`,
                brand: 'Unknown Brand',
                ingredients: 'Ingredients not available'
            },
            allergenWarnings: [],
            safe: true,
            riskLevel: 'safe'
        });
    }
});

// Mock scan history
app.get('/api/scan/history', (req, res) => {
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

app.listen(PORT, () => {
    console.log(`🚀 Mock backend running on http://localhost:${PORT}`);
    console.log(`📱 Test with Expo web at http://localhost:8081`);
    console.log(`\n📦 Test barcodes:`);
    console.log(`   3017620422003 - Nutella (has allergens)`);
    console.log(`   5000159484695 - Cadbury Chocolate (has allergens)`);
    console.log(`   0016000275287 - Apple Juice (safe)`);
});
