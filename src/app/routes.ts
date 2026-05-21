import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Restaurants } from './pages/Restaurants';
import { RestaurantProfile } from './pages/RestaurantProfile';
import { Approvals } from './pages/Approvals';
import { MenuThemes } from './pages/MenuThemes';
import { Subscriptions } from './pages/Subscriptions';
import { Payments } from './pages/Payments';
import { RevenueAnalytics } from './pages/RevenueAnalytics';
import { QRAnalytics } from './pages/QRAnalytics';
import { Users } from './pages/Users';
import { Support } from './pages/Support';
import { Notifications } from './pages/Notifications';
import { Settings } from './pages/Settings';
import { SystemLogs } from './pages/SystemLogs';
import Login from './pages/Login/Login';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Login,
  },
  {
    path: '/',
    Component: Layout,
    children: [
      { path: 'dashboard', Component: Dashboard },
      { path: 'restaurants', Component: Restaurants },
      { path: 'restaurants/:id', Component: RestaurantProfile },
      { path: 'approvals', Component: Approvals },
      { path: 'themes', Component: MenuThemes },
      { path: 'subscriptions', Component: Subscriptions },
      { path: 'payments', Component: Payments },
      { path: 'revenue-analytics', Component: RevenueAnalytics },
      { path: 'qr-analytics', Component: QRAnalytics },
      { path: 'users', Component: Users },
      { path: 'support', Component: Support },
      { path: 'notifications', Component: Notifications },
      { path: 'settings', Component: Settings },
      { path: 'logs', Component: SystemLogs }
    ]
  }
]);
