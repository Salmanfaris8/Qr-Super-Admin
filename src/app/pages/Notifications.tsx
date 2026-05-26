import { useState, useEffect } from 'react';
import { Bell, Info, AlertTriangle, CheckCircle, XCircle, Trash2, Loader, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/superadmin/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success) {
        setNotifications(res.data.data);
      }
    } catch (err: any) {
      console.error('Fetch notifications failed:', err);
      setError(err.response?.data?.message || 'Failed to load platform notifications.');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const handleMarkRead = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_BASE_URL}/superadmin/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        window.dispatchEvent(new Event('notificationsUpdated'));
      }
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`${API_BASE_URL}/superadmin/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success) {
        setNotifications(prev => prev.filter(n => n.id !== id));
        window.dispatchEvent(new Event('notificationsUpdated'));
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const handleClearAll = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`${API_BASE_URL}/superadmin/notifications/clear-all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success) {
        setNotifications([]);
        window.dispatchEvent(new Event('notificationsUpdated'));
      }
    } catch (err) {
      console.error('Failed to clear notifications:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_BASE_URL}/superadmin/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        window.dispatchEvent(new Event('notificationsUpdated'));
      }
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-[#1E88E5] mx-auto mb-4" />
          <p className="text-[#6B7280]">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-red-50 border-red-200">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 mb-2">Error Loading Notifications</h3>
            <p className="text-red-700">{error}</p>
            <Button onClick={fetchNotifications} variant="outline" className="mt-4 border-red-300 text-red-700 hover:bg-red-100">
              Try Again
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">Notifications</h1>
          <p className="text-sm text-[#6B7280] mt-1">Stay updated with platform activity</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleMarkAllRead} variant="outline" className="border-[#E5E7EB]" disabled={notifications.length === 0}>
            Mark All as Read
          </Button>
          <Button onClick={handleClearAll} variant="outline" className="border-[#E5E7EB] text-red-600" disabled={notifications.length === 0}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-4 bg-white border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280]">Total Notifications</p>
          <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">{notifications.length}</p>
        </Card>
        <Card className="p-4 bg-white border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280]">Unread</p>
          <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">{unreadCount}</p>
        </Card>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notification) => {
          const read = notification.isRead;
          return (
            <Card
              key={notification.id}
              onClick={() => !read && handleMarkRead(notification.id)}
              className={`p-4 bg-white border-[#E5E7EB] hover:shadow-md transition-shadow cursor-pointer ${
                !read ? 'bg-blue-50/50' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">{getIcon(notification.type)}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className={`text-sm font-semibold ${!read ? 'text-[#1E88E5]' : 'text-gray-700'}`}>
                        {notification.title}
                      </h4>
                      <p className={`text-sm mt-1 ${!read ? 'font-medium' : ''} text-[#1A1A1A]`}>
                        {notification.message}
                      </p>
                    </div>
                    {!read && (
                      <Badge className="bg-[#1E88E5] text-white shrink-0">New</Badge>
                    )}
                  </div>
                  <p className="text-xs text-[#6B7280] mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(notification.id);
                  }} 
                  variant="ghost" 
                  size="icon" 
                  className="shrink-0"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {notifications.length === 0 && (
        <Card className="p-12 bg-white border-[#E5E7EB] text-center">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">No Notifications</h3>
          <p className="text-[#6B7280]">You're all caught up! No new notifications to display.</p>
        </Card>
      )}
    </div>
  );
}
