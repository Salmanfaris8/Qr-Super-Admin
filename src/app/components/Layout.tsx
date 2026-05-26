import { useEffect, useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router';
import {
  LayoutDashboard,
  Store,
  Palette,
  CreditCard,
  IndianRupee,
  BarChart3,
  QrCode,
  Users,
  Headphones,
  Bell,
  Settings,
  FileText,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  LogOut
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import axios from 'axios';


interface NavItem {
  name: string
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

export function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [ticketCount, setTicketCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();

  const admin = JSON.parse(localStorage.getItem("admin"));
  const token = localStorage.getItem("token")

  const API = import.meta.env.VITE_API_URL;

  const fetchTicketCount = async () => {
    try {
      const res = await axios.get(`${API}/superadmin/support/tickets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const openTickets = res.data.data?.filter((t: any) => t.status !== 'closed') || [];
      setTicketCount(openTickets.length);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchNotificationCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}/superadmin/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success) {
        const unreadCount = res.data.data.filter((n: any) => !n.isRead).length || 0;
        setNotifications(unreadCount);
      }
    } catch (err: any) {
      console.error('Fetch notifications failed:', err);
    }
  };

  useEffect(() => {
    fetchTicketCount();
    fetchNotificationCount();

    // Poll for notifications and tickets every 4 seconds for instant database sync
    const interval = setInterval(() => {
      fetchTicketCount();
      fetchNotificationCount();
    }, 4000);

    window.addEventListener('notificationsUpdated', fetchNotificationCount);
    return () => {
      clearInterval(interval);
      window.removeEventListener('notificationsUpdated', fetchNotificationCount);
    };
  }, []);

  const navItems: NavItem[] = [
    { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
    { name: 'Restaurants', icon: <Store className="w-5 h-5" />, path: '/restaurants' },
    { name: 'Menu Themes', icon: <Palette className="w-5 h-5" />, path: '/themes' },
    { name: 'Subscriptions', icon: <CreditCard className="w-5 h-5" />, path: '/subscriptions' },
    { name: 'Payments', icon: <IndianRupee className="w-5 h-5" />, path: '/payments' },
    { name: 'Revenue Analytics', icon: <BarChart3 className="w-5 h-5" />, path: '/revenue-analytics' },
    { name: 'QR Analytics', icon: <QrCode className="w-5 h-5" />, path: '/qr-analytics' },
    // { name: 'Users', icon: <Users className="w-5 h-5" />, path: '/users' },
    { name: 'Support Tickets', icon: <Headphones className="w-5 h-5" />, path: '/support', badge: ticketCount },
    { name: 'Notifications', icon: <Bell className="w-5 h-5" />, path: '/notifications', badge: notifications },
    // { name: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/settings' },
    { name: 'System Logs', icon: <FileText className="w-5 h-5" />, path: '/logs' }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-[#E5E7EB] z-50 transition-all duration-300
          ${sidebarCollapsed ? 'w-20' : 'w-64'}
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#E5E7EB]">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#1E88E5] to-[#00C853] rounded-lg flex items-center justify-center">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-[#1A1A1A]">QR Hotels</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-3 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                  ${isActive(item.path)
                    ? 'bg-[#1E88E5]/10 text-[#1E88E5]'
                    : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#1A1A1A]'
                  }
                  ${sidebarCollapsed ? 'justify-center' : ''}
                `}
              >
                <div className="relative">
                  {item.icon}
                  {item.badge !== undefined && item.badge > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00C853] rounded-full flex items-center justify-center">
                      <span className="text-[10px] text-white font-medium">{item.badge}</span>
                    </div>
                  )}
                </div>
                {!sidebarCollapsed && (
                  <span className="flex-1 text-sm font-medium">{item.name}</span>
                )}
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div
        className={`
          transition-all duration-300
          ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
        `}
      >
        {/* Header */}
        <header className="h-16 bg-white border-b border-[#E5E7EB] sticky top-0 z-30">
          <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Search */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <Input
                  type="search"
                  placeholder="Search restaurants, users, tickets..."
                  className="pl-10 bg-[#F5F7FA] border-transparent focus:bg-white"
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#00C853] rounded-full" />
              </Button>

              {/* User Menu */}
              <div className="flex items-center gap-3 pl-3 border-l border-[#E5E7EB]">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-[#1A1A1A]">{admin?.name}</p>
                  <p className="text-xs text-[#6B7280]">Super Admin</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1E88E5] to-[#00C853] flex items-center justify-center">
                  <span className="text-sm font-medium text-white">{admin?.name?.charAt(0)?.toUpperCase() || "A"}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
