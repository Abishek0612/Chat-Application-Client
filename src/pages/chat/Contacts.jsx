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
import { formatTime } from "../../utils/formatters";
import toast from "react-hot-toast";

const Contacts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { contacts, isLoading } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [activeTab, setActiveTab] = useState("all-users");
  const [creatingChats, setCreatingChats] = useState(new Set());
  const [sendingRequests, setSendingRequests] = useState(new Set());

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchAllUsers = async () => {
      setIsLoadingUsers(true);
      try {
        console.log("Fetching all users...");
        const response = await userAPI.getUsers();
        console.log("Users API response:", response);

        const users = response.data?.data?.users || response.data?.users || [];
        console.log("Extracted users:", users);

        setAllUsers(users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error("Failed to load users");
        setAllUsers([]);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    const fetchUserContacts = async () => {
      try {
        await dispatch(fetchContacts()).unwrap();
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      }
    };

    fetchAllUsers();
    fetchUserContacts();
  }, [dispatch]);

  useEffect(() => {
    if (debouncedSearch.trim()) {
      setIsSearching(true);
      const filtered = allUsers.filter(
        (user) =>
          user.firstName
            ?.toLowerCase()
            .includes(debouncedSearch.toLowerCase()) ||
          user.lastName
            ?.toLowerCase()
            .includes(debouncedSearch.toLowerCase()) ||
          user.username
            ?.toLowerCase()
            .includes(debouncedSearch.toLowerCase()) ||
          user.email?.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
      setSearchResults(filtered);
      setIsSearching(false);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [debouncedSearch, allUsers]);

  const handleStartChat = async (contactUser) => {
    if (!contactUser || !contactUser.id) {
      console.error("Invalid contact user:", contactUser);
      toast.error("Invalid user selected");
      return;
    }

    if (creatingChats.has(contactUser.id)) {
      return;
    }

    setCreatingChats((prev) => new Set([...prev, contactUser.id]));

    try {
      console.log("Starting chat with user:", contactUser);

      const chatData = {
        isGroup: false,
        members: [contactUser.id],
      };

      const result = await dispatch(createChat(chatData)).unwrap();
      console.log("Chat creation result:", result);

      let chatId;

      if (result?.data?.chat?.id) {
        chatId = result.data.chat.id;
      } else if (result?.chat?.id) {
        chatId = result.chat.id;
      } else if (result?.id) {
        chatId = result.id;
      } else {
        console.error("Invalid response structure:", result);
        throw new Error("Invalid response from server");
      }

      navigate(`/chat/${chatId}`);
      toast.success("Chat started!");
    } catch (error) {
      console.error("Failed to start chat:", error);
      toast.error(error.message || "Failed to start chat");
    } finally {
      setCreatingChats((prev) => {
        const newSet = new Set(prev);
        newSet.delete(contactUser.id);
        return newSet;
      });
    }
  };

  const handleSendRequest = async (targetUser) => {
    if (!targetUser || !targetUser.id || sendingRequests.has(targetUser.id)) {
      return;
    }

    setSendingRequests((prev) => new Set([...prev, targetUser.id]));

    try {
      const response = await userAPI.sendFriendRequest(targetUser.id);
      console.log("Friend request sent:", response);
      toast.success(`Friend request sent to ${targetUser.firstName}`);

      setAllUsers((prev) =>
        prev.map((user) =>
          user.id === targetUser.id
            ? { ...user, friendRequestSent: true }
            : user
        )
      );
    } catch (error) {
      console.error("Failed to send friend request:", error);

      const errorMessage =
        error.response?.data?.message || "Failed to send friend request";
      toast.error(errorMessage);
    } finally {
      setSendingRequests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(targetUser.id);
        return newSet;
      });
    }
  };

  const isContact = (userId) => {
    return contacts.some((contact) => contact.id === userId);
  };

  const usersToShow =
    activeTab === "contacts"
      ? contacts
      : searchQuery.trim()
      ? searchResults
      : allUsers;

  const filteredUsers = usersToShow.filter(
    (contact) => contact?.id !== user?.id
  );

  return (
    <div className="flex flex-col h-full">
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
          <h1 className="text-xl font-semibold text-gray-900">Find People</h1>
        </div>
      </div>

      <div className="p-4 bg-white border-b border-gray-200">
        <Input
          type="text"
          placeholder="Search by name, username, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search />}
        />
        {isSearching && (
          <div className="mt-2 flex items-center justify-center">
            <LoadingSpinner size="sm" />
            <span className="ml-2 text-sm text-gray-500">Searching...</span>
          </div>
        )}
      </div>

      <div className="flex bg-white border-b border-gray-200">
        <button
          onClick={() => setActiveTab("all-users")}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === "all-users"
              ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Users className="h-4 w-4" />
            <span>All Users ({isLoadingUsers ? "..." : allUsers.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("contacts")}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === "contacts"
              ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <MessageCircle className="h-4 w-4" />
            <span>My Contacts ({contacts.length})</span>
          </div>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-white">
        {isLoadingUsers || isLoading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="md" />
            <span className="ml-2">Loading users...</span>
          </div>
        ) : (
          <div className="p-4">
            {filteredUsers.length === 0 ? (
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
                  <div>
                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      No users found for "{searchQuery}"
                    </p>
                    <p className="text-sm text-gray-400">
                      Try searching with a different username or email
                    </p>
                  </div>
                ) : (
                  <div>
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No other users found</p>
                    <p className="text-sm text-gray-400">
                      More users will appear here when they register
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredUsers.map((contact, index) => {
                  if (!contact || !contact.id) {
                    return null;
                  }

                  return (
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
                            {contact.firstName} {contact.lastName || ""}
                          </h3>
                          <p className="text-sm text-gray-500">
                            @{contact.username}
                          </p>
                          {contact.bio && (
                            <p className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                              {contact.bio}
                            </p>
                          )}
                          <p className="text-xs text-gray-400">
                            {contact.isOnline
                              ? "Online"
                              : contact.lastSeen
                              ? `Last seen ${formatTime(contact.lastSeen)}`
                              : "Offline"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {activeTab === "all-users" &&
                          !isContact(contact.id) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSendRequest(contact)}
                              disabled={sendingRequests.has(contact.id)}
                              className="text-primary-600 hover:text-primary-700"
                            >
                              {sendingRequests.has(contact.id) ? (
                                <LoadingSpinner size="sm" />
                              ) : (
                                <>
                                  <UserPlus className="h-4 w-4 mr-1" />
                                  Add
                                </>
                              )}
                            </Button>
                          )}

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleStartChat(contact)}
                          disabled={creatingChats.has(contact.id)}
                          className="flex items-center space-x-1"
                        >
                          {creatingChats.has(contact.id) ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <>
                              <MessageCircle className="h-4 w-4" />
                              <span>Chat</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            className="flex items-center justify-center space-x-2"
            onClick={() => {
              toast("Group chat feature coming soon!");
            }}
          >
            <Users className="h-4 w-4" />
            <span>New Group</span>
          </Button>
          <Button
            variant="secondary"
            className="flex items-center justify-center space-x-2"
            onClick={() => {
              toast("Add by contact feature coming soon!");
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
