import { create } from "zustand";
import { authAPI } from "../services/api";
import { io } from "socket.io-client";
import useChatStore from "./chatStore";

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  socket: null,
  error: null,

  // Actions
  setUser: (user) => set({ user, isAuthenticated: true }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  connectSocket: async () => {
    const socket = io("https://neuralmind-dbl0.onrender.com", {
      withCredentials: true,
    });
    set({ socket });
    socket.on("connect", () => {
      console.log("Socket connected");
    });
    socket.on("ai-message-response", (content) => {
      const aiMessage = {
        _id: (Date.now() + 1).toString(),
        content: content,
        role: "model",
        chatId: useChatStore.getState().currentChat._id,
        createdAt: new Date().toISOString(),
      };

      useChatStore.getState().addMessage(aiMessage);
      useChatStore.getState().setTyping(false);
    });
    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login(credentials);
      const data = response.data;

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      // Optionally connect to socket after login
      get().connectSocket();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
      });
      throw new Error(errorMessage);
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.register(userData);
      const data = response.data;

      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed";
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
      });
      throw new Error(errorMessage);
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const response = await authAPI.checkAuth();
      set({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
      });
      get().connectSocket();
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },
}));

export default useAuthStore;
