import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

export const upsertConversation = async (req, res) => {
  // participants: [userId, doctorId]
  const { userId, doctorId } = req.body;
  const ids = [userId, doctorId].sort(); // ensure order
  let conv = await Conversation.findOne({ participants: ids });
  if (!conv) conv = await Conversation.create({ participants: ids });
  res.json(conv);
};

export const listMessages = async (req, res) => {
  const { conversationId, page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const msgs = await Message.find({ conversation: conversationId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));
  res.json({ data: msgs.reverse() });
};
