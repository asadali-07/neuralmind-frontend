import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Zap } from 'lucide-react';

const MessageInput = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="p-4 bg-white  border-t border-gray-200">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="relative flex items-center gap-3">
          {/* Attachment button */}
          {/* <button
            type="button"
            className="p-3 text-gray-400 hover:text-indigo-500 transition-all duration-200 hover:scale-110"
            disabled={disabled}
            title="Attach file (coming soon)"
          >
            <Paperclip size={20} />
          </button> */}

          {/* Message input container */}
          <div className="flex-1 relative group">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                placeholder="Ask NeuralMind anything..."
                disabled={disabled}
                rows={1}
                className="
                  w-full resize-none rounded-2xl border-2 border-gray-200
                  bg-gray-50  px-4 py-3 pr-14 text-gray-900
                  placeholder-gray-500
                  focus:border-indigo-500 focus:bg-white
                  focus:ring-2 focus:ring-indigo-500/20 focus:outline-none
                  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
                  transition-all duration-200
                  min-h-[52px] max-h-[120px] overflow-y-auto
                  shadow-sm hover:shadow-md focus:shadow-lg
                "
                style={{ height: '52px' }}
              />
              
              {/* Gradient border effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 -z-10 blur-sm"></div>
            </div>
            
            {/* Send button */}
            <button
              type="submit"
              disabled={!message.trim() || disabled}
              className={`
                absolute right-2 bottom-3 p-2.5 rounded-xl transition-all duration-200
                ${message.trim() && !disabled
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                  : 'bg-gray-200  text-gray-400  cursor-not-allowed'
                }
              `}
            >
              {disabled ? (
                <div className="flex items-center">
                  <Zap size={16} className="animate-pulse" />
                </div>
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
        </div>

        {/* Helper text */}
        <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500 ">
          <span className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-gray-100  rounded text-xs">Enter</kbd>
            to send
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-gray-100  rounded text-xs">Shift + Enter</kbd>
            for new line
          </span>
        </div>

        {disabled && (
          <div className="mt-2 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs">
              <Zap size={12} className="animate-pulse" />
              NeuralMind is processing your request...
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default MessageInput;
