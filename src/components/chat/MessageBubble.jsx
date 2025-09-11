import React, { useState } from "react";
import { motion } from "framer-motion";
import { MoreVertical, Download, Reply, Copy, Trash2 } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { formatTime } from "../../utils/formatters";
import { clsx } from "clsx";

export const MessageBubble = ({ message, isOwn, showAvatar }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content);
    setShowMenu(false);
  };

  const handleDeleteMessage = () => {
    setShowMenu(false);
  };

  const handleDownloadFile = () => {
    if (message.fileUrl) {
      window.open(message.fileUrl, "_blank");
    }
    setShowMenu(false);
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case "IMAGE":
        return (
          <div className="space-y-2">
            <img
              src={message.fileUrl}
              alt="Shared image"
              className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(message.fileUrl, "_blank")}
            />
            {message.content && <p className="text-sm">{message.content}</p>}
          </div>
        );

      case "FILE":
        return (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {message.fileName}
              </p>
              <p className="text-xs text-gray-500">
                {message.fileSize &&
                  `${(message.fileSize / 1024 / 1024).toFixed(2)} MB`}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownloadFile}
              className="flex-shrink-0"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        );

      default:
        return <p className="text-sm">{message.content}</p>;
    }
  };

  return (
    <div
      className={clsx(
        "flex space-x-2 mb-4",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      {!isOwn && showAvatar && (
        <Avatar
          src={message.sender?.avatar}
          alt={message.sender?.firstName}
          size="sm"
          fallbackText={message.sender?.firstName}
        />
      )}

      {!isOwn && !showAvatar && <div className="w-8" />}

      <div
        className={clsx(
          "relative max-w-xs lg:max-w-md group",
          isOwn ? "order-1" : "order-2"
        )}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={clsx(
            "px-4 py-2 rounded-2xl shadow-sm relative",
            isOwn
              ? "bg-primary-600 text-white rounded-br-sm"
              : "bg-white text-gray-900 rounded-bl-sm border border-gray-200"
          )}
        >
          {!isOwn && showAvatar && (
            <p className="text-xs font-medium text-primary-600 mb-1">
              {message.sender?.firstName} {message.sender?.lastName}
            </p>
          )}

          {renderMessageContent()}

          <div
            className={clsx(
              "flex items-center justify-between mt-1 text-xs",
              isOwn ? "text-primary-100" : "text-gray-500"
            )}
          >
            <span>{formatTime(message.createdAt)}</span>
            {isOwn && (
              <div className="flex items-center space-x-1 ml-2">
                {message.isRead ? (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Message menu */}
        <div
          className={clsx(
            "absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity",
            isOwn ? "-left-8" : "-right-8"
          )}
        >
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
              className="rounded-full w-6 h-6 p-0 bg-white shadow-md"
            >
              <MoreVertical className="w-3 h-3" />
            </Button>

            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={clsx(
                  "absolute top-8 z-10 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px]",
                  isOwn ? "right-0" : "left-0"
                )}
              >
                <button
                  onClick={handleCopyMessage}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </button>

                <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Reply className="w-4 h-4" />
                  <span>Reply</span>
                </button>

                {isOwn && (
                  <button
                    onClick={handleDeleteMessage}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
