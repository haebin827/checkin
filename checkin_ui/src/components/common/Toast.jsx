import React, { useEffect, useState } from 'react';
import '../../assets/styles/components/Toast.css';

const ToastItem = ({ toast, removeToast }) => {
  const [exit, setExit] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setExit(true);
    }, toast.duration - 500);
    
    return () => clearTimeout(timer);
  }, [toast.duration]);
  
  useEffect(() => {
    if (exit) {
      const timer = setTimeout(() => {
        removeToast(toast.id);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [exit, removeToast, toast.id]);

  return (
    <div 
      className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}
      style={{
        animation: exit ? 'slideOut 0.5s forwards' : 'slideIn 0.3s forwards'
      }}
    >
      <div className="toast-message">{toast.message}</div>
      <button 
        className="toast-close" 
        onClick={() => setExit(true)}
      >
        &times;
      </button>
    </div>
  );
};

const Toast = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          removeToast={removeToast} 
        />
      ))}
    </div>
  );
};

export default Toast; 