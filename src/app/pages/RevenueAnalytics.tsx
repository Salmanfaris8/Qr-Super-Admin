import { TrendingUp, DollarSign, Calendar } from 'lucide-react';
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
  Legend
} from 'recharts';
import { revenueGrowthData, topPayingRestaurants } from '../data/mockData';

export function RevenueAnalytics() {
  const monthlyGrowthData = [
    { month: 'Jan', revenue: 11500, target: 11000 },
    { month: 'Feb', revenue: 11900, target: 11500 },
    { month: 'Mar', revenue: 12450, target: 12000 },
    { month: 'Apr', revenue: 13200, target: 12500 },
    { month: 'May', revenue: 13800, target: 13000 },
    { month: 'Jun', revenue: 14500, target: 13500 }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#1A1A1A]">Revenue Analytics</h1>
        <p className="text-sm text-[#6B7280] mt-1">Track and analyze platform revenue performance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-white border-[#E5E7EB]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-[#6B7280]">Monthly Revenue</p>
          </div>
          <p className="text-3xl font-semibold text-[#1A1A1A]">$12,450</p>
          <p className="text-sm text-green-600 mt-2">+18% from last month</p>
        </Card>
        <Card className="p-6 bg-white border-[#E5E7EB]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-[#6B7280]">Yearly Revenue</p>
          </div>
          <p className="text-3xl font-semibold text-[#1A1A1A]">$138,650</p>
          <p className="text-sm text-green-600 mt-2">+24% YoY</p>
        </Card>
        <Card className="p-6 bg-white border-[#E5E7EB]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm text-[#6B7280]">Avg Revenue Per User</p>
          </div>
          <p className="text-3xl font-semibold text-[#1A1A1A]">$127</p>
          <p className="text-sm text-green-600 mt-2">+5% increase</p>
        </Card>
        <Card className="p-6 bg-white border-[#E5E7EB]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-sm text-[#6B7280]">Projected (Next Month)</p>
          </div>
          <p className="text-3xl font-semibold text-[#1A1A1A]">$13,200</p>
          <p className="text-sm text-blue-600 mt-2">Based on trends</p>
        </Card>
      </div>

      {/* Revenue Growth Chart */}
      <Card className="p-6 bg-white border-[#E5E7EB]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[#1A1A1A]">Revenue Growth Trend</h3>
            <p className="text-sm text-[#6B7280] mt-1">Monthly revenue vs targets</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#00C853] rounded-full" />
              <span className="text-sm text-[#6B7280]">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#1E88E5] rounded-full" />
              <span className="text-sm text-[#6B7280]">Target</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={monthlyGrowthData}>
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
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#00C853"
              strokeWidth={3}
              dot={{ fill: '#00C853', r: 5 }}
              name="Actual Revenue"
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#1E88E5"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#1E88E5', r: 4 }}
              name="Target"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Top Paying Restaurants */}
      <Card className="p-6 bg-white border-[#E5E7EB]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[#1A1A1A]">Top Paying Restaurants</h3>
            <p className="text-sm text-[#6B7280] mt-1">Highest revenue contributors (YTD)</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topPayingRestaurants} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis type="number" stroke="#6B7280" style={{ fontSize: '12px' }} />
            <YAxis dataKey="name" type="category" width={150} stroke="#6B7280" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="revenue" fill="#1E88E5" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Revenue by Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-white border-[#E5E7EB]">
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Basic Plan Revenue</h3>
          <p className="text-3xl font-semibold text-[#1A1A1A]">$588</p>
          <p className="text-sm text-[#6B7280] mt-2">12 subscribers × $49</p>
          <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
            <p className="text-sm text-[#6B7280]">% of Total Revenue</p>
            <p className="text-xl font-semibold text-[#1A1A1A] mt-1">4.7%</p>
          </div>
        </Card>
        <Card className="p-6 bg-white border-[#E5E7EB]">
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Standard Plan Revenue</h3>
          <p className="text-3xl font-semibold text-[#1A1A1A]">$4,172</p>
          <p className="text-sm text-[#6B7280] mt-2">28 subscribers × $149</p>
          <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
            <p className="text-sm text-[#6B7280]">% of Total Revenue</p>
            <p className="text-xl font-semibold text-[#1A1A1A] mt-1">33.5%</p>
          </div>
        </Card>
        <Card className="p-6 bg-white border-[#E5E7EB]">
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Premium Plan Revenue</h3>
          <p className="text-3xl font-semibold text-[#1A1A1A]">$17,342</p>
          <p className="text-sm text-[#6B7280] mt-2">58 subscribers × $299</p>
          <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
            <p className="text-sm text-[#6B7280]">% of Total Revenue</p>
            <p className="text-xl font-semibold text-[#1A1A1A] mt-1">61.8%</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
