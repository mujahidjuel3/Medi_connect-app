import express from 'express';
import { auth } from '../middlewares/auth.js'; // auth middleware import
import authDoctor from '../middlewares/authDoctor.js';
import { 
  upsertConversation, 
  listMessages, 
  getDoctorConversations,
  getUserConversations,
  deleteMessage,
  deleteConversation
} from '../controllers/chatController.js';

const router = express.Router();

// নতুন conversation তৈরি বা পুরোনো conversation ফেরত আনা
router.post('/conversation', auth, upsertConversation);

// কোনো conversation এর মেসেজ লিস্ট আনা
router.get('/messages', auth, listMessages);

// User এর জন্য conversations পাওয়া
router.get('/user/conversations', auth, getUserConversations);

// Doctor এর জন্য conversations পাওয়া
router.get('/doctor/conversations', authDoctor, getDoctorConversations);

// Delete a specific message (for users)
router.delete('/message', auth, deleteMessage);

// Delete a specific message (for doctors)
router.delete('/doctor/message', authDoctor, deleteMessage);

// Delete a conversation (for users)
router.delete('/conversation', auth, deleteConversation);

// Delete a conversation (for doctors)
router.delete('/doctor/conversation', authDoctor, deleteConversation);

export default router;
