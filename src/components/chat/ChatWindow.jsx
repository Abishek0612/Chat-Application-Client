import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { TypingIndicator } from "./TypingIndicator";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { useSocket } from "../../hooks/useSocket";
import { useDebounce } from "../../hooks/useDebounce";
import {
  fetchMessages,
  markMessagesAsRead,
  addMessage,
  clearMessages,
  markChatMessagesAsRead,
  setCurrentChatId,
} from "../../store/slices/messageSlice";
import {
  fetchChatById,
  setCurrentChat,
  clearCurrentChat,
  updateChatLastMessage,
  fetchChats,
} from "../../store/slices/chatSlice";
import {
  Phone,
  Video,
  MoreVertical,
  ArrowLeft,
  Search,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatTime } from "../../utils/formatters";

export const ChatWindow = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const messageRefs = useRef(new Map());

  const [typingUsers, setTypingUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(-1);

  const { currentChat } = useSelector((state) => state.chat);
  const { messages, isLoading: messagesLoading } = useSelector(
    (state) => state.message
  );
  const { user } = useSelector((state) => state.auth);

  const socket = useSocket();
  const socketConnected = socket?.isConnected || false;
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (debouncedSearchQuery && isSearchVisible) {
      const results = messages.filter((msg) =>
        msg.content?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
      setSearchResults(
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
      setCurrentResultIndex(results.length > 0 ? 0 : -1);
    } else {
      setSearchResults([]);
      setCurrentResultIndex(-1);
    }
  }, [debouncedSearchQuery, messages, isSearchVisible]);

  useEffect(() => {
    if (currentResultIndex !== -1 && searchResults[currentResultIndex]) {
      const messageId = searchResults[currentResultIndex].id;
      const element = messageRefs.current.get(messageId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentResultIndex, searchResults]);

  useEffect(() => {
    const loadChatData = async () => {
      if (!chatId) {
        dispatch(clearCurrentChat());
        dispatch(clearMessages());
        setIsInitialLoad(false);
        return;
      }

      try {
        setError(null);
        setIsInitialLoad(true);

        dispatch(setCurrentChatId(chatId));

        const [chatResult, messagesResult] = await Promise.allSettled([
          dispatch(fetchChatById(chatId)).unwrap(),
          dispatch(fetchMessages({ chatId })).unwrap(),
        ]);

        if (chatResult.status === "fulfilled") {
          setTimeout(() => {
            dispatch(markMessagesAsRead(chatId));
          }, 500);
        } else {
          console.error("Failed to load chat:", chatResult.reason);
          setError(chatResult.reason || "Failed to load chat");
        }

        if (messagesResult.status === "rejected") {
          console.error("Failed to load messages:", messagesResult.reason);
          if (chatResult.status === "rejected") {
            setError("Failed to load chat data");
          }
        }

        dispatch(fetchChats());
      } catch (error) {
        console.error("Failed to load chat data:", error);
        setError(error.message || "Failed to load chat");
      } finally {
        setIsInitialLoad(false);
      }
    };

    loadChatData();
  }, [chatId, dispatch]);

  useEffect(() => {
    if (!socket || !chatId) return;

    const joinChat = () => {
      if (socket.isConnected && typeof socket.emit === "function") {
        socket.emit("joinChat", chatId);
        console.log(`Joined chat room: ${chatId}`);
      }
    };

    if (socket.isConnected) {
      joinChat();
    } else {
      socket.on("connect", joinChat);
    }

    return () => {
      if (socket && typeof socket.off === "function") {
        socket.off("connect", joinChat);
        if (socket.isConnected && typeof socket.emit === "function") {
          socket.emit("leaveChat", chatId);
          console.log(`Left chat room: ${chatId}`);
        }
      }
    };
  }, [socket, chatId]);

  useEffect(() => {
    if (!socket || !chatId) return;

    const handleNewMessage = (message) => {
      console.log("New message received:", message);

      if (message.chatId === chatId) {
        dispatch(addMessage(message));
        dispatch(updateChatLastMessage({ chatId, message }));

        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);

        if (message.senderId !== user?.id) {
          setTimeout(() => {
            dispatch(
              markChatMessagesAsRead({ chatId, currentUserId: user?.id })
            );
          }, 1000);
        }

        dispatch(fetchChats());
      }
    };

    const handleUserTyping = ({ userId, username, firstName }) => {
      if (userId !== user?.id) {
        setTypingUsers((prev) => {
          const exists = prev.find((u) => u.userId === userId);
          if (!exists) {
            return [...prev, { userId, username, firstName }];
          }
          return prev;
        });

        setTimeout(() => {
          setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
        }, 3000);
      }
    };

    const handleUserStoppedTyping = ({ userId }) => {
      setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
    };

    const handleMessageRead = ({ messageId, userId }) => {
      console.log("Message read:", messageId, "by user:", userId);
    };

    const handleError = (error) => {
      console.error("Socket error:", error);
      toast.error("Connection error occurred");
    };

    if (typeof socket.on === "function") {
      socket.on("newMessage", handleNewMessage);
      socket.on("userTyping", handleUserTyping);
      socket.on("userStoppedTyping", handleUserStoppedTyping);
      socket.on("messageRead", handleMessageRead);
      socket.on("error", handleError);
    }

    return () => {
      if (socket && typeof socket.off === "function") {
        socket.off("newMessage", handleNewMessage);
        socket.off("userTyping", handleUserTyping);
        socket.off("userStoppedTyping", handleUserStoppedTyping);
        socket.off("messageRead", handleMessageRead);
        socket.off("error", handleError);
      }
    };
  }, [socket, chatId, dispatch, user?.id]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = useCallback(
    (content, type = "TEXT", fileData = null) => {
      if (
        !chatId ||
        (!content?.trim() && !fileData?.fileUrl) ||
        !socket ||
        !socketConnected ||
        typeof socket.emit !== "function"
      ) {
        if (!socketConnected) {
          toast.error("Not connected to server. Please refresh the page.");
        }
        return;
      }

      const messageData = {
        content: content?.trim() || "",
        type,
        chatId,
        receiverId: currentChat?.isGroup
          ? null
          : currentChat?.members?.find((m) => m.userId !== user?.id)?.userId,
        ...(fileData && {
          fileUrl: fileData.fileUrl,
          fileName: fileData.fileName,
          fileSize: fileData.fileSize,
        }),
      };

      console.log("Sending message:", messageData);
      socket.emit("sendMessage", messageData);
    },
    [chatId, socket, socketConnected, currentChat, user?.id]
  );

  const handleTyping = useCallback(() => {
    if (
      socket &&
      socketConnected &&
      chatId &&
      typeof socket.emit === "function"
    ) {
      socket.emit("typing", { chatId });
    }
  }, [socket, socketConnected, chatId]);

  const handleStopTyping = useCallback(() => {
    if (
      socket &&
      socketConnected &&
      chatId &&
      typeof socket.emit === "function"
    ) {
      socket.emit("stopTyping", { chatId });
    }
  }, [socket, socketConnected, chatId]);

  const handleSearchNav = (direction) => {
    if (searchResults.length === 0) return;
    let nextIndex = currentResultIndex + direction;
    if (nextIndex >= searchResults.length) {
      nextIndex = 0;
    } else if (nextIndex < 0) {
      nextIndex = searchResults.length - 1;
    }
    setCurrentResultIndex(nextIndex);
  };

  const closeSearch = () => {
    setIsSearchVisible(false);
    setSearchQuery("");
  };

  if (isInitialLoad || messagesLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-500">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button
            onClick={() => {
              setError(null);
              setIsInitialLoad(true);
              if (chatId) {
                dispatch(fetchChatById(chatId));
                dispatch(fetchMessages({ chatId }));
              }
            }}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">💬</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Select a conversation
          </h3>
          <p className="text-gray-500">
            Choose from your existing conversations or start a new one
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white shadow-sm flex-shrink-0"
      >
        <div className="flex items-center space-x-3 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/chat")}
            className="md:hidden rounded-full p-2 flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center space-x-3 min-w-0">
            <Avatar
              src={currentChat.avatar}
              alt={currentChat.name}
              size="md"
              isOnline={currentChat.isOnline}
              fallbackText={currentChat.name}
              className="flex-shrink-0"
            />

            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-gray-900 truncate">
                {currentChat.name}
              </h2>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-500 truncate">
                  {currentChat.isOnline
                    ? "Online"
                    : currentChat.lastSeen
                    ? `Last seen ${formatTime(currentChat.lastSeen)}`
                    : "Offline"}
                </p>
                {!socketConnected && (
                  <span className="text-xs text-red-500 flex-shrink-0">
                    • Disconnected
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSearchVisible(true)}
            className="rounded-full p-2"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              toast("Voice call feature coming soon!", {
                duration: 3000,
              })
            }
            className="rounded-full p-2 hidden sm:block"
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              toast("Video call feature coming soon!", {
                duration: 3000,
              })
            }
            className="rounded-full p-2 hidden sm:block"
          >
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full p-2">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isSearchVisible && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            className="px-4 py-2 border-b border-gray-200 bg-gray-50 flex items-center space-x-2"
          >
            <Input
              type="text"
              placeholder="Search in chat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              autoFocus
            />
            {searchResults.length > 0 && (
              <span className="text-sm text-gray-500">{`${
                currentResultIndex + 1
              } of ${searchResults.length}`}</span>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => handleSearchNav(1)}
              disabled={searchResults.length === 0}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => handleSearchNav(-1)}
              disabled={searchResults.length === 0}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={closeSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-hidden relative min-h-0">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <MessageList
              messages={messages}
              isLoading={false}
              currentUserId={user?.id}
              highlightedMessageId={searchResults[currentResultIndex]?.id}
              searchQuery={debouncedSearchQuery}
              messageRefs={messageRefs}
            />
            <div ref={messagesEndRef} />
          </div>

          <AnimatePresence>
            {typingUsers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="px-6 py-2"
              >
                <TypingIndicator users={typingUsers} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex-shrink-0">
        <MessageInput
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          onStopTyping={handleStopTyping}
          disabled={!socketConnected}
        />

        {!socketConnected && (
          <div className="bg-red-100 border-t border-red-200 px-4 py-2">
            <p className="text-sm text-red-600 text-center">
              Connection lost. Trying to reconnect...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
