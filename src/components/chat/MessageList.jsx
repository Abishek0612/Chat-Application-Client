import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageBubble } from "./MessageBubble";
import { MessageSkeleton } from "../ui/Skeleton";
import { formatDate } from "../../utils/formatters";

export const MessageList = ({ messages, isLoading, currentUserId }) => {
  const listRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const groupMessagesByDate = (messages) => {
    const groups = {};
    if (!Array.isArray(messages)) return groups;

    messages.forEach((message) => {
      if (message && message.createdAt) {
        const date = new Date(message.createdAt).toDateString();
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(message);
      }
    });
    return groups;
  };

  if (isLoading) {
    return <MessageSkeleton />;
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-3">💬</div>
          <p className="text-gray-500">No messages yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Start the conversation with a message
          </p>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div
      ref={listRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin"
    >
      <AnimatePresence initial={false}>
        {Object.entries(messageGroups).map(([date, dayMessages]) => (
          <div key={date}>
            <div className="flex justify-center mb-4">
              <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                {formatDate(date, { dateOnly: true })}
              </span>
            </div>

            {dayMessages.map((message, index) => {
              if (!message || !message.id) {
                return null;
              }

              const isOwn = message.senderId === currentUserId;

              const showAvatar =
                index === 0 ||
                dayMessages[index - 1]?.senderId !== message.senderId ||
                new Date(message.createdAt) -
                  new Date(dayMessages[index - 1]?.createdAt) >
                  5 * 60 * 1000;

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    ease: "easeOut",
                  }}
                >
                  <MessageBubble
                    message={message}
                    isOwn={isOwn}
                    showAvatar={showAvatar}
                    currentUserId={currentUserId}
                  />
                </motion.div>
              );
            })}
          </div>
        ))}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
};
