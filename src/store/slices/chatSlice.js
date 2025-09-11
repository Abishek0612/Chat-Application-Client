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
      console.error("Fetch chats error:", error);
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
      if (!chatId) {
        throw new Error("Chat ID is required");
      }

      const response = await chatAPI.getChatById(chatId);
      return response.data;
    } catch (error) {
      console.error("Fetch chat by ID error:", error);
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

      if (
        !chatData.members ||
        !Array.isArray(chatData.members) ||
        chatData.members.length === 0
      ) {
        throw new Error("At least one member is required");
      }

      const response = await chatAPI.createChat(chatData);
      console.log("Chat creation response:", response.data);

      if (!response.data || !response.data.data || !response.data.data.chat) {
        console.error("Invalid response structure:", response.data);
        throw new Error("Invalid response from server");
      }

      return response.data;
    } catch (error) {
      console.error("Chat creation error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create chat"
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
      console.error("Fetch contacts error:", error);
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
      if (!userId) {
        throw new Error("User ID is required");
      }

      const response = await userAPI.addContact(userId);
      return response.data;
    } catch (error) {
      console.error("Add contact error:", error);
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
      state.error = null;
    },

    clearCurrentChat: (state) => {
      state.currentChat = null;
    },

    updateChat: (state, action) => {
      if (!action.payload || !action.payload.id) {
        console.warn("updateChat: Invalid payload", action.payload);
        return;
      }

      const chatIndex = state.chats.findIndex(
        (chat) => chat && chat.id === action.payload.id
      );

      if (chatIndex !== -1) {
        state.chats[chatIndex] = {
          ...state.chats[chatIndex],
          ...action.payload,
        };
      }

      if (state.currentChat && state.currentChat.id === action.payload.id) {
        state.currentChat = { ...state.currentChat, ...action.payload };
      }
    },

    addChat: (state, action) => {
      if (!action.payload || !action.payload.id) {
        console.warn("addChat: Invalid payload", action.payload);
        return;
      }

      const existingIndex = state.chats.findIndex(
        (chat) => chat && chat.id === action.payload.id
      );

      if (existingIndex === -1) {
        state.chats.unshift(action.payload);
      }
    },

    removeChat: (state, action) => {
      const chatId = action.payload;
      if (!chatId) {
        console.warn("removeChat: Invalid chat ID", chatId);
        return;
      }

      state.chats = state.chats.filter((chat) => chat && chat.id !== chatId);

      if (state.currentChat && state.currentChat.id === chatId) {
        state.currentChat = null;
      }
    },

    updateChatLastMessage: (state, action) => {
      const { chatId, message } = action.payload;

      if (!chatId || !message) {
        console.warn("updateChatLastMessage: Invalid payload", action.payload);
        return;
      }

      const chatIndex = state.chats.findIndex(
        (chat) => chat && chat.id === chatId
      );

      if (chatIndex !== -1) {
        state.chats[chatIndex].lastMessage = message;
        state.chats[chatIndex].updatedAt = message.createdAt;
        const chat = state.chats.splice(chatIndex, 1)[0];
        state.chats.unshift(chat);
      }
    },

    incrementUnreadCount: (state, action) => {
      const chatId = action.payload;

      if (!chatId) {
        console.warn("incrementUnreadCount: Invalid chat ID", chatId);
        return;
      }

      const chatIndex = state.chats.findIndex(
        (chat) => chat && chat.id === chatId
      );

      if (chatIndex !== -1) {
        state.chats[chatIndex].unreadCount =
          (state.chats[chatIndex].unreadCount || 0) + 1;
      }
    },

    clearUnreadCount: (state, action) => {
      const chatId = action.payload;

      if (!chatId) {
        console.warn("clearUnreadCount: Invalid chat ID", chatId);
        return;
      }

      const chatIndex = state.chats.findIndex(
        (chat) => chat && chat.id === chatId
      );

      if (chatIndex !== -1) {
        state.chats[chatIndex].unreadCount = 0;
      }
    },

    clearError: (state) => {
      state.error = null;
    },

    resetChatState: (state) => {
      return initialState;
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
        state.error = null;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.error("Fetch chats failed:", action.payload);
      })

      // Fetch chat by ID
      .addCase(fetchChatById.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchChatById.fulfilled, (state, action) => {
        if (action.payload && action.payload.data && action.payload.data.chat) {
          state.currentChat = action.payload.data.chat;
          state.error = null;

          const chatIndex = state.chats.findIndex(
            (chat) => chat && chat.id === action.payload.data.chat.id
          );
          if (chatIndex !== -1) {
            state.chats[chatIndex] = {
              ...state.chats[chatIndex],
              ...action.payload.data.chat,
            };
          }
        } else {
          console.warn(
            "fetchChatById: Invalid response structure",
            action.payload
          );
        }
      })
      .addCase(fetchChatById.rejected, (state, action) => {
        state.error = action.payload;
        console.error("Fetch chat by ID failed:", action.payload);
      })

      // Create chat
      .addCase(createChat.pending, (state) => {
        state.error = null;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        console.log("createChat.fulfilled payload:", action.payload);

        if (
          !action.payload ||
          !action.payload.data ||
          !action.payload.data.chat
        ) {
          console.error(
            "createChat: Invalid response structure",
            action.payload
          );
          state.error = "Invalid response from server";
          return;
        }

        const newChat = action.payload.data.chat;

        if (!newChat || !newChat.id) {
          console.error("createChat: Invalid chat object", newChat);
          state.error = "Invalid chat data received";
          return;
        }

        const existingIndex = state.chats.findIndex(
          (chat) => chat && chat.id === newChat.id
        );

        if (existingIndex === -1) {
          state.chats.unshift(newChat);
        } else {
          state.chats[existingIndex] = {
            ...state.chats[existingIndex],
            ...newChat,
          };
        }

        state.error = null;
      })
      .addCase(createChat.rejected, (state, action) => {
        state.error = action.payload;
        console.error("Create chat failed:", action.payload);
      })

      // Fetch contacts
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.contacts = action.payload.contacts || [];
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        console.error("Fetch contacts failed:", action.payload);
      })

      // Add contact
      .addCase(addContact.fulfilled, (state, action) => {
        if (action.payload && action.payload.chat) {
          const newChat = action.payload.chat;

          if (newChat && newChat.id) {
            const existingIndex = state.chats.findIndex(
              (chat) => chat && chat.id === newChat.id
            );

            if (existingIndex === -1) {
              state.chats.unshift(newChat);
            }
          }
        }
      })
      .addCase(addContact.rejected, (state, action) => {
        console.error("Add contact failed:", action.payload);
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
  resetChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
