import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:4000";

interface Notification {
  _id: string;
  title: string;
  body: string;
  type: "order" | "message" ;
  isRead: boolean;
  link: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

interface SocketNotification {
  type: "message" | "order";
  title: string;
  body: string;
  discussionId?: string;
}

// Format date to relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) {
    return "Just now";
  } else if (diffMins < 60) {
    return `${diffMins} min ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
}

function NotificationIcon({ type }: { type: Notification["type"] }) {
  switch (type) {
    case "message":
      return (
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      );
    case "order":
      return (
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    default:
      return (
        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Socket ref to persist across renders
  const socketRef = useRef<Socket | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const token = localStorage.getItem("token");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Parse user ID from JWT token
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.id || payload.userId || payload._id);
      } catch (e) {
        console.error("Failed to parse token:", e);
      }
    }
  }, [token]);

  // Handle real-time notifications
  const handleRealtimeNotification = useCallback(
    (socketNotif: SocketNotification) => {
      const newNotification: Notification = {
        _id: `temp-${Date.now()}`,
        title: socketNotif.title,
        body: socketNotif.body,
        type: socketNotif.type,
        isRead: false,
        link: socketNotif.discussionId ? `/seller/discussion/${socketNotif.discussionId}` : "",
        user: userId || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setNotifications((prev) => [newNotification, ...prev]);
    },
    [userId]
  );

  // Initialize socket connection
  useEffect(() => {
    if (!token) {
      return;
    }

    const socket = io(SOCKET_URL, {
      auth: {
        token: token,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);

      if (userId) {
        socket.emit("joinUserRoom", userId);
        console.log("Joined user room:", userId);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      setIsConnected(false);
    });

    socket.on("notification", (notification: SocketNotification) => {
      console.log("Received notification:", notification);
      handleRealtimeNotification(notification);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, userId, handleRealtimeNotification]);

  // Join user room when userId changes and socket is connected
  useEffect(() => {
    if (socketRef.current?.connected && userId) {
      socketRef.current.emit("joinUserRoom", userId);
      console.log("Joined user room:", userId);
    }
  }, [userId]);

  // Fetch notifications from backend
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:4000/api/notification/getSellerNotifications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await response.json();
        setNotifications(data.notifications || []);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n._id !== id));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification._id);
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-indigo-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
        aria-label="Notifications"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-20 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-linear-to-r from-blue-600 to-blue-400 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
              {/* Connection indicator */}
              <div
                className={`h-2 w-2 rounded-full ${
                  isConnected ? "bg-green-300 animate-pulse" : "bg-red-300"
                }`}
                title={isConnected ? "Connected - Live updates" : "Disconnected"}
              />
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-indigo-100 hover:text-white transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="py-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                <p className="mt-2 text-gray-500 text-sm">Loading...</p>
              </div>
            ) : error ? (
              <div className="py-12 text-center">
                <svg className="w-12 h-12 text-red-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-gray-500 text-sm">{error}</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-12 text-center">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p className="text-gray-500">No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.isRead ? "bg-indigo-50/50" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="shrink-0 mt-0.5">
                      <NotificationIcon type={notification.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${!notification.isRead ? "text-gray-900" : "text-gray-600"}`}>
                          {notification.title}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification._id);
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{notification.body}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(notification.createdAt)}</p>
                    </div>
                    {!notification.isRead && (
                      <div className="shrink-0">
                        <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 bg-gray-50 text-center border-t border-gray-100">
              <Link to="/dashboard/Notifications" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationDropdown;
