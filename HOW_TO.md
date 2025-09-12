
# MediConnect – Thunder Client + Seed Data + i18n (BN/EN)

## 1) Backend Setup
```bash
cd Backend
npm i
cp .env.example .env  # if exists; otherwise create based on below
npm run dev           # or: npm start
```

**.env sample**
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/medi_connect
JWT_SECRET=change_me
CORS_ORIGIN=http://localhost:5173
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
```

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
