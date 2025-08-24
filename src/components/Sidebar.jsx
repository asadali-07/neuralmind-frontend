import React, { useEffect, useState } from 'react';
import { MessageSquare, Plus, Trash2, Edit3, Sparkles, Bot, User, Check, X } from 'lucide-react';
import useChatStore from '../store/chatStore';
import useUIStore from '../store/uiStore';

const Sidebar = () => {
  const {
    chats,
    currentChat,
    fetchChats,
    createChat,
    deleteChat,
    updateChat,
    getChat,
  } = useChatStore();
  
  const { closeSidebar, isMobile } = useUIStore();
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const handleNewChat = async () => {
    try {
      await createChat();
      if (isMobile) {
        closeSidebar();
      }
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  const handleChatSelect = async (chatId) => {
    try {
      await getChat(chatId);
      if (isMobile) {
        closeSidebar();
      }
    } catch (error) {
      console.error('Failed to select chat:', error);
    }
  };

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat?')) {
      try {
        await deleteChat(chatId);
      } catch (error) {
        console.error('Failed to delete chat:', error);
      }
    }
  };

  const handleEditStart = (e, chat) => {
    e.stopPropagation();
    setEditingChatId(chat._id);
    setEditTitle(chat.title);
  };

  const handleEditSave = async (e, chatId) => {
    e.stopPropagation();
    if (editTitle.trim() && editTitle !== chats.find(c => c._id === chatId)?.title) {
      try {
        await updateChat(chatId, editTitle.trim());
      } catch (error) {
        console.error('Failed to update chat:', error);
      }
    }
    setEditingChatId(null);
    setEditTitle('');
  };

  const handleEditCancel = (e) => {
    e.stopPropagation();
    setEditingChatId(null);
    setEditTitle('');
  };

  const handleKeyPress = (e, chatId) => {
    if (e.key === 'Enter') {
      handleEditSave(e, chatId);
    } else if (e.key === 'Escape') {
      handleEditCancel(e);
    }
  };

  const truncateTitle = (title, maxLength = 25) => {
    return title?.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200  flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 ">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl group"
        >
          <div className="p-1 rounded-lg bg-white/20">
            <Plus size={16} className="group-hover:rotate-90 transition-transform duration-200" />
          </div>
          <span className="font-medium">New Chat</span>
          <Sparkles size={16} className="ml-auto opacity-70" />
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          {chats.length === 0 ? (
            <div className="text-center text-gray-500  py-12">
              <div className="relative mb-4">
                <Bot size={48} className="mx-auto text-gray-300 " />
                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 rounded-full blur-lg"></div>
              </div>
              <p className="text-sm font-medium mb-1">No conversations yet</p>
              <p className="text-xs opacity-70">Start a new chat to begin</p>
            </div>
          ) : (
            <div className="space-y-2">
              {chats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => editingChatId !== chat._id && handleChatSelect(chat._id)}
                  className={`
                    group relative flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer
                    transition-all duration-200 hover:scale-[1.02] hover:shadow-sm
                    ${currentChat?._id === chat._id 
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-500 border border-indigo-200 dark:border-indigo-700/50 shadow-md' 
                      : 'hover:bg-gray-50 '
                    }
                  `}
                >
                  <div className={`
                    p-2 rounded-lg transition-colors
                    ${currentChat?._id === chat._id 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
                      : 'bg-gray-100  text-gray-600 dark:text-gray-300 group-hover:bg-gray-200 '
                    }
                  `}>
                    <MessageSquare size={14} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {editingChatId === chat._id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => handleKeyPress(e, chat._id)}
                          onBlur={(e) => handleEditSave(e, chat._id)}
                          className="flex-1 text-sm font-medium bg-transparent border-b border-gray-300  focus:border-indigo-500 focus:outline-none text-gray-900 "
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex items-center gap-1">
                          <button
                                  onClick={(e) => handleEditSave(e, chat._id)}
                                  className="p-1 rounded hover:bg-green-100 transition-colors"
                            title="Save"
                          >
                            <Check size={12} className="text-green-600" />
                          </button>
                          <button
                            onClick={handleEditCancel}
                            className="p-1 rounded hover:bg-red-100  transition-colors"
                            title="Cancel"
                          >
                            <X size={12} className="text-red-600" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className={`
                          text-sm font-medium truncate
                          ${currentChat?._id === chat._id 
                            ? 'text-gray-900 ' 
                            : 'text-gray-700 '
                          }
                        `}>
                          {truncateTitle(chat.title)}
                        </p>
                        <p className="text-xs text-gray-500  truncate">
                          {new Date(chat.updatedAt).toLocaleDateString()}
                        </p>
                      </>
                    )}
                  </div>
                  
                  {/* Actions */}
                  {editingChatId !== chat._id && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleEditStart(e, chat)}
                        className="p-1.5 rounded-lg hover:bg-gray-200  transition-colors"
                        title="Edit chat"
                      >
                        <Edit3 size={12} className="text-gray-500 " />
                      </button>
                      <button
                        onClick={(e) => handleDeleteChat(e, chat._id)}
                        className="p-1.5 rounded-lg hover:bg-red-100  transition-colors group/delete"
                        title="Delete chat"
                      >
                        <Trash2 size={12} className="text-gray-500  group-hover/delete:text-red-500" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 ">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 ">
          <Bot size={16} className="text-indigo-500" />
          <span className="font-medium">NeuralMind AI</span>
        </div>
        <div className="text-center text-xs text-gray-400 mt-1">
          Powered by Advanced AI
        </div>
      </div>
    </div>
  );
};

export default Sidebar;