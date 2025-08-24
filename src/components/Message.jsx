import React from 'react';
import { User, Bot, Copy, Check } from 'lucide-react';
import Markdown from 'react-markdown';

const Message = ({ message, isTyping = false }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className={`group flex gap-4 p-6 transition-colors duration-200 ${
      isUser
        ? 'bg-transparent'
        : 'bg-gray-50/50 backdrop-blur-sm'
    }`}>
      {/* Avatar */}
      <div className={`
        w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transition-transform duration-200 group-hover:scale-105
        ${isUser 
          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
          : 'bg-gradient-to-r from-emerald-500 to-cyan-600 text-white'
        }
      `}>
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>

      {/* Message content */}
      <div className="flex-1 space-y-3 min-w-0">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-900 ">
            {isUser ? 'You' : 'NeuralMind'}
          </div>
          
          {!isTyping && !isUser && message.content && (
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
              title="Copy message"
            >
              {copied ? (
                <Check size={14} className="text-green-500" />
              ) : (
                <Copy size={14} className="text-gray-500 " />
              )}
            </button>
          )}
        </div>
        
        <div className={`
          text-gray-800 leading-relaxed text-[15px]
          ${isUser ? 'font-medium' : ''}
        `}>
          {isTyping ? (
            <div className="flex items-center gap-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full typing-dot"></div>
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full typing-dot"></div>
                <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full typing-dot"></div>
              </div>
              <span className="text-gray-500 text-sm">
                NeuralMind is thinking...
              </span>
            </div>
          ) : (
            <div className="reset-tw">
              <Markdown>{message.content || '...'}</Markdown>
            </div>
          )}
        </div>

        {message.createdAt && !isTyping && (
          <div className="text-xs text-gray-400 ">
            {new Date(message.createdAt).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
