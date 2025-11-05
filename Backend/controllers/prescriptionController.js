import streamifier from 'streamifier';
import Prescription from '../models/Prescription.js';
import { v2 as cloudinary } from 'cloudinary';

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
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes
    });

    res.status(201).json(doc);
  } catch (e) { next(e); }
};