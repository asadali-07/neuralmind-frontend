import React from 'react';
import { Brain } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="relative">
          {/* Outer spinning ring */}
          <div
            className={`
              ${sizeClasses[size]}
              border-4 border-indigo-100 border-t-indigo-500  rounded-full animate-spin mx-auto
            `}
          />
          {/* Inner brain icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full p-2">
              <Brain className={`${iconSizeClasses[size]} text-white animate-pulse`} />
            </div>
          </div>
        </div>
        
        {text && (
          <div className="mt-4">
            <p className="text-gray-700 text-sm font-medium">{text}</p>
            <div className="flex justify-center mt-2 space-x-1">
              <div className="w-1 h-1 bg-indigo-500 rounded-full typing-dot"></div>
              <div className="w-1 h-1 bg-purple-500 rounded-full typing-dot"></div>
              <div className="w-1 h-1 bg-cyan-500 rounded-full typing-dot"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
