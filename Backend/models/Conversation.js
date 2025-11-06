import mongoose from 'mongoose';
const conversationSchema = new mongoose.Schema(
  {
    participants: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      required: true 
    }], // Can be User or Doctor IDs
    lastMessageAt: Date
  },
  { timestamps: true }
);
export default mongoose.model('Conversation', conversationSchema);
