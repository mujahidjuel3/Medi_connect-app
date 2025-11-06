import mongoose from 'mongoose';
const messageSchema = new mongoose.Schema(
  {
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      refPath: 'senderModel',
      required: true 
    },
    senderModel: {
      type: String,
      enum: ['user', 'doctor'],
      default: 'user'
    },
    senderRole: {
      type: String,
      enum: ['user', 'doctor'],
      default: 'user'
    },
    text: { type: String, trim: true, required: true },
    readAt: Date
  },
  { timestamps: true }
);
messageSchema.index({ conversation: 1, createdAt: -1 });
export default mongoose.model('Message', messageSchema);