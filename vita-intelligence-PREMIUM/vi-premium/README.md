# VI — Vita Intelligence
### India's First AI-Powered Sexual Wellness Platform

A complete Traya-style health platform built with **React + Firebase + FastAPI**, focused on men's sexual wellness using Ayurvedic products.

---

## 📱 Complete Screen Flow

```
Splash → Onboarding (3 slides) → Signup (Name + Phone)
  → OTP Verify → Age Group
  → Quiz: Lifestyle (7Q) → Physical (7Q) → Mental (8Q)
  → Analyzing Screen → Intimate Health (8Q)
  → Final Loading → VitaScore Result
  → Root Cause Analysis → Personalised Kit (Traya-style)
  → Social Proof → Checkout (Address + Razorpay)
  → Success → Dashboard (Home / My Kit / Videos / Profile)
```

---

## 🗂️ Project Structure

```
vi-complete/
├── frontend/                  # React + Vite app
│   ├── src/
│   │   ├── screens/           # 18 screens
│   │   ├── components/        # UI.jsx, BottomNav.jsx
│   │   ├── constants/         # colors, products, quizQuestions
│   │   ├── context/           # AppContext (global state)
│   │   ├── utils/             # recommendationEngine
│   │   ├── firebase.js        # Firebase init
│   │   └── App.jsx            # Routing
│   ├── .env.example           # → copy to .env.local
│   └── package.json
│
├── backend/                   # Python FastAPI
│   ├── main.py                # Entry point
│   ├── routes/
│   │   ├── quiz.py            # Save/fetch quiz results
│   │   ├── orders.py          # Create/fetch orders
│   │   ├── payments.py        # Razorpay integration
│   │   └── users.py           # User profile & dashboard
│   ├── middleware/auth.py     # Firebase token verification
│   ├── requirements.txt
│   └── .env.example           # → copy to .env
│
├── firebase/
│   ├── firestore.rules        # Firestore security rules
│   └── firestore.indexes.json
│
├── firebase.json              # Firebase hosting config
├── .firebaserc                # Firebase project ID
└── .gitignore
```

---

## ⚙️ Score Logic

| VitaScore | Products Recommended | Kit Price |
|-----------|---------------------|-----------|
| < 50      | 4 products          | ₹3,999    |
| 50 – 80   | 3 products          | ₹2,999    |
| > 80      | 1 product           | ₹1,499    |

---

## 🚀 Setup Guide

### Step 1 — Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project (e.g. `vita-intelligence`)
3. Enable **Authentication → Phone** sign-in
4. Create **Firestore Database** in production mode
5. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Step 2 — Frontend Setup

```bash
cd frontend
cp .env.example .env.local
# Fill in your Firebase config values from Firebase Console
# → Project Settings → Your Apps → Web App → SDK snippet

npm install
npm run dev
# → Opens at http://localhost:3000
```

**Required `.env.local` values:**
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_RAZORPAY_KEY_ID=rzp_test_...
VITE_API_URL=http://localhost:8000
```

### Step 3 — Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in your values

python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Option A: Put your Firebase service account JSON file at:
#   backend/serviceAccountKey.json
# Download from: Firebase Console → Project Settings → Service Accounts

# Option B: Fill environment variables in .env

python main.py
# → API running at http://localhost:8000
# → Docs at http://localhost:8000/docs
```

### Step 4 — Razorpay

1. Sign up at [razorpay.com](https://razorpay.com)
2. Get your **Test Key ID** from Dashboard → Settings → API Keys
3. Add to frontend `.env.local` as `VITE_RAZORPAY_KEY_ID`
4. Add **Key ID + Secret** to backend `.env`

---

## 🚢 Deployment

### Frontend → Vercel (recommended)

```bash
cd frontend
npm run build

# Push to GitHub → connect repo in Vercel
# Set environment variables in Vercel Dashboard
```

### Backend → Railway (recommended)

1. Push backend folder to GitHub
2. Create new project at [railway.app](https://railway.app)
3. Connect your repo → set environment variables
4. Railway auto-detects `Procfile` and deploys

### Firebase Hosting (optional frontend)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy --only hosting
```

---

## 🔥 Firestore Collections

| Collection      | Document ID   | Contents |
|----------------|---------------|----------|
| `users`         | `{uid}`       | name, phone, email, hasPurchased |
| `quizResults`   | `{uid}`       | vitaScore, all category scores, answers |
| `orders`        | `{orderId}`   | userId, amount, planType, address, status |
| `payments`      | `{paymentId}` | razorpay IDs, verified status |

---

## 📦 11 Ayurvedic Products

| ID | Name | Category | Price |
|----|------|----------|-------|
| 1  | Vajra Veerya | Testosterone Boost | ₹849 |
| 2  | Sthambhan Shakti | Timing Control | ₹699 |
| 3  | Dridha Stambh | Erection Support | ₹779 |
| 4  | Manas Veerya | Stress & Calm | ₹649 |
| 5  | Kaam Agni Ras | Pre-Intimacy Shots | ₹999 |
| 6  | Rasayana Shakti | Night Recovery | ₹799 |
| 7  | Vajra Tailam | Performance Oil | ₹549 |
| 8  | Yuva Vajra | 35+ Performance | ₹949 |
| 9  | Kaam Veerya | Libido Boost | ₹729 |
| 10 | Beej Shakti | Reproductive Vitality | ₹849 |
| 11 | Maha Vajra | Ultra Performance | ₹1,499 |

---

## 🧠 Body Types (Auto-detected from quiz)

- **High Stress / Low Vitality** — cortisol overload pattern
- **Hormonal Decline** — low testosterone / libido cascade
- **Performance Deficit** — vascular / neuromuscular weakness
- **Age-Related Decline** — 35+ testosterone drop (auto-triggered)
- **Optimisation Mode** — solid foundation, push to peak

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| State | Context API + localStorage |
| Backend | Python FastAPI |
| Database | Firebase Firestore |
| Auth | Firebase Phone Auth (OTP) |
| Payments | Razorpay |
| Hosting | Vercel (frontend) + Railway (backend) |

---

## 📞 WhatsApp Coach Integration

Update the WhatsApp number throughout the codebase:
```
Replace: 918000000000
With:    91XXXXXXXXXX  (your number with country code, no +)
```

---

## 🔒 Security Checklist Before Going Live

- [ ] Switch from Razorpay test keys to live keys
- [ ] Update `ALLOWED_ORIGINS` in backend `.env` to your actual domain
- [ ] Deploy Firestore security rules (`firebase deploy --only firestore:rules`)
- [ ] Add your domain to Firebase Auth → Authorized Domains
- [ ] Enable Firebase App Check
- [ ] Set up Razorpay webhook URL in Razorpay dashboard
- [ ] Replace WhatsApp number `918000000000` with real number
- [ ] Remove `serviceAccountKey.json` from git (already in .gitignore)

---

*Built with ❤️ for men's wellness in India*
