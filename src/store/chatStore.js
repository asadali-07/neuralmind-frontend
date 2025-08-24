import { create } from 'zustand';
import { chatAPI } from '../services/api';
import useAuthStore from './authStore';

const useChatStore = create((set, get) => ({
  chats: [],
  currentChat: null,
  messages: [],
  isLoading: false,
  error: null,
  isTyping: false,

  // Actions
  setChats: (chats) => set({ chats }),
  
  setCurrentChat: (chat) => set({ currentChat: chat }),
  
  setMessages: (messages) => set({ messages }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  setTyping: (isTyping) => set({ isTyping }),
  
  clearError: () => set({ error: null }),

  // Add message to current chat
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  // Update last message (for streaming responses)
  // updateLastMessage: (content) =>
  //   set((state) => {
  //     const messages = [...state.messages];
  //     if (messages.length > 0) {
  //       messages[messages.length - 1] = {
  //         ...messages[messages.length - 1],
  //         content,
  //       };
  //     }
  //     return { messages };
  //   }),

  // Fetch all chats
  fetchChats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await chatAPI.getChats();
      const chats = response.data.chats;
      set({ chats, isLoading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch chats';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  // Create new chat
  createChat: async (title = 'New Chat') => {
    set({ isLoading: true, error: null });
    try {
      const response = await chatAPI.createChat(title);
      const newChat = response.data.chat;
      set((state) => ({
        chats: [newChat, ...state.chats],
        currentChat: newChat,
        messages: [],
        isLoading: false,
      }));
      return newChat;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create chat';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  // Get chat by ID
  getChat: async (chatId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await chatAPI.getChat(chatId);
      const data = response.data;
      set({
        currentChat: data.chat,
        messages: data.messages || [],
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch chat';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  // Delete chat
  deleteChat: async (chatId) => {
    set({ isLoading: true, error: null });
    try {
      await chatAPI.deleteChat(chatId);
      set((state) => ({
        chats: state.chats.filter((chat) => chat._id !== chatId),
        currentChat: state.currentChat?._id === chatId ? null : state.currentChat,
        messages: state.currentChat?._id === chatId ? [] : state.messages,
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete chat';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
  updateChat: async (chatId, title) => {
    set({ isLoading: true, error: null });
    try {
      await chatAPI.updateChat(chatId, title);
      set((state) => ({
        chats: state.chats.map((chat) =>
          chat._id === chatId ? { ...chat, title } : chat
        ),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update chat';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  // Send message
  sendMessage: async (content) => {
    const { currentChat, addMessage, setTyping } = get();

    if (!currentChat) {
      throw new Error('No chat selected');
    }

    // Add user message
    const userMessage = {
      _id: Date.now().toString(),
      content,
      role: 'user',
      chatId: currentChat._id,
      createdAt: new Date().toISOString(),
    };

    addMessage(userMessage);
    setTyping(true);

    try {
      useAuthStore.getState().socket.emit('ai-message', {
        chatId: currentChat._id,
        content,
      });

    } catch (error) {
      setTyping(false);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send message';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  // Clear current chat
  clearCurrentChat: () =>
    set({
      currentChat: null,
      messages: [],
    }),
}));

export default useChatStore;
