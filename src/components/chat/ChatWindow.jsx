import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { TypingIndicator } from "./TypingIndicator";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { useSocket } from "../../hooks/useSocket";
import {
  fetchMessages,
  markMessagesAsRead,
  addMessage,
  clearMessages,
} from "../../store/slices/messageSlice";
import {
  fetchChatById,
  setCurrentChat,
  clearCurrentChat,
} from "../../store/slices/chatSlice";
import { Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export const ChatWindow = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const [typingUsers, setTypingUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  const { currentChat } = useSelector((state) => state.chat);
  const { messages, isLoading: messagesLoading } = useSelector(
    (state) => state.message
  );
  const { user } = useSelector((state) => state.auth);

  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      const handleConnect = () => {
        console.log("Socket connected");
        setSocketConnected(true);
        setError(null);
      };

      const handleDisconnect = () => {
        console.log("Socket disconnected");
        setSocketConnected(false);
      };

      const handleConnectError = (error) => {
        console.error("Socket connection error:", error);
        setError("Connection failed. Please refresh the page.");
        setSocketConnected(false);
      };

      if (socket && typeof socket.on === "function") {
        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("connect_error", handleConnectError);

        if (socket.connected) {
          setSocketConnected(true);
        }
      }

      return () => {
        if (socket && typeof socket.off === "function") {
          socket.off("connect", handleConnect);
          socket.off("disconnect", handleDisconnect);
          socket.off("connect_error", handleConnectError);
        }
      };
    }
  }, [socket]);

  useEffect(() => {
    const loadChatData = async () => {
      if (!chatId) {
        dispatch(clearCurrentChat());
        dispatch(clearMessages());
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        dispatch(clearMessages());

        const [chatResult, messagesResult] = await Promise.all([
          dispatch(fetchChatById(chatId)).unwrap(),
          dispatch(fetchMessages({ chatId })).unwrap(),
        ]);

        if (socket && socketConnected && typeof socket.emit === "function") {
          socket.emit("joinChat", chatId);
          console.log(`Joined chat room: ${chatId}`);
        }

        dispatch(markMessagesAsRead(chatId));
      } catch (error) {
        console.error("Failed to load chat:", error);
        setError(error.message || "Failed to load chat");
        toast.error("Failed to load chat");
      } finally {
        setIsLoading(false);
      }
    };

    loadChatData();

    return () => {
      if (socket && chatId && typeof socket.emit === "function") {
        socket.emit("leaveChat", chatId);
        console.log(`Left chat room: ${chatId}`);
      }
    };
  }, [chatId, dispatch, socket, socketConnected]);

  useEffect(() => {
    if (!socket || !chatId || typeof socket.on !== "function") return;

    const handleNewMessage = (message) => {
      console.log("New message received:", message);
      if (message.chatId === chatId) {
        dispatch(addMessage(message));

        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);

        if (message.senderId !== user?.id) {
          dispatch(markMessagesAsRead(chatId));
        }
      }
    };

    const handleUserTyping = ({ userId, username, firstName }) => {
      if (userId !== user?.id) {
        setTypingUsers((prev) => {
          const exists = prev.find((u) => u.userId === userId);
          if (!exists) {
            return [...prev, { userId, username, firstName }];
          }
          return prev;
        });

        setTimeout(() => {
          setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
        }, 3000);
      }
    };

    const handleUserStoppedTyping = ({ userId }) => {
      setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
    };

    const handleMessageRead = ({ messageId, userId }) => {
      console.log("Message read:", messageId, "by user:", userId);
    };

    const handleError = (error) => {
      console.error("Socket error:", error);
      toast.error("Connection error occurred");
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("userTyping", handleUserTyping);
    socket.on("userStoppedTyping", handleUserStoppedTyping);
    socket.on("messageRead", handleMessageRead);
    socket.on("error", handleError);

    return () => {
      if (typeof socket.off === "function") {
        socket.off("newMessage", handleNewMessage);
        socket.off("userTyping", handleUserTyping);
        socket.off("userStoppedTyping", handleUserStoppedTyping);
        socket.off("messageRead", handleMessageRead);
        socket.off("error", handleError);
      }
    };
  }, [socket, chatId, dispatch, user?.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    return () => clearTimeout(timer);
  }, [messages]);

  const handleSendMessage = useCallback(
    (content, type = "TEXT") => {
      if (
        !chatId ||
        !content.trim() ||
        !socket ||
        !socketConnected ||
        typeof socket.emit !== "function"
      ) {
        if (!socketConnected) {
          toast.error("Not connected to server. Please refresh the page.");
        }
        return;
      }

      const messageData = {
        content: content.trim(),
        type,
        chatId,
        receiverId: currentChat?.isGroup
          ? null
          : currentChat?.members?.find((m) => m.userId !== user?.id)?.userId,
      };

      console.log("Sending message:", messageData);
      socket.emit("sendMessage", messageData);
    },
    [chatId, socket, socketConnected, currentChat, user?.id]
  );

  const handleTyping = useCallback(() => {
    if (
      socket &&
      socketConnected &&
      chatId &&
      typeof socket.emit === "function"
    ) {
      socket.emit("typing", { chatId });
    }
  }, [socket, socketConnected, chatId]);

  const handleStopTyping = useCallback(() => {
    if (
      socket &&
      socketConnected &&
      chatId &&
      typeof socket.emit === "function"
    ) {
      socket.emit("stopTyping", { chatId });
    }
  }, [socket, socketConnected, chatId]);

  if (isLoading || messagesLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-500">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </div>
      </div>
    );
  }

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">💬</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Select a conversation
          </h3>
          <p className="text-gray-500">
            Choose from your existing conversations or start a new one
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white shadow-sm"
      >
        <div className="flex items-center space-x-3">
          {/* Back button for mobile */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/chat")}
            className="md:hidden rounded-full p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <Avatar
            src={currentChat.avatar}
            alt={currentChat.name}
            size="md"
            isOnline={currentChat.isOnline}
            fallbackText={currentChat.name}
          />

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {currentChat.name}
            </h2>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-500">
                {currentChat.isOnline
                  ? "Online"
                  : currentChat.lastSeen && `Last seen ${currentChat.lastSeen}`}
              </p>
              {!socketConnected && (
                <span className="text-xs text-red-500">• Disconnected</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toast.info("Voice call feature coming soon!")}
            className="rounded-full p-2"
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toast.info("Video call feature coming soon!")}
            className="rounded-full p-2"
          >
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full p-2">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden relative">
        <MessageList
          messages={messages}
          isLoading={false}
          currentUserId={user?.id}
        />

        {/* Typing Indicator */}
        <AnimatePresence>
          {typingUsers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 left-6"
            >
              <TypingIndicator users={typingUsers} />
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
        onStopTyping={handleStopTyping}
        disabled={!socketConnected}
      />

      {/* Connection Status Banner */}
      {!socketConnected && (
        <div className="bg-red-100 border-t border-red-200 px-4 py-2">
          <p className="text-sm text-red-600 text-center">
            Connection lost. Trying to reconnect...
          </p>
        </div>
      )}
    </div>
  );
};
