import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Menu,
  Settings,
  User,
  LogOut,
  MessageCircle,
  Users,
  X,
} from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { NotificationCenter } from "../notifications/NotificationCenter";
import { logoutUser } from "../../store/slices/authSlice";
import toast from "react-hot-toast";

export const Header = ({ onToggleSidebar, isSidebarOpen }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
    setShowProfileMenu(false);
  };

  const getPageTitle = () => {
    if (location.pathname.startsWith("/chat")) return "Messages";
    if (location.pathname === "/profile") return "Profile";
    if (location.pathname === "/settings") return "Settings";
    if (location.pathname === "/contacts") return "Contacts";
    return "Chat App";
  };

  const handleToggleSidebar = () => {
    onToggleSidebar?.();
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 py-3 relative z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={handleToggleSidebar}
            >
              {isSidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-semibold text-gray-900">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-1">
              <Button
                variant={
                  location.pathname.startsWith("/chat") ? "primary" : "ghost"
                }
                size="sm"
                onClick={() => navigate("/chat")}
                className="px-3"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chats
              </Button>

              <Button
                variant={
                  location.pathname === "/contacts" ? "primary" : "ghost"
                }
                size="sm"
                onClick={() => navigate("/contacts")}
                className="px-3"
              >
                <Users className="h-4 w-4 mr-2" />
                Contacts
              </Button>
            </div>

            <NotificationCenter />

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Avatar
                  src={user?.avatar}
                  alt={user?.firstName}
                  size="sm"
                  fallbackText={user?.firstName}
                />
              </button>

              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowProfileMenu(false);
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate("/settings");
                        setShowProfileMenu(false);
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>

                    <hr className="my-1" />

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </button>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
