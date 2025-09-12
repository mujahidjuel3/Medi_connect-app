import 'dotenv/config';
import mongoose from 'mongoose';

const MONGODB_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medi_connect';

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    speciality: { type: String, required: true },
    about: String,
    fees: Number,
    image: String,
  },
  { timestamps: true }
);

const Doctor = mongoose.model('Doctor', doctorSchema);

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  // index reset
  await Doctor.collection.dropIndexes();

  const docs = [
    {
      name: 'ডা. তাহসিন রহমান',
      speciality: 'Medicine',
      about: '১০+ বছরের অভিজ্ঞতা',
      fees: 800,
      image: '/doctors/d1.png',
    },
    {
      name: 'Dr. Sara Ahmed',
      speciality: 'Dermatology',
      about: 'Skin specialist',
      fees: 1000,
      image: '/doctors/d2.png',
    },
    {
      name: 'Dr. Mujahid Juel',
      speciality: 'Dermatology',
      about: 'Skin Ton',
      fees: 1200,
      image: '/doctors/d3.png',
    },
    {
      name: 'Dr. Ahmed',
      speciality: 'Dermatology',
      about: 'Skin specialist',
      fees: 1020,
      image: '/doctors/d2.png',
    },
    {
      name: 'Dr.Juel',
      speciality: 'Dermatology',
      about: 'Skin Ton',
      fees: 120,
      image: '/doctors/d3.png',
    },
  ];

  await Doctor.deleteMany({});
  await Doctor.insertMany(docs);
  console.log('Seeded doctors:', docs.length);

  await mongoose.disconnect();
  console.log('Done.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
