import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarOpen: false,
  theme: "light",
  notifications: {
    enabled: true,
    sound: true,
    desktop: true,
  },
  activeModal: null,
  loading: {
    global: false,
    upload: false,
  },
  toast: {
    show: false,
    message: "",
    type: "info",
  },
  searchQuery: "",
  searchResults: [],
  searchLoading: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);
    },
    updateNotificationSettings: (state, action) => {
      state.notifications = { ...state.notifications, ...action.payload };
      localStorage.setItem(
        "notifications",
        JSON.stringify(state.notifications)
      );
    },
    setActiveModal: (state, action) => {
      state.activeModal = action.payload;
    },
    closeModal: (state) => {
      state.activeModal = null;
    },
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
    setUploadLoading: (state, action) => {
      state.loading.upload = action.payload;
    },
    showToast: (state, action) => {
      state.toast = {
        show: true,
        message: action.payload.message,
        type: action.payload.type || "info",
      };
    },
    hideToast: (state) => {
      state.toast.show = false;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setSearchLoading: (state, action) => {
      state.searchLoading = action.payload;
    },
    clearSearch: (state) => {
      state.searchQuery = "";
      state.searchResults = [];
      state.searchLoading = false;
    },
    loadSettings: (state) => {
      try {
        const savedTheme = localStorage.getItem("theme");
        const savedNotifications = localStorage.getItem("notifications");

        if (savedTheme) {
          state.theme = savedTheme;
        }
        if (savedNotifications) {
          state.notifications = JSON.parse(savedNotifications);
        }
      } catch (error) {
        console.error("Error loading UI settings:", error);
      }
    },
    saveSettings: (state) => {
      try {
        localStorage.setItem("theme", state.theme);
        localStorage.setItem(
          "notifications",
          JSON.stringify(state.notifications)
        );
      } catch (error) {
        console.error("Error saving UI settings:", error);
      }
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  updateNotificationSettings,
  setActiveModal,
  closeModal,
  setGlobalLoading,
  setUploadLoading,
  showToast,
  hideToast,
  setSearchQuery,
  setSearchResults,
  setSearchLoading,
  clearSearch,
  loadSettings,
  saveSettings,
} = uiSlice.actions;

export default uiSlice.reducer;
