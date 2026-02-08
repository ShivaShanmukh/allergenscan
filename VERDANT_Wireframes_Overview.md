# VERDANT - MVP Wireframes Documentation

**App Name:** VERDANT  
**Tagline:** "Your AI Health Companion - Sustainable food, simplified"  
**Platform:** Android (Portrait-only)  
**Target Demographic:** Family-friendly (ages 8+)  
**Design Language:** Nature-inspired, clean, accessible

---

## 📱 Complete Screen Set (11 Screens)

### **ONBOARDING FLOW**

#### 01. Splash/Welcome
- **Purpose:** First-time user introduction
- **Key Elements:**
  - VERDANT logo (centered)
  - Tagline
  - "Get Started" CTA button
  - "Sign In" link for returning users
- **Notes:** Auto-skip for returning users

#### 02. Onboarding - Allergies Setup
- **Purpose:** Collect critical health data for scan safety
- **Key Elements:**
  - Progress indicator (Step 1 of 3)
  - Selectable allergy chips (Peanuts, Dairy, Gluten, etc.)
  - "Add Custom Allergy" option
  - "Skip for now" link (discouraged but available)
- **Data Collected:** User allergies/intolerances

#### 03. Onboarding - Dietary Preferences
- **Purpose:** Personalize food recommendations
- **Key Elements:**
  - Progress indicator (Step 2 of 3)
  - Dietary preference chips (Vegan, Keto, Halal, etc.)
  - Optional - can skip
- **Data Collected:** Dietary lifestyle choices

#### 04. Onboarding - Health Goals
- **Purpose:** Understand user motivation for personalized AI coaching
- **Key Elements:**
  - Progress indicator (Step 3 of 3)
  - Goal cards with icons and descriptions:
    - Eat Healthier
    - Manage Allergies
    - Save Money
    - Go Sustainable
  - "Complete Setup" CTA
- **Data Collected:** Primary health goal

---

### **MAIN APP SCREENS**

#### 05. Dashboard/Home ⭐ **[PRIMARY SCREEN]**
- **Purpose:** Central hub - all features accessible from here
- **Layout:**
  - **Header:** User avatar, greeting, notifications
  - **Search Bar:** Text search + voice button (Ivy activation)
  - **Quick Filters:** Vegan, Budget, Nearby (scrollable chips)
  - **Map Section (Mini):** Embedded map showing nearby stores with pins
    - User location indicator
    - Store pins (leaf markers)
    - "Tap to expand full map" prompt
  - **Today's Activity Stats:** Scans, Money Saved, Stores Visited
  - **AI Agent Widget (Ivy):**
    - Avatar + waveform indicator
    - "Tap to chat or say 'Hey Ivy'" prompt
    - Always listening indicator
  - **Floating Scan Button:** Large, prominent terracotta button (bottom center)
  - **Bottom Navigation:** Home, Explore, History, Profile
- **User Flows:**
  - Tap Map → Full-screen map view
  - Tap Scan → Camera scanner
  - Tap Ivy → AI chat interface
  - Voice "Hey Ivy" → Activates voice chat
  - Search bar → Store/product search results

#### 06. Scanner Camera View
- **Purpose:** Barcode scanning for product analysis
- **Key Elements:**
  - Full-screen camera viewfinder
  - Green scan frame with corner indicators
  - Top controls: Close (X), Flashlight toggle
  - Bottom instruction panel:
    - "Scan Product Barcode"
    - Positioning guidance
    - "Can't scan? Enter manually" link
  - Ivy voice indicator: "Ivy is ready to help"
- **Technical:** Real-time barcode detection, ARCore integration
- **User Flow:** Scan detected → Auto-proceed to Scan Results

#### 07. Scan Results - Product Analysis
- **Purpose:** Display allergen safety + nutritional insights
- **Layout:**
  - Header with back button
  - Product image and name
  - **Safety Indicator (Large, Prominent):**
    - Green circle: SAFE ✓
    - Yellow circle: CHECK INGREDIENTS ⚠️
    - Red circle: CAUTION ⚠️
  - **Allergen Details Card:** Lists detected allergens (if any)
  - **Nutrition Highlights:** Sugar, fiber, vitamins, etc.
  - **Ivy Voice Message (Auto-spoken):**
    - Explains results conversationally
    - Suggests alternatives if unsafe
  - **Action Buttons:**
    - "Find Alternatives Nearby" (primary CTA)
    - "View Full Details" / "Save to History"
- **Voice Integration:** Ivy auto-activates and speaks results immediately
- **User Flow:** "Find Alternatives" → Map with relevant stores

#### 08. Store Listings / Search Results
- **Purpose:** Display stores matching search/filter criteria
- **Key Elements:**
  - Header with back button and search query
  - Search bar (refine search)
  - Filter chips: Distance, Price, Rating
  - Results count
  - **Store Cards (List):**
    - Store image
    - Name, distance, price range, rating
    - Tags (Gluten-Free, Organic, etc.)
  - "View All on Map" button
  - **Ivy Suggestion Box:** Personalized store recommendation
  - Bottom navigation
- **User Flow:** Tap store card → Store Detail page

#### 09. Store Detail Page
- **Purpose:** Comprehensive store information + navigation
- **Layout:**
  - Header with back button and favorite toggle
  - Store hero image
  - Store name, rating, distance, price range
  - Tags (specialties)
  - **Action Buttons:** Navigate (primary), Call Store
  - **About Section:** Store description
  - **Hours:** Operating hours (expandable)
  - **Popular Products:** Horizontal scroll of product cards
  - **Ivy's Tip:** Personalized insight (e.g., "12 products match your preferences")
- **User Flow:** 
  - Navigate → Opens Maps app
  - Call → Phone dialer
  - Product card → Product detail (future)

#### 10. AI Chat Interface (Ivy) 🌿
- **Purpose:** Conversational AI health companion
- **Key Features:**
  - **Header:** Ivy avatar, online status
  - **Waveform Indicator:** Shows when actively listening
  - **Chat Messages:**
    - Ivy messages: Left-aligned, sage green background
    - User messages: Right-aligned, forest green background
  - **Interactive Elements:**
    - Store/product cards (tappable)
    - Quick reply buttons
  - **Context Awareness Indicator:** Shows what Ivy knows about user
  - **Voice Input Area:**
    - Text input field
    - Push-to-talk microphone button
    - "Push to talk" instruction
  - **Mode Toggle:** "Switch to wellness chat mode" (therapeutic conversations)
- **Voice Capabilities:**
  - Always listening (wake word: "Hey Ivy")
  - Push-to-talk option
  - Auto-activates after scan results
  - Context-aware responses (knows scan history, location, preferences)
- **Conversation Types:**
  - Product questions
  - Store recommendations
  - Health guidance
  - Wellness/therapeutic support

#### 11. Profile/Settings
- **Purpose:** User account management + health profile
- **Layout:**
  - Header with settings gear icon
  - Profile avatar and name
  - Member since date
  - **Activity Stats Cards:**
    - Products scanned (this week)
    - Money saved (total)
    - Stores visited (this month)
  - **Health Profile Section:**
    - Allergies (editable)
    - Dietary Preferences (editable)
    - Health Goals (editable)
  - **App Settings:**
    - Notifications toggle
    - Voice Assistant settings
    - Location Services
    - Privacy & Data management
  - Bottom navigation
- **User Flow:** Edit options → Onboarding-style editors

---

## 🎨 Design System Summary

### **Color Palette**
- **Primary:** Forest Green `#2D5F3F` (trust, sustainability)
- **Secondary:** Sage Green `#8BA888` (calm, natural)
- **Background:** Cream `#F8F6F1` / White `#FFFFFF`
- **Accent:** Terracotta `#D97757` (CTAs, energy)
- **Success:** Green `#4CAF50`
- **Warning:** Amber `#FF9800`
- **Danger:** Red `#E57373`

### **Typography**
- **Font:** Inter (clean, highly readable)
- **Sizes:** H1 (28px), H2 (22px), Body (16px), Small (14px)

### **Components**
- **Buttons:** 48px height (touch-friendly), 12px border radius
- **Cards:** White background, soft shadow, 12px radius
- **Icons:** Illustrated, hand-drawn feel (organic)
- **Map:** Custom illustrated style (like Forest app)

### **AI Character: Ivy 🌿**
- **Visual:** Leaf/plant character, sage green
- **Voice:** Warm, supportive, female (ElevenLabs)
- **Personality:** Friendly coach + empathetic companion

---

## 🔄 Key User Flows

### **Flow 1: First-Time Scan**
1. Open app → Dashboard
2. Tap "SCAN PRODUCT" button
3. Camera opens → Scan barcode
4. Results appear → Ivy speaks analysis
5. If unsafe → Tap "Find Alternatives"
6. Map shows stores with better options
7. Tap store → View details → Navigate

### **Flow 2: Find Cheap Gluten-Free Options**
1. Dashboard → Tap search bar
2. Type "gluten-free bread"
3. Apply filter: "Budget"
4. View store listings
5. Tap store card → Store detail
6. Navigate to store

### **Flow 3: Ask Ivy for Help**
1. Dashboard → Tap Ivy widget (OR say "Hey Ivy")
2. Chat interface opens
3. User: "I need breakfast ideas for my allergy"
4. Ivy: Suggests products + shows nearby stores
5. Tap store card → Navigate

### **Flow 4: Voice-Only Interaction**
1. User says "Hey Ivy"
2. Ivy activates (waveform shows listening)
3. User: "What's the cheapest organic store near me?"
4. Ivy: Responds verbally + shows map with stores
5. User can tap or continue voice commands

---

## 📊 MVP Feature Scope

### **Included (Launch):**
✅ Barcode scanning  
✅ Allergen detection  
✅ Store discovery (map + list)  
✅ AI voice assistant (basic health guidance)  
✅ Search & filters  
✅ Product analysis  
✅ Store self-service platform (separate admin portal)  
✅ Scan history tracking  

### **Future (Post-MVP):**
🔮 Therapeutic AI conversations (deep wellness)  
🔮 Meal planning  
🔮 Social features (sharing, reviews)  
🔮 Price tracking & alerts  
🔮 Loyalty/rewards program  
🔮 Product recommendations engine  
🔮 Nutrition tracking dashboard  

---

## 🛠️ Technical Notes

### **Platform:**
- Android SDK 26+ (ARCore required)
- Portrait-only (simplifies AR)
- 360×640 base resolution (scaled for density)

### **Key Integrations:**
- **ElevenLabs:** Voice AI for Ivy
- **Google Maps API:** Map display & navigation
- **Barcode Scanner:** ML Kit or similar
- **Backend:** Supabase (database, auth, storage)
- **Analytics:** Track scan rates, user engagement

### **Store Platform:**
- Separate web portal for stores to:
  - Register/manage profile
  - Add/edit products & prices
  - View analytics (how many users found them)
  - Update hours, images, descriptions

---

## 🎯 Next Steps

1. **Review Wireframes:** Validate flows and interactions
2. **Design System:** Create high-fidelity mockups of key screens
3. **Component Library:** Build reusable UI components
4. **Prototype:** Interactive Figma prototype for investor demos
5. **Developer Handoff:** Specs, assets, and documentation
6. **User Testing:** Validate with 5-10 target users before full development

---

## 💡 Design Decisions

**Why Dashboard-First (Not Scan-First)?**
- Discovery is the core value (finding sustainable stores)
- Scanning is validation tool, not primary action
- Map visibility drives engagement and exploration

**Why Always-Listening Voice?**
- Hands-free usage (grocery shopping)
- Lower friction than push-to-talk for health questions
- "Hey Ivy" creates brand personality

**Why Embedded Map on Dashboard?**
- Immediate visibility of nearby options
- Quick access to full map when needed
- Balances discovery with other features (scan, AI)

**Why Separate Store Platform?**
- Scales better than manual curation
- Stores have ownership and incentive to keep data fresh
- Reduces operational burden on VERDANT team

---

**Created:** February 7, 2026  
**For:** VERDANT MVP Investor Pitch & Development  
**Status:** Wireframes complete, ready for high-fidelity design
