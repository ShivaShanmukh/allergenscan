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

---

## 🏗️ Architecture

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
