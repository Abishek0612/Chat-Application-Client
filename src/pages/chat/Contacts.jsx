import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  UserPlus,
  Users,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Avatar } from "../../components/ui/Avatar";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import {
  fetchContacts,
  addContact,
  createChat,
} from "../../store/slices/chatSlice";
import { userAPI } from "../../store/api/userApi";
import { useDebounce } from "../../hooks/useDebounce";
import toast from "react-hot-toast";

const Contacts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { contacts, isLoading } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("contacts");

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  useEffect(() => {
    if (debouncedSearch.trim()) {
      searchUsers(debouncedSearch);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearch]);

  const searchUsers = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await userAPI.searchUsers(query);
      setSearchResults(response.data.users || []);

      if (response.data.users && response.data.users.length > 0) {
        setActiveTab("search");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search users");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleStartChat = async (contactUser) => {
    try {
      const chatData = {
        name: null,
        isGroup: false,
        members: [contactUser.id],
      };

      const result = await dispatch(createChat(chatData)).unwrap();
      navigate(`/chat/${result.chat.id}`);
      toast.success("Chat started!");
    } catch (error) {
      toast.error("Failed to start chat");
    }
  };

  const handleAddContact = async (userId) => {
    try {
      await dispatch(addContact(userId)).unwrap();
      toast.success("Contact added!");
      dispatch(fetchContacts());
    } catch (error) {
      toast.error("Failed to add contact");
    }
  };

  const contactsToShow = activeTab === "contacts" ? contacts : searchResults;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/chat")}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">
            Start New Chat
          </h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search contacts or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <LoadingSpinner size="sm" />
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-gray-200">
        <button
          onClick={() => setActiveTab("contacts")}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === "contacts"
              ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Contacts ({contacts.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("search")}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === "search"
              ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Search Users ({searchResults.length})</span>
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="md" />
          </div>
        ) : (
          <div className="p-4">
            {contactsToShow.length === 0 ? (
              <div className="text-center py-8">
                {activeTab === "contacts" ? (
                  <div>
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-2">No contacts yet</p>
                    <p className="text-sm text-gray-400">
                      Search for users to start chatting
                    </p>
                  </div>
                ) : searchQuery.trim() ? (
                  isSearching ? (
                    <div>
                      <LoadingSpinner size="md" className="mx-auto mb-3" />
                      <p className="text-gray-500">Searching...</p>
                    </div>
                  ) : (
                    <div>
                      <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">
                        No users found for "{searchQuery}"
                      </p>
                      <p className="text-sm text-gray-400">
                        Try searching with a different username or email
                      </p>
                    </div>
                  )
                ) : (
                  <div>
                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Search for users</p>
                    <p className="text-sm text-gray-400">
                      Enter a username or email to find people
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {contactsToShow.map((contact, index) => (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar
                        src={contact.avatar}
                        alt={contact.firstName}
                        size="md"
                        fallbackText={contact.firstName}
                        showOnlineStatus
                        isOnline={contact.isOnline}
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {contact.firstName} {contact.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          @{contact.username}
                        </p>
                        {contact.bio && (
                          <p className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                            {contact.bio}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {activeTab === "search" &&
                        !contacts.find((c) => c.id === contact.id) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAddContact(contact.id)}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            <UserPlus className="h-4 w-4" />
                          </Button>
                        )}
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleStartChat(contact)}
                        className="flex items-center space-x-1"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>Chat</span>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            className="flex items-center justify-center space-x-2"
            onClick={() => {
              toast.info("Group chat feature coming soon!");
            }}
          >
            <Users className="h-4 w-4" />
            <span>New Group</span>
          </Button>
          <Button
            variant="secondary"
            className="flex items-center justify-center space-x-2"
            onClick={() => {
              toast.info("Add by contact feature coming soon!");
            }}
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Contact</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
