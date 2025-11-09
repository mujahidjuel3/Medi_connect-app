import express from "express";
import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import razorpay from "razorpay";
import crypto from "crypto";
import axios from "axios";
// API for register user

const registerUser = async (req, res) => {
  try {
    const { name, nameBn, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Detail" });
    }

    //validating email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    //validating strong password
    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a strong password" });
    }

    //check user existed
    const existedUser = await userModel.findOne({ email });

    if (existedUser) {
      return res.status(409).json({
        success: false,
        message: "User with email already exists",
      });
    }

    //hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      nameBn: nameBn?.trim() || "",
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);

    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    console.log("error:", error);

    return res.json({ success: false, message: error.message });
  }
};

//api for user login

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    //check user exist
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    //check for password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      return res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};

//API to get user profile data

const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await userModel.findById(userId).select("-password");

    res.json({ success: true, userData });
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};

//API to update user profile

const updateProfile = async (req, res) => {
  try {
    const { userId, name, nameBn, phone, address, dob, gender } = req.body;

    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data missing" });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      nameBn: nameBn?.trim() || "",
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });

    if (imageFile) {
      // upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });

      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};

//API to book appointment

const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;
    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData.available) {
      return res.json({ success: false, message: "Doctor is not availble " });
    }

    let slots_booked = docData.slots_booked;

    //checking for slot availablity
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({
          success: false,
          message: "Slot not availble ",
        });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");

    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    //save new slots data in docdata

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment Booked" });
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};

//API to get user appointments for backend my-appointments page

const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });

    if (!appointments) {
      return res.json({ success: false, message: "No Appointment" });
    }

    res.json({ success: true, appointments });
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};

// API to cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // releaseing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};

// API for make payment of appointment using razorpay
// Only initialize Razorpay if keys are provided (optional for Bangladesh)
let razorpayInstance = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

const paymentRazorpay = async (req, res) => {
  try {
    // Check if Razorpay is configured
    if (!razorpayInstance) {
      return res.json({
        success: false,
        message: "Razorpay is not configured. Please use SSLCommerz for payments.",
      });
    }

    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({
        success: false,
        message: "Appointment cancelled or not found",
      });
    }

    // creating options for razorpay payment

    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY || "INR",
      receipt: appointmentId,
    };

    //creating of an order
    const order = await razorpayInstance.orders.create(options);

    res.json({ success: true, order });
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};

// API to verify payment
const verifyRazorpay = async (req, res) => {
  try {
    // Check if Razorpay is configured
    if (!razorpayInstance) {
      return res.json({
        success: false,
        message: "Razorpay is not configured. Please use SSLCommerz for payments.",
      });
    }

    const { razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true,
      });

      res.json({ success: true, message: "Payment successfull" });
    } else {
      res.json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};

// SSLCommerz Payment Integration
// API to initiate SSLCommerz payment
const paymentSSLCommerz = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const { userId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({
        success: false,
        message: "Appointment cancelled or not found",
      });
    }

    if (appointmentData.userId !== userId) {
      return res.json({
        success: false,
        message: "Unauthorized action",
      });
    }

    const userData = await userModel.findById(userId).select("-password");

    // SSLCommerz configuration
    const storeId = process.env.SSLCOMMERZ_STORE_ID || "testbox";
    const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD || "qwerty";
    const isLive = process.env.SSLCOMMERZ_IS_LIVE === "true";
    const baseUrl = isLive
      ? "https://securepay.sslcommerz.com"
      : "https://sandbox.sslcommerz.com";

    // Payment data
    const amount = appointmentData.amount;
    const tranId = `TXN${Date.now()}${appointmentId.slice(-6)}`;
    const successUrl = `${process.env.BACKEND_URL || "http://localhost:5000"}/api/user/sslcommerz-success`;
    const failUrl = `${process.env.BACKEND_URL || "http://localhost:5000"}/api/user/sslcommerz-fail`;
    const cancelUrl = `${process.env.BACKEND_URL || "http://localhost:5000"}/api/user/sslcommerz-cancel`;
    const ipnUrl = `${process.env.BACKEND_URL || "http://localhost:5000"}/api/user/sslcommerz-ipn`;

    // Prepare post data
    const doctorName = appointmentData.docData?.name || "Doctor";
    const doctorSpeciality = appointmentData.docData?.speciality || "Appointment";
    const productName = `Doctor Appointment - ${doctorName} (${doctorSpeciality})`;

    const postData = {
      store_id: storeId,
      store_passwd: storePassword,
      total_amount: amount,
      currency: "BDT",
      tran_id: tranId,
      success_url: successUrl,
      fail_url: failUrl,
      cancel_url: cancelUrl,
      ipn_url: ipnUrl,
      product_name: productName, // Required by SSLCommerz
      product_category: "Healthcare",
      product_profile: "Service",
      cus_name: userData.name || "Customer",
      cus_email: userData.email || "customer@example.com",
      cus_add1: userData.address?.line1 || "Dhaka",
      cus_add2: userData.address?.line2 || "",
      cus_city: userData.address?.city || "Dhaka",
      cus_state: userData.address?.state || "Dhaka",
      cus_postcode: userData.address?.pincode || "1200",
      cus_country: "Bangladesh",
      cus_phone: userData.phone || "01700000000",
      cus_fax: "",
      shipping_method: "NO", // NO for digital services like appointments
      ship_name: "",
      ship_add1: "",
      ship_add2: "",
      ship_city: "",
      ship_state: "",
      ship_postcode: "",
      ship_country: "",
      multi_card_name: "",
      value_a: appointmentId, // Store appointment ID
      value_b: userId, // Store user ID
      value_c: "",
      value_d: "",
    };

    // Save transaction ID to appointment
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      transactionId: tranId,
    });

    // Make request to SSLCommerz
    // Convert postData to URLSearchParams for form-urlencoded format
    const formData = new URLSearchParams();
    Object.keys(postData).forEach((key) => {
      formData.append(key, postData[key]);
    });

    const response = await axios.post(
      `${baseUrl}/gwprocess/v4/api.php`,
      formData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // SSLCommerz returns response as string or object
    let responseData = response.data;
    
    // If response is string, parse it
    if (typeof responseData === 'string') {
      const parsedData = {};
      responseData.split('&').forEach((pair) => {
        const [key, value] = pair.split('=');
        if (key && value) {
          parsedData[key] = decodeURIComponent(value);
        }
      });
      responseData = parsedData;
    }

    if (responseData.status === "SUCCESS" && responseData.GatewayPageURL) {
      res.json({
        success: true,
        gatewayUrl: responseData.GatewayPageURL,
        tranId: tranId,
      });
    } else {
      res.json({
        success: false,
        message: responseData.failedreason || responseData.error || "Payment initiation failed",
      });
    }
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};

// SSLCommerz IPN (Instant Payment Notification) handler
const sslcommerzIPN = async (req, res) => {
  try {
    const {
      tran_id,
      status,
      val_id,
      amount,
      store_amount,
      currency,
      value_a, // appointmentId
      value_b, // userId
    } = req.body;

    // Verify payment with SSLCommerz
    const storeId = process.env.SSLCOMMERZ_STORE_ID || "testbox";
    const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD || "qwerty";
    const isLive = process.env.SSLCOMMERZ_IS_LIVE === "true";
    const baseUrl = isLive
      ? "https://securepay.sslcommerz.com"
      : "https://sandbox.sslcommerz.com";

    // Verify payment
    const verifyResponse = await axios.get(
      `${baseUrl}/validator/api/validationserverAPI.php`,
      {
        params: {
          val_id: val_id,
          store_id: storeId,
          store_passwd: storePassword,
          format: "json",
        },
      }
    );

    if (
      verifyResponse.data.status === "VALID" ||
      verifyResponse.data.status === "VALIDATED"
    ) {
      // Update appointment payment status
      await appointmentModel.findByIdAndUpdate(value_a, {
        payment: true,
        transactionId: tran_id,
        paymentMethod: "SSLCommerz",
      });

      res.status(200).send("IPN received and payment verified");
    } else {
      res.status(400).send("Payment verification failed");
    }
  } catch (error) {
    console.log("IPN error:", error);
    res.status(500).send("IPN processing error");
  }
};

// SSLCommerz payment success callback
const sslcommerzSuccess = async (req, res) => {
  try {
    // SSLCommerz sends data via both GET (query) and POST (body)
    const tran_id = req.query.tran_id || req.body.tran_id;
    const val_id = req.query.val_id || req.body.val_id;

    if (!tran_id || !val_id) {
      return res.redirect(
        `${process.env.FRONTEND_URL || "http://localhost:5173"}/my-appointments?payment=failed`
      );
    }

    // Find appointment by transaction ID
    const appointment = await appointmentModel.findOne({
      transactionId: tran_id,
    });

    if (appointment && !appointment.payment) {
      // Verify payment
      const storeId = process.env.SSLCOMMERZ_STORE_ID || "testbox";
      const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD || "qwerty";
      const isLive = process.env.SSLCOMMERZ_IS_LIVE === "true";
      const baseUrl = isLive
        ? "https://securepay.sslcommerz.com"
        : "https://sandbox.sslcommerz.com";

      try {
        const verifyResponse = await axios.get(
          `${baseUrl}/validator/api/validationserverAPI.php`,
          {
            params: {
              val_id: val_id,
              store_id: storeId,
              store_passwd: storePassword,
              format: "json",
            },
          }
        );

        if (
          verifyResponse.data.status === "VALID" ||
          verifyResponse.data.status === "VALIDATED"
        ) {
          await appointmentModel.findByIdAndUpdate(appointment._id, {
            payment: true,
            paymentMethod: "SSLCommerz",
          });
        }
      } catch (verifyError) {
        console.log("Verification error:", verifyError);
      }
    }

    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:5173"}/my-appointments?payment=success`
    );
  } catch (error) {
    console.log("Success callback error:", error);
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:5173"}/my-appointments?payment=error`
    );
  }
};

// SSLCommerz payment fail callback
const sslcommerzFail = async (req, res) => {
  try {
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:5173"}/my-appointments?payment=failed`
    );
  } catch (error) {
    console.log("Fail callback error:", error);
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:5173"}/my-appointments?payment=error`
    );
  }
};

// SSLCommerz payment cancel callback
const sslcommerzCancel = async (req, res) => {
  try {
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:5173"}/my-appointments?payment=cancelled`
    );
  } catch (error) {
    console.log("Cancel callback error:", error);
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:5173"}/my-appointments?payment=error`
    );
  }
};

// API to get all doctors (for users)
const allDoctors = async (_req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};

export {
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
};
