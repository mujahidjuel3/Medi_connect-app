import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import Razorpay from "razorpay";

// Local Imports
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

// Routes
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/usersRoute.js";
import chatRoutes from "./routes/chatRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";

// ------------------ App Config ------------------ //
const app = express();
const port = process.env.PORT || 5000;

// ------------------ Middlewares ------------------ //
// CORS must be before other middlewares
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CORS_ORIGIN,
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000'
    ].filter(Boolean);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for development
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','token', 'atoken', 'dtoken', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// DB Connections
connectDB();          // ✅ MongoDB connect
connectCloudinary();  // ✅ Cloudinary connect

// ------------------ Razorpay ------------------ //
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ------------------ API Routes ------------------ //
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRoutes);
app.use("/api/prescriptions", prescriptionRoutes);

// Test Route
app.get("/", (_req, res) => {
  res.send("🚀 Server is running...");
});

// ------------------ Socket.io ------------------ //
const server = http.createServer(app);

const io = new Server(server, {
  cors: { 
    origin: [process.env.CORS_ORIGIN, 'http://localhost:5173', 'http://localhost:5174'].filter(Boolean),
    credentials: true 
  },
});

io.use((socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      (socket.handshake.headers.authorization || "").split(" ")[1];
    if (!token) return next();
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = { id: payload.id, role: payload.role };
    next();
  } catch (e) {
    next();
  }
});

io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("chat:join", (conversationId) => socket.join(conversationId));

  socket.on("chat:message", async ({ conversationId, text }) => {
    const { default: Message } = await import("./models/Message.js");
    const msg = await Message.create({
      conversation: conversationId,
      sender: socket.user?.id ?? "guest",
      text,
    });
    io.to(conversationId).emit("chat:message", msg);
  });

  socket.on("typing", (conversationId) => {
    socket.to(conversationId).emit("typing", socket.user?.id);
  });
});

app.set("io", io); 

// ------------------ Server Listen ------------------ //
server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📡 CORS enabled for: http://localhost:5173, http://localhost:5174`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${port} is already in use. Please kill the process using this port.`);
    console.error(`💡 Run: netstat -ano | findstr :${port} to find the process`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', error);
    process.exit(1);
  }
});
