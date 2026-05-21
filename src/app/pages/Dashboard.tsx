import { Link } from 'react-router';
import {
  Store,
  CreditCard,
  DollarSign,
  QrCode,
  TrendingUp,
  CheckCircle,
  Palette,
  Headphones,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  restaurantGrowthData,
  revenueGrowthData,
  qrScansData,
  restaurants,
  supportTickets,
  pendingRestaurants
} from '../data/mockData';

export function Dashboard() {
  const totalRestaurants = restaurants.length;
  const activeSubscriptions = restaurants.filter(r => r.accountStatus === 'Active').length;
  const monthlyRevenue = restaurants.reduce((sum, r) => sum + r.monthlyRevenue, 0);
  const todayScans = 25610; // Mock today's scans
  const openTickets = supportTickets.filter(t => t.status === 'Open').length;
  const pendingApprovals = pendingRestaurants.length;

  const stats = [
    {
      title: 'Total Restaurants',
      value: totalRestaurants,
      change: '+12%',
      trend: 'up',
      icon: <Store className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Subscriptions',
      value: activeSubscriptions,
      change: '+8%',
      trend: 'up',
      icon: <CreditCard className="w-6 h-6" />,
      color: 'bg-green-500'
    },
    {
      title: 'Monthly Revenue',
      value: `$${monthlyRevenue.toLocaleString()}`,
      change: '+18%',
      trend: 'up',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-purple-500'
    },
    {
      title: 'QR Scans Today',
      value: todayScans.toLocaleString(),
      change: '+24%',
      trend: 'up',
      icon: <QrCode className="w-6 h-6" />,
      color: 'bg-orange-500'
    }
  ];

  const quickActions = [
    {
      title: 'Approve Restaurants',
      description: `${pendingApprovals} pending approvals`,
      icon: <CheckCircle className="w-5 h-5" />,
      link: '/approvals',
      color: 'text-[#1E88E5]'
    },
    {
      title: 'Add Menu Theme',
      description: 'Upload new template',
      icon: <Palette className="w-5 h-5" />,
      link: '/themes',
      color: 'text-[#00C853]'
    },
    {
      title: 'View Support Tickets',
      description: `${openTickets} open tickets`,
      icon: <Headphones className="w-5 h-5" />,
      link: '/support',
      color: 'text-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#1A1A1A]">Dashboard</h1>
        <p className="text-sm text-[#6B7280] mt-1">Welcome back! Here's what's happening with your platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 bg-white border-[#E5E7EB] hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-[#6B7280] font-medium">{stat.title}</p>
                <p className="text-3xl font-semibold text-[#1A1A1A] mt-2">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.trend === 'up' ? (
                    <ArrowUp className="w-4 h-4 text-[#00C853]" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-[#00C853]' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-[#6B7280]">vs last month</span>
                </div>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center text-white`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Restaurant Growth */}
        <Card className="p-6 bg-white border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#1A1A1A]">Restaurant Growth</h3>
              <p className="text-sm text-[#6B7280] mt-1">Total restaurants over time</p>
            </div>
            <TrendingUp className="w-5 h-5 text-[#00C853]" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={restaurantGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#1E88E5"
                strokeWidth={2}
                dot={{ fill: '#1E88E5', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue Growth */}
        <Card className="p-6 bg-white border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#1A1A1A]">Revenue Growth</h3>
              <p className="text-sm text-[#6B7280] mt-1">Monthly recurring revenue</p>
            </div>
            <DollarSign className="w-5 h-5 text-[#00C853]" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#00C853"
                strokeWidth={2}
                dot={{ fill: '#00C853', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Daily QR Scans Chart */}
      <Card className="p-6 bg-white border-[#E5E7EB]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[#1A1A1A]">Daily QR Scans</h3>
            <p className="text-sm text-[#6B7280] mt-1">This week's scan activity</p>
          </div>
          <QrCode className="w-5 h-5 text-[#1E88E5]" />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={qrScansData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="day" stroke="#6B7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="scans" fill="#1E88E5" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.link}>
              <Card className="p-6 bg-white border-[#E5E7EB] hover:shadow-lg hover:border-[#1E88E5] transition-all cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center ${action.color}`}>
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#1A1A1A]">{action.title}</h4>
                    <p className="text-sm text-[#6B7280] mt-1">{action.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Restaurants */}
        <Card className="p-6 bg-white border-[#E5E7EB]">
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Top Restaurants by Scans</h3>
          <div className="space-y-4">
            {restaurants
              .sort((a, b) => b.qrScans - a.qrScans)
              .slice(0, 5)
              .map((restaurant, index) => (
                <div key={restaurant.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1E88E5] to-[#00C853] flex items-center justify-center text-white text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#1A1A1A]">{restaurant.name}</p>
                    <p className="text-sm text-[#6B7280]">{restaurant.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#1A1A1A]">{restaurant.qrScans.toLocaleString()}</p>
                    <p className="text-xs text-[#6B7280]">scans</p>
                  </div>
                </div>
              ))}
          </div>
        </Card>

        {/* Recent Support Tickets */}
        <Card className="p-6 bg-white border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#1A1A1A]">Recent Support Tickets</h3>
            <Link to="/support">
              <Button variant="link" className="text-[#1E88E5] p-0 h-auto">View All</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {supportTickets.slice(0, 5).map((ticket) => (
              <div key={ticket.id} className="flex items-start gap-3 pb-4 border-b border-[#E5E7EB] last:border-0 last:pb-0">
                <div className="flex-1">
                  <p className="font-medium text-[#1A1A1A]">{ticket.subject}</p>
                  <p className="text-sm text-[#6B7280] mt-1">{ticket.restaurant}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.priority === 'Urgent'
                        ? 'bg-red-100 text-red-700'
                        : ticket.priority === 'High'
                        ? 'bg-orange-100 text-orange-700'
                        : ticket.priority === 'Medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {ticket.priority}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.status === 'Open'
                        ? 'bg-gray-100 text-gray-700'
                        : ticket.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-700'
                        : ticket.status === 'Resolved'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
