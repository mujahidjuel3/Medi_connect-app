import streamifier from 'streamifier';
import Prescription from '../models/Prescription.js';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';

export const uploadPrescription = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'File required' });

    const streamUpload = (buffer) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'prescriptions', resource_type: 'auto' },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });

    const result = await streamUpload(req.file.buffer);

    const doc = await Prescription.create({
      user: req.user.id,
      appointment: req.body.appointmentId || null,
      doctorId: req.body.doctorId || null, // Optional: direct doctor reference
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes
    });

    res.status(201).json({ success: true, message: 'Prescription uploaded successfully', ...doc.toObject() });
  } catch (e) { next(e); }
};

// Get all prescriptions (for admin)
export const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({})
      .populate({ path: 'user', model: 'user', select: 'name email image' })
      .populate({ path: 'appointment', model: 'appointment' })
      .populate({ path: 'doctorId', model: 'doctor', select: 'name email image speciality' })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, prescriptions });
  } catch (error) {
    console.error('Get all prescriptions error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get prescriptions for a specific doctor
export const getDoctorPrescriptions = async (req, res) => {
  try {
    // Get docId from token payload (set by authDoctor middleware)
    const docId = req.doctor?.id;
    if (!docId) {
      return res.json({ success: false, message: "Doctor ID is required" });
    }

    // Convert docId to ObjectId if it's a string
    let doctorObjectId;
    try {
      doctorObjectId = mongoose.Types.ObjectId.isValid(docId) 
        ? new mongoose.Types.ObjectId(docId) 
        : docId;
    } catch (e) {
      doctorObjectId = docId;
    }

    // Only show prescriptions directly linked to this doctor (doctorId field)
    // Try both ObjectId and string format
    const query = {
      $or: [
        { doctorId: doctorObjectId },
        { doctorId: docId.toString() }
      ]
    };

    // Find prescriptions directly linked to this doctor
    const prescriptions = await Prescription.find(query)
      .populate({ path: 'user', model: 'user', select: 'name email image' })
      .populate({ path: 'doctorId', model: 'doctor', select: 'name email image speciality' })
      .populate({
        path: 'appointment',
        model: 'appointment'
      })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, prescriptions });
  } catch (error) {
    console.error('Get doctor prescriptions error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get prescriptions for a specific user
export const getUserPrescriptions = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "User ID is required" });
    }

    const prescriptions = await Prescription.find({ user: userId })
      .populate({ path: 'appointment', model: 'appointment' })
      .populate({ path: 'doctorId', model: 'doctor', select: 'name email image speciality' })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, prescriptions });
  } catch (error) {
    console.error('Get user prescriptions error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a prescription
export const deletePrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.body;
    const userId = req.user?.id;
    const docId = req.doctor?.id; // For doctor deletion (from authDoctor middleware)

    if (!prescriptionId) {
      return res.status(400).json({ success: false, message: "Prescription ID is required" });
    }

    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) {
      return res.status(404).json({ success: false, message: "Prescription not found" });
    }

    // Check permission - user can delete their own, doctor can delete if prescription is linked to them
    let hasPermission = false;
    if (userId && prescription.user.toString() === userId.toString()) {
      hasPermission = true;
    } else if (docId) {
      // Doctor can delete if prescription is directly linked to them
      const prescriptionDocId = prescription.doctorId?.toString() || prescription.doctorId;
      hasPermission = prescriptionDocId === docId.toString();
    }

    if (!hasPermission) {
      return res.status(403).json({ success: false, message: "You don't have permission to delete this prescription" });
    }

    // Delete from cloudinary
    if (prescription.publicId) {
      try {
        await cloudinary.uploader.destroy(prescription.publicId);
      } catch (cloudinaryError) {
        console.error('Cloudinary delete error:', cloudinaryError);
      }
    }

    // Delete from database
    await Prescription.findByIdAndDelete(prescriptionId);

    res.json({ success: true, message: "Prescription deleted successfully" });
  } catch (error) {
    console.error('Delete prescription error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};