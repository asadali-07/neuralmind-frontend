import axios from "axios";
import useAuthStore from "../store/authStore";

// Create axios instance with default config
const api = axios.create({
  baseURL: "https://neuralmind-dbl0.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
        useAuthStore.getState().logout();
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register"
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
  checkAuth: () => api.get("/auth/check-auth"),
};

// Chat API
export const chatAPI = {
  getChats: () => api.get("/chat"),
  createChat: (title) => api.post("/chat", { title }),
  getChat: (chatId) => api.get(`/chat/${chatId}`),
  deleteChat: (chatId) => api.delete(`/chat/${chatId}`),
  updateChat: (chatId, title) => api.put(`/chat/${chatId}`, { title }),
};

//message API
export const messageAPI = {
  getAllChatMessages: (chatId) => api.get(`/message/${chatId}`),
};

export default api;
