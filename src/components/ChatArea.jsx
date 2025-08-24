import React, { useEffect, useRef } from 'react';
import { Brain, Sparkles, MessageCircle, Zap } from 'lucide-react';
import Message from './Message';
import useChatStore from '../store/chatStore';

const ChatArea = () => {
  const { messages, currentChat, isTyping } = useChatStore();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (!currentChat) {
    return (
      <div className="flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 h-full relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="text-center max-w-2xl mx-auto p-8 relative z-10">
          {/* Logo */}
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/25 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <Brain className="text-white w-12 h-12" />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 rounded-3xl opacity-20 blur-lg animate-pulse"></div>
          </div>

          {/* Welcome text */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
              Welcome to NeuralMind
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your intelligent AI assistant powered by advanced neural networks
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-h-0 h-full transition-colors duration-300">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full w-full absolute inset-0">
            <div className="text-center p-8 w-full">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MessageCircle className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ready to chat!
              </h3>
              <p className="text-gray-600">
                Ask me anything to get started
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full">
            <div className="max-w-4xl mx-auto px-4 py-6">
              {messages.map((message, index) => (
                <div key={message._id} className="message-appear" style={{ animationDelay: `${index * 0.1}s` }}>
                  <Message message={message} />
                </div>
              ))}
              {isTyping && (
                <div className="message-appear">
                  <Message 
                    message={{ role: 'model', content: '' }} 
                    isTyping={true} 
                  />
                </div>
              )}
            </div>
            <div ref={messagesEndRef} className="h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatArea;