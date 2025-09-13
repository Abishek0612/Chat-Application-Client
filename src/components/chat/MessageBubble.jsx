import React, { useState } from "react";
import { motion } from "framer-motion";
import { MoreVertical, Download, Reply, Copy, Trash2 } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { formatTime } from "../../utils/formatters";
import { clsx } from "clsx";

export const MessageBubble = ({
  message,
  isOwn,
  showAvatar,
  currentUserId,
  highlighted,
  searchQuery,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  if (!message || !message.id) {
    console.warn("Invalid message in MessageBubble:", message);
    return null;
  }

  const messageIsOwn = message.senderId === currentUserId;

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
              onError={(e) => {
                console.error("Failed to load image:", message.fileUrl);
                e.target.style.display = "none";
              }}
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
                {message.fileName || "Unknown file"}
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

      case "VIDEO":
        return (
          <div className="space-y-2">
            <video
              src={message.fileUrl}
              controls
              className="max-w-xs rounded-lg"
              onError={(e) => {
                console.error("Failed to load video:", message.fileUrl);
              }}
            >
              Your browser does not support the video tag.
            </video>
            {message.content && <p className="text-sm">{message.content}</p>}
          </div>
        );

      case "AUDIO":
        return (
          <div className="space-y-2">
            <audio
              src={message.fileUrl}
              controls
              className="max-w-xs"
              onError={(e) => {
                console.error("Failed to load audio:", message.fileUrl);
              }}
            >
              Your browser does not support the audio tag.
            </audio>
            {message.content && <p className="text-sm">{message.content}</p>}
          </div>
        );

      default:
        if (searchQuery && message.content && message.type === "TEXT") {
          const parts = message.content.split(
            new RegExp(`(${searchQuery})`, "gi")
          );
          return (
            <p className="text-sm break-words whitespace-pre-wrap">
              {parts.map((part, i) =>
                part.toLowerCase() === searchQuery.toLowerCase() ? (
                  <mark
                    key={i}
                    className="bg-yellow-300 text-black rounded px-0.5"
                  >
                    {part}
                  </mark>
                ) : (
                  part
                )
              )}
            </p>
          );
        }
        return (
          <p className="text-sm break-words whitespace-pre-wrap">
            {message.content}
          </p>
        );
    }
  };

  return (
    <div
      className={clsx(
        "flex space-x-2 mb-4",
        messageIsOwn ? "justify-end" : "justify-start"
      )}
    >
      {!messageIsOwn && showAvatar && (
        <Avatar
          src={message.sender?.avatar}
          alt={message.sender?.firstName || "User"}
          size="sm"
          fallbackText={message.sender?.firstName?.charAt(0) || "U"}
        />
      )}

      {!messageIsOwn && !showAvatar && <div className="w-8" />}

      <div
        className={clsx(
          "relative max-w-xs lg:max-w-md group",
          messageIsOwn ? "mr-2" : "ml-2"
        )}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className={clsx(
            "px-4 py-2 rounded-2xl shadow-sm relative transition-colors duration-300",
            messageIsOwn
              ? "bg-blue-600 text-white ml-auto"
              : "bg-gray-100 text-gray-900 border border-gray-200",
            highlighted && (messageIsOwn ? "bg-blue-800" : "bg-yellow-200")
          )}
          style={{
            borderBottomRightRadius: messageIsOwn ? "4px" : "16px",
            borderBottomLeftRadius: messageIsOwn ? "16px" : "4px",
          }}
        >
          {!messageIsOwn && showAvatar && message.sender && (
            <p className="text-xs font-medium text-blue-600 mb-1">
              {message.sender.firstName} {message.sender.lastName || ""}
            </p>
          )}

          {renderMessageContent()}

          <div
            className={clsx(
              "flex items-center justify-end mt-1 text-xs",
              messageIsOwn ? "text-blue-100" : "text-gray-500"
            )}
          >
            <span>{formatTime(message.createdAt)}</span>

            {messageIsOwn && (
              <div className="flex items-center space-x-1 ml-2">
                {message.isRead ? (
                  <svg
                    className="w-4 h-4 text-blue-200"
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
                    className="w-4 h-4 text-blue-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            )}
          </div>
        </motion.div>

        <div
          className={clsx(
            "absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity",
            messageIsOwn ? "-left-8" : "-right-8"
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
                  messageIsOwn ? "right-0" : "left-0"
                )}
                onBlur={() => setShowMenu(false)}
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

                {messageIsOwn && (
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

      {messageIsOwn && showAvatar && (
        <Avatar
          src={message.sender?.avatar}
          alt={message.sender?.firstName || "You"}
          size="sm"
          fallbackText={message.sender?.firstName?.charAt(0) || "Y"}
        />
      )}
    </div>
  );
};
