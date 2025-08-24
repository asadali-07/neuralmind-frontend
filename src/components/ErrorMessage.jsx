import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorMessage = ({ message, onClose, type = 'error' }) => {
  if (!message) return null;

  const typeStyles = {
    error: {
      bg: 'bg-red-50 ',
      border: 'border-red-200 ',
      text: 'text-red-700 ',
      icon: 'text-red-500 '
    },
    warning: {
      bg: 'bg-yellow-50 ',
      border: 'border-yellow-200 ',
      text: 'text-yellow-700 ',
      icon: 'text-yellow-500 '
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700 ',
      icon: 'text-blue-500 '
    }
  };

  const styles = typeStyles[type] || typeStyles.error;

  return (
    <div className={`${styles.bg} border ${styles.border} ${styles.text} px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm`}>
      <AlertCircle size={20} className={`${styles.icon} flex-shrink-0`} />
      <p className="flex-1 font-medium">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className={`${styles.icon} hover:scale-110 transition-transform p-1 rounded-lg hover:bg-black/5 `}
          aria-label="Close error message"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
