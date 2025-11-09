import express from "express";

import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
  paymentSSLCommerz,
  sslcommerzIPN,
  sslcommerzSuccess,
  sslcommerzFail,
  sslcommerzCancel,
  allDoctors,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-profile", authUser, getProfile);
userRouter.post(
  "/update-profile",
  upload.single("image"),
  authUser,
  updateProfile
);
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments", authUser, listAppointment);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);
userRouter.post("/payment-razorpay", authUser, paymentRazorpay);
userRouter.post("/verify-razorpay", authUser, verifyRazorpay);
userRouter.post("/payment-sslcommerz", authUser, paymentSSLCommerz);
userRouter.post("/sslcommerz-ipn", sslcommerzIPN);
// SSLCommerz sends both GET and POST requests for callbacks
userRouter.get("/sslcommerz-success", sslcommerzSuccess);
userRouter.post("/sslcommerz-success", sslcommerzSuccess);
userRouter.get("/sslcommerz-fail", sslcommerzFail);
userRouter.post("/sslcommerz-fail", sslcommerzFail);
userRouter.get("/sslcommerz-cancel", sslcommerzCancel);
userRouter.post("/sslcommerz-cancel", sslcommerzCancel);
userRouter.get("/all-doctors", authUser, allDoctors);

export default userRouter;
