import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ChatList } from "../chat/ChatList";
import { ContactList } from "../contacts/ContactList";
import { MessageCircle, Users } from "lucide-react";
import { Button } from "../ui/Button";
import { clsx } from "clsx";

export const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("chats");
  const location = useLocation();

  React.useEffect(() => {
    if (location.pathname.startsWith("/chat")) {
      setActiveTab("chats");
    } else if (location.pathname === "/contacts") {
      setActiveTab("contacts");
    }
  }, [location.pathname]);

  const tabs = [
    { id: "chats", label: "Chats", icon: MessageCircle },
    { id: "contacts", label: "Contacts", icon: Users },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-colors relative",
                activeTab === tab.id
                  ? "text-primary-600 bg-primary-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>

              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {activeTab === "chats" && <ChatList />}
          {activeTab === "contacts" && <ContactList />}
        </motion.div>
      </div>
    </div>
  );
};
