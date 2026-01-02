import { toast } from 'react-hot-toast';
export const showToast = (message, type = 'info') => {
  const baseStyle = {
    background: '#fff',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  };

  const configs = {
   
    info: {
      icon: 'ℹ',
      style: {
        ...baseStyle,
        color: '#1e40af',
        border: '2px solid #3b82f6',
      },
      iconTheme: {
        primary: '#3b82f6',
        secondary: '#fff',
      },
      duration: 3500,
    }

  };

  const config = configs[type] || configs.info;

  toast(message, {
    icon: config.icon,
    style: config.style,
    duration: config.duration,
    position: 'top-right',
  });
};

export const showSuccessToast = (message) => showToast(message, 'success');

export default showToast;