import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { UseAuth } from "@/context/AuthContext";

interface Message {
  _id: string;
  sender: { _id: string; name?: string | undefined; role?:string  | undefined } | string;
  content: string;
  createdAt?: string;
}

interface ChatAppProps {
  productId: string;
}

const ChatApp = ({ productId }: ChatAppProps) => {
  const {user } = UseAuth()
  const [comments, setComments] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [discussionId, setDiscussionId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const hasJoinedRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  // 🔌 STEP 1 — Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      console.error("❌ No token found");
      return;
    }

    // Create socket connection
    socketRef.current = io("http://localhost:4000", {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socketRef.current.on("connect", () => {
      console.log("✅ Socket connected");
      setIsConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      console.log("🔌 Socket disconnected");
      setIsConnected(false);
      hasJoinedRef.current = false;
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("❌ Connection error:", err.message);
      setIsConnected(false);
    });

    // Listen for incoming messages
    socketRef.current.on("receiveMessage", (newMessage: Message) => {
      console.log("📩 New message received:", newMessage);
      setComments((prev) => [...prev, newMessage]);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.off("receiveMessage");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // 🧠 STEP 2 — Get or create discussion
  useEffect(() => {
    const getDiscussion = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:4000/api/discussion/getCreatedDiscusion/${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data?.discussion?._id) {
          console.log("✅ Discussion ID:", res.data.discussion._id);
          setDiscussionId(res.data.discussion._id);
        }
      } catch (err: any) {
        console.error("❌ Error getting discussion:", err.response?.data || err.message);
      }
    };

    if (productId) {
      getDiscussion();
    }
  }, [productId]);

  // 📥 STEP 3 — Load existing messages
  useEffect(() => {
    if (!discussionId) return;

    const loadMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:4000/api/discussion/${discussionId}/messages`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("📨 Loaded messages:", res.data);
        setComments(res.data);
      } catch (err) {
        console.error("❌ Error loading messages:", err);
      }
    };

    loadMessages();
  }, [discussionId]);

  // 🔗 STEP 4 — Join discussion room
  useEffect(() => {
    if (!discussionId || !socketRef.current || !isConnected || hasJoinedRef.current) {
      return;
    }

    console.log("🔗 Joining discussion:", discussionId);
    socketRef.current.emit("joinDiscussion", discussionId);
    hasJoinedRef.current = true;
  }, [discussionId, isConnected]);

  // ✉️ STEP 5 — Send message
  const sendMessage = () => {
    if (!message.trim() || !discussionId || !socketRef.current || !isConnected) {
      console.warn("⚠️ Cannot send message:", {
        hasMessage: !!message.trim(),
        hasDiscussion: !!discussionId,
        hasSocket: !!socketRef.current,
        isConnected,
      });
      return;
    }

    console.log("📤 Sending message:", message);
    socketRef.current.emit("sendMessage", {
      discussionId,
      content: message,
    });

    setMessage("");
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">
          Comments <span className="text-sm font-normal text-gray-500">({comments.length})</span>
        </h3>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-gray-500">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="p-6 space-y-6 max-h-96 overflow-y-auto bg-gray-50">
        {comments.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((c : any) => (
            <div key={c._id} className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold shrink-0">
                {typeof c.sender === "object" && c.sender?.name
                  ? c.sender.name.charAt(0).toUpperCase()
                  : "U"}
                  
              </div>

              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <h4 className="text-sm font-semibold  text-gray-900">
                    {typeof c.sender === "object" ? c.sender?.name || "User" : "User"}
                    <span className="pl-2 text-xs text-gray-400 font-normal">{c.sender?.role}</span>
                  </h4>
                  <span className="text-xs text-gray-400">
                    {c.createdAt 
                      ? new Date(c.createdAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })
                      : ""}
                  </span>
                </div>
                <div className={c.sender?.name == user?.name as string ?"bg-blue-200 p-3 rounded-2xl border shadow-sm" :"bg-white p-3 rounded-2xl border shadow-sm"}>
                  <p className="text-sm text-gray-700">{c.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold shrink-0">
            U
          </div>

          <div className="relative flex-1">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={isConnected ? "Add a comment..." : "Connecting..."}
              className="w-full bg-gray-100 rounded-full py-2 px-5 pr-12 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={!isConnected}
            />

            <button
              onClick={sendMessage}
              disabled={!message.trim() || !isConnected}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;