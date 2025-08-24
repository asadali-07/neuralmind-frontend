import { create } from "zustand";

const useUIStore = create((set) => ({
  isSidebarOpen: false,
  isMobile: false,

  // Sidebar Actions
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  closeSidebar: () => set({ isSidebarOpen: false }),

  openSidebar: () => set({ isSidebarOpen: true }),

  setMobile: (isMobile) => set({ isMobile }),
  
}));

export default useUIStore;
