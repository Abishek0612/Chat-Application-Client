import api from "../../services/api";

export const userAPI = {
  getUsers: (params = {}) => api.get("/users", { params }),
  getUserById: (userId) => api.get(`/users/${userId}`),
  searchUsers: (query) => api.get("/users/search", { params: { q: query } }),
  getContacts: () => api.get("/users/contacts"),
  addContact: (userId) => api.post(`/users/contacts/${userId}`),
  removeContact: (userId) => api.delete(`/users/contacts/${userId}`),
  updateProfile: (data) => api.put("/users/profile", data),
  uploadAvatar: (formData) =>
    api.post("/users/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  sendFriendRequest: (userId) => api.post(`/users/friend-request/${userId}`),
  acceptFriendRequest: (requestId) =>
    api.post(`/users/friend-request/${requestId}/accept`),
  rejectFriendRequest: (requestId) =>
    api.post(`/users/friend-request/${requestId}/reject`),
  getFriendRequests: () => api.get("/users/friend-requests"),
};
