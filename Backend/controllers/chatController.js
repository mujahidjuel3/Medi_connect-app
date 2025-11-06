import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import userModel from '../models/userModel.js';
import doctorModel from '../models/doctorModel.js';

export const upsertConversation = async (req, res) => {
  try {
    // participants: [userId, doctorId]
    const { userId, doctorId } = req.body;
    
    if (!userId || !doctorId) {
      return res.status(400).json({ 
        success: false,
        message: "User ID and Doctor ID are required" 
      });
    }

    const ids = [userId, doctorId].sort(); // ensure order
    let conv = await Conversation.findOne({ participants: ids });
    
    if (!conv) {
      conv = await Conversation.create({ 
        participants: ids,
        lastMessageAt: new Date()
      });
    }
    
    res.json(conv);
  } catch (error) {
    console.error('Upsert conversation error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Failed to create conversation" 
    });
  }
};

export const listMessages = async (req, res) => {
  try {
    const { conversationId, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const msgs = await Message.find({ conversation: conversationId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();
    
    // Manually populate sender based on senderModel
    const populatedMsgs = await Promise.all(
      msgs.map(async (msg) => {
        if (msg.senderModel === 'doctor') {
          const sender = await doctorModel.findById(msg.sender).select('name email image').lean();
          return { ...msg, sender };
        } else {
          const sender = await userModel.findById(msg.sender).select('name email image').lean();
          return { ...msg, sender };
        }
      })
    );
    
    res.json({ data: populatedMsgs.reverse() });
  } catch (error) {
    console.error('List messages error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all conversations for a doctor
export const getDoctorConversations = async (req, res) => {
  try {
    const { docId } = req.body;
    if (!docId) {
      return res.json({ success: false, message: "Doctor ID is required" });
    }

    // Find all conversations where doctor is a participant
    const conversations = await Conversation.find({ participants: docId })
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .lean();

    // Get last message and user info for each conversation
    const conversationsWithMessages = await Promise.all(
      conversations.map(async (conv) => {
        const lastMsg = await Message.findOne({ conversation: conv._id })
          .sort({ createdAt: -1 })
          .lean();
        
        // Manually populate sender
        let lastMessage = null;
        if (lastMsg) {
          if (lastMsg.senderModel === 'doctor') {
            const sender = await doctorModel.findById(lastMsg.sender).select('name email image').lean();
            lastMessage = { ...lastMsg, sender };
          } else {
            const sender = await userModel.findById(lastMsg.sender).select('name email image').lean();
            lastMessage = { ...lastMsg, sender };
          }
        }
        
        // Get the other participant (user) - not the doctor
        const userId = conv.participants.find(
          (p) => p.toString() !== docId.toString()
        );
        
        // Fetch user details
        const user = userId ? await userModel.findById(userId).select('name email image').lean() : null;

        return {
          ...conv,
          lastMessage,
          user,
        };
      })
    );

    res.json({ success: true, conversations: conversationsWithMessages });
  } catch (error) {
    console.error('Get doctor conversations error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all conversations for a user
export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "User ID is required" });
    }

    // Find all conversations where user is a participant
    const conversations = await Conversation.find({ participants: userId })
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .lean();

    // Get last message and doctor info for each conversation
    const conversationsWithMessages = await Promise.all(
      conversations.map(async (conv) => {
        const lastMsg = await Message.findOne({ conversation: conv._id })
          .sort({ createdAt: -1 })
          .lean();
        
        // Manually populate sender
        let lastMessage = null;
        if (lastMsg) {
          if (lastMsg.senderModel === 'doctor') {
            const sender = await doctorModel.findById(lastMsg.sender).select('name email image').lean();
            lastMessage = { ...lastMsg, sender };
          } else {
            const sender = await userModel.findById(lastMsg.sender).select('name email image').lean();
            lastMessage = { ...lastMsg, sender };
          }
        }
        
        // Get the other participant (doctor) - not the user
        const doctorId = conv.participants.find(
          (p) => p.toString() !== userId.toString()
        );
        
        // Fetch doctor details
        const doctor = doctorId ? await doctorModel.findById(doctorId).select('name email image speciality').lean() : null;

        return {
          ...conv,
          lastMessage,
          doctor,
        };
      })
    );

    res.json({ success: true, conversations: conversationsWithMessages });
  } catch (error) {
    console.error('Get user conversations error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a specific message
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.body;
    const userId = req.user?.id;
    const { docId } = req.body; // For doctor deletion

    if (!messageId) {
      return res.status(400).json({ success: false, message: "Message ID is required" });
    }

    // Find the message
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    // Check if user has permission to delete (must be the sender)
    const isSender = 
      (userId && message.sender.toString() === userId.toString()) ||
      (docId && message.sender.toString() === docId.toString() && message.senderModel === 'doctor');

    if (!isSender) {
      return res.status(403).json({ success: false, message: "You can only delete your own messages" });
    }

    // Delete the message
    await Message.findByIdAndDelete(messageId);

    // Emit socket event to notify clients
    if (req.app.get('io')) {
      req.app.get('io').to(message.conversation.toString()).emit('chat:message:deleted', { messageId });
    }

    res.json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a conversation (and all its messages)
export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.body;
    const userId = req.user?.id;
    const { docId } = req.body; // For doctor deletion

    if (!conversationId) {
      return res.status(400).json({ success: false, message: "Conversation ID is required" });
    }

    // Find the conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    // Check if user/doctor is a participant
    const isParticipant = 
      (userId && conversation.participants.includes(userId)) ||
      (docId && conversation.participants.includes(docId));

    if (!isParticipant) {
      return res.status(403).json({ success: false, message: "You don't have permission to delete this conversation" });
    }

    // Delete all messages in the conversation
    await Message.deleteMany({ conversation: conversationId });

    // Delete the conversation
    await Conversation.findByIdAndDelete(conversationId);

    // Emit socket event to notify clients
    if (req.app.get('io')) {
      req.app.get('io').to(conversationId).emit('chat:conversation:deleted', { conversationId });
    }

    res.json({ success: true, message: "Conversation deleted successfully" });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
