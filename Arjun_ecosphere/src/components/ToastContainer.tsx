import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, removeToast } from '../store';
import { X, CheckCircle, Info, AlertTriangle, AlertCircle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const toasts = useSelector((state: RootState) => state.notifications.toasts);
  const dispatch = useDispatch();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3.5 max-w-sm w-full">
      {toasts.map((toast) => {
        return (
          <ToastItem
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => dispatch(removeToast(toast.id))}
          />
        );
      })}
    </div>
  );
};

interface ToastItemProps {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  onClose: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />
  };

  const bgBorder = {
    success: 'bg-[#182a20] border border-green-500/20 text-green-100',
    info: 'bg-[#17233a] border border-blue-500/20 text-blue-100',
    warning: 'bg-[#2b2417] border border-yellow-500/20 text-yellow-100',
    error: 'bg-[#2d1b1f] border border-red-500/20 text-red-100'
  };

  return (
    <div className={`p-4 rounded-xl flex items-start gap-3 shadow-lg transition-all duration-300 transform translate-y-0 ${bgBorder[type]}`}>
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1 text-sm font-medium pr-1">{message}</div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
