import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nameBn: { type: String, default: "" }, // Bengali name
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    specialityBn: { type: String, default: "" }, // Bengali speciality
    degree: { type: String, required: true },
    degreeBn: { type: String, default: "" }, // Bengali degree
    experience: { type: String, required: true },
    about: { type: String, required: true },
    aboutBn: { type: String, default: "" }, // Bengali about
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    address: { type: Object, required: true },
    date: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
  },
  { minimize: false }
);

//minimize false allows to add empty object {} in schema

const doctorModel =
  mongoose.models.doctor || mongoose.model("doctor", doctorSchema);

export default doctorModel;
