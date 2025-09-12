import express from 'express';
import multer from 'multer';
import { uploadPrescription } from '../controllers/prescriptionController.js';
import { auth } from "../middlewares/auth.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_, file, cb) => {
    const ok = ['image/jpeg','image/png','image/webp','application/pdf'].includes(file.mimetype);
    cb(ok ? null : new Error('Invalid file type'), ok);
  }
});
router.post('/', auth, upload.single('file'), uploadPrescription);
export default router;