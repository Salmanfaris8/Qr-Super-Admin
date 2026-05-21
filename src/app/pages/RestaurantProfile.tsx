import { useParams, Link } from 'react-router';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Palette,
  QrCode,
  TrendingUp,
  Ban,
  CheckCircle,
  Edit
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { restaurants } from '../data/mockData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export function RestaurantProfile() {
  const { id } = useParams();
  const restaurant = restaurants.find(r => r.id === id);

  if (!restaurant) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/restaurants">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">Restaurant Not Found</h1>
        </div>
        <Card className="p-12 bg-white border-[#E5E7EB] text-center">
          <p className="text-[#6B7280]">The requested restaurant could not be found.</p>
        </Card>
      </div>
    );
  }

  // Mock scan data for the chart
  const scanData = [
    { date: '3/10', scans: 234 },
    { date: '3/11', scans: 289 },
    { date: '3/12', scans: 312 },
    { date: '3/13', scans: 276 },
    { date: '3/14', scans: 345 },
    { date: '3/15', scans: 398 },
    { date: '3/16', scans: 421 }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link to="/restaurants">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">Restaurant Profile</h1>
          <p className="text-sm text-[#6B7280] mt-1">Detailed information and analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-[#E5E7EB]">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          {restaurant.accountStatus === 'Active' ? (
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
              <Ban className="w-4 h-4 mr-2" />
              Suspend
            </Button>
          ) : (
            <Button variant="outline" className="border-green-200 text-green-600 hover:bg-green-50">
              <CheckCircle className="w-4 h-4 mr-2" />
              Activate
            </Button>
          )}
        </div>
      </div>

      {/* Restaurant Header Card */}
      <Card className="p-6 bg-white border-[#E5E7EB]">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Logo */}
          <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-[#1E88E5] to-[#00C853] flex items-center justify-center text-white text-3xl font-bold shrink-0">
            {restaurant.name.charAt(0)}
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-[#1A1A1A]">{restaurant.name}</h2>
                <p className="text-[#6B7280] mt-1">ID: {restaurant.id}</p>
              </div>
              <Badge
                className={`
                  ${restaurant.accountStatus === 'Active' ? 'bg-green-100 text-green-700' : ''}
                  ${restaurant.accountStatus === 'Suspended' ? 'bg-red-100 text-red-700' : ''}
                  ${restaurant.accountStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                `}
              >
                {restaurant.accountStatus}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-[#6B7280]">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{restaurant.email}</span>
              </div>
              <div className="flex items-center gap-3 text-[#6B7280]">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{restaurant.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-[#6B7280]">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{restaurant.address}</span>
              </div>
              <div className="flex items-center gap-3 text-[#6B7280]">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Joined {new Date(restaurant.joinedDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-white border-[#E5E7EB]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm text-[#6B7280]">Subscription</p>
          </div>
          <p className="text-2xl font-semibold text-[#1A1A1A]">{restaurant.subscriptionPlan}</p>
          <p className="text-sm text-[#6B7280] mt-1">${restaurant.monthlyRevenue}/month</p>
        </Card>

        <Card className="p-6 bg-white border-[#E5E7EB]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <QrCode className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-[#6B7280]">Total Scans</p>
          </div>
          <p className="text-2xl font-semibold text-[#1A1A1A]">{restaurant.qrScans.toLocaleString()}</p>
          <p className="text-sm text-green-600 mt-1">+12% this month</p>
        </Card>

        <Card className="p-6 bg-white border-[#E5E7EB]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Palette className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-[#6B7280]">Menu Theme</p>
          </div>
          <p className="text-lg font-semibold text-[#1A1A1A]">{restaurant.menuTheme}</p>
          <Button variant="link" className="text-[#1E88E5] p-0 h-auto mt-1 text-sm">
            Change Theme
          </Button>
        </Card>

        <Card className="p-6 bg-white border-[#E5E7EB]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-sm text-[#6B7280]">Avg. Daily Scans</p>
          </div>
          <p className="text-2xl font-semibold text-[#1A1A1A]">324</p>
          <p className="text-sm text-green-600 mt-1">+8% this week</p>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Owner Information */}
        <Card className="p-6 bg-white border-[#E5E7EB] lg:col-span-1">
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Owner Information</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Full Name</p>
              <p className="font-medium text-[#1A1A1A]">{restaurant.ownerName}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Email Address</p>
              <p className="font-medium text-[#1A1A1A]">{restaurant.email}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Phone Number</p>
              <p className="font-medium text-[#1A1A1A]">{restaurant.phone}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Location</p>
              <p className="font-medium text-[#1A1A1A]">{restaurant.location}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Full Address</p>
              <p className="font-medium text-[#1A1A1A]">{restaurant.address}</p>
            </div>
          </div>
        </Card>

        {/* Scan Analytics Chart */}
        <Card className="p-6 bg-white border-[#E5E7EB] lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#1A1A1A]">QR Scan Analytics</h3>
              <p className="text-sm text-[#6B7280] mt-1">Last 7 days performance</p>
            </div>
            <Button variant="outline" size="sm" className="border-[#E5E7EB]">
              View Details
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={scanData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" style={{ fontSize: '12px' }} />
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
                dataKey="scans"
                stroke="#1E88E5"
                strokeWidth={2}
                dot={{ fill: '#1E88E5', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Subscription Details */}
      <Card className="p-6 bg-white border-[#E5E7EB]">
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Subscription Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-[#6B7280] mb-1">Current Plan</p>
            <p className="text-xl font-semibold text-[#1A1A1A]">{restaurant.subscriptionPlan}</p>
          </div>
          <div>
            <p className="text-sm text-[#6B7280] mb-1">Monthly Fee</p>
            <p className="text-xl font-semibold text-[#1A1A1A]">${restaurant.monthlyRevenue}</p>
          </div>
          <div>
            <p className="text-sm text-[#6B7280] mb-1">Billing Cycle</p>
            <p className="text-xl font-semibold text-[#1A1A1A]">Monthly</p>
          </div>
          <div>
            <p className="text-sm text-[#6B7280] mb-1">Next Billing Date</p>
            <p className="text-xl font-semibold text-[#1A1A1A]">Apr 1, 2026</p>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="bg-[#1E88E5] hover:bg-[#1E88E5]/90 text-white">
            Upgrade Plan
          </Button>
          <Button variant="outline" className="border-[#E5E7EB]">
            View Payment History
          </Button>
          <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
            Cancel Subscription
          </Button>
        </div>
      </Card>

      {/* Action Logs */}
      <Card className="p-6 bg-white border-[#E5E7EB]">
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'Subscription renewed', date: 'Mar 1, 2026 10:30 AM', type: 'success' },
            { action: 'Menu theme updated', date: 'Feb 28, 2026 3:45 PM', type: 'info' },
            { action: 'QR code regenerated', date: 'Feb 25, 2026 11:20 AM', type: 'info' },
            { action: 'Profile information updated', date: 'Feb 20, 2026 2:15 PM', type: 'info' }
          ].map((log, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-[#E5E7EB] last:border-0">
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    log.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                />
                <p className="text-sm font-medium text-[#1A1A1A]">{log.action}</p>
              </div>
              <p className="text-sm text-[#6B7280]">{log.date}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
