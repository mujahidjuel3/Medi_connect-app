import mongoose from 'mongoose';
const prescriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // Changed 'User' to 'user' to match model name
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'appointment' }, // Changed to match appointment model name
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor' }, // Optional: direct doctor reference
    url: String,
    publicId: String,
    bytes: Number,
    format: String,
  },
  { timestamps: true }
);
export default mongoose.model('Prescription', prescriptionSchema);