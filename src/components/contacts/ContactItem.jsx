import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Phone,
  Video,
  MoreVertical,
  UserMinus,
} from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { formatTime } from "../../utils/formatters";

export const ContactItem = ({ contact }) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleStartChat = () => {
    navigate(`/chat/new?userId=${contact.id}`);
  };

  const handleCall = () => {
    console.log("Calling:", contact.username);
  };

  const handleVideoCall = () => {
    console.log("Video calling:", contact.username);
  };

  const handleRemoveContact = () => {
    console.log("Removing contact:", contact.username);
    setShowMenu(false);
  };

  return (
    <motion.div
      whileHover={{ backgroundColor: "#f9fafb" }}
      className="p-4 cursor-pointer transition-colors relative group"
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Avatar
            src={contact.avatar}
            alt={contact.firstName}
            size="md"
            isOnline={contact.isOnline}
            fallbackText={contact.firstName}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {contact.firstName} {contact.lastName}
            </h3>
            <span className="text-xs text-gray-500">
              {contact.isOnline ? (
                <span className="text-green-600">Online</span>
              ) : (
                contact.lastSeen && `Last seen ${formatTime(contact.lastSeen)}`
              )}
            </span>
          </div>

          <p className="text-sm text-gray-600 truncate">@{contact.username}</p>

          {contact.bio && (
            <p className="text-xs text-gray-500 truncate mt-1">{contact.bio}</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleStartChat}
            className="rounded-full p-2"
            title="Start chat"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCall}
            className="rounded-full p-2"
            title="Call"
          >
            <Phone className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleVideoCall}
            className="rounded-full p-2"
            title="Video call"
          >
            <Video className="h-4 w-4" />
          </Button>

          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
              className="rounded-full p-2"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>

            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 top-8 z-10 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px]"
              >
                <button
                  onClick={handleRemoveContact}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <UserMinus className="w-4 h-4" />
                  <span>Remove</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
