import api from "../../services/api";

export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/users/profile", data),
  uploadAvatar: (formData) =>
    api.post("/users/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  googleAuth: () =>
    (window.location.href = `${api.defaults.baseURL}/auth/google`),
};
