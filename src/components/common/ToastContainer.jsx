import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '380px',
      width: '100%'
    }}>
      {toasts.map((toast) => {
        let icon = <CheckCircle2 size={20} color="var(--electric-teal)" />;
        let borderLeft = '4px solid var(--electric-teal)';
        
        if (toast.type === 'warning') {
          icon = <AlertCircle size={20} color="#D97706" />;
          borderLeft = '4px solid #D97706';
        } else if (toast.type === 'info') {
          icon = <Info size={20} color="#0284C7" />;
          borderLeft = '4px solid #0284C7';
        }

        return (
          <div
            key={toast.id}
            style={{
              background: 'var(--ink-black)',
              color: 'var(--white)',
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              borderLeft,
              animation: 'fadeIn 0.25s ease forwards'
            }}
          >
            <div style={{ flexShrink: 0, marginTop: '2px' }}>{icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '2px' }}>
                {toast.title}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#B3B3B3', lineHeight: 1.4 }}>
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#888',
                cursor: 'pointer',
                padding: '2px',
                marginTop: '1px'
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
