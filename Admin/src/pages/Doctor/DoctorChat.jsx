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
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
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
    
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

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
      <div className="m-5">
        <h1 className="text-lg font-medium mb-4">Chat with Patients</h1>

        <div className="bg-white border rounded-lg overflow-hidden" style={{ height: "calc(90vh - 120px)" }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r overflow-y-auto">
              <div className="p-4 border-b bg-gray-50">
                <h2 className="font-semibold text-gray-700">Conversations</h2>
              </div>
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">
                  Loading conversations...
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No conversations yet
                </div>
              ) : (
                <div>
                  {conversations.map((conv) => (
                    <div
                      key={conv._id}
                      className={`p-4 border-b hover:bg-gray-50 transition-colors ${
                        selectedConversation?._id === conv._id
                          ? "bg-primary/10 border-l-4 border-l-primary"
                          : ""
                      }`}
                    >
                      <div 
                        onClick={() => setSelectedConversation(conv)}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <img
                          src={conv.user?.image || "/default-avatar.png"}
                          alt={conv.user?.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 truncate">
                            {conv.user?.name || "Unknown User"}
                          </h3>
                          {conv.lastMessage && (
                            <p className="text-sm text-gray-500 truncate">
                              {conv.lastMessage.text}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Are you sure you want to delete conversation with ${conv.user?.name || "this user"}?`)) {
                            deleteConversationById(conv._id);
                          }
                        }}
                        className="mt-2 text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors"
                        title="Delete conversation"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedUser?.image || "/default-avatar.png"}
                        alt={selectedUser?.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold">{selectedUser?.name || "Unknown User"}</h3>
                        <p className="text-sm text-gray-500">Patient</p>
                      </div>
                    </div>
                    <button
                      onClick={deleteConversation}
                      className="text-red-500 hover:text-red-700 text-sm px-3 py-1 rounded hover:bg-red-50 transition-colors"
                      title="Delete conversation"
                    >
                      🗑️ Delete
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                            <div className={`relative ${isDoctor ? "flex-row-reverse" : "flex-row"} flex items-start gap-2`}>
                              <div
                                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                  isDoctor
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                <p className="text-sm">{msg.text}</p>
                                {msg.createdAt && (
                                  <p
                                    className={`text-xs mt-1 ${
                                      isDoctor ? "text-white/70" : "text-gray-500"
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
                  <div className="border-t p-4 bg-gray-50">
                    <div className="flex gap-2">
                      <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Type your message..."
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!text.trim()}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <p>Select a conversation to start chatting</p>
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

