import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, Users, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "../../components/ui/Button";

const ChatDashboard = () => {
  const navigate = useNavigate();
  const { chats } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex flex-col h-full">
      {/* Welcome Message */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-12 h-12 text-primary-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Welcome to Chat App, {user?.firstName}!
          </h2>

          <p className="text-gray-600 mb-8">
            {chats.length === 0
              ? "You don't have any conversations yet. Start chatting with your friends and family!"
              : "Select a chat from the sidebar or start a new conversation."}
          </p>

          <div className="space-y-3">
            <Button
              onClick={() => navigate("/contacts")}
              className="w-full flex items-center justify-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Start New Chat</span>
            </Button>

            <Button
              variant="secondary"
              onClick={() => {
                navigate("/contacts");
              }}
              className="w-full flex items-center justify-center space-x-2"
            >
              <Users className="h-4 w-4" />
              <span>Create Group</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatDashboard;
