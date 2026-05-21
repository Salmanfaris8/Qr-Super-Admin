import { QrCode, TrendingUp, Clock, MapPin } from 'lucide-react';
import { Card } from '../components/ui/card';
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
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { qrScansData, peakHoursData, restaurants } from '../data/mockData';

export function QRAnalytics() {
  const deviceData = [
    { name: 'Mobile', value: 68, color: '#1E88E5' },
    { name: 'Tablet', value: 22, color: '#00C853' },
    { name: 'Desktop', value: 10, color: '#FFA726' }
  ];

  const scansByLocation = [
    { location: 'New York, NY', scans: 15234 },
    { location: 'Los Angeles, CA', scans: 12890 },
    { location: 'San Francisco, CA', scans: 11456 },
    { location: 'Chicago, IL', scans: 9876 },
    { location: 'Miami, FL', scans: 8456 }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#1A1A1A]">QR Analytics</h1>
        <p className="text-sm text-[#6B7280] mt-1">Track QR code scan performance and patterns</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-white border-[#E5E7EB]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <QrCode className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-[#6B7280]">Total Scans Today</p>
          </div>
          <p className="text-3xl font-semibold text-[#1A1A1A]">25,610</p>
          <p className="text-sm text-green-600 mt-2">+24% from yesterday</p>
        </Card>
        <Card className="p-6 bg-white border-[#E5E7EB]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-[#6B7280]">This Week</p>
          </div>
          <p className="text-3xl font-semibold text-[#1A1A1A]">156,340</p>
          <p className="text-sm text-green-600 mt-2">+15% vs last week</p>
        </Card>
        <Card className="p-6 bg-white border-[#E5E7EB]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm text-[#6B7280]">Peak Hour</p>
          </div>
          <p className="text-3xl font-semibold text-[#1A1A1A]">6 PM</p>
          <p className="text-sm text-[#6B7280] mt-2">2,340 scans/hour</p>
        </Card>
        <Card className="p-6 bg-white border-[#E5E7EB]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-sm text-[#6B7280]">Top Location</p>
          </div>
          <p className="text-xl font-semibold text-[#1A1A1A]">New York</p>
          <p className="text-sm text-[#6B7280] mt-2">15,234 scans</p>
        </Card>
      </div>

      {/* Daily Scans Chart */}
      <Card className="p-6 bg-white border-[#E5E7EB]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[#1A1A1A]">Daily QR Scans</h3>
            <p className="text-sm text-[#6B7280] mt-1">This week's scan activity</p>
          </div>
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

      {/* Peak Hours and Device Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Hours */}
        <Card className="p-6 bg-white border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#1A1A1A]">Peak Scanning Hours</h3>
              <p className="text-sm text-[#6B7280] mt-1">Average hourly scan distribution</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={peakHoursData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="hour" stroke="#6B7280" style={{ fontSize: '12px' }} />
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
                stroke="#00C853"
                strokeWidth={2}
                dot={{ fill: '#00C853', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Device Distribution */}
        <Card className="p-6 bg-white border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#1A1A1A]">Device Distribution</h3>
              <p className="text-sm text-[#6B7280] mt-1">Scans by device type</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {deviceData.map((device, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: device.color }} />
                  <span className="text-sm text-[#6B7280]">{device.name}</span>
                </div>
                <span className="text-sm font-medium text-[#1A1A1A]">{device.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Locations & Top Restaurants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Locations by Scans */}
        <Card className="p-6 bg-white border-[#E5E7EB]">
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Top Locations by Scans</h3>
          <div className="space-y-4">
            {scansByLocation.map((location, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1E88E5] to-[#00C853] flex items-center justify-center text-white text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#1A1A1A]">{location.location}</p>
                  <div className="w-full h-2 bg-gray-100 rounded-full mt-2">
                    <div
                      className="h-full bg-gradient-to-r from-[#1E88E5] to-[#00C853] rounded-full"
                      style={{ width: `${(location.scans / 15234) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#1A1A1A]">{location.scans.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Restaurants by Scans */}
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
      </div>
    </div>
  );
}
