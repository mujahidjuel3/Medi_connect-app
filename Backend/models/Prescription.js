import mongoose from 'mongoose';
const prescriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    url: String,
    publicId: String,
    bytes: Number,
    format: String,
  },
  { timestamps: true }
);
export default mongoose.model('Prescription', prescriptionSchema);