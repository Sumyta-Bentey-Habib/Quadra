'use client'
import { useState } from "react";
import { 
  Heart, 
  MessageCircle, 
  UserPlus, 
  Share2, 
  Bell,
  Check,
  Trash2,
  Filter,
  X
} from "lucide-react";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "like",
      user: { name: "Sarah Johnson", avatar: "/api/placeholder/40/40", username: "@sarahj" },
      content: "liked your post",
      postPreview: "Just launched my new portfolio website! 🚀",
      time: "2m ago",
      read: false
    },
    {
      id: 2,
      type: "comment",
      user: { name: "Alex Rivera", avatar: "/api/placeholder/40/40", username: "@alexr" },
      content: "commented on your post",
      comment: "This looks amazing! Great work 👏",
      time: "15m ago",
      read: false
    },
    {
      id: 3,
      type: "follow",
      user: { name: "Maya Patel", avatar: "/api/placeholder/40/40", username: "@mayap" },
      content: "started following you",
      time: "1h ago",
      read: false
    },
    {
      id: 4,
      type: "share",
      user: { name: "James Chen", avatar: "/api/placeholder/40/40", username: "@jchen" },
      content: "shared your post",
      postPreview: "10 tips for better UI design",
      time: "2h ago",
      read: true
    },
    {
      id: 5,
      type: "like",
      user: { name: "Emma Wilson", avatar: "/api/placeholder/40/40", username: "@emmaw" },
      content: "liked your comment",
      time: "3h ago",
      read: true
    },
    {
      id: 6,
      type: "comment",
      user: { name: "David Kim", avatar: "/api/placeholder/40/40", username: "@davidk" },
      content: "replied to your comment",
      comment: "I completely agree with your point!",
      time: "5h ago",
      read: true
    },
    {
      id: 7,
      type: "follow",
      user: { name: "Lisa Anderson", avatar: "/api/placeholder/40/40", username: "@lisaa" },
      content: "started following you",
      time: "1d ago",
      read: true
    },
    {
      id: 8,
      type: "like",
      user: { name: "Mike Brown", avatar: "/api/placeholder/40/40", username: "@mikeb" },
      content: "and 12 others liked your post",
      postPreview: "Behind the scenes of our latest project",
      time: "2d ago",
      read: true
    }
  ]);

  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart className="h-5 w-5" />;
      case "comment":
        return <MessageCircle className="h-5 w-5" />;
      case "follow":
        return <UserPlus className="h-5 w-5" />;
      case "share":
        return <Share2 className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case "like":
        return "bg-red-100 text-red-600";
      case "comment":
        return "bg-blue-100 text-blue-600";
      case "follow":
        return "bg-green-100 text-green-600";
      case "share":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread") return !n.read;
    if (filter === "all") return true;
    return n.type === filter;
  });

  const getInitials = (name) => {
    return name.split(" ").map(n => n[0]).join("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-600">
                    {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Check className="h-4 w-4" />
                Mark all read
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              { label: "All", value: "all" },
              { label: "Unread", value: "unread" },
              { label: "Likes", value: "like" },
              { label: "Comments", value: "comment" },
              { label: "Follows", value: "follow" },
              { label: "Shares", value: "share" }
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  filter === item.value
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Bell className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">
              {filter === "unread" 
                ? "You're all caught up!" 
                : "You don't have any notifications yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`group bg-white rounded-xl border transition-all duration-200 hover:shadow-md ${
                  notification.read
                    ? "border-gray-200"
                    : "border-blue-200 bg-blue-50/30"
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getIconColor(notification.type)}`}>
                      {getIcon(notification.type)}
                    </div>

                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white">
                        <img
                          src={notification.user.avatar}
                          alt={notification.user.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="hidden absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 items-center justify-center text-white text-sm font-medium">
                          {getInitials(notification.user.name)}
                        </div>
                      </div>
                      {!notification.read && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-semibold hover:underline cursor-pointer">
                          {notification.user.name}
                        </span>{" "}
                        <span className="text-gray-600">{notification.content}</span>
                      </p>

                      {notification.postPreview && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {notification.postPreview}
                          </p>
                        </div>
                      )}

                      {notification.comment && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-700 italic">
                            &quot;{notification.comment}&quot;
                          </p>
                        </div>
                      )}

                      <p className="mt-2 text-xs text-gray-500">{notification.time}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;