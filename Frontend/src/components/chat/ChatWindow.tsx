

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

interface ChatWindowProps {
  userId: string;
  doctorId: string;
}

export default function ChatWindow({ userId, doctorId }: ChatWindowProps) {
  const token = localStorage.getItem('token') || '';
  const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [conversationId, setConversationId] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId || !doctorId || !token) return;
    
    setIsLoading(true);
    // socket init
    const socket = io(backendUrl, {
      auth: { token },
      transports: ['websocket'],
    });
    socketRef.current = socket;

    (async () => {
      try {
        // ensure conversation
        const { data } = await axios.post(
          `${backendUrl}/api/chat/conversation`,
          { userId, doctorId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setConversationId(data._id);

        // fetch last messages
        const res = await axios.get(
          `${backendUrl}/api/chat/messages?conversationId=${data._id}&limit=50`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(res.data.data || res.data || []);

        socket.emit('chat:join', data._id);
        setIsLoading(false);
      } catch (err: any) {
        console.error('Chat init failed:', err);
        setIsLoading(false);
      }
    })();

    socket.on('chat:message', (msg) => {
      setMessages((m) => [...m, msg]);
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, doctorId, token, backendUrl]);

  const send = () => {
    if (!text.trim() || !conversationId) return;
    socketRef.current?.emit('chat:message', { conversationId, text });
    setText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex flex-col h-[500px] border border-gray-300 rounded-lg bg-white">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Loading chat...</p>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((m) => {
                const isMe = m.sender === userId || (typeof m.sender === 'object' && m.sender?._id === userId);
                return (
                  <div
                    key={m._id || Math.random()}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        isMe
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{m.text}</p>
                      {m.createdAt && (
                        <p className={`text-xs mt-1 ${isMe ? 'text-white/70' : 'text-gray-500'}`}>
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>
          <div className="border-t border-gray-200 p-3">
            <div className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Type your message..."
              />
              <button
                onClick={send}
                disabled={!text.trim()}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
