import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { chatAPI } from "../api/chatApi";
import { userAPI } from "../api/userApi";

export const fetchChats = createAsyncThunk(
  "chat/fetchChats",
  async (params, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getChats(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch chats"
      );
    }
  }
);

export const fetchChatById = createAsyncThunk(
  "chat/fetchChatById",
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getChatById(chatId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch chat"
      );
    }
  }
);

export const createChat = createAsyncThunk(
  "chat/createChat",
  async (chatData, { rejectWithValue }) => {
    try {
      console.log("Creating chat with data:", chatData);
      const response = await chatAPI.createChat(chatData);
      console.log("Chat creation response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Chat creation error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create chat"
      );
    }
  }
);

export const fetchContacts = createAsyncThunk(
  "chat/fetchContacts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAPI.getContacts();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch contacts"
      );
    }
  }
);

export const addContact = createAsyncThunk(
  "chat/addContact",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userAPI.addContact(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add contact"
      );
    }
  }
);

const initialState = {
  chats: [],
  currentChat: null,
  contacts: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    clearCurrentChat: (state) => {
      state.currentChat = null;
    },
    updateChat: (state, action) => {
      const chatIndex = state.chats.findIndex(
        (chat) => chat.id === action.payload.id
      );
      if (chatIndex !== -1) {
        state.chats[chatIndex] = {
          ...state.chats[chatIndex],
          ...action.payload,
        };
      }
      if (state.currentChat?.id === action.payload.id) {
        state.currentChat = { ...state.currentChat, ...action.payload };
      }
    },
    addChat: (state, action) => {
      state.chats.unshift(action.payload);
    },
    removeChat: (state, action) => {
      state.chats = state.chats.filter((chat) => chat.id !== action.payload);
      if (state.currentChat?.id === action.payload) {
        state.currentChat = null;
      }
    },
    updateChatLastMessage: (state, action) => {
      const { chatId, message } = action.payload;
      const chatIndex = state.chats.findIndex((chat) => chat.id === chatId);
      if (chatIndex !== -1) {
        state.chats[chatIndex].lastMessage = message;
        state.chats[chatIndex].updatedAt = message.createdAt;
        const chat = state.chats.splice(chatIndex, 1)[0];
        state.chats.unshift(chat);
      }
    },
    incrementUnreadCount: (state, action) => {
      const chatId = action.payload;
      const chatIndex = state.chats.findIndex((chat) => chat.id === chatId);
      if (chatIndex !== -1) {
        state.chats[chatIndex].unreadCount =
          (state.chats[chatIndex].unreadCount || 0) + 1;
      }
    },
    clearUnreadCount: (state, action) => {
      const chatId = action.payload;
      const chatIndex = state.chats.findIndex((chat) => chat.id === chatId);
      if (chatIndex !== -1) {
        state.chats[chatIndex].unreadCount = 0;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch chats
      .addCase(fetchChats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chats = action.payload.chats || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch chat by ID
      .addCase(fetchChatById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChatById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentChat = action.payload.chat;
      })
      .addCase(fetchChatById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create chat
      .addCase(createChat.fulfilled, (state, action) => {
        state.chats.unshift(action.payload.chat);
      })
      // Fetch contacts
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.contacts = action.payload.contacts || [];
      })
      // Add contact
      .addCase(addContact.fulfilled, (state, action) => {
        if (action.payload.chat) {
          state.chats.unshift(action.payload.chat);
        }
      });
  },
});

export const {
  setCurrentChat,
  clearCurrentChat,
  updateChat,
  addChat,
  removeChat,
  updateChatLastMessage,
  incrementUnreadCount,
  clearUnreadCount,
  clearError,
} = chatSlice.actions;

export default chatSlice.reducer;
