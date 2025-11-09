# Vercel Deployment Guide - MediConnect

## 🚨 Problem: Monorepo Structure

আপনার project এ **3টি folder** আছে:
- `Admin/` - Admin Panel
- `Backend/` - Backend API
- `Frontend/` - Main Website

**Vercel default এ root folder থেকে build করে**, তাই confusion হয়।

---

## ✅ Solution: 2 Options

### **Option 1: Frontend Deploy (Recommended for University Project)**

Vercel এ **Frontend folder** deploy করুন:

#### Steps:

1. **Vercel Dashboard এ যান:**
   - https://vercel.com/new
   - GitHub repo import করুন

2. **Project Settings:**
   - **Root Directory:** `Frontend` set করুন
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

3. **Environment Variables:**
   ```
   VITE_BACKEND_URL=https://your-backend-url.com
   ```

4. **Deploy!**

---

### **Option 2: Root vercel.json (Already Created)**

আমি root এ `vercel.json` file create করেছি যা automatically Frontend build করবে।

#### Steps:

1. **Vercel Dashboard:**
   - Import your GitHub repo
   - Vercel automatically `vercel.json` detect করবে

2. **Build Settings:**
   - Framework: Vite
   - Root Directory: Leave as root (`.`)
   - Build Command: `cd Frontend && npm install && npm run build`
   - Output Directory: `Frontend/dist`

3. **Deploy!**

---

## 📝 Important Notes:

### Backend Deployment:
- **Vercel Backend support করে না** (serverless functions ছাড়া)
- Backend deploy করতে হবে **separate platform এ:**
  - **Render.com** (Free)
  - **Railway.app** (Free tier)
  - **Heroku** (Paid)
  - **DigitalOcean** (Paid)

### Frontend Environment Variables:
```env
VITE_BACKEND_URL=https://your-backend-api.com
```

### Build Command:
```bash
cd Frontend
npm install
npm run build
```

---

## 🎯 Quick Deploy Steps:

### 1. Frontend Build Test (Local):
```bash
cd Frontend
npm install
npm run build
```

### 2. Vercel Deploy:
1. Go to https://vercel.com
2. Import GitHub repo
3. **Root Directory:** `Frontend`
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. Add environment variable: `VITE_BACKEND_URL`
7. Deploy!

---

## 🔧 Backend Deployment (Separate):

### Render.com (Free):
1. Go to https://render.com
2. New Web Service
3. Connect GitHub repo
4. **Root Directory:** `Backend`
5. **Build Command:** `npm install`
6. **Start Command:** `npm start`
7. Add environment variables from `.env`
8. Deploy!

---

## ✅ Summary:

| Component | Platform | Root Directory |
|-----------|----------|----------------|
| **Frontend** | Vercel | `Frontend` |
| **Backend** | Render/Railway | `Backend` |
| **Admin** | Vercel (separate) | `Admin` |

**University Project এর জন্য Frontend deploy করলেই হবে!** 🎓

