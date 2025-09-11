import React from "react";
import { motion } from "framer-motion";
import { Avatar } from "../ui/Avatar";

export const TypingIndicator = ({ users }) => {
  if (!users || users.length === 0) return null;

  const displayText =
    users.length === 1
      ? `${users[0].username} is typing...`
      : `${users.length} people are typing...`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-lg border border-gray-200"
    >
      <div className="flex -space-x-1">
        {users.slice(0, 3).map((user) => (
          <Avatar
            key={user.userId}
            src={user.avatar}
            alt={user.username}
            size="xs"
            fallbackText={user.username}
            className="border-2 border-white"
          />
        ))}
      </div>

      <div className="flex items-center space-x-1">
        <span className="text-sm text-gray-600">{displayText}</span>
        <div className="flex space-x-1">
          <div className="w-1 h-1 bg-gray-400 rounded-full typing-dot" />
          <div className="w-1 h-1 bg-gray-400 rounded-full typing-dot" />
          <div className="w-1 h-1 bg-gray-400 rounded-full typing-dot" />
        </div>
      </div>
    </motion.div>
  );
};
