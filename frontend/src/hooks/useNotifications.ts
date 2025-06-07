import { useState, useCallback, useEffect } from 'react';
import { Notification, NotificationType } from '../types/hooks';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications);
      // Convert string dates back to Date objects
      const notificationsWithDates = parsed.map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp)
      }));
      setNotifications(notificationsWithDates);
      updateUnreadCount(notificationsWithDates);
    }
  }, []);

  // Update unread count when notifications change
  const updateUnreadCount = (notifs: Notification[]) => {
    const count = notifs.filter(n => !n.read).length;
    setUnreadCount(count);
  };

  // Save notifications to localStorage when they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(notifications));
      updateUnreadCount(notifications);
    }
  }, [notifications]);

  const addNotification = useCallback((message: string, type: NotificationType = 'info') => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date(),
      read: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    return newNotification.id;
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      );
      return updated;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    localStorage.removeItem('notifications');
  }, []);
  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } as const;
};

export default useNotifications;
