import { Bell, Info, AlertTriangle, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { notifications } from '../data/mockData';

export function Notifications() {
  const unreadCount = notifications.filter(n => !n.read).length;

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">Notifications</h1>
          <p className="text-sm text-[#6B7280] mt-1">Stay updated with platform activity</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-[#E5E7EB]">
            Mark All as Read
          </Button>
          <Button variant="outline" className="border-[#E5E7EB] text-red-600">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

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

      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`p-4 bg-white border-[#E5E7EB] hover:shadow-md transition-shadow ${
              !notification.read ? 'bg-blue-50/50' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="mt-1">{getIcon(notification.type)}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className={`text-sm ${!notification.read ? 'font-medium' : ''} text-[#1A1A1A]`}>
                    {notification.message}
                  </p>
                  {!notification.read && (
                    <Badge className="bg-[#1E88E5] text-white shrink-0">New</Badge>
                  )}
                </div>
                <p className="text-xs text-[#6B7280] mt-2">{notification.timestamp}</p>
              </div>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Trash2 className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
          </Card>
        ))}
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
