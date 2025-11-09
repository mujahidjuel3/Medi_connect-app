# Vercel Monorepo Deployment - Frontend, Backend, Admin একসাথে

## ✅ হ্যাঁ, Vercel এ সব deploy করা যায়!

Vercel এ **3টি separate projects** হিসেবে deploy করতে হবে:

---

## 🎯 Method 1: Separate Projects (Recommended - সহজ)

### **Project 1: Frontend**

1. **Vercel Dashboard:**
   - https://vercel.com/new
   - "Add New Project"
   - GitHub repo select করুন

2. **Project Settings:**
   - **Project Name:** `mediconnect-frontend`
   - **Root Directory:** `Frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build` (auto)
   - **Output Directory:** `dist` (auto)

3. **Environment Variables:**
   ```
   VITE_BACKEND_URL=https://mediconnect-backend.vercel.app
   ```

4. **Deploy!**

---

### **Project 2: Backend**

**⚠️ Important:** Vercel এ traditional Express.js backend deploy করতে হলে **serverless functions** এ convert করতে হবে।

#### Option A: Vercel Serverless (Recommended)

1. **Backend Structure Change:**
   - `api/` folder create করুন root এ
   - Express routes গুলো serverless functions এ convert করুন

2. **Vercel Dashboard:**
   - New Project
   - **Root Directory:** `Backend`
   - **Framework:** Other
   - **Build Command:** `npm install`
   - **Output Directory:** `.`

3. **Environment Variables:**
   ```
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   SSLCOMMERZ_STORE_ID=testbox
   SSLCOMMERZ_STORE_PASSWORD=qwerty
   SSLCOMMERZ_IS_LIVE=false
   BACKEND_URL=https://mediconnect-backend.vercel.app
   FRONTEND_URL=https://mediconnect-frontend.vercel.app
   ```

#### Option B: Render.com (Easier - No Code Change)

Backend এর জন্য **Render.com** ব্যবহার করুন (Free):

1. https://render.com
2. New Web Service
3. **Root Directory:** `Backend`
4. **Build:** `npm install`
5. **Start:** `npm start`
6. Environment variables add করুন

---

### **Project 3: Admin**

1. **Vercel Dashboard:**
   - New Project
   - **Root Directory:** `Admin`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

2. **Environment Variables:**
   ```
   VITE_BACKEND_URL=https://mediconnect-backend.vercel.app
   ```

3. **Deploy!**

---

## 🎯 Method 2: Single Project with Subdirectories (Advanced)

একটি project এ সব deploy করতে হলে `vercel.json` configuration দরকার।

---

## 📋 Quick Steps Summary:

### Step 1: Frontend Deploy
```
1. Vercel → New Project
2. Root: Frontend
3. Framework: Vite
4. Env: VITE_BACKEND_URL
5. Deploy
```

### Step 2: Backend Deploy
```
Option A: Render.com (Easier)
- Root: Backend
- Build: npm install
- Start: npm start
- Add env variables

Option B: Vercel Serverless
- Convert to serverless functions
- More complex
```

### Step 3: Admin Deploy
```
1. Vercel → New Project
2. Root: Admin
3. Framework: Vite
4. Env: VITE_BACKEND_URL
5. Deploy
```

---

## 🔗 URLs After Deployment:

- **Frontend:** `https://mediconnect-frontend.vercel.app`
- **Backend:** `https://mediconnect-backend.vercel.app` (or Render URL)
- **Admin:** `https://mediconnect-admin.vercel.app`

---

## ⚙️ Environment Variables Update:

Deploy করার পর, Frontend এবং Admin এর `VITE_BACKEND_URL` update করুন:

```
VITE_BACKEND_URL=https://your-backend-url.com
```

---

## 💡 Recommendation:

**University Project এর জন্য:**
- ✅ **Frontend:** Vercel (Free, Easy)
- ✅ **Backend:** Render.com (Free, No code change)
- ✅ **Admin:** Vercel (Free, Easy)

**সব free এবং easy!** 🎉

