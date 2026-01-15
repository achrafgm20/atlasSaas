import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";

// ⚠️ Create socket ONCE (outside component)
let socket: Socket;

interface Message {
  _id: string;
  sender: { name?: string } | string;
  content: string;
  createdAt?: string;
}

interface ChatAppProps {
  productId: string;
}

const ChatApp = ({ productId }: ChatAppProps) => {
  const [comments, setComments] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [discussionId, setDiscussionId] = useState<string | null>(null);
  const hasJoinedRef = useRef(false);

  // 🧠 STEP 1 — Create / get discussion
  useEffect(() => {
    const getDiscussion = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `/api/discussion/getCreatedDiscusion/${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data?.discussion?._id) {
          setDiscussionId(res.data.discussion._id);
        }
      } catch (err: any) {
        console.error("❌ Error getting discussion:", err.response?.data || err.message);
      }
    };

    if (productId) getDiscussion();
  }, [productId]);

  // 📥 STEP 2 — Load messages
  useEffect(() => {
    if (!discussionId) return;

    const loadMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/discussion/${discussionId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setComments(res.data);
      } catch (err) {
        console.error("❌ Error loading messages:", err);
      }
    };

    loadMessages();
  }, [discussionId]);

  // 🔌 STEP 3 — Init socket once
  useEffect(() => {
    if (!socket) {
      socket = io("http://localhost:5000", {
        auth: { token: localStorage.getItem("token") },
      });
    }

    socket.on("receiveMessage", (newMessage: Message) => {
      setComments((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  // 🔗 STEP 4 — Join discussion room
  useEffect(() => {
    if (!discussionId || !socket || hasJoinedRef.current) return;

    socket.emit("joinDiscussion", discussionId);
    hasJoinedRef.current = true;
  }, [discussionId]);

  // ✉️ STEP 5 — Send message
  const sendMessage = () => {
    if (!message.trim() || !discussionId || !socket) return;

    socket.emit("sendMessage", {
      discussionId,
      content: message,
    });

    setMessage("");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-gray-50">
        <h3 className="text-lg font-bold text-gray-800">
          Comments <span className="text-sm font-normal text-gray-500">({comments.length})</span>
        </h3>
      </div>

      {/* Messages */}
      <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
        {comments.map((c) => (
          <div key={c._id} className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
              {typeof c.sender === "object" && c.sender?.name
                ? c.sender.name.charAt(0)
                : "U"}
            </div>

            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <h4 className="text-sm font-semibold text-gray-900">
                  {typeof c.sender === "object" ? c.sender?.name || "User" : "User"}
                </h4>
                <span className="text-xs text-gray-400">
                  {c.createdAt ? new Date(c.createdAt).toLocaleTimeString() : ""}
                </span>
              </div>
              <div className="bg-gray-50 p-3 rounded-2xl border">
                <p className="text-sm text-gray-700">{c.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-200" />

          <div className="relative flex-1">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a comment..."
              className="w-full bg-gray-100 rounded-full py-2 px-5 pr-12 text-sm focus:ring-2 focus:ring-indigo-500"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button
              onClick={sendMessage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-full"
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