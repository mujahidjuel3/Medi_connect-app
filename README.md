# 🏥 MediConnect - Doctor Appointment Booking System

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.3.1-blue.svg)

**A comprehensive healthcare platform for booking doctor appointments with real-time chat, payment integration, and multi-language support.**

[Features](#-features) • [Installation](#-installation) • [Documentation](#-documentation) • [Deployment](#-deployment)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Project](#-running-the-project)
- [API Documentation](#-api-documentation)
- [Demo Credentials](#-demo-credentials)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

MediConnect is a full-stack web application designed to streamline the process of booking doctor appointments. The platform provides a seamless experience for patients to find doctors, book appointments, make payments, and communicate with healthcare providers in real-time.

### Key Highlights

- ✅ **Complete Appointment Management System**
- ✅ **Real-time Chat with Doctors**
- ✅ **Secure Payment Integration (SSLCommerz)**
- ✅ **Prescription Upload & Management**
- ✅ **Multi-language Support (Bengali & English)**
- ✅ **Responsive Design**
- ✅ **Admin Panel for Management**

---

## ✨ Features

### 👤 User Features
- **User Authentication**: Secure registration and login system
- **Doctor Discovery**: Browse doctors by specialty with advanced filtering
- **Appointment Booking**: Easy appointment scheduling with time slot selection
- **Payment Integration**: Secure online payment via SSLCommerz (Bangladesh)
- **Real-time Chat**: Instant messaging with doctors
- **Prescription Management**: Upload and view prescriptions
- **Appointment History**: Track all past and upcoming appointments
- **Profile Management**: Update personal information and preferences

### 👨‍⚕️ Doctor Features
- **Profile Management**: Complete doctor profile with specialties
- **Availability Management**: Set available time slots
- **Patient Communication**: Real-time chat with patients
- **Appointment Management**: View and manage appointments

### 🔐 Admin Features
- **Doctor Management**: Add, edit, and manage doctor profiles
- **Slot Management**: Create and manage appointment time slots
- **System Monitoring**: Overview of system activities

### 🌐 Internationalization
- **Bengali (বাংলা)** - Full Bengali language support
- **English** - Complete English interface
- **Language Toggle** - Easy switching between languages

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time Communication**: Socket.io
- **Payment Gateway**: SSLCommerz (Bangladesh)
- **File Upload**: Cloudinary, Multer
- **Validation**: Validator.js

### Frontend
- **Framework**: React.js 18.3.1
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Internationalization**: react-i18next
- **HTTP Client**: Axios
- **UI Components**: React Icons, Lucide React
- **Notifications**: React Toastify

### Admin Panel
- **Framework**: React.js 18.3.1
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM

### Development Tools
- **Package Manager**: npm
- **Development Server**: Nodemon
- **Code Quality**: ESLint

---

## 📁 Project Structure

```
Medi_connect-app/
├── Backend/                    # Backend API Server
│   ├── config/                 # Configuration files
│   ├── controllers/            # Business logic
│   ├── middlewares/            # Custom middlewares
│   ├── models/                 # Database models
│   ├── routes/                 # API routes
│   ├── scripts/                # Utility scripts (seed data)
│   ├── server.js               # Main server file
│   ├── package.json            # Backend dependencies
│   └── .env                    # Environment variables (create this)
│
├── Frontend/                   # User-facing React application
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   ├── pages/              # Page components
│   │   ├── locales/            # Translation files (BN/EN)
│   │   │   ├── en/             # English translations
│   │   │   └── bn/             # Bengali translations
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # Entry point
│   ├── public/                 # Static assets
│   ├── package.json            # Frontend dependencies
│   └── vite.config.js          # Vite configuration
│
├── Admin/                      # Admin panel React application
│   ├── src/
│   │   ├── components/         # Admin components
│   │   ├── pages/              # Admin pages
│   │   └── App.jsx             # Main app component
│   ├── package.json            # Admin dependencies
│   └── vite.config.js          # Vite configuration
│
├── README.md                   # This file
├── PROJECT_SUMMARY.md          # Detailed project summary
├── HOW_TO.md                   # Setup and usage guide
├── BACKEND_DEPLOYMENT_GUIDE.md # Deployment instructions
└── Thunder_Collection_MediConnect.json  # API testing collection
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **MongoDB** (Local installation or MongoDB Atlas account)
- **Git** (for cloning the repository)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Medi_connect-app
```

### Step 2: Install Backend Dependencies

```bash
cd Backend
npm install
```

### Step 3: Install Frontend Dependencies

```bash
cd ../Frontend
npm install
```

### Step 4: Install Admin Panel Dependencies

```bash
cd ../Admin
npm install
```

---

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `Backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://127.0.0.1:27017/medi_connect
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/medi_connect?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your_secure_random_secret_key_here

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# SSLCommerz Payment Gateway (Test Mode)
SSLCOMMERZ_STORE_ID=testbox
SSLCOMMERZ_STORE_PASSWORD=qwerty
SSLCOMMERZ_IS_LIVE=false

# Application URLs
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173

# Currency
CURRENCY=BDT

# Admin Credentials (Optional - for initial admin creation)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

### Frontend Environment Variables

Create a `.env` file in the `Frontend/` directory:

```env
VITE_BACKEND_URL=http://localhost:5000
```

### Admin Panel Environment Variables

Create a `.env` file in the `Admin/` directory:

```env
VITE_BACKEND_URL=http://localhost:5000
```

### Getting API Keys

#### Cloudinary Setup
1. Visit [Cloudinary](https://cloudinary.com/users/register/free)
2. Create a free account
3. Copy your `Cloud Name`, `API Key`, and `API Secret` from the dashboard
4. Add them to your `.env` file

#### MongoDB Atlas Setup (Optional - for cloud database)
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string and add it to `MONGO_URI`

---

## 🏃 Running the Project

### Development Mode

#### 1. Start MongoDB (if using local MongoDB)

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# OR
mongod
```

#### 2. Seed Database (Optional - for demo data)

```bash
cd Backend
npm run seed
```

This will create:
- Sample doctors
- Time slots
- Demo user accounts (see [Demo Credentials](#-demo-credentials))

#### 3. Start Backend Server

```bash
cd Backend
npm run dev
```

Backend will run on: `http://localhost:5000`

#### 4. Start Frontend Application

Open a new terminal:

```bash
cd Frontend
npm run dev
```

Frontend will run on: `http://localhost:5173`

#### 5. Start Admin Panel (Optional)

Open another terminal:

```bash
cd Admin
npm run dev
```

Admin panel will run on: `http://localhost:5174` (or next available port)

### Production Build

#### Build Frontend

```bash
cd Frontend
npm run build
```

#### Build Admin Panel

```bash
cd Admin
npm run build
```

#### Start Backend (Production)

```bash
cd Backend
npm start
```

---

## 📚 API Documentation

### Base URL

```
Development: http://localhost:5000/api
Production: https://your-backend-url.com/api
```

### Authentication

Most endpoints require authentication. Include the JWT token in the request header:

```
Authorization: Bearer <your_jwt_token>
```

### Main Endpoints

#### User Endpoints
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

#### Doctor Endpoints
- `GET /api/doctor/all` - Get all doctors
- `GET /api/doctor/:id` - Get doctor by ID
- `GET /api/doctor/specialty/:specialty` - Get doctors by specialty

#### Appointment Endpoints
- `POST /api/appointment/book` - Book an appointment
- `GET /api/appointment/user` - Get user appointments
- `PUT /api/appointment/cancel/:id` - Cancel appointment

#### Payment Endpoints
- `POST /api/user/sslcommerz-init` - Initialize payment
- `POST /api/user/sslcommerz-success` - Payment success callback
- `POST /api/user/sslcommerz-fail` - Payment failure callback
- `POST /api/user/sslcommerz-cancel` - Payment cancellation callback

### API Testing

Import `Thunder_Collection_MediConnect.json` into Thunder Client (VS Code extension) or Postman for easy API testing.

---

## 🔑 Demo Credentials

After running the seed script, you can use these credentials:

### Admin Account
```
Email: admin@example.com
Password: admin123
```

### Doctor Account
```
Email: doctor@example.com
Password: doc123
```

### User Account
```
Email: test@example.com
Password: secret123
```

---

## 🌐 Deployment

### Backend Deployment

The project supports deployment on:
- **Render.com** (Recommended - Free tier available)
- **Railway.app** (Alternative - Free tier available)

Detailed deployment instructions are available in [`BACKEND_DEPLOYMENT_GUIDE.md`](./BACKEND_DEPLOYMENT_GUIDE.md)

### Frontend & Admin Deployment

Deploy to **Vercel**:
1. Connect your GitHub repository
2. Set root directory to `Frontend` or `Admin`
3. Add environment variables
4. Deploy

### Environment Variables for Production

Update these variables for production:

```env
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
BACKEND_URL=https://your-backend-domain.com
FRONTEND_URL=https://your-frontend-domain.com
SSLCOMMERZ_IS_LIVE=true  # If using live payment gateway
```

---

## 💳 Payment System

### Test Mode (Current Setup)

The project is configured with SSLCommerz test credentials:
- **Store ID**: `testbox`
- **Store Password**: `qwerty`
- **Mode**: Test/Sandbox

**Test Card Details:**
- Card Number: `4111111111111111`
- Expiry: Any future date
- CVV: Any 3 digits

### Live Mode Setup

1. Create an account at [SSLCommerz Developer Portal](https://developer.sslcommerz.com/)
2. Get your Store ID and Store Password
3. Update `.env` file:
   ```env
   SSLCOMMERZ_STORE_ID=your_live_store_id
   SSLCOMMERZ_STORE_PASSWORD=your_live_store_password
   SSLCOMMERZ_IS_LIVE=true
   ```
4. Configure callback URLs in SSLCommerz dashboard

---

## 🧪 Testing

### Manual Testing

1. **User Registration & Login**: Test user authentication flow
2. **Doctor Browsing**: Search and filter doctors
3. **Appointment Booking**: Book an appointment with a doctor
4. **Payment Flow**: Test payment with test card
5. **Chat System**: Test real-time messaging
6. **Prescription Upload**: Upload and view prescriptions

### API Testing

Use the provided Thunder Client collection or Postman to test all API endpoints.

---

## 🐛 Troubleshooting

### Common Issues

#### Backend won't start
- Check if MongoDB is running
- Verify all environment variables are set
- Check if port 5000 is available

#### Frontend can't connect to backend
- Verify `VITE_BACKEND_URL` in Frontend `.env`
- Check CORS settings in Backend
- Ensure backend server is running

#### Database connection error
- Verify MongoDB connection string
- Check if MongoDB service is running
- For Atlas: Verify IP whitelist settings

#### Payment not working
- Verify SSLCommerz credentials
- Check payment callback URLs
- Ensure `SSLCOMMERZ_IS_LIVE` is set correctly

---

## 📝 Additional Documentation

- [`PROJECT_SUMMARY.md`](./PROJECT_SUMMARY.md) - Detailed project overview
- [`HOW_TO.md`](./HOW_TO.md) - Setup and usage guide
- [`BACKEND_DEPLOYMENT_GUIDE.md`](./BACKEND_DEPLOYMENT_GUIDE.md) - Deployment instructions

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**MediConnect Development Team**

---

## 🙏 Acknowledgments

- SSLCommerz for payment gateway integration
- Cloudinary for image hosting
- MongoDB Atlas for cloud database
- All open-source contributors

---

## 📞 Support

For support, please open an issue in the repository or contact the development team.

---

<div align="center">

**Made with ❤️ for better healthcare management**

⭐ Star this repo if you find it helpful!

</div>

