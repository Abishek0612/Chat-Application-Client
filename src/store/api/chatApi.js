import api from "../../services/api";

export const chatAPI = {
  getChats: (params = {}) => api.get("/chats", { params }),
  getChatById: (chatId) => api.get(`/chats/${chatId}`),
  createChat: (chatData) => api.post("/chats", chatData),
  updateChat: (chatId, data) => api.put(`/chats/${chatId}`, data),
  deleteChat: (chatId) => api.delete(`/chats/${chatId}`),
  getChatMembers: (chatId) => api.get(`/chats/${chatId}/members`),
  addMember: (chatId, userId) =>
    api.post(`/chats/${chatId}/members`, { userId }),
  removeMember: (chatId, userId) =>
    api.delete(`/chats/${chatId}/members/${userId}`),
  getMessages: (chatId, params = {}) =>
    api.get(`/messages/${chatId}`, { params }),
  sendMessage: (messageData) => api.post("/messages", messageData),
  deleteMessage: (messageId) => api.delete(`/messages/${messageId}`),
  markAsRead: (messageId) => api.put(`/messages/${messageId}/read`),
};
