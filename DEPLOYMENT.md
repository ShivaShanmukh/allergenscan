# 🌐 Deploying VERDANT to the Web

## Quick Deploy with Vercel (Recommended)

### **Option 1: Deploy via Vercel Dashboard** (Easiest)

1. **Go to Vercel:**
   - Visit https://vercel.com
   - Sign up/Login with GitHub

2. **Import Repository:**
   - Click "Add New Project"
   - Select "Import Git Repository"
   - Choose `ShivaShanmukh/allergenscan`

3. **Configure Build:**
   - **Framework Preset:** Other
   - **Root Directory:** `allergy-scanner-frontend`
   - **Build Command:** `npx expo export:web`
   - **Output Directory:** `dist`

4. **Environment Variables:**
   Add this variable:
   ```
   EXPO_PUBLIC_API_URL=http://localhost:4000/api
   ```
   (Or deploy backend first and use that URL)

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Get your public URL: `https://your-app.vercel.app`

### **Option 2: Deploy via Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
cd c:\Users\Superman\Downloads\VERDANT
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: allergenscan
# - Directory: allergy-scanner-frontend
# - Override settings? Yes
# - Build command: npx expo export:web
# - Output directory: dist
```

---

## Deploy Backend (Required for Full Functionality)

### **Option A: Deploy Mock Backend to Vercel**

1. Create `api` folder in root
2. Move mock-backend logic to serverless functions
3. Deploy with main app

### **Option B: Deploy to Railway** (Recommended for Real Backend)

1. **Go to Railway:**
   - Visit https://railway.app
   - Sign up with GitHub

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `allergenscan` repository
   - Select `allergenscan` folder

3. **Add PostgreSQL:**
   - Click "New"
   - Select "Database" → "PostgreSQL"
   - Copy connection string

4. **Set Environment Variables:**
   ```
   PORT=4000
   DATABASE_URL=<your_railway_postgres_url>
   JWT_SECRET=your_secret_key_here
   ```

5. **Deploy:**
   - Railway auto-deploys
   - Get your backend URL: `https://your-backend.railway.app`

6. **Update Frontend:**
   - Update `EXPO_PUBLIC_API_URL` in Vercel to your Railway URL

---

## Important Notes

### **⚠️ Camera Limitations**
- Camera scanning **does NOT work** in web browsers
- Users must use **manual input** on web
- For camera scanning, users need the **mobile app**

### **📱 Mobile App Access**
After deploying web version, users can still access the full mobile app:
1. Install Expo Go on phone
2. Visit your Vercel URL
3. Add QR code to download mobile version

### **🔒 CORS Configuration**
Make sure your backend allows requests from your Vercel domain:
```javascript
app.use(cors({
  origin: ['https://your-app.vercel.app', 'http://localhost:8081']
}));
```

---

## Testing Your Deployment

Once deployed, test these flows:

1. **Registration:** ✅ Should work
2. **Login:** ✅ Should work
3. **Onboarding:** ✅ Should work
4. **Manual Scan:** ✅ Should work
5. **Camera Scan:** ❌ Won't work (web limitation)
6. **History:** ✅ Should work
7. **Profile:** ✅ Should work

---

## Sharing Your App

Once deployed, share:
- **Web App:** `https://your-app.vercel.app`
- **GitHub:** `https://github.com/ShivaShanmukh/allergenscan`

Users can:
- Test the app in browser (manual input only)
- Download Expo Go and use full camera features
- View source code on GitHub

---

## Quick Start (No Backend Deployment)

If you just want to deploy frontend for demo:

1. Update `constants/api.ts` to use mock data
2. Deploy to Vercel
3. Add note: "Backend coming soon - limited functionality"

This lets people see the UI and flow, even without full backend!

---

**Ready to deploy?** Start with Vercel dashboard - it's the easiest! 🚀
