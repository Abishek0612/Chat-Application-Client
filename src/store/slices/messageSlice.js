import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { chatAPI } from "../api/chatApi";

export const fetchMessages = createAsyncThunk(
  "message/fetchMessages",
  async ({ chatId, page = 1, limit = 50 }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getMessages(chatId, { page, limit });
      return { chatId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch messages"
      );
    }
  }
);

export const sendMessage = createAsyncThunk(
  "message/sendMessage",
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await chatAPI.sendMessage(messageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send message"
      );
    }
  }
);

export const deleteMessage = createAsyncThunk(
  "message/deleteMessage",
  async (messageId, { rejectWithValue }) => {
    try {
      await chatAPI.deleteMessage(messageId);
      return messageId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete message"
      );
    }
  }
);

export const markMessagesAsRead = createAsyncThunk(
  "message/markAsRead",
  async (chatId, { getState, rejectWithValue }) => {
    try {
      const { message, auth } = getState();
      const currentUserId = auth.user?.id;

      const unreadMessages = message.messages.filter(
        (msg) =>
          msg.chatId === chatId && !msg.isRead && msg.senderId !== currentUserId
      );

      if (unreadMessages.length === 0) {
        return chatId;
      }

      await Promise.all(
        unreadMessages.map((msg) => chatAPI.markAsRead(msg.id))
      );

      return chatId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark messages as read"
      );
    }
  }
);

const initialState = {
  messages: [],
  isLoading: false,
  error: null,
  currentChatId: null,
  pagination: {
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
    hasNextPage: false,
  },
  typingUsers: [],
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const message = action.payload;
      if (!message || !message.id) return;

      const existingIndex = state.messages.findIndex(
        (m) => m.id === message.id
      );

      if (existingIndex === -1) {
        state.messages.push(message);
        state.messages.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      }
    },
    updateMessage: (state, action) => {
      const messageIndex = state.messages.findIndex(
        (m) => m.id === action.payload.id
      );
      if (messageIndex !== -1) {
        state.messages[messageIndex] = {
          ...state.messages[messageIndex],
          ...action.payload,
        };
      }
    },
    removeMessage: (state, action) => {
      state.messages = state.messages.filter((m) => m.id !== action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
      state.currentChatId = null;
      state.pagination = initialState.pagination;
    },
    setCurrentChatId: (state, action) => {
      if (state.currentChatId !== action.payload) {
        state.messages = [];
        state.currentChatId = action.payload;
      }
    },
    setTypingUsers: (state, action) => {
      state.typingUsers = action.payload;
    },
    addTypingUser: (state, action) => {
      const user = action.payload;
      if (!state.typingUsers.find((u) => u.userId === user.userId)) {
        state.typingUsers.push(user);
      }
    },
    removeTypingUser: (state, action) => {
      state.typingUsers = state.typingUsers.filter(
        (u) => u.userId !== action.payload
      );
    },
    markMessageAsRead: (state, action) => {
      const messageId = action.payload;
      const messageIndex = state.messages.findIndex((m) => m.id === messageId);
      if (messageIndex !== -1) {
        state.messages[messageIndex].isRead = true;
      }
    },
    markChatMessagesAsRead: (state, action) => {
      const { chatId, currentUserId } = action.payload;
      state.messages.forEach((message) => {
        if (message.chatId === chatId && message.senderId !== currentUserId) {
          message.isRead = true;
        }
      });
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        state.currentChatId = action.meta.arg.chatId;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        const { messages, pagination } = action.payload.data || action.payload;
        state.messages = Array.isArray(messages) ? messages : [];
        state.pagination = pagination || state.pagination;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.messages = [];
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const message = action.payload.data?.message || action.payload.message;
        if (message && message.id) {
          const existingIndex = state.messages.findIndex(
            (m) => m.id === message.id
          );
          if (existingIndex === -1) {
            state.messages.push(message);
            state.messages.sort(
              (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );
          }
        }
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.messages = state.messages.filter((m) => m.id !== action.payload);
      })
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        const chatId = action.payload;
        state.messages.forEach((message) => {
          if (message.chatId === chatId) {
            message.isRead = true;
          }
        });
      });
  },
});

export const {
  addMessage,
  updateMessage,
  removeMessage,
  clearMessages,
  setCurrentChatId,
  setTypingUsers,
  addTypingUser,
  removeTypingUser,
  markMessageAsRead,
  markChatMessagesAsRead,
  clearError,
} = messageSlice.actions;

export default messageSlice.reducer;
