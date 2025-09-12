import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, MessageCircle, UserPlus } from "lucide-react";
import { Button } from "../ui/Button";
import { Avatar } from "../ui/Avatar";
import { useSocket } from "../../hooks/useSocket";
import { formatTime } from "../../utils/formatters";
import toast from "react-hot-toast";

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const socket = useSocket();

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log("Could not play notification sound:", error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleNewMessageNotification = (data) => {
      const notification = {
        id: Date.now(),
        type: "message",
        title: `New message from ${data.sender.firstName}`,
        message: data.content,
        user: data.sender,
        timestamp: new Date(),
        read: false,
      };

      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      playNotificationSound();

      toast(notification.title, {
        duration: 4000,
      });
    };

    const handleFriendRequest = (data) => {
      const notification = {
        id: Date.now(),
        type: "friend_request",
        title: `Friend request from ${data.sender.firstName}`,
        message: "Wants to connect with you",
        user: data.sender,
        timestamp: new Date(),
        read: false,
      };

      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      playNotificationSound();

      toast(notification.title, {
        duration: 4000,
      });
    };

    socket.on("newMessageNotification", handleNewMessageNotification);
    socket.on("friendRequest", handleFriendRequest);

    return () => {
      socket.off("newMessageNotification", handleNewMessageNotification);
      socket.off("friendRequest", handleFriendRequest);
    };
  }, [socket]);

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const clearNotification = (notificationId) => {
    setNotifications((prev) =>
      prev.filter((notif) => notif.id !== notificationId)
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllNotifications}
                    className="text-xs"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar
                        src={notification.user.avatar}
                        alt={notification.user.firstName}
                        size="sm"
                        fallbackText={notification.user.firstName}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatTime(notification.timestamp)}
                            </p>
                          </div>

                          <div className="flex items-center space-x-2">
                            {notification.type === "message" && (
                              <MessageCircle className="h-4 w-4 text-blue-500" />
                            )}
                            {notification.type === "friend_request" && (
                              <UserPlus className="h-4 w-4 text-green-500" />
                            )}

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                clearNotification(notification.id);
                              }}
                              className="p-1"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};
