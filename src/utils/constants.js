export const MESSAGE_TYPES = {
  TEXT: "TEXT",
  IMAGE: "IMAGE",
  FILE: "FILE",
  AUDIO: "AUDIO",
  VIDEO: "VIDEO",
};

export const USER_ROLES = {
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
};

export const SOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  JOIN_CHAT: "joinChat",
  LEAVE_CHAT: "leaveChat",
  SEND_MESSAGE: "sendMessage",
  NEW_MESSAGE: "newMessage",
  TYPING: "typing",
  STOP_TYPING: "stopTyping",
  USER_ONLINE: "userOnline",
  USER_OFFLINE: "userOffline",
  USER_TYPING: "userTyping",
  USER_STOPPED_TYPING: "userStoppedTyping",
  MESSAGE_READ: "messageRead",
  CHAT_UPDATED: "chatUpdated",
};

export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

export const CHAT_TYPES = {
  DIRECT: "direct",
  GROUP: "group",
};

export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};

export const FILE_TYPES = {
  IMAGE: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  VIDEO: ["video/mp4", "video/mpeg", "video/quicktime"],
  AUDIO: ["audio/mpeg", "audio/wav", "audio/ogg"],
  DOCUMENT: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ],
  ARCHIVE: ["application/zip", "application/x-rar-compressed"],
};

export const MAX_FILE_SIZE = {
  IMAGE: 5 * 1024 * 1024,
  VIDEO: 50 * 1024 * 1024,
  AUDIO: 10 * 1024 * 1024,
  DOCUMENT: 10 * 1024 * 1024,
  ARCHIVE: 20 * 1024 * 1024,
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    PROFILE: "/auth/profile",
    GOOGLE: "/auth/google",
  },
  USERS: {
    BASE: "/users",
    SEARCH: "/users/search",
    CONTACTS: "/users/contacts",
    PROFILE: "/users/profile",
    AVATAR: "/users/avatar",
  },
  CHATS: {
    BASE: "/chats",
    MEMBERS: (chatId) => `/chats/${chatId}/members`,
  },
  MESSAGES: {
    BASE: "/messages",
    UPLOAD: "/messages/upload",
    READ: (messageId) => `/messages/${messageId}/read`,
  },
};

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
};

export const STORAGE_KEYS = {
  TOKEN: "token",
  THEME: "theme",
  NOTIFICATIONS: "notifications",
  SIDEBAR_OPEN: "sidebarOpen",
  RECENT_SEARCHES: "recentSearches",
  CHAT_DRAFTS: "chatDrafts",
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "Session expired. Please login again.",
  FORBIDDEN: "Access denied.",
  NOT_FOUND: "Resource not found.",
  SERVER_ERROR: "Server error. Please try again later.",
  VALIDATION_ERROR: "Please check your input and try again.",
  FILE_TOO_LARGE: "File size exceeds the maximum limit.",
  INVALID_FILE_TYPE: "File type is not supported.",
};

export const SUCCESS_MESSAGES = {
  LOGIN: "Login successful!",
  REGISTER: "Account created successfully!",
  LOGOUT: "Logged out successfully.",
  PROFILE_UPDATED: "Profile updated successfully.",
  MESSAGE_SENT: "Message sent.",
  FILE_UPLOADED: "File uploaded successfully.",
  CONTACT_ADDED: "Contact added successfully.",
  CHAT_CREATED: "Chat created successfully.",
};

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
};

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

export const DEFAULT_AVATAR_COLORS = [
  "#f87171",
  "#fb923c",
  "#fbbf24",
  "#a3e635",
  "#34d399",
  "#22d3ee",
  "#60a5fa",
  "#a78bfa",
  "#f472b6",
  "#fb7185",
];
