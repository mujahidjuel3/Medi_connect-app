import express from 'express';
import { auth } from '../middlewares/auth.js'; // auth middleware import
import { upsertConversation, listMessages } from '../controllers/chatController.js';

const router = express.Router();

// নতুন conversation তৈরি বা পুরোনো conversation ফেরত আনা
router.post('/conversation', auth, upsertConversation);

// কোনো conversation এর মেসেজ লিস্ট আনা
router.get('/messages', auth, listMessages);

export default router;
