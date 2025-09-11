import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { TypingIndicator } from "./TypingIndicator";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { useSocket } from "../../hooks/useSocket";
import {
  fetchMessages,
  markMessagesAsRead,
  addMessage,
} from "../../store/slices/messageSlice";
import { Phone, Video, MoreVertical } from "lucide-react";

export const ChatWindow = () => {
  const { chatId } = useParams();
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const [typingUsers, setTypingUsers] = useState([]);

  const { currentChat } = useSelector((state) => state.chat);
  const { messages, isLoading } = useSelector((state) => state.message);
  const { user } = useSelector((state) => state.auth);

  const socket = useSocket();

  useEffect(() => {
    if (chatId) {
      dispatch(fetchMessages(chatId));
      socket?.emit("joinChat", chatId);
      dispatch(markMessagesAsRead(chatId));
    }

    return () => {
      if (chatId) {
        socket?.emit("leaveChat", chatId);
      }
    };
  }, [chatId, dispatch, socket]);

  useEffect(() => {
    const handleNewMessage = (message) => {
      if (message.chatId === chatId) {
        dispatch(addMessage(message));
        dispatch(markMessagesAsRead(chatId));
      }
    };

    const handleUserTyping = ({ userId, username }) => {
      if (userId !== user?.id) {
        setTypingUsers((prev) => [
          ...prev.filter((u) => u.userId !== userId),
          { userId, username },
        ]);
      }
    };

    const handleUserStoppedTyping = ({ userId }) => {
      setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
    };

    if (socket) {
      socket.on("newMessage", handleNewMessage);
      socket.on("userTyping", handleUserTyping);
      socket.on("userStoppedTyping", handleUserStoppedTyping);
    }

    return () => {
      if (socket) {
        socket.off("newMessage", handleNewMessage);
        socket.off("userTyping", handleUserTyping);
        socket.off("userStoppedTyping", handleUserStoppedTyping);
      }
    };
  }, [socket, chatId, dispatch, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (content, type = "TEXT") => {
    if (!chatId || !content.trim()) return;

    const messageData = {
      content: content.trim(),
      type,
      chatId,
      receiverId: currentChat?.isGroup
        ? null
        : currentChat?.members?.find((m) => m.userId !== user?.id)?.userId,
    };

    socket?.emit("sendMessage", messageData);
  };

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
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white"
      >
        <div className="flex items-center space-x-3">
          <Avatar
            src={currentChat.avatar}
            alt={currentChat.name}
            size="md"
            isOnline={currentChat.isOnline}
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {currentChat.name}
            </h2>
            <p className="text-sm text-gray-500">
              {currentChat.isOnline
                ? "Online"
                : `Last seen ${currentChat.lastSeen}`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>

      <div className="flex-1 overflow-hidden relative">
        <MessageList
          messages={messages}
          isLoading={isLoading}
          currentUserId={user?.id}
        />

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

      <MessageInput
        onSendMessage={handleSendMessage}
        onTyping={() => socket?.emit("typing", { chatId })}
        onStopTyping={() => socket?.emit("stopTyping", { chatId })}
      />
    </div>
  );
};
