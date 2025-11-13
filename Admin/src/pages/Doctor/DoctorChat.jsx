import { useContext, useEffect, useState, useRef } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { io } from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";
import MoveUpOnRender from "../../components/MoveUpOnRender";

const DoctorChat = () => {
  const { dToken, backendUrl } = useContext(DoctorContext);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const bottomRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const socketRef = useRef(null);
  const doctorIdRef = useRef(null);

  // Get doctor ID from token
  useEffect(() => {
    if (dToken) {
      try {
        const tokenParts = dToken.split(".");
        const payload = JSON.parse(atob(tokenParts[1]));
        doctorIdRef.current = payload.id;
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }
  }, [dToken]);

  // Load conversations
  useEffect(() => {
    if (!dToken || !doctorIdRef.current) return;

    const loadConversations = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `${backendUrl}/api/chat/doctor/conversations`,
          {
            headers: { dToken },
          }
        );

        if (data.success) {
          setConversations(data.conversations || []);
        } else {
          toast.error(data.message || "Failed to load conversations");
        }
      } catch (error) {
        console.error("Load conversations error:", error);
        toast.error("Failed to load conversations");
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
  }, [dToken, backendUrl]);

  // Initialize socket and load messages when conversation is selected
  useEffect(() => {
    if (!selectedConversation || !dToken || !doctorIdRef.current) return;

    // Initialize socket
    const socket = io(backendUrl, {
      auth: { dToken },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    // Scroll to bottom function
    const scrollToBottom = () => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      } else if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };

    const loadMessages = async () => {
      try {
        setIsLoadingMessages(true);
        const { data } = await axios.get(
          `${backendUrl}/api/chat/messages?conversationId=${selectedConversation._id}&limit=50`,
          {
            headers: { Authorization: `Bearer ${dToken}` },
          }
        );

        setMessages(data.data || []);
        socket.emit("chat:join", selectedConversation._id);
        
        // Scroll to bottom after loading messages
        setTimeout(() => {
          scrollToBottom();
        }, 200);
      } catch (error) {
        console.error("Load messages error:", error);
        toast.error("Failed to load messages");
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();

    // Listen for new messages
    socket.on("chat:message", (msg) => {
      setMessages((prev) => {
        // Check if message already exists (avoid duplicates)
        const exists = prev.some(
          (m) =>
            m._id === msg._id ||
            (m._id?.startsWith("temp-") && m.text === msg.text)
        );
        if (exists) {
          // Replace temp message with real one
          return prev.map((m) =>
            m._id?.startsWith("temp-") && m.text === msg.text
              ? { ...msg, isSending: false }
              : m
          );
        }
        return [...prev, { ...msg, isSending: false }];
      });
      // Scroll to bottom when new message arrives
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    });

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("error", (error) => {
      toast.error(error.message || "Socket error");
    });

    // Listen for message deletion events
    socket.on("chat:message:deleted", ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    });

    // Listen for conversation deletion events
    socket.on("chat:conversation:deleted", ({ conversationId: deletedConvId }) => {
      if (deletedConvId === selectedConversation?._id) {
        setMessages([]);
        setSelectedConversation(null);
        toast.info("Conversation has been deleted");
        // Reload conversations list
        const loadConversations = async () => {
          try {
            const { data } = await axios.get(
              `${backendUrl}/api/chat/doctor/conversations`,
              { headers: { dToken } }
            );
            if (data.success) {
              setConversations(data.conversations || []);
            }
          } catch (error) {
            console.error("Error reloading conversations:", error);
          }
        };
        loadConversations();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedConversation, dToken, backendUrl]);

  const sendMessage = () => {
    if (!text.trim() || !selectedConversation || !socketRef.current) {
      console.error('Cannot send message:', { text: text.trim(), conversation: !!selectedConversation, socket: !!socketRef.current });
      return;
    }

    const messageText = text.trim();
    setText("");

    // Optimistically add message to UI
    const tempMessage = {
      _id: `temp-${Date.now()}`,
      text: messageText,
      sender: doctorIdRef.current,
      senderRole: "doctor",
      createdAt: new Date(),
      isSending: true,
    };
    setMessages((prev) => [...prev, tempMessage]);
    
    // Scroll to bottom after adding temp message
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 50);

    // Send via socket
    socketRef.current.emit(
      "chat:message",
      {
        conversationId: selectedConversation._id,
        text: messageText,
        senderRole: "doctor",
      },
      (response) => {
        if (response?.error) {
          console.error("Message send error:", response.error);
          toast.error(response.error || "Failed to send message");
          // Remove temp message on error
          setMessages((prev) => prev.filter((m) => m._id !== tempMessage._id));
        }
      }
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const deleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }

    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/chat/doctor/message`,
        {
          data: { messageId, docId: doctorIdRef.current },
          headers: { dToken },
        }
      );

      if (data.success) {
        toast.success(data.message || "Message deleted successfully");
        setMessages((prev) => prev.filter((m) => m._id !== messageId));
      } else {
        toast.error(data.message || "Failed to delete message");
      }
    } catch (error) {
      console.error("Delete message error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete message"
      );
    }
  };

  const deleteConversationById = async (conversationId) => {
    if (!conversationId) return;

    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/chat/doctor/conversation`,
        {
          data: {
            conversationId,
            docId: doctorIdRef.current,
          },
          headers: { dToken },
        }
      );

      if (data.success) {
        toast.success(data.message || "Conversation deleted successfully");
        
        // If deleted conversation is currently selected, clear it
        if (selectedConversation?._id === conversationId) {
          setMessages([]);
          setSelectedConversation(null);
        }
        
        // Reload conversations
        const loadConversations = async () => {
          try {
            const { data } = await axios.get(
              `${backendUrl}/api/chat/doctor/conversations`,
              { headers: { dToken } }
            );
            if (data.success) {
              setConversations(data.conversations || []);
            }
          } catch (error) {
            console.error("Error reloading conversations:", error);
          }
        };
        loadConversations();
      } else {
        toast.error(data.message || "Failed to delete conversation");
      }
    } catch (error) {
      console.error("Delete conversation error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete conversation"
      );
    }
  };

  const deleteConversation = async () => {
    if (!selectedConversation) return;

    if (
      !window.confirm(
        "Are you sure you want to delete this conversation? All messages will be permanently deleted."
      )
    ) {
      return;
    }

    await deleteConversationById(selectedConversation._id);
  };

  const selectedUser = selectedConversation?.user;

  return (
    <MoveUpOnRender id="doctor-chat">
      <div className="m-0 xs:m-1 sm:m-2 md:m-0 lg:m-2 xl:m-3 px-0 xs:px-1 sm:px-2 md:px-0 lg:px-2 xl:px-3 overflow-x-hidden w-full max-w-full">
        <h1 className="text-base xs:text-lg sm:text-xl md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-semibold mb-1 xs:mb-2 sm:mb-3 md:mb-2 lg:mb-3 xl:mb-4 2xl:mb-5 text-gray-800 px-1 xs:px-2 md:px-2">Chat with Patients</h1>

        <div className="bg-white border border-gray-200 md:border-0 md:rounded-none lg:border lg:rounded-lg overflow-hidden shadow-sm md:shadow-none lg:shadow-sm w-full max-w-full" style={{ height: "calc(90vh - 60px)", maxHeight: "calc(90vh - 60px)" }}>
          <div className="flex flex-col lg:flex-row h-full w-full max-w-full overflow-hidden">
            {/* Conversations List */}
            <div className="w-full lg:w-[40%] xl:w-[45%] 2xl:w-[48%] border-b lg:border-b-0 lg:border-r overflow-y-auto overflow-x-hidden bg-gray-50 flex-shrink-0 min-w-0 max-w-full lg:max-h-full" style={{ maxHeight: "calc(50vh - 60px)" }}>
              <div className="p-1.5 xs:p-2 sm:p-3 md:p-3 lg:p-4 border-b bg-white sticky top-0 z-10 shadow-sm">
                <h2 className="font-semibold text-gray-800 text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg">Conversations</h2>
              </div>
              {isLoading ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  <div className="animate-pulse">Loading conversations...</div>
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-6 sm:p-8 text-center text-gray-400">
                  <p className="text-sm sm:text-base">No conversations yet</p>
                  <p className="text-xs text-gray-400 mt-1">Patients will appear here when they message you</p>
                </div>
              ) : (
                <div>
                  {conversations.map((conv) => (
                    <div
                      key={conv._id}
                      className={`p-1.5 xs:p-2 sm:p-2.5 md:p-2.5 lg:p-4 xl:p-5 2xl:p-6 border-b border-gray-200 hover:bg-white transition-all cursor-pointer ${
                        selectedConversation?._id === conv._id
                          ? "bg-primary/5 border-l-4 border-l-primary shadow-sm"
                          : "bg-gray-50"
                      }`}
                    >
                      <div 
                        onClick={() => setSelectedConversation(conv)}
                        className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-2 lg:gap-3 xl:gap-4 2xl:gap-4 w-full"
                      >
                        <img
                          src={conv.user?.image || "/default-avatar.png"}
                          alt={conv.user?.name}
                          className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-14 lg:h-14 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 truncate lg:truncate-none text-[11px] xs:text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg 2xl:text-xl">
                            {conv.user?.name || "Unknown User"}
                          </h3>
                          {conv.lastMessage ? (
                            <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-xs lg:text-sm xl:text-base 2xl:text-lg text-gray-600 truncate lg:truncate-none mt-0.5">
                              {conv.lastMessage.text}
                            </p>
                          ) : (
                            <p className="text-[9px] xs:text-[10px] text-gray-400 italic truncate lg:truncate-none">No messages yet</p>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Are you sure you want to delete conversation with ${conv.user?.name || "this user"}?`)) {
                              deleteConversationById(conv._id);
                            }
                          }}
                          className="text-red-500 hover:text-red-700 flex-shrink-0 transition-colors p-1.5 hover:bg-red-50 rounded ml-auto"
                          title="Delete conversation"
                        >
                          <span className="text-base xs:text-lg">🗑️</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-white min-w-0 overflow-hidden w-full lg:flex-1" style={{ minHeight: "calc(50vh - 60px)", maxHeight: "calc(90vh - 60px)" }}>
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-1.5 xs:p-2 sm:p-3 md:p-3 lg:p-4 xl:p-5 border-b bg-gradient-to-r from-gray-50 to-white flex items-center justify-between shadow-sm sticky top-0 z-10 flex-shrink-0 overflow-x-hidden">
                    <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-2 lg:gap-2.5 xl:gap-3 min-w-0 flex-1">
                      <img
                        src={selectedUser?.image || "/default-avatar.png"}
                        alt={selectedUser?.name}
                        className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full border-2 border-white shadow-md object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <h3 className="font-semibold text-gray-800 text-[11px] xs:text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg 2xl:text-xl truncate">{selectedUser?.name || "Unknown User"}</h3>
                        <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-xs lg:text-sm xl:text-base text-gray-500 truncate">Patient</p>
                      </div>
                    </div>
                    <button
                      onClick={deleteConversation}
                      className="text-red-500 hover:text-red-700 text-[9px] xs:text-[10px] sm:text-xs md:text-xs lg:text-sm xl:text-base px-1 xs:px-1.5 sm:px-2 md:px-2.5 lg:px-3 xl:px-4 py-0.5 xs:py-1 sm:py-1.5 md:py-1.5 lg:py-2 xl:py-2.5 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-0.5 xs:gap-1 sm:gap-1 md:gap-1.5 border border-red-200 hover:border-red-300 flex-shrink-0"
                      title="Delete conversation"
                    >
                      <span className="text-[10px] xs:text-xs sm:text-sm">🗑️</span>
                      <span className="hidden sm:inline text-[10px] xs:text-xs sm:text-sm md:text-xs lg:text-sm xl:text-base">Delete</span>
                    </button>
                  </div>

                  {/* Messages */}
                  <div 
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto overflow-x-hidden p-1.5 xs:p-2 sm:p-3 md:p-3 lg:p-4 xl:p-5 2xl:p-6 space-y-1.5 xs:space-y-2 sm:space-y-2.5 md:space-y-3 lg:space-y-3 xl:space-y-4 bg-gray-50 min-h-0"
                    style={{ scrollBehavior: 'smooth' }}
                  >
                    {isLoadingMessages ? (
                      <div className="text-center text-gray-500">
                        Loading messages...
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-8">
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isDoctor =
                          msg.senderRole === "doctor" ||
                          (typeof msg.sender === "object" &&
                            msg.sender?._id === doctorIdRef.current);
                        return (
                          <div
                            key={msg._id || Math.random()}
                            className={`flex ${isDoctor ? "justify-end" : "justify-start"} group`}
                          >
                            <div className={`relative ${isDoctor ? "flex-row-reverse" : "flex-row"} flex items-start gap-1 xs:gap-1.5 sm:gap-2 md:gap-2 lg:gap-2.5 xl:gap-3 w-full max-w-full`}>
                              <div
                                className={`max-w-[90%] xs:max-w-[88%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[75%] xl:max-w-[70%] 2xl:max-w-[65%] rounded-2xl px-2 xs:px-2.5 sm:px-3 md:px-3.5 lg:px-4 xl:px-5 2xl:px-6 py-1.5 xs:py-2 sm:py-2.5 md:py-2.5 lg:py-3 xl:py-3.5 shadow-sm break-words ${
                                  isDoctor
                                    ? "bg-gradient-to-br from-primary to-primary/90 text-white rounded-br-sm"
                                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                                }`}
                              >
                                <p className="text-[11px] xs:text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg leading-relaxed break-words whitespace-pre-wrap overflow-wrap-anywhere">{msg.text}</p>
                                {msg.createdAt && (
                                  <p
                                    className={`text-[9px] xs:text-[10px] sm:text-xs mt-0.5 xs:mt-1 sm:mt-1.5 md:mt-1.5 lg:mt-2 ${
                                      isDoctor ? "text-white/80" : "text-gray-500"
                                    }`}
                                  >
                                    {new Date(msg.createdAt).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                )}
                              </div>
                              {isDoctor && (
                                <button
                                  onClick={() => deleteMessage(msg._id)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 text-sm"
                                  title="Delete message"
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

                  {/* Message Input */}
                  <div className="border-t-2 border-gray-200 px-1.5 xs:px-2 sm:px-3 md:px-3 lg:px-4 xl:px-5 py-1.5 xs:py-2 sm:py-3 md:py-3 lg:py-4 xl:py-5 bg-white shadow-lg sticky bottom-0 z-10 flex-shrink-0 overflow-x-hidden w-full">
                    <div className="flex gap-1.5 xs:gap-2 sm:gap-2.5 md:gap-3 lg:gap-3 xl:gap-4 w-full max-w-full">
                      <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 min-w-0 px-2 xs:px-3 sm:px-4 md:px-4 lg:px-5 xl:px-6 2xl:px-7 py-1.5 xs:py-2 sm:py-2.5 md:py-2.5 lg:py-3 xl:py-3.5 2xl:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-[11px] xs:text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg placeholder-gray-400"
                        placeholder="Type your message..."
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!text.trim()}
                        className="px-2 xs:px-2.5 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-10 py-1.5 xs:py-2 sm:py-2.5 md:py-2.5 lg:py-3 xl:py-3.5 2xl:py-4 bg-gradient-to-r from-primary to-primary/90 text-white rounded-xl hover:from-primary/90 hover:to-primary active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg font-medium text-[11px] xs:text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg flex items-center justify-center flex-shrink-0 min-w-[40px] xs:min-w-[44px] sm:min-w-[60px] md:min-w-[70px] lg:min-w-[85px] xl:min-w-[100px] 2xl:min-w-[120px] touch-manipulation"
                        style={{ minHeight: '40px' }}
                      >
                        <span className="hidden sm:inline">Send</span>
                        <span className="sm:hidden text-base xs:text-lg font-bold">📤</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50">
                  <div className="text-center">
                    <p className="text-sm sm:text-base mb-2">Select a conversation to start chatting</p>
                    <p className="text-xs text-gray-400">Choose a patient from the list to begin</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MoveUpOnRender>
  );
};

export default DoctorChat;

