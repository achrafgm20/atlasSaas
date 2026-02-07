import { useEffect, useState, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:4000";

// Interface matching backend data structure
interface Notification {
  _id: string;
  title: string;
  body: string;
  type: "order" | "message";
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

type FilterType = "all" | "unread" | "read";

function NotificationIcon({ type }: { type: Notification["type"] }) {
  const iconClasses = {
    message: "bg-blue-100 text-blue-600",
    order: "bg-green-100 text-green-600",
  };

  const icons = {
    message: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    ),
    order: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  const typeClass = iconClasses[type];
  const icon = icons[type];

  return (
    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${typeClass}`}>
      {icon}
    </div>
  );
}

// Format date to relative time or date string
function formatDate(dateString: string): { time: string; date: string } {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let time: string;
  let dateStr: string;

  if (diffMins < 1) {
    time = "Just now";
  } else if (diffMins < 60) {
    time = `${diffMins} min ago`;
  } else if (diffHours < 24) {
    time = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else if (diffDays < 7) {
    time = `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  } else {
    time = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  if (diffDays === 0) {
    dateStr = "Today";
  } else if (diffDays === 1) {
    dateStr = "Yesterday";
  } else {
    dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  return { time, date: dateStr };
}

// Connection status indicator component
function ConnectionStatus({ isConnected }: { isConnected: boolean }) {
  return (
    <div className="flex items-center space-x-2">
      <div
        className={`h-2 w-2 rounded-full ${
          isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
        }`}
      />
      <span className="text-xs text-gray-500">
        {isConnected ? "Live updates" : "Offline"}
      </span>
    </div>
  );
}

// Toast notification component for real-time notifications
function NotificationToast({
  notification,
  onClose,
}: {
  notification: { title: string; body: string; type: string } | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
        <div className="flex items-start space-x-3">
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center ${
              notification.type === "message"
                ? "bg-blue-100 text-blue-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {notification.type === "message" ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
            <p className="text-sm text-gray-500 truncate">{notification.body}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [toastNotification, setToastNotification] = useState<{
    title: string;
    body: string;
    type: string;
  } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Socket ref to persist across renders
  const socketRef = useRef<Socket | null>(null);

  const token = localStorage.getItem("token");

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
      // Create a new notification object
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

      // Add to notifications list
      setNotifications((prev) => [newNotification, ...prev]);

      // Show toast
      setToastNotification({
        title: socketNotif.title,
        body: socketNotif.body,
        type: socketNotif.type,
      });
    },
    [userId]
  );

  // Initialize socket connection
  useEffect(() => {
    if (!token) {
      return;
    }

    // Create socket connection
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

    // Socket event handlers
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);

      // Join user room when connected
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

    // Cleanup on unmount
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
        console.log(data);
        setNotifications(data.notifications || []);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "read") return n.isRead;
    return true;
  });

  // Group notifications by date
  const groupedNotifications = filteredNotifications.reduce(
    (groups, notification) => {
      const { date } = formatDate(notification.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
      return groups;
    },
    {} as Record<string, Notification[]>
  );

  const markAsRead = async (id: string) => {
    setNotifications(notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
  };

  const markAsUnread = async (id: string) => {
    setNotifications(notifications.map((n) => (n._id === id ? { ...n, isRead: false } : n)));
  };

  const toggleSelect = (id: string) => {
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(selectedNotifications.filter((sid) => sid !== id));
    } else {
      setSelectedNotifications([...selectedNotifications, id]);
    }
  };

  const selectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n._id));
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification._id);
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  // New function to handle view details click
  const handleViewDetails = async (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the parent onClick
    
    try {
      const response = await fetch(
        `http://localhost:4000/api/notification/viewDetails/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notification details");
      }

      const data = await response.json();
      console.log("Notification details:", data);
      
      // Navigate to the product/order page based on the API response
      if (data.link) {
        window.location.href = data.link;
      } else if (data.productLink) {
        window.location.href = data.productLink;
      } else if (data.url) {
        window.location.href = data.url;
      } else if (data.productId) {
        window.location.href = `/dashboard/products?productId=${data.productId}`;
      } else if (data.orderId) {
        window.location.href = `/dashboard/orders?orderId=${data.orderId}`;
      } else {
        console.warn("No navigation link found in response");
      }
    } catch (err) {
      console.error("Error fetching notification details:", err);
      // Optionally show an error toast to the user
      setToastNotification({
        title: "Error",
        body: "Could not load notification details",
        type: "message",
      });
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const markSelectedAsRead = () => {
    setNotifications(
      notifications.map((n) =>
        selectedNotifications.includes(n._id) ? { ...n, isRead: true } : n
      )
    );
    setSelectedNotifications([]);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading notifications...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Notifications
          </h3>
          <p className="text-gray-500 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast for real-time notifications */}
      <NotificationToast
        notification={toastNotification}
        onClose={() => setToastNotification(null)}
      />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
              <ConnectionStatus isConnected={isConnected} />
            </div>
            <div className="flex items-center space-x-4">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Mark all as read
                </button>
              )}
              {selectedNotifications.length > 0 && (
                <button
                  onClick={markSelectedAsRead}
                  className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Mark selected as read ({selectedNotifications.length})
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex space-x-1">
              {(["all", "unread", "read"] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    filter === f
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  {f === "unread" && unreadCount > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
            {filteredNotifications.length > 0 && (
              <button
                onClick={selectAll}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {selectedNotifications.length === filteredNotifications.length &&
                filteredNotifications.length > 0
                  ? "Deselect all"
                  : "Select all"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notification List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">
              {filter === "unread"
                ? "You're all caught up! No unread notifications."
                : filter === "read"
                ? "No read notifications yet."
                : "When you get notifications, they'll show up here."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedNotifications).map(([date, notifs]) => (
              <div key={date}>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  {date}
                </h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden divide-y divide-gray-100">
                  {notifs.map((notification) => {
                    const { time } = formatDate(notification.createdAt);
                    return (
                      <div
                        key={notification._id}
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          !notification.isRead ? "bg-indigo-50/50" : ""
                        } ${
                          selectedNotifications.includes(notification._id)
                            ? "bg-blue-100/50"
                            : ""
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          {/* Checkbox */}
                          <div className="shrink-0 pt-1">
                            <input
                              type="checkbox"
                              checked={selectedNotifications.includes(notification._id)}
                              onChange={() => toggleSelect(notification._id)}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                            />
                          </div>

                          {/* Icon */}
                          <div className="shrink-0">
                            <NotificationIcon type={notification.type} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div
                              className="cursor-pointer"
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p
                                    className={`text-sm font-medium ${
                                      !notification.isRead ? "text-gray-900" : "text-gray-700"
                                    }`}
                                  >
                                    {notification.title}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                    {notification.body}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-2">{time}</p>
                                </div>

                                {/* Unread indicator */}
                                {!notification.isRead && (
                                  <div className="shrink-0 ml-4">
                                    <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-4 mt-3">
                              {notification.isRead ? (
                                <button
                                  onClick={() => markAsUnread(notification._id)}
                                  className="text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors"
                                >
                                  Mark as unread
                                </button>
                              ) : (
                                <button
                                  onClick={() => markAsRead(notification._id)}
                                  className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                  Mark as read
                                </button>
                              )}
                              <button
                                onClick={(e) => handleViewDetails(notification._id, e)}
                                className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                              >
                                View details →
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;