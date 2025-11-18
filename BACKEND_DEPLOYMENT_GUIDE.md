# 🚀 Backend Deployment Guide - Render & Railway

## 📋 Table of Contents
1. [Quick Start - যদি আপনার .env ফাইল আছে](#quick-start)
2. [Render.com Deployment (Recommended - Free)](#render-deployment)
3. [Railway.app Deployment (Alternative - Free)](#railway-deployment)
4. [MongoDB Atlas Setup (Free Database)](#mongodb-atlas-setup)
5. [Environment Variables Guide](#environment-variables)
6. [After Deployment Checklist](#after-deployment)

---

## ⚡ Quick Start - যদি আপনার .env ফাইল আছে

### ✅ আপনার যদি `Backend/.env` ফাইল ইতিমধ্যে আছে:

আপনার `.env` ফাইল প্রস্তুত থাকলে deployment **খুবই সহজ!** শুধু values copy-paste করতে হবে।

---

### 📝 Step-by-Step (আপনার .env থেকে)

#### **Step 1: GitHub এ Code Push করুন**

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

---

#### **Step 2: Render.com/Railway এ Account তৈরি করুন**

- **Render.com:** https://render.com (Recommended)
- **Railway.app:** https://railway.app (Alternative)

---

#### **Step 3: Web Service তৈরি করুন**

1. **Render/Railway Dashboard** → **New Web Service**
2. **GitHub Repository** connect করুন
3. **Settings:**
   - **Root Directory:** `Backend` ⚠️ (খুবই গুরুত্বপূর্ণ!)
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

---

#### **Step 4: Environment Variables Copy করুন**

আপনার `Backend/.env` ফাইল খুলুন এবং **সব values copy করুন:**

**আপনার .env ফাইলে যা আছে:**
```env
# Server Configuration
PORT=5000
CORS_ORIGIN=http://localhost:5173

# Database
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mediconnect?retryWrites=true&w=majority

# JWT
JWT_SECRET=mediconnect

# Admin
ADMIN_EMAIL=admin@doctor.com
ADMIN_PASSWORD=doctor123

# Cloudinary
CLOUDINARY_CLOUD_NAME=dsghjpz6r
CLOUDINARY_API_KEY=127693813729497
CLOUDINARY_API_SECRET=NZQcNG88yyGpxtaSdjLq4ci-kA8

# SSLCommerz
SSLCOMMERZ_STORE_ID=testbox
SSLCOMMERZ_STORE_PASSWORD=qwerty
SSLCOMMERZ_IS_LIVE=false

# URLs
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173

# Currency
CURRENCY=BDT
```

---

#### **Step 5: Render/Railway এ Environment Variables Add করুন**

**Render.com:**
1. **Environment Variables** section এ click করুন
2. **Add Environment Variable** button click করুন
3. আপনার `.env` ফাইল থেকে **Key** এবং **Value** copy-paste করুন
4. এভাবে **সব variables add করুন**

**Railway.app:**
1. **Variables** tab click করুন
2. **Raw Editor** toggle করুন
3. আপনার `.env` ফাইলের content **paste করুন** (comments ছাড়া)
4. **Save** করুন

---

#### **Step 6: Production Values Update করুন**

**⚠️ Important:** Production এ কিছু values পরিবর্তন করতে হবে:

| Variable | Local (.env) | Production (Render/Railway) |
|----------|-------------|---------------------------|
| `CORS_ORIGIN` | `http://localhost:5173` | `https://your-frontend.vercel.app` |
| `BACKEND_URL` | `http://localhost:5000` | `https://your-backend.onrender.com` (deploy হওয়ার পর) |
| `FRONTEND_URL` | `http://localhost:5173` | `https://your-frontend.vercel.app` |
| `NODE_ENV` | (নেই) | `production` (add করুন) |

**কিভাবে Update করবেন:**
1. Deploy হওয়ার পর **Backend URL** পাবেন
2. Render/Railway Dashboard → **Environment Variables**
3. **CORS_ORIGIN** update করুন (Frontend Vercel URL)
4. **BACKEND_URL** update করুন (Render/Railway দেওয়া URL)
5. **FRONTEND_URL** update করুন (Frontend Vercel URL)
6. **NODE_ENV=production** add করুন (যদি না থাকে)

---

#### **Step 7: Deploy করুন**

1. **Create Web Service** / **Deploy** button click করুন
2. **Wait:** 5-10 minutes (build + deploy)
3. **Logs** watch করুন

---

#### **Step 8: Test করুন**

Deploy successful হলে:
1. Browser এ Backend URL visit করুন
2. **Expected:** `🚀 Server is running...`
3. ✅ **Success!**

---

### 🎯 Quick Checklist

আপনার `.env` ফাইল থেকে যা copy করবেন:
- ✅ `PORT=5000`
- ✅ `MONGO_URI` (আপনার MongoDB Atlas connection string)
- ✅ `JWT_SECRET`
- ✅ `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- ✅ `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- ✅ `SSLCOMMERZ_STORE_ID`, `SSLCOMMERZ_STORE_PASSWORD`, `SSLCOMMERZ_IS_LIVE`
- ✅ `CURRENCY=BDT`

Production এ যা পরিবর্তন করবেন:
- ⚠️ `CORS_ORIGIN` → Frontend Vercel URL
- ⚠️ `BACKEND_URL` → Render/Railway দেওয়া URL
- ⚠️ `FRONTEND_URL` → Frontend Vercel URL
- ⚠️ `NODE_ENV=production` → Add করুন

---

### 💡 Tips

1. **`.env` ফাইল খুলে রাখুন** - Render/Railway এ values add করার সময়
2. **One by one add করুন** - Render এ (Railway এ bulk paste করতে পারবেন)
3. **Deploy হওয়ার পর** - Backend URL পেয়ে environment variables update করুন
4. **Test করুন** - Browser এ Backend URL visit করে check করুন

---

### ✅ আপনার .env ফাইল প্রস্তুত থাকলে:

**Deployment time:** 10-15 minutes (copy-paste + deploy)

**কোনো confusion নেই!** শুধু values copy-paste করুন। 🚀

---

## 🎯 Render.com Deployment (Recommended)

### ✅ কেন Render.com?
- ✅ সম্পূর্ণ Free tier
- ✅ সহজ setup
- ✅ Auto-deploy from GitHub
- ✅ Environment variables সহজে manage করা যায়
- ✅ Socket.io support করে

---

### 📝 Step-by-Step Guide (Render.com)

#### **Step 1: Render.com Account তৈরি করুন**

1. **Website:** https://render.com এ যান
2. **Sign Up:** "Get Started for Free" button click করুন
3. **GitHub Connect:** GitHub account দিয়ে sign up করুন (সবচেয়ে সহজ)
4. **Email Verify:** Email verify করুন

---

#### **Step 3: Render Dashboard থেকে Web Service তৈরি করুন**

1. **Render Dashboard:** https://dashboard.render.com এ login করুন
2. **New + Button:** Top right corner এ "New +" button click করুন
3. **Web Service Select:** "Web Service" option select করুন

---

#### **Step 4: GitHub Repository Connect করুন**

1. **Connect Repository:**
   - "Connect GitHub" button click করুন
   - আপনার GitHub account authorize করুন
   - Repository list থেকে `Medi_connect-app` select করুন
   - "Connect" click করুন

---

#### **Step 5: Service Configuration (খুবই গুরুত্বপূর্ণ!)**

এখানে **সব field সঠিকভাবে fill up করুন:**

| Field | Value | Notes |
|-------|-------|-------|
| **Name** | `mediconnect-backend` | আপনার পছন্দমতো নাম |
| **Region** | `Singapore` | Bangladesh এর কাছে, fastest |
| **Branch** | `main` বা `master` | আপনার GitHub branch name |
| **Root Directory** | `Backend` | ⚠️ **খুবই গুরুত্বপূর্ণ!** |
| **Runtime** | `Node` | Auto detect হবে |
| **Build Command** | `npm install` | Dependencies install করবে |
| **Start Command** | `npm start` | Server start করবে |
| **Plan** | `Free` | Free tier select করুন |

**⚠️ Important Notes:**
- **Root Directory:** অবশ্যই `Backend` লিখতে হবে (capital B)
- **Build Command:** `npm install` (auto detect হবে)
- **Start Command:** `npm start` (package.json এ আছে)

---

#### **Step 6: Environment Variables Add করুন**

**💡 আপনার `.env` ফাইল আছে?** → **Quick Start** section দেখুন (উপরে) - সেখানে সহজে copy-paste করার method আছে।

**Environment Variables section এ click করুন এবং আপনার `.env` ফাইল থেকে সব values add করুন।**

**⚠️ Production এ পরিবর্তন করুন:**
- `CORS_ORIGIN` → Frontend Vercel URL
- `BACKEND_URL` → Render দেওয়া URL (deploy হওয়ার পর)
- `FRONTEND_URL` → Frontend Vercel URL
- `NODE_ENV=production` → Add করুন

---

#### **Step 7: Deploy করুন**

1. **Scroll Down:** সব configuration check করুন
2. **Create Web Service:** "Create Web Service" button click করুন
3. **Wait:** Render automatically build এবং deploy করবে (5-10 minutes লাগতে পারে)
4. **Logs Watch:** Build logs দেখতে পারেন, কোনো error থাকলে দেখবেন

---

#### **Step 8: Backend URL পাবেন**

Deploy successful হলে:
- **Your Backend URL:** `https://mediconnect-backend.onrender.com`
- এই URL টি **copy করে রাখুন**

---

#### **Step 9: Environment Variables Update করুন**

Backend URL পাওয়ার পর, Render Dashboard এ গিয়ে:

1. **Settings** tab click করুন
2. **Environment Variables** section এ যান
3. **BACKEND_URL** update করুন:
   ```
   BACKEND_URL=https://mediconnect-backend.onrender.com
   ```
4. **FRONTEND_URL** update করুন (আপনার actual Frontend URL):
   ```
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```
5. **Save Changes** click করুন
6. **Manual Deploy** → "Deploy latest commit" click করুন (restart করার জন্য)

---

#### **Step 10: Test করুন**

Browser এ যান:
```
https://mediconnect-backend.onrender.com
```

**Expected Response:**
```
🚀 Server is running...
```

✅ **এটা দেখলে success!**

---

## 🚂 Railway.app Deployment (Alternative)

### ✅ কেন Railway?
- ✅ Free tier available ($5 credit monthly)
- ✅ Very fast deployment
- ✅ Easy setup
- ✅ Auto HTTPS

---

### 📝 Step-by-Step Guide (Railway)

#### **Step 1: Railway Account তৈরি করুন**

1. **Website:** https://railway.app এ যান
2. **Sign Up:** "Start a New Project" click করুন
3. **GitHub Connect:** GitHub account দিয়ে sign up করুন
4. **Email Verify:** Email verify করুন

---

#### **Step 2: New Project তৈরি করুন**

1. **Dashboard:** Railway dashboard এ যান
2. **New Project:** "New Project" button click করুন
3. **Deploy from GitHub:** "Deploy from GitHub repo" select করুন
4. **Repository Select:** `Medi_connect-app` select করুন

---

#### **Step 3: Service Configuration**

Railway automatically detect করবে, কিন্তু manual configure করতে পারেন:

1. **Service Settings:** Service এ click করুন
2. **Settings Tab:** "Settings" tab click করুন
3. **Root Directory:** `Backend` set করুন
4. **Start Command:** `npm start` (auto detect হবে)

---

#### **Step 4: Environment Variables Add করুন**

**💡 আপনার `.env` ফাইল আছে?** → **Quick Start** section দেখুন (উপরে) - সেখানে সহজে copy-paste করার method আছে।

1. **Variables Tab:** "Variables" tab click করুন
2. **Raw Editor:** "Raw Editor" toggle করুন
3. আপনার `.env` ফাইলের content **paste করুন** (comments # remove করুন)
4. **Save** click করুন

**⚠️ Production এ পরিবর্তন করুন:**
- `CORS_ORIGIN` → Frontend Vercel URL
- `BACKEND_URL` → Railway দেওয়া URL (deploy হওয়ার পর)
- `FRONTEND_URL` → Frontend Vercel URL
- `NODE_ENV=production` → Add করুন

---

#### **Step 5: Deploy**

Railway automatically deploy করবে। Logs দেখতে পারেন।

**Backend URL পাওয়ার পর:**
1. **Variables** tab এ যান
2. **BACKEND_URL** update করুন (Railway দেওয়া URL)
3. **Save** করুন
4. Service **restart** হবে automatically

---

## 🗄️ MongoDB Atlas Setup (Free Database)

### ✅ কেন MongoDB Atlas?
- ✅ সম্পূর্ণ Free (512MB storage)
- ✅ Cloud database (no local setup needed)
- ✅ Perfect for production

---

### 📝 Step-by-Step Guide

#### **Step 1: MongoDB Atlas Account**

1. **Website:** https://www.mongodb.com/cloud/atlas/register এ যান
2. **Sign Up:** Free account তৈরি করুন
3. **Email Verify:** Email verify করুন

---

#### **Step 2: Create Cluster (Free)**

1. **Create Cluster:** "Build a Database" click করুন
2. **Free Tier:** "M0 FREE" select করুন
3. **Cloud Provider:** `AWS` select করুন
4. **Region:** `Mumbai (ap-south-1)` বা `Singapore` select করুন (nearest to Bangladesh)
5. **Cluster Name:** `Cluster0` (default) রাখুন
6. **Create Cluster:** "Create" click করুন
7. **Wait:** 3-5 minutes লাগবে cluster তৈরি হতে

---

#### **Step 3: Database User তৈরি করুন**

1. **Database Access:** Left sidebar এ "Database Access" click করুন
2. **Add New Database User:** "Add New Database User" button click করুন
3. **Authentication Method:** "Password" select করুন
4. **Username:** আপনার username দিন (যেমন: `mediconnect_user`)
5. **Password:** Strong password দিন (copy করে রাখুন!)
6. **Database User Privileges:** "Atlas admin" select করুন
7. **Add User:** "Add User" click করুন

**⚠️ Important:** Username এবং Password **copy করে safe রাখুন!**

---

#### **Step 4: Network Access (IP Whitelist)**

1. **Network Access:** Left sidebar এ "Network Access" click করুন
2. **Add IP Address:** "Add IP Address" button click করুন
3. **Allow Access from Anywhere:** 
   - "Allow Access from Anywhere" click করুন
   - IP: `0.0.0.0/0` automatically add হবে
   - **Comment:** `Render/Railway Deployment` লিখুন
4. **Confirm:** "Confirm" click করুন

**⚠️ Note:** Production এ specific IP use করা ভাল, কিন্তু free tier এর জন্য `0.0.0.0/0` OK

---

#### **Step 5: Connection String পাওয়া**

1. **Database:** Left sidebar এ "Database" click করুন
2. **Connect:** "Connect" button click করুন
3. **Connect your application:** "Connect your application" option select করুন
4. **Driver:** `Node.js` select করুন
5. **Version:** Latest version select করুন
6. **Connection String Copy:** String টি copy করুন

**Connection String Format:**
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

#### **Step 6: Connection String Update করুন**

Copy করা string এ:
1. `<username>` → আপনার database username
2. `<password>` → আপনার database password
3. Database name add করুন: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/medi_connect?retryWrites=true&w=majority`

**⚠️ Important:** Password এ special characters থাকলে URL encode করুন (`@` → `%40`, `#` → `%23`)

**Render/Railway এ Add করুন:**
1. **Environment Variables** section
2. **MONGO_URI** variable add করুন
3. **Value:** আপনার final connection string paste করুন
4. **Save** করুন

---

## 📋 Environment Variables List

**💡 আপনার `.env` ফাইল আছে?** → সব values সেখানে আছে, শুধু copy-paste করুন।

| Variable | কোথায় পাবেন |
|----------|---------------|
| `PORT` | `5000` (Fixed) |
| `NODE_ENV` | `production` (Production এ add করুন) |
| `MONGO_URI` | MongoDB Atlas (নিচে দেখুন) |
| `JWT_SECRET` | আপনার `.env` ফাইল থেকে |
| `CORS_ORIGIN` | Frontend Vercel URL (production এ update করুন) |
| `CLOUDINARY_*` | Cloudinary dashboard (free account) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | আপনার `.env` ফাইল থেকে |
| `SSLCOMMERZ_*` | Test mode: `testbox` / `qwerty` |
| `CURRENCY` | `BDT` (বাংলাদেশ) বা `INR` (ভারত) |
| `BACKEND_URL` | Render/Railway দেওয়া URL (deploy হওয়ার পর) |
| `FRONTEND_URL` | Frontend Vercel URL |

### ☁️ Cloudinary Setup

1. https://cloudinary.com/users/register/free → Free account
2. Dashboard → Credentials copy করুন
3. Render/Railway এ add করুন

---

## ✅ After Deployment Checklist

### Backend Deployment:
- [ ] Render/Railway এ service created
- [ ] Root Directory: `Backend` set করা আছে
- [ ] Start Command: `npm start` set করা আছে
- [ ] সব Environment Variables add করা আছে
- [ ] MongoDB Atlas connection string add করা আছে
- [ ] Backend URL পাওয়া গেছে
- [ ] Browser এ test করা হয়েছে (`https://your-backend-url.com`)
- [ ] Response: `🚀 Server is running...` দেখাচ্ছে

---

### Frontend & Admin Update:
- [ ] Vercel Dashboard → Frontend Project → Settings → Environment Variables
- [ ] `VITE_BACKEND_URL` update করুন (Render/Railway URL)
- [ ] Vercel Dashboard → Admin Project → Settings → Environment Variables
- [ ] `VITE_BACKEND_URL` update করুন (Render/Railway URL)
- [ ] Frontend এবং Admin **redeploy** করুন

---

### Final Test:
- [ ] Frontend থেকে Backend API call করা যায়
- [ ] Login/Register কাজ করছে
- [ ] Database connection successful
- [ ] Chat system কাজ করছে (Socket.io)
- [ ] Payment test করা হয়েছে

---

## 🆘 Troubleshooting

### ❌ Build Failed:
- Root Directory `Backend` আছে কিনা check করুন
- Build logs দেখুন error message

### ❌ Server Not Starting:
- Environment Variables সব add করা আছে কিনা check করুন
- `MONGO_URI` সঠিক আছে কিনা check করুন
- Logs দেখুন specific error

### ❌ MongoDB Connection Error:
- MongoDB Atlas এ IP whitelist (`0.0.0.0/0`) আছে কিনা
- Connection string এ database name (`medi_connect`) আছে কিনা
- Password URL encoded আছে কিনা (special characters)

### ❌ CORS Error:
- `CORS_ORIGIN` এ Frontend URL (`https://`) আছে কিনা
- Backend restart করুন

---

## 🎉 Success!

সব setup হয়ে গেলে:

✅ **Backend:** `https://mediconnect-backend.onrender.com` (working)
✅ **Frontend:** `https://your-frontend.vercel.app` (working)
✅ **Admin:** `https://your-admin.vercel.app` (working)
✅ **Database:** MongoDB Atlas (connected)
✅ **Payment:** Test mode (working)

**University project ready for live demo!** 🎓🚀

---

**Good luck with your deployment!** 🚀

