import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medi_connect';
    
    if (!process.env.MONGO_URI) {
      console.warn('⚠️  MONGO_URI not found in .env, using default: mongodb://127.0.0.1:27017/medi_connect');
    }
    
    const connectionInstance = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDb connected || DB HOST: ${connectionInstance.connection.host}`);
    console.log(`✅ Database: ${connectionInstance.connection.name}`);
  } catch (error) {
    console.error("❌ MONGODB connection FAILED", error.message);
    console.error("💡 Make sure MongoDB is running and MONGO_URI is correct in .env file");
    // Don't exit - let server start even if DB fails (for development)
    // process.exit(1);
  }
};

export default connectDB;
