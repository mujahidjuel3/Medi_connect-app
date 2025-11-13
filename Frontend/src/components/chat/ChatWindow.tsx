

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
  const messagesContainerRef = useRef<HTMLDivElement>(null);
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
        
        // Scroll to bottom after messages load
        setTimeout(() => {
          if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
          }
        }, 200);
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
      
      // Scroll to bottom when new message arrives
      setTimeout(() => {
        scrollToBottom();
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

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    } else if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Auto scroll when messages change
  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [messages.length, isLoading]);

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
    
    // Scroll to bottom after adding temp message
    setTimeout(() => {
      scrollToBottom();
    }, 50);

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
    <div className="flex flex-col h-[400px] xs:h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px] xl:h-[650px] 2xl:h-[700px] border-2 border-gray-200 rounded-xl bg-white shadow-lg overflow-hidden w-full">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">{t('loading')}</p>
          </div>
        </div>
      ) : (
        <>
          {conversationId && (
            <div className="p-2 xs:p-3 sm:p-4 md:p-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white shadow-sm">
              <h3 className="font-semibold text-gray-800 text-sm xs:text-base sm:text-lg md:text-xl">{t('chat')}</h3>
              <button
                onClick={deleteConversation}
                className="text-red-500 hover:text-red-700 text-xs xs:text-sm px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-2.5 rounded-lg hover:bg-red-50 transition-colors border border-red-200 hover:border-red-300 flex items-center gap-1 xs:gap-2"
                title={t('delete_conversation')}
              >
                <span className="text-xs xs:text-sm">🗑️</span>
                <span className="hidden sm:inline text-xs sm:text-sm">{t('delete_conversation')}</span>
              </button>
            </div>
          )}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto overflow-x-hidden p-1.5 xs:p-2 sm:p-3 md:p-3 lg:p-4 xl:p-5 2xl:p-6 space-y-1.5 xs:space-y-2 sm:space-y-2.5 md:space-y-3 lg:space-y-3 xl:space-y-4 bg-gray-50 min-h-0"
            style={{ scrollBehavior: 'smooth' }}
          >
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
                    <div className={`relative ${isMe ? 'flex-row-reverse' : 'flex-row'} flex items-start gap-1 xs:gap-1.5 sm:gap-2 md:gap-2 lg:gap-2.5 xl:gap-3 w-full max-w-full`}>
                      <div
                        className={`max-w-[90%] xs:max-w-[88%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[75%] xl:max-w-[70%] 2xl:max-w-[65%] rounded-2xl px-2 xs:px-2.5 sm:px-3 md:px-3.5 lg:px-4 xl:px-5 2xl:px-6 py-1.5 xs:py-2 sm:py-2.5 md:py-2.5 lg:py-3 xl:py-3.5 shadow-sm break-words ${
                          isMe
                            ? 'bg-gradient-to-br from-primary to-primary/90 text-white rounded-br-sm'
                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                        } ${m.isSending ? 'opacity-70' : ''}`}
                      >
                        <p className="text-[11px] xs:text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg leading-relaxed break-words whitespace-pre-wrap overflow-wrap-anywhere">{m.text}</p>
                        {m.createdAt && (
                          <p className={`text-[9px] xs:text-[10px] sm:text-xs mt-0.5 xs:mt-1 sm:mt-1.5 md:mt-1.5 lg:mt-2 ${isMe ? 'text-white/80' : 'text-gray-500'}`}>
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
          <div className="border-t-2 border-gray-200 px-1.5 xs:px-2 sm:px-3 md:px-3 lg:px-4 xl:px-5 py-1.5 xs:py-2 sm:py-3 md:py-3 lg:py-4 xl:py-5 bg-white shadow-lg sticky bottom-0 z-10 flex-shrink-0 overflow-x-hidden w-full">
            <div className="flex gap-1.5 xs:gap-2 sm:gap-2.5 md:gap-3 lg:gap-3 xl:gap-4 w-full max-w-full">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 min-w-0 px-2 xs:px-3 sm:px-4 md:px-4 lg:px-5 xl:px-6 2xl:px-7 py-1.5 xs:py-2 sm:py-2.5 md:py-2.5 lg:py-3 xl:py-3.5 2xl:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-[11px] xs:text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg placeholder-gray-400"
                placeholder={t('type_message')}
              />
              <button
                onClick={send}
                disabled={!text.trim()}
                className="px-2 xs:px-2.5 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-10 py-1.5 xs:py-2 sm:py-2.5 md:py-2.5 lg:py-3 xl:py-3.5 2xl:py-4 bg-gradient-to-r from-primary to-primary/90 text-white rounded-xl hover:from-primary/90 hover:to-primary active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg font-medium text-[11px] xs:text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg flex items-center justify-center flex-shrink-0 min-w-[40px] xs:min-w-[44px] sm:min-w-[60px] md:min-w-[70px] lg:min-w-[85px] xl:min-w-[100px] 2xl:min-w-[120px] touch-manipulation"
                style={{ minHeight: '40px' }}
              >
                <span className="hidden sm:inline">{t('send')}</span>
                <span className="sm:hidden text-base xs:text-lg font-bold">📤</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
