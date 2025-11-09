
# MediConnect – Thunder Client + Seed Data + i18n (BN/EN)

## 1) Backend Setup
```bash
cd Backend
npm i
cp .env.example .env  # if exists; otherwise create based on below
npm run dev           # or: npm start
```

**.env file sample (Backend/.env)**
```env
# Server Configuration
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/medi_connect
JWT_SECRET=change_me_to_a_secure_random_string
CORS_ORIGIN=http://localhost:5173

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay Configuration (Optional - for Indian payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CURRENCY=INR

# SSLCommerz Payment Gateway Configuration (Bangladesh)
# For TEST/SANDBOX Mode (Free - No signup needed)
SSLCOMMERZ_STORE_ID=testbox
SSLCOMMERZ_STORE_PASSWORD=qwerty
SSLCOMMERZ_IS_LIVE=false

# For LIVE/PRODUCTION Mode (Uncomment and fill with your credentials)
# SSLCOMMERZ_STORE_ID=your_live_store_id
# SSLCOMMERZ_STORE_PASSWORD=your_live_store_password
# SSLCOMMERZ_IS_LIVE=true

# Application URLs
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

**⚠️ Important:** `.env` file create করুন `Backend` folder এ এবং উপরের values গুলো fill করুন।

**SSLCommerz Setup:**

### Test/Sandbox Mode (Free - No Signup Required)
এই mode এ আপনি free তে test করতে পারবেন, কোন signup লাগবে না:
```env
SSLCOMMERZ_STORE_ID=testbox
SSLCOMMERZ_STORE_PASSWORD=qwerty
SSLCOMMERZ_IS_LIVE=false
```

**Test Card Details (Sandbox Mode):**
- Card Number: `4111111111111111`
- Card Expiry: Any future date (e.g., `12/25`)
- CVV: Any 3 digits (e.g., `123`)

### Live/Production Mode Setup (Real Payments)

**Step 1: SSLCommerz Account তৈরি করুন**
1. https://developer.sslcommerz.com/registration/ এ যান
2. "Sign Up" button এ click করুন
3. আপনার business information দিন:
   - Business Name
   - Business Type
   - Contact Information
   - Bank Account Details
4. Email verification করুন

**Step 2: Store ID এবং Password নিন**
1. Login করুন https://developer.sslcommerz.com/
2. Dashboard এ যান
3. "Store Settings" section এ যান
4. আপনার **Store ID** এবং **Store Password** copy করুন
   - Store ID: `yourstore123` (format)
   - Store Password: `yourpassword123` (format)

**Step 3: .env File Update করুন**
```env
# Live Mode Configuration
SSLCOMMERZ_STORE_ID=your_actual_store_id
SSLCOMMERZ_STORE_PASSWORD=your_actual_store_password
SSLCOMMERZ_IS_LIVE=true
BACKEND_URL=https://your-backend-domain.com
FRONTEND_URL=https://your-frontend-domain.com
```

**Step 4: Important Notes for Live Mode**
- ✅ Production এ যাওয়ার আগে সব test করুন
- ✅ IPN URL SSLCommerz dashboard এ whitelist করুন
- ✅ Success/Fail/Cancel URLs HTTPS হতে হবে
- ✅ SSLCommerz dashboard এ callback URLs configure করুন
- ✅ প্রথমে small amount দিয়ে test করুন

**Step 5: SSLCommerz Dashboard Configuration**
1. https://developer.sslcommerz.com/ এ login করুন
2. "Store Settings" → "Payment Settings" এ যান
3. IPN URL set করুন: `https://your-backend-domain.com/api/user/sslcommerz-ipn`
4. Success URL: `https://your-backend-domain.com/api/user/sslcommerz-success`
5. Fail URL: `https://your-backend-domain.com/api/user/sslcommerz-fail`
6. Cancel URL: `https://your-backend-domain.com/api/user/sslcommerz-cancel`

**Live Mode Fees:**
- SSLCommerz প্রতি transaction এ commission নেয় (usually 1.5-2.5%)
- Minimum charge: Usually ৳2-5 per transaction
- Settlement: Usually 2-3 business days

---

## 🎓 University Project Mode (Current Setup)

**আপনার project এখন TEST MODE এ আছে - Perfect for University Project!**

### Current Configuration:
```env
SSLCOMMERZ_STORE_ID=testbox
SSLCOMMERZ_STORE_PASSWORD=qwerty
SSLCOMMERZ_IS_LIVE=false
```

### Benefits for University Project:
- ✅ **No real money** - Safe for demo
- ✅ **Free testing** - No signup needed
- ✅ **Full functionality** - All features work
- ✅ **Perfect for presentation** - Professional payment flow

### If You Need Live Mode Later (Simple Steps):
1. Get SSLCommerz account: https://developer.sslcommerz.com/
2. Get Store ID and Password
3. Update `.env` file:
   ```env
   SSLCOMMERZ_STORE_ID=your_real_store_id
   SSLCOMMERZ_STORE_PASSWORD=your_real_password
   SSLCOMMERZ_IS_LIVE=true
   ```
4. Update URLs to HTTPS (if deployed)
5. Restart server

**That's it!** Just 3 values change করলেই live mode enable হবে! 🎉

### Thunder Client
Import `Thunder_Collection_MediConnect.json` into VS Code Thunder Client.
1) Run **Register** (optional)
2) Run **Login** → will set `{{token}}`
3) Run **Get Profile**, **Update Profile**, **Book Appointment** with Bearer token automatically.

We unified auth to **Authorization: Bearer <token>** for all protected routes. We also added `express.urlencoded` so `x-www-form-urlencoded` works.

## 2) Seed Data (fallback if POST not used)
```bash
cd Backend
node scripts/seed.js
```
This will create sample **doctors**, **slots**, and demo accounts.

- **Admin Panel login:** admin@example.com / admin123
- **Doctor login:** doctor@example.com / doc123
- **User login:** test@example.com / secret123

## 3) Admin Panel
```bash
cd Admin
npm i
npm run dev
```
Default URL: http://localhost:5174 (see Vite config). After login, you can create doctors/slots which the frontend consumes.

## 4) Frontend (BN/EN toggle)
```bash
cd Frontend
npm i
npm run dev
```
URL: http://localhost:5173

We use **react-i18next** with `src/i18n.ts` and `src/locales/en/common.json`, `src/locales/bn/common.json`.
The **Navbar** has a BN/EN switch that flips all UI strings: *Home, All Doctors, About, Contact, Login, Sign Up*, etc.

### Add a new translation key
1) In component: `t('navbar.home')`
2) Add to both `common.json` files:
```json
// en/common.json
{ "navbar": { "home": "Home" } }
// bn/common.json
{ "navbar": { "home": "হোম" } }
```

## 5) Common Errors
- **401 Unauthorized:** Missing or wrong Bearer token. Run Login first.
- **400 Validation:** Check required fields in body.
- **Multipart routes:** Use *form-data* body (Thunder Client) when uploading image.
- **CORS:** Make sure `CORS_ORIGIN` matches your frontend port.

## 6) Scripts
- `npm run dev` – dev server with nodemon (Backend/Admin/Frontend)
- `node scripts/seed.js` – seed database

Good luck! ✅
