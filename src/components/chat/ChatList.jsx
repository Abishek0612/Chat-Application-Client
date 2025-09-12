import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { ChatListSkeleton } from "../ui/Skeleton";
import { fetchChats, setCurrentChat } from "../../store/slices/chatSlice";
import { formatTime } from "../../utils/formatters";
import { clsx } from "clsx";
import { useDebounce } from "../../hooks/useDebounce";

export const ChatList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chatId } = useParams();

  const { chats, isLoading, error } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  const filteredChats = React.useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return chats || [];
    }

    return (chats || []).filter((chat) =>
      chat?.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [chats, debouncedSearchQuery]);

  const handleChatSelect = useCallback(
    (chat) => {
      try {
        dispatch(setCurrentChat(chat));
        navigate(`/chat/${chat.id}`);
        console.log("Selected chat:", chat.id);
      } catch (error) {
        console.error("Error selecting chat:", error);
      }
    },
    [dispatch, navigate]
  );

  const handleNewChat = useCallback(() => {
    navigate("/contacts");
  }, [navigate]);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <ChatListSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h1 className="text-xl font-semibold text-gray-900">Chats</h1>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-2">⚠️</div>
            <p className="text-gray-500 mb-4">Failed to load chats</p>
            <Button onClick={() => dispatch(fetchChats())}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Chats</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNewChat}
            className="rounded-full p-2 hover:bg-gray-100"
            title="Start new chat"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <Input
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={handleSearchChange}
          leftIcon={<Search />}
          className="w-full"
        />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            {searchQuery ? (
              <>
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No chats found
                </h3>
                <p className="text-gray-500 mb-4">
                  No chats match "{searchQuery}"
                </p>
                <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
              </>
            ) : (
              <>
                <div className="text-gray-400 text-6xl mb-4">💬</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No chats yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Start a conversation with someone
                </p>
                <Button onClick={handleNewChat}>Start New Chat</Button>
              </>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredChats.map((chat, index) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ backgroundColor: "#f9fafb" }}
                className={clsx(
                  "p-4 cursor-pointer transition-colors relative",
                  chatId === chat.id &&
                    "bg-primary-50 border-r-2 border-primary-500"
                )}
                onClick={() => handleChatSelect(chat)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar
                      src={chat.avatar}
                      alt={chat.name}
                      size="md"
                      isOnline={chat.isOnline}
                      fallbackText={chat.name}
                    />
                    {chat.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                        {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {chat.name}
                      </h3>
                      {chat.lastMessage && (
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {formatTime(chat.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <p
                        className={clsx(
                          "text-sm truncate",
                          chat.unreadCount > 0
                            ? "font-medium text-gray-900"
                            : "text-gray-600"
                        )}
                      >
                        {chat.lastMessage ? (
                          <>
                            {chat.lastMessage.senderId === user?.id && (
                              <span className="text-gray-400">You: </span>
                            )}
                            {chat.lastMessage.type === "IMAGE"
                              ? "📷 Photo"
                              : chat.lastMessage.type === "FILE"
                              ? "📎 File"
                              : chat.lastMessage.type === "VIDEO"
                              ? "🎥 Video"
                              : chat.lastMessage.type === "AUDIO"
                              ? "🎵 Audio"
                              : chat.lastMessage.content}
                          </>
                        ) : (
                          <span className="text-gray-400 italic">
                            No messages yet
                          </span>
                        )}
                      </p>

                      {chat.lastMessage?.senderId === user?.id &&
                        chat.lastMessage && (
                          <div className="flex-shrink-0 ml-2">
                            {chat.lastMessage.isRead ? (
                              <svg
                                className="w-4 h-4 text-blue-500"
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
                                className="w-4 h-4 text-gray-400"
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
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
