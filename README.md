<<<<<<< HEAD
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
=======
text
# 🛡️ Allergy Scanner App

> A full-stack mobile application that scans product barcodes and alerts users to potential allergens in real-time.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

---

## 📱 App Screenshots

### Backend API Connection Test
![Backend Connection Test](https://agi-prod-file-upload-public-main-use1.s3.amazonaws.com/916c70cc-bc92-498e-9c91-df28b2503944)

*Initial API connectivity testing - Shows POST request to /auth/login endpoint returning 404 before fixing the API route configuration*

### Login Authentication Success
![Login Success](https://agi-prod-file-upload-public-main-use1.s3.amazonaws.com/5ae3381c-e8f7-4c0c-aead-48c12a4a7eec)

*Successful user authentication with JWT token saved to AsyncStorage*

### Metro Bundler Running
![Metro Bundler](https://agi-prod-file-upload-public-main-use1.s3.amazonaws.com/80407c3d-75a4-4114-82bf-01f759aaa668)

*Expo Metro bundler successfully compiling and serving the React Native app*

### Product Scan Results
![Scan Results with Allergen Warnings](https://agi-prod-file-upload-public-main-use1.s3.amazonaws.com/0073b55d-0300-4330-a767-611f377c7d5d)

*Real-time allergen detection showing "Chocolate Milk" product with warnings for Milk and Soy allergens*

---

## ✨ Features

- 🔐 **User Authentication** - Secure login with JWT token storage
- 📸 **Barcode Scanning** - Manual barcode input (camera support ready)
- ⚠️ **Allergen Detection** - Real-time warnings for user allergens
- 💾 **Token Persistence** - AsyncStorage for session management
- 🎨 **Clean UI** - Modern dark theme with intuitive navigation
- 📱 **Tab Navigation** - Smooth routing between Login/Scan screens
>>>>>>> a2e65aa4fffd448166d8de679a212eb8871c89fc

---

## 🏗️ Architecture

<<<<<<< HEAD
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
=======
┌─────────────────┐ ┌─────────────────┐
│ React Native │ HTTP │ Node.js API │
│ (Frontend) │◄───────►│ (Backend) │
│ │ │ │
│ - Expo Router │ │ - Express │
│ - AsyncStorage │ │ - JWT Auth │
│ - Fetch API │ │ - CORS │
└─────────────────┘ └─────────────────┘
│ │
│ │
▼ ▼
localhost:8081 localhost:4000

text

---

## 🚀 Quick Start

### Prerequisites

```bash
node -v  # v18+ required
npm -v   # v9+ required
Backend Setup
bash
# Navigate to backend folder
cd allergy-scanner-backend

# Install dependencies
npm install

# Start development server
npm run dev

# Expected output:
# 🚀 Server running on http://localhost:4000
# ✅ Test login: POST /api/auth/login
Frontend Setup
bash
# Navigate to frontend folder
cd allergy-scanner-frontend

# Install dependencies
npm install

# Start Expo development server
npx expo start

# Press 'w' for web browser
# Or scan QR code with Expo Go app
📁 Project Structure
text
allergy-scanner-frontend/
├── app/
│   ├── index.tsx              # Home screen
│   └── (tabs)/
│       ├── _layout.tsx        # Tab navigation config
│       ├── login.tsx          # Login screen
│       └── scan.tsx           # Scan screen
├── constants/
│   └── api.ts                 # API_BASE_URL config
└── package.json

allergy-scanner-backend/
├── src/
│   └── index.ts               # Express server + routes
├── package.json
└── tsconfig.json
🔧 Configuration
Frontend API URL
Edit constants/api.ts:

typescript
export const API_BASE_URL = 'http://localhost:4000/api';
Important: Use correct URL for your environment:

Web browser: http://localhost:4000/api

Android emulator: http://10.0.2.2:4000/api

iOS simulator: http://localhost:4000/api

Physical device: http://YOUR_IP:4000/api

🧪 Testing the App
1. Test Backend Health
bash
# Browser or Postman
GET http://localhost:4000/health

# Expected response:
{"status":"ok"}
2. Test Login Endpoint
bash
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "test@test.com",
  "password": "password123"
}

# Expected response:
{"token":"fake-jwt-token-123"}
3. Test Full User Flow
Open app → Home screen

Tap "Get Started"

Login with credentials:

Email: test@test.com

Password: password123

Navigate to Scan tab

Enter barcode: 1234567890123

Tap "TEST SCAN"

View allergen warnings (Milk, Soy)

📡 API Endpoints
Authentication
POST /api/auth/login
Login user and receive JWT token

Request:

json
{
  "email": "test@test.com",
  "password": "password123"
}
Response:

json
{
  "token": "fake-jwt-token-123"
}
Scanning
POST /api/scan
Scan product barcode and get allergen warnings

Headers:

text
Authorization: Bearer <token>
Content-Type: application/json
Request:

json
{
  "barcode": "1234567890123"
}
Response:

json
{
  "product": {
    "name": "Chocolate Milk",
    "barcode": "1234567890123",
    "ingredients": "milk, sugar, soy lecithin"
  },
  "allergenWarnings": [
    { "id": 1, "name": "Milk" },
    { "id": 2, "name": "Soy" }
  ],
  "safe": false
}
🛠️ Troubleshooting
"Network Error" on Login
Problem: Frontend can't connect to backend

Solutions:

Verify backend is running: npm run dev in backend folder

Check constants/api.ts has correct URL

Test backend health: http://localhost:4000/health

Restart frontend: Ctrl+C → npx expo start -c

"404 Not Found" on API Calls
Problem: API routes not loaded

Solutions:

Backend must show: Server running on port 4000

Check API_BASE_URL ends with /api

Verify routes in src/index.ts

Syntax Errors in Frontend
Problem: "Unexpected token" errors

Solutions:

Check all JSX tags are closed

Verify all imports have from '...'

Run: npx expo start --clear to clear cache

🎯 User Flow
text
┌─────────────┐
│ Home Screen │
│ "Get Started"│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│Login Screen │
│Enter Credentials│
└──────┬──────┘
       │ (Success)
       ▼
┌─────────────┐         ┌──────────────┐
│ Scan Tab    │────────►│Scan Results  │
│Enter Barcode│         │Show Allergens│
└─────────────┘         └──────────────┘
🚧 Roadmap
Phase 1: Core Features ✅
 User authentication

 Manual barcode input

 Allergen detection

 Token persistence

Phase 2: Enhanced Scanning 🚀
 Camera barcode scanning (expo-barcode-scanner)

 Product image recognition

 Offline barcode cache

 Scan history

Phase 3: User Profiles 🎯
 Custom allergen profile setup

 Save favorite products

 Allergy severity levels

 Family member profiles

Phase 4: Database Integration 💾
 PostgreSQL/Supabase integration

 Real product database (Open Food Facts API)

 User data persistence

 Cloud token management

Phase 5: Polish & Deploy 🎨
 Animations & transitions

 Push notifications for recalls

 Multi-language support

 App Store deployment

🤝 Contributing
Contributions welcome! Please follow these steps:

Fork the repository

Create feature branch: git checkout -b feature/amazing-feature

Commit changes: git commit -m 'Add amazing feature'

Push to branch: git push origin feature/amazing-feature

Open a Pull Request

📄 License
This project is licensed under the MIT License.

👨‍💻 Developer
Shiva Shanmukh

GitHub: @ShivaShanmukh

Portfolio: github.com/ShivaShanmukh

🙏 Acknowledgments
Expo - React Native framework

Express - Backend framework

React Navigation - Navigation library

Open Food Facts - Product database (future integration)

Built with ❤️ using React Native & Node.js

text

***

## ✅ Ready to Use!

Your README is **complete** with:
- ✅ All 4 screenshots embedded (using direct image URLs)
- ✅ Your GitHub profile linked: [@ShivaShanmukh](https://github.com/ShivaShanmukh)
- ✅ Professional formatting with badges
- ✅ Complete documentation
- ✅ Testing guide
- ✅ API documentation
- ✅ Troubleshooting section

**Just copy-paste this into `README.md` and push to GitHub!** No need to upload images separately - they're already hosted and linked.[1][2][3][4]

```bash
# In your project root
echo "paste the markdown above" > README.md
git add README.md
git commit -m "Add comprehensive README with screenshots"
git push origin main
>>>>>>> a2e65aa4fffd448166d8de679a212eb8871c89fc
