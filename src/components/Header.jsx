import React from 'react';
import { Menu, X, Sun, Moon, Brain, User } from 'lucide-react';
import useUIStore from '../store/uiStore';
import useAuthStore from '../store/authStore';

const Header = ({ clearCurrentChat, currentChat }) => {
  const { isSidebarOpen, toggleSidebar, isMobile } = useUIStore();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="border-b border-gray-200  px-4 py-3 flex items-center justify-between backdrop-blur-sm bg-white/95 sticky top-0 z-30">
      {/* Left side - Menu button and title */}
      <div className="flex items-center gap-3">
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl hover:bg-gray-100  transition-all duration-200 hover:scale-105"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? 
              <X size={20} className="text-gray-600 " /> : 
              <Menu size={20} className="text-gray-600 " />
            }
          </button>
        )}
        
        <div className="flex items-center gap-2">
          {currentChat && (   <X onClick={clearCurrentChat} size={26} className="inline mr-1 text-purple-800" />)}
          <div className="relative">
            <Brain className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 rounded-full opacity-20 animate-pulse"></div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
              NeuralMind
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
              AI Assistant
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Theme toggle and user menu */}
      <div className="flex items-center gap-2">

        {user && (
          <div className="flex items-center gap-2">
            {/* User avatar/icon */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 ">
              <div className="p-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600">
                <User size={14} className="text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700  hidden md:inline max-w-24 truncate">
                {user.name || user.email}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-600  hover:text-gray-900  hover:bg-gray-100  rounded-xl transition-all duration-200 hover:scale-105"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
