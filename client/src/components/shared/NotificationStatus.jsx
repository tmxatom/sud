import React, { useState, useEffect } from 'react';
import { FiBell, FiBellOff, FiCheck, FiX } from 'react-icons/fi';
import { generateToken, getNotificationPermission, isNotificationSupported } from '../../notifications/firebase';

const NotificationStatus = () => {
  const [permission, setPermission] = useState('default');
  const [loading, setLoading] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(isNotificationSupported());
    setPermission(getNotificationPermission());
  }, []);

  const handleEnableNotifications = async () => {
    setLoading(true);
    try {
      const token = await generateToken();
      if (token) {
        setPermission('granted');
        console.log('Notifications enabled successfully');
      } else {
        setPermission('denied');
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!supported) {
    return (
      <div className="flex items-center space-x-2 text-gray-500 text-sm">
        <FiBellOff className="h-4 w-4" />
        <span>Notifications not supported</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {permission === 'granted' ? (
        <div className="flex items-center space-x-2 text-green-600 text-sm">
          <FiCheck className="h-4 w-4" />
          <span>Notifications enabled</span>
        </div>
      ) : permission === 'denied' ? (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <FiX className="h-4 w-4" />
          <span>Notifications blocked</span>
        </div>
      ) : (
        <button
          onClick={handleEnableNotifications}
          disabled={loading}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
        >
          <FiBell className="h-4 w-4" />
          <span>{loading ? 'Enabling...' : 'Enable notifications'}</span>
        </button>
      )}
    </div>
  );
};

export default NotificationStatus;