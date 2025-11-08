import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
//Api for adding doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      nameBn,
      email,
      password,
      speciality,
      specialityBn,
      degree,
      degreeBn,
      experience,
      about,
      aboutBn,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    //checking for image file
    if (!imageFile) {
      return res.json({ success: false, message: "Doctor image is required" });
    }

    //checking for all data to add doctor
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // validatin email format

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    //validating strong password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password (minimum 8 characters)",
      });
    }

    // Normalize email for comparison (trim and lowercase)
    const normalizedEmail = email.trim().toLowerCase();

    //check if doctor with this email already exists (case-insensitive check)
    // First try direct match (for already normalized emails)
    let existedDoctor = await doctorModel.findOne({
      email: normalizedEmail,
    });

    // If not found, check case-insensitively (for old data that might have different cases)
    if (!existedDoctor) {
      existedDoctor = await doctorModel.findOne({
        email: { $regex: new RegExp(`^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
      });
    }

    if (existedDoctor) {
      return res.status(409).json({
        success: false,
        message: "Doctor with this email already exists",
      });
    }

    // hashing doctor password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // upload image cloudinary
    let imageUrl;
    try {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      imageUrl = imageUpload.secure_url;
    } catch (cloudinaryError) {
      console.log("Cloudinary upload error:", cloudinaryError);
      return res.json({
        success: false,
        message: "Failed to upload image. Please try again.",
      });
    }

    // Parse address safely
    let parsedAddress;
    try {
      parsedAddress = typeof address === "string" ? JSON.parse(address) : address;
    } catch (parseError) {
      return res.json({
        success: false,
        message: "Invalid address format",
      });
    }

    const doctorData = {
      name: name.trim(),
      nameBn: nameBn?.trim() || "",
      email: normalizedEmail, // Use already normalized email
      image: imageUrl,
      password: hashedPassword,
      speciality,
      specialityBn: specialityBn?.trim() || "",
      degree: degree.trim(),
      degreeBn: degreeBn?.trim() || "",
      experience,
      about: about.trim(),
      aboutBn: aboutBn?.trim() || "",
      fees: Number(fees),
      address: parsedAddress,
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);

    await newDoctor.save();
    res.json({
      success: true,
      message: "Doctor added successfully",
    });
  } catch (error) {
    console.log("Add doctor error:", error);
    
    // Handle specific MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "email";
      return res.status(409).json({
        success: false,
        message: `Doctor with this ${field} already exists`,
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors || {}).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: errors.join(", ") || "Validation error",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to add doctor. Please try again.",
    });
  }
};

// API for admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "Email and password are required" });
    }

    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (email === adminEmail && password === adminPassword) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials. Please check your email and password." });
    }
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message || "Login failed" });
  }
};

// Api for get all doctors list
const allDoctors = async (_req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all appointments list
const appointmentsAdmin = async (_req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};

// API for  appointment cancel

const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

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

//API to get dashboard data for admin panel

const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      users: users.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};

// API to delete doctor
const deleteDoctor = async (req, res) => {
  try {
    const { docId } = req.body;

    if (!docId) {
      return res.json({ success: false, message: "Doctor ID is required" });
    }

    // Check if doctor exists
    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    // Cancel all appointments for this doctor
    await appointmentModel.updateMany(
      { docId, cancelled: false },
      { cancelled: true }
    );

    // Delete the doctor
    await doctorModel.findByIdAndDelete(docId);

    res.json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};

export {
  addDoctor,
  loginAdmin,
  allDoctors,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
  deleteDoctor,
};
