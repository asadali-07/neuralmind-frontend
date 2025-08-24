import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ChatArea from "../components/ChatArea";
import MessageInput from "../components/MessageInput";
import useUIStore from "../store/uiStore";
import useChatStore from "../store/chatStore";

const Chat = () => {
  const { setMobile, isSidebarOpen, isMobile } = useUIStore();
  const { sendMessage, createChat, currentChat, clearCurrentChat, isTyping } =
    useChatStore();

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setMobile]);

  const handleSendMessage = async (content) => {
    try {
      // If no current chat, create one first
      if (!currentChat) await createChat(content.slice(0, 25));
      await sendMessage(content);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <div
        className={`
        ${
          isMobile
            ? "fixed inset-y-0 left-0 z-50 w-64"
            : "relative w-64 flex-shrink-0"
        }
        ${isMobile && !isSidebarOpen ? "-translate-x-full" : "translate-x-0"}
        transition-transform duration-300 ease-in-out
      `}
      >
        <Sidebar />
      </div>

      {/* Overlay for mobile sidebar */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-white/5 backdrop-blur-sm bg-opacity-50 z-40 lg:hidden"
          onClick={() => useUIStore.getState().closeSidebar()}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0">
          <Header
            clearCurrentChat={clearCurrentChat}
            currentChat={currentChat}
          />
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto">
          <ChatArea />
        </div>

        {/* Message input */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-white">
          <MessageInput onSendMessage={handleSendMessage} disabled={isTyping} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
