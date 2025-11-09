# 🚀 Complete Deployment Guide - Frontend, Backend, Admin

## ✅ হ্যাঁ, Vercel এ সব deploy করা যায়!

**3টি separate projects** হিসেবে deploy করতে হবে।

---

## 📋 Step-by-Step Deployment

### **1️⃣ Frontend Deploy (Vercel)**

#### Step 1: Vercel Dashboard
1. https://vercel.com/new এ যান
2. "Add New Project" click করুন
3. GitHub repo select করুন: `Medi_connect-app`

#### Step 2: Project Configuration
- **Project Name:** `mediconnect-frontend` (বা আপনার পছন্দ)
- **Root Directory:** `Frontend` ⚠️ **Important!**
- **Framework Preset:** `Vite` (auto detect হবে)
- **Build Command:** `npm run build` (auto)
- **Output Directory:** `dist` (auto)

#### Step 3: Environment Variables
```
VITE_BACKEND_URL=https://mediconnect-backend.vercel.app
```
(Backend deploy করার পর actual URL দিবেন)

#### Step 4: Deploy
- "Deploy" button click করুন
- ✅ Frontend deployed!

**URL:** `https://mediconnect-frontend.vercel.app`

---

### **2️⃣ Backend Deploy (2 Options)**

#### **Option A: Render.com (Recommended - সহজ, Free)**

**কেন Render.com?**
- ✅ Free tier available
- ✅ Traditional Express.js support করে
- ✅ No code change needed
- ✅ Easy setup

**Steps:**

1. **Render Dashboard:**
   - https://render.com এ sign up/login করুন
   - "New +" → "Web Service" click করুন

2. **Connect Repository:**
   - GitHub repo connect করুন
   - Repository: `Medi_connect-app` select করুন

3. **Service Configuration:**
   - **Name:** `mediconnect-backend`
   - **Region:** Singapore (nearest to Bangladesh)
   - **Branch:** `master`
   - **Root Directory:** `Backend` ⚠️ **Important!**
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

4. **Environment Variables:**
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CORS_ORIGIN=https://mediconnect-frontend.vercel.app
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   SSLCOMMERZ_STORE_ID=testbox
   SSLCOMMERZ_STORE_PASSWORD=qwerty
   SSLCOMMERZ_IS_LIVE=false
   BACKEND_URL=https://mediconnect-backend.onrender.com
   FRONTEND_URL=https://mediconnect-frontend.vercel.app
   ```

5. **Deploy:**
   - "Create Web Service" click করুন
   - ✅ Backend deployed!

**URL:** `https://mediconnect-backend.onrender.com`

---

#### **Option B: Vercel Serverless (Advanced)**

Vercel এ backend deploy করতে হলে serverless functions এ convert করতে হবে (complex)।

**Recommendation:** Render.com use করুন (easier)।

---

### **3️⃣ Admin Deploy (Vercel)**

#### Step 1: Vercel Dashboard
1. Vercel Dashboard এ যান
2. "Add New Project" click করুন
3. Same GitHub repo select করুন: `Medi_connect-app`

#### Step 2: Project Configuration
- **Project Name:** `mediconnect-admin`
- **Root Directory:** `Admin` ⚠️ **Important!**
- **Framework Preset:** `Vite` (auto detect)
- **Build Command:** `npm run build` (auto)
- **Output Directory:** `dist` (auto)

#### Step 3: Environment Variables
```
VITE_BACKEND_URL=https://mediconnect-backend.onrender.com
```

#### Step 4: Deploy
- "Deploy" button click করুন
- ✅ Admin deployed!

**URL:** `https://mediconnect-admin.vercel.app`

---

## 🔄 Update Environment Variables

Backend deploy করার পর, Frontend এবং Admin এর environment variables update করুন:

### Frontend (Vercel):
```
VITE_BACKEND_URL=https://mediconnect-backend.onrender.com
```

### Admin (Vercel):
```
VITE_BACKEND_URL=https://mediconnect-backend.onrender.com
```

**Vercel Dashboard → Project → Settings → Environment Variables → Edit**

---

## 📊 Final URLs

| Component | Platform | URL |
|-----------|----------|-----|
| **Frontend** | Vercel | `https://mediconnect-frontend.vercel.app` |
| **Backend** | Render.com | `https://mediconnect-backend.onrender.com` |
| **Admin** | Vercel | `https://mediconnect-admin.vercel.app` |

---

## ✅ Deployment Checklist

### Frontend:
- [ ] Vercel project created
- [ ] Root Directory: `Frontend`
- [ ] Environment variable: `VITE_BACKEND_URL` added
- [ ] Deployed successfully

### Backend:
- [ ] Render.com account created
- [ ] Web Service created
- [ ] Root Directory: `Backend`
- [ ] All environment variables added
- [ ] MongoDB connection string added
- [ ] Deployed successfully

### Admin:
- [ ] Vercel project created
- [ ] Root Directory: `Admin`
- [ ] Environment variable: `VITE_BACKEND_URL` added
- [ ] Deployed successfully

### After Deployment:
- [ ] Frontend `VITE_BACKEND_URL` updated with Render URL
- [ ] Admin `VITE_BACKEND_URL` updated with Render URL
- [ ] All URLs working
- [ ] Test payment flow

---

## 🎓 University Project Tips

1. **Free Tier ব্যবহার করুন:**
   - Vercel: Free (unlimited)
   - Render.com: Free (with limitations)

2. **MongoDB:**
   - MongoDB Atlas (Free tier) ব্যবহার করুন
   - Connection string Render.com এ add করুন

3. **Environment Variables:**
   - Test mode credentials use করুন
   - No real payment needed

---

## 🆘 Troubleshooting

### Frontend/Admin Build Failed:
- Check Root Directory is correct
- Check `package.json` exists
- Check build command

### Backend Not Starting:
- Check environment variables
- Check MongoDB connection
- Check PORT variable

### CORS Error:
- Update `CORS_ORIGIN` in Backend env variables
- Add Frontend URL to allowed origins

---

## 🎉 Success!

সব deploy হয়ে গেলে:
- ✅ Frontend: Working
- ✅ Backend: Working
- ✅ Admin: Working
- ✅ Payment: Test mode working

**University project ready for demo!** 🎓

