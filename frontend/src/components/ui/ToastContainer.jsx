import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';

const icons = {
  success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
  error: <XCircle className="w-5 h-5 text-red-400" />,
  warning: <AlertCircle className="w-5 h-5 text-yellow-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
};

const colors = {
  success: 'border-emerald-500/30 bg-emerald-500/10',
  error: 'border-red-500/30 bg-red-500/10',
  warning: 'border-yellow-500/30 bg-yellow-500/10',
  info: 'border-blue-500/30 bg-blue-500/10',
};

const Toast = ({ toast, onRemove }) => (
  <motion.div
    layout
    initial={{ opacity: 0, x: 100, scale: 0.9 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    exit={{ opacity: 0, x: 100, scale: 0.9 }}
    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-card max-w-sm w-full ${colors[toast.type]}`}
  >
    <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
    <div className="flex-1 min-w-0">
      {toast.title && (
        <p className="text-sm font-semibold text-white mb-0.5">{toast.title}</p>
      )}
      <p className="text-sm text-white/70">{toast.message}</p>
    </div>
    <button
      onClick={() => onRemove(toast.id)}
      className="flex-shrink-0 text-white/40 hover:text-white/70 transition-colors"
    >
      <X className="w-4 h-4" />
    </button>
  </motion.div>
);

const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
