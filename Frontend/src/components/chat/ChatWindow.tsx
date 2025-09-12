

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

interface ChatWindowProps {
  userId: string;
  doctorId: string;
}

export default function ChatWindow({ userId, doctorId }: ChatWindowProps) {
  const token = localStorage.getItem('token') || '';
  const [conversationId, setConversationId] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // socket init
    const socket = io(import.meta.env.VITE_API_URL, {
      auth: { token },
      transports: ['websocket'], // force websocket (fix CORS/polling issues)
    });
    socketRef.current = socket;

    (async () => {
      try {
        // ensure conversation
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/chat/conversation`,
          { userId, doctorId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setConversationId(data._id);

        // fetch last messages
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/chat/messages?conversationId=${data._id}&limit=50`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(res.data.data);

        socket.emit('chat:join', data._id);
      } catch (err) {
        console.error('Chat init failed:', err);
      }
    })();

    socket.on('chat:message', (msg) => {
      setMessages((m) => [...m, msg]);
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, doctorId, token]);

  const send = () => {
    if (!text.trim() || !conversationId) return;
    socketRef.current?.emit('chat:message', { conversationId, text });
    setText('');
  };

  return (
    <div className="flex flex-col p-3 border rounded h-96">
      <div className="flex-1 space-y-2 overflow-auto">
        {messages.map((m) => (
          <div key={m._id || Math.random()} className="text-sm">
            <b>{m.sender === userId ? 'Me' : 'Doctor'}:</b> {m.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2 mt-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 px-2 py-1 border rounded"
          placeholder="Type message..."
        />
        <button
          onClick={send}
          className="px-3 py-1 text-white bg-black rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
