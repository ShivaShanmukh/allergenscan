# 🌿 VERDANT - Allergy Scanner App

> **Smart barcode scanning for safer food choices**

VERDANT is a React Native mobile application that helps users with food allergies make safer choices by scanning product barcodes and instantly checking for allergens.

## ✨ Features

### 📸 **Camera Barcode Scanning** (Week 1 - ✅ Complete)
- Real-time camera-based barcode detection
- Supports multiple barcode formats (EAN-13, UPC-A, Code-128, QR codes)
- Flashlight toggle for low-light scanning
- Haptic feedback on successful scan
- Manual input fallback for accessibility
- Permission handling with user-friendly prompts

### 🔐 **Authentication & Onboarding**
- Secure JWT-based authentication
- Multi-step onboarding flow:
  - Allergen selection
  - Dietary preferences
  - Health goals
- Persistent user sessions

### 🏠 **Home Dashboard**
- Personalized greeting
- Quick stats (scan count, allergens tracked)
- Quick action buttons
- Ivy AI assistant widget (placeholder)

### 📊 **Scan Results**
- Color-coded safety badges (Safe/Caution/Warning)
- Product information display
- Ingredient list
- Allergen warnings with risk levels
- Scan history tracking

### 👤 **User Profile**
- Manage allergens
- Update dietary preferences
- Set health goals
- View account information

---

## 🏗️ Architecture

### **Frontend**
- **Framework:** React Native with Expo
- **Navigation:** Expo Router (file-based routing)
- **State Management:** React Hooks + AsyncStorage
- **UI Components:** Custom components with nature-inspired design
- **Camera:** expo-barcode-scanner
- **Haptics:** expo-haptics

### **Backend**
- **Framework:** Express.js
- **Database:** PostgreSQL (Neon)
- **Authentication:** JWT
- **External API:** Open Food Facts for product data
- **ORM:** Raw SQL with pg client

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+
- npm or yarn
- PostgreSQL database (or Neon account)
- Expo CLI
- Physical device or emulator with camera (for full testing)

### **Installation**

#### 1. Clone the repository
\`\`\`bash
git clone https://github.com/ShivaShanmukh/allergenscan.git
cd allergenscan
\`\`\`

#### 2. Install backend dependencies
\`\`\`bash
cd allergenscan
npm install
\`\`\`

#### 3. Configure environment variables
Create \`.env\` in the \`allergenscan\` directory:
\`\`\`env
PORT=4000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key_here
\`\`\`

#### 4. Initialize database
\`\`\`bash
npm run migrate
\`\`\`

#### 5. Start backend server
\`\`\`bash
npm run dev
\`\`\`
Backend will run on http://localhost:4000

#### 6. Install frontend dependencies
\`\`\`bash
cd ../allergy-scanner-frontend
npm install
\`\`\`

#### 7. Start Expo development server
\`\`\`bash
npx expo start
\`\`\`

#### 8. Run on device
- **Web:** Press \`w\` (camera won't work, use manual input)
- **iOS:** Press \`i\` (requires Xcode)
- **Android:** Press \`a\` (requires Android Studio)
- **Physical Device:** Scan QR code with Expo Go app

---

## 🧪 Testing

### **Test Barcodes**

| Barcode | Product | Allergens | Risk Level |
|---------|---------|-----------|------------|
| \`3017620422003\` | Nutella Hazelnut Spread | Milk, Soy, Tree Nuts | ⚠️ HIGH |
| \`5000159484695\` | Cadbury Dairy Milk | Milk, Soy | ⚠️ CAUTION |
| \`0016000275287\` | Organic Apple Juice | None | ✅ SAFE |

### **Test Credentials**
- **Email:** test@verdant.app
- **Password:** password123

### **Testing Flow**
1. Register/Login
2. Complete onboarding (select Milk & Soy as allergens)
3. Navigate to Scan tab
4. Grant camera permission
5. Scan barcode or use manual input
6. View results with allergen warnings

---

## 📱 Camera Scanning Implementation

### **Key Features**
- Full-screen camera viewfinder
- Green scan frame overlay with corner indicators
- Top controls (flashlight toggle)
- Bottom panel (instructions + manual input option)
- Permission request handling
- Loading states

### **Code Structure**
\`\`\`
allergy-scanner-frontend/
├── app/
│   ├── (tabs)/
│   │   ├── scan.tsx          # Camera scanner screen
│   │   ├── home.tsx           # Dashboard
│   │   ├── history.tsx        # Scan history
│   │   └── profile.tsx        # User profile
│   ├── auth/
│   │   ├── login.tsx          # Login screen
│   │   └── register.tsx       # Registration
│   ├── onboarding/
│   │   ├── allergens.tsx      # Step 1
│   │   ├── dietary.tsx        # Step 2
│   │   └── goals.tsx          # Step 3
│   └── index.tsx              # Landing page
├── constants/
│   ├── theme.ts               # Design system
│   └── api.ts                 # API configuration
└── package.json
\`\`\`

### **Camera Implementation Highlights**
\`\`\`typescript
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Haptics from 'expo-haptics';

// Permission handling
const [hasPermission, setHasPermission] = useState<boolean | null>(null);
useEffect(() => {
  (async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  })();
}, []);

// Barcode detection
const handleBarCodeScanned = async ({ type, data }) => {
  setScanned(true);
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  await performScan(data);
};

// Camera view
<BarCodeScanner
  onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
  style={StyleSheet.absoluteFillObject}
  torchMode={torch ? 'on' : 'off'}
/>
\`\`\`

---

## 🎨 Design System

### **Color Palette**
- **Forest Green:** `#2D5016` (Primary)
- **Sage:** `#8FA888` (Secondary)
- **Terracotta:** `#C1666B` (Accent/CTA)
- **Cream:** `#F8F4E8` (Background)
- **Success:** `#4CAF50`
- **Warning:** `#FF9800`
- **Danger:** `#D32F2F`

### **Typography**
- **System Font:** San Francisco (iOS), Roboto (Android)
- **Weights:** 400 (Regular), 600 (Semibold), 700 (Bold), 800 (Extra Bold)

---

## 📂 Project Structure

\`\`\`
VERDANT/
├── allergenscan/              # Backend (Express + PostgreSQL)
│   ├── src/
│   │   ├── routes/            # API endpoints
│   │   ├── services/          # Business logic
│   │   ├── db.ts              # Database connection
│   │   ├── config.ts          # Configuration
│   │   ├── initDb.ts          # Database initialization
│   │   └── index.ts           # Server entry point
│   └── package.json
│
├── allergy-scanner-frontend/  # Frontend (React Native + Expo)
│   ├── app/                   # Screens (file-based routing)
│   ├── constants/             # Theme & config
│   ├── assets/                # Images & fonts
│   └── package.json
│
└── mock-backend.js            # Mock server for testing
\`\`\`

---

## 🛣️ Roadmap

### ✅ **Week 1: Camera Barcode Scanning** (Complete)
- [x] Camera viewfinder implementation
- [x] Barcode detection
- [x] Permission handling
- [x] Manual input fallback
- [x] Flashlight toggle
- [x] Haptic feedback

### 🚧 **Week 2: Store Database & Discovery** (In Progress)
- [ ] Store database schema
- [ ] Store management APIs
- [ ] Store search/filter
- [ ] Google Maps integration

### 📅 **Week 3: Ivy AI Voice Assistant**
- [ ] ElevenLabs integration
- [ ] Voice commands
- [ ] Natural language queries
- [ ] Product recommendations

### 📅 **Week 4: Store Self-Service Portal**
- [ ] Store registration
- [ ] Product management
- [ ] Analytics dashboard
- [ ] QR code generation

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Shiva Shanmukh**
- GitHub: [@ShivaShanmukh](https://github.com/ShivaShanmukh)

---

## 🙏 Acknowledgments

- **Open Food Facts** for product data API
- **Expo** for the amazing React Native framework
- **Neon** for PostgreSQL hosting
- **ElevenLabs** (upcoming) for AI voice integration

---

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Email: shivashanmukh@example.com

---

**Made with 🌿 by the VERDANT team**
