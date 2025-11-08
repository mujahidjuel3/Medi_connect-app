import express from 'express';
import multer from 'multer';
import { 
  uploadPrescription, 
  getAllPrescriptions,
  getDoctorPrescriptions,
  getUserPrescriptions,
  deletePrescription
} from '../controllers/prescriptionController.js';
import { auth } from "../middlewares/auth.js";
import authAdmin from '../middlewares/authAdmin.js';
import authDoctor from '../middlewares/authDoctor.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_, file, cb) => {
    const ok = ['image/jpeg','image/png','image/webp','application/pdf'].includes(file.mimetype);
    cb(ok ? null : new Error('Invalid file type'), ok);
  }
});

// Upload prescription (user)
router.post('/', auth, upload.single('file'), uploadPrescription);

// Get user's prescriptions
router.get('/user', auth, getUserPrescriptions);

// Get all prescriptions (admin)
router.get('/admin/all', authAdmin, getAllPrescriptions);

// Get doctor's prescriptions
router.get('/doctor', authDoctor, getDoctorPrescriptions);

// Delete prescription (user)
router.delete('/', auth, deletePrescription);

// Delete prescription (doctor)
router.delete('/doctor', authDoctor, deletePrescription);

export default router;