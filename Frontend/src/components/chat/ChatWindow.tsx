

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

interface ChatWindowProps {
  userId: string;
  doctorId: string;
}

export default function ChatWindow({ userId, doctorId }: ChatWindowProps) {
  const { t } = useTranslation();
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
        setIsLoading(true);
        console.log('Creating conversation:', { userId, doctorId });
        
        // ensure conversation
        const { data } = await axios.post(
          `${backendUrl}/api/chat/conversation`,
          { userId, doctorId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        console.log('Conversation created:', data);
        
        if (!data || !data._id) {
          throw new Error('Invalid conversation data received');
        }
        
        setConversationId(data._id);

        // fetch last messages
        const res = await axios.get(
          `${backendUrl}/api/chat/messages?conversationId=${data._id}&limit=50`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        console.log('Messages loaded:', res.data);
        const messages = res.data.data || res.data || [];
        setMessages(Array.isArray(messages) ? messages : []);

        // Join socket room
        if (socket.connected) {
          socket.emit('chat:join', data._id);
          console.log('Joined conversation room:', data._id);
        } else {
          socket.once('connect', () => {
            socket.emit('chat:join', data._id);
          });
        }
        
        setIsLoading(false);
      } catch (err: any) {
        console.error('Chat init failed:', err);
        console.error('Error details:', err.response?.data || err.message);
        setIsLoading(false);
        // Show error to user
        if (err.response?.status === 401) {
          alert(t('please_login_chat'));
        } else {
          alert(t('chat_init_failed'));
        }
      }
    })();

    socket.on('chat:message', (msg) => {
      console.log('Received message via socket:', msg);
      if (!msg || !msg.text) {
        console.warn('Invalid message received:', msg);
        return;
      }
      
      setMessages((prev) => {
        // Check if message already exists (avoid duplicates)
        const exists = prev.some(m => 
          m._id === msg._id || 
          (m._id?.startsWith('temp-') && m.text === msg.text && Math.abs(new Date(m.createdAt).getTime() - new Date(msg.createdAt).getTime()) < 5000)
        );
        
        if (exists) {
          // Replace temp message with real one
          return prev.map(m => 
            (m._id?.startsWith('temp-') && m.text === msg.text) ? { ...msg, isSending: false } : m
          );
        }
        return [...prev, { ...msg, isSending: false }];
      });
      
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Listen for message deletion events
    socket.on('chat:message:deleted', ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    });

    // Listen for conversation deletion events
    socket.on('chat:conversation:deleted', ({ conversationId: deletedConvId }) => {
      if (deletedConvId === conversationId) {
        setMessages([]);
        setConversationId('');
        alert(t('conversation_deleted'));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, doctorId, token, backendUrl, conversationId]);

  // Rejoin conversation when conversationId changes
  useEffect(() => {
    if (conversationId && socketRef.current?.connected) {
      socketRef.current.emit('chat:join', conversationId);
    }
  }, [conversationId]);

  const send = async () => {
    if (!text.trim() || !conversationId) {
      console.error('Cannot send message:', { 
        text: text.trim(), 
        conversationId, 
        socket: !!socketRef.current,
        socketConnected: socketRef.current?.connected 
      });
      return;
    }

    if (!socketRef.current || !socketRef.current.connected) {
      alert(t('connection_lost'));
      return;
    }

    const messageText = text.trim();
    setText('');

    // Optimistically add message to UI
    const tempMessage = {
      _id: `temp-${Date.now()}`,
      text: messageText,
      sender: userId,
      senderRole: 'user',
      createdAt: new Date(),
      isSending: true,
    };
    setMessages((prev) => [...prev, tempMessage]);
    
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    try {
      // Send via socket
      socketRef.current.emit('chat:message', { 
        conversationId, 
        text: messageText,
        senderRole: 'user'
      }, (response) => {
        console.log('Message send response:', response);
        if (response?.error) {
          console.error('Message send error:', response.error);
          alert(`${t('send_message_failed')}: ${response.error}`);
          // Remove temp message on error
          setMessages((prev) => prev.filter(m => m._id !== tempMessage._id));
        } else if (response?.success) {
          console.log('Message sent successfully');
        }
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      alert(t('send_message_failed'));
      // Remove temp message on error
      setMessages((prev) => prev.filter(m => m._id !== tempMessage._id));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!window.confirm(t('are_you_sure_delete_message'))) {
      return;
    }

    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/chat/message`,
        {
          data: { messageId },
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (data.success) {
        setMessages((prev) => prev.filter((m) => m._id !== messageId));
      } else {
        alert(data.message || t('delete_message_failed'));
      }
    } catch (error: any) {
      console.error('Delete message error:', error);
      alert(error.response?.data?.message || t('delete_message_failed'));
    }
  };

  const deleteConversation = async () => {
    if (!conversationId) return;
    
    if (!window.confirm(t('are_you_sure_delete_conversation'))) {
      return;
    }

    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/chat/conversation`,
        {
          data: { conversationId },
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (data.success) {
        setMessages([]);
        setConversationId('');
        alert(t('conversation_deleted'));
      } else {
        alert(data.message || t('delete_conversation_failed'));
      }
    } catch (error: any) {
      console.error('Delete conversation error:', error);
      alert(error.response?.data?.message || t('delete_conversation_failed'));
    }
  };

  return (
    <div className="flex flex-col h-[500px] border border-gray-300 rounded-lg bg-white">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">{t('loading')}</p>
        </div>
      ) : (
        <>
          {conversationId && (
            <div className="p-3 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-700">{t('chat')}</h3>
              <button
                onClick={deleteConversation}
                className="text-red-500 hover:text-red-700 text-sm px-3 py-1 rounded hover:bg-red-50 transition-colors"
                title={t('delete_conversation')}
              >
                🗑️ {t('delete_conversation')}
              </button>
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <p>{t('no_messages')}</p>
              </div>
            ) : (
              messages.map((m) => {
                const isMe = 
                  m.sender === userId || 
                  (typeof m.sender === 'object' && m.sender?._id === userId) ||
                  m.senderRole === 'user';
                return (
                  <div
                    key={m._id || `msg-${m.text}-${m.createdAt}`}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}
                  >
                    <div className={`relative ${isMe ? 'flex-row-reverse' : 'flex-row'} flex items-start gap-2`}>
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          isMe
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-800'
                        } ${m.isSending ? 'opacity-70' : ''}`}
                      >
                        <p className="text-sm">{m.text}</p>
                        {m.createdAt && (
                          <p className={`text-xs mt-1 ${isMe ? 'text-white/70' : 'text-gray-500'}`}>
                            {new Date(m.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                            {m.isSending && ` (${t('sending')})`}
                          </p>
                        )}
                      </div>
                      {isMe && !m.isSending && (
                        <button
                          onClick={() => deleteMessage(m._id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 text-sm"
                          title={t('delete_message')}
                        >
                          🗑️
                        </button>
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
                placeholder={t('type_message')}
              />
              <button
                onClick={send}
                disabled={!text.trim()}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t('send')}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
