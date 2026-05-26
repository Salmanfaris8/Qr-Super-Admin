import { useState, useEffect } from 'react';
import { TrendingUp, IndianRupee, Calendar, Loader, AlertCircle } from 'lucide-react';
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
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export function RevenueAnalytics() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/superadmin/restaurants`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success) {
        const mappedPayments = res.data.data.map((r: any) => {
          let paymentStatus: 'Completed' | 'Pending' | 'Failed' = 'Completed';
          if (r.accountStatus === 'Pending') {
            paymentStatus = 'Pending';
          } else if (r.accountStatus === 'Suspended') {
            paymentStatus = 'Failed';
          }

          return {
            id: `PAY-${r.dbId}`,
            restaurantName: r.name,
            amount: r.monthlyRevenue || 0,
            plan: r.subscriptionPlan || 'Basic',
            date: r.createdAt || new Date().toISOString(),
            status: paymentStatus
          };
        });
        setPayments(mappedPayments);
      }
    } catch (err: any) {
      console.error('Fetch revenue failed:', err);
      setError(err.response?.data?.message || 'Failed to load revenue details from backend.');
    } finally {
      setLoading(false);
    }
  };

  const isToday = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    return d.getDate() === today.getDate() &&
           d.getMonth() === today.getMonth() &&
           d.getFullYear() === today.getFullYear();
  };

  const isThisMonth = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    return d.getMonth() === today.getMonth() &&
           d.getFullYear() === today.getFullYear();
  };

  const isThisYear = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    return d.getFullYear() === today.getFullYear();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-[#1E88E5] mx-auto mb-4" />
          <p className="text-[#6B7280]">Loading revenue analytics...</p>
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
            <h3 className="font-semibold text-red-900 mb-2">Error Loading Analytics</h3>
            <p className="text-red-700">{error}</p>
            <Button onClick={fetchRevenueData} variant="outline" className="mt-4 border-red-300 text-red-700 hover:bg-red-100">
              Try Again
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Calculate live stats
  const todayRevenue = payments
    .filter(p => p.status === 'Completed' && isToday(p.date))
    .reduce((sum, p) => sum + p.amount, 0);

  const monthlyRevenue = payments
    .filter(p => p.status === 'Completed' && isThisMonth(p.date))
    .reduce((sum, p) => sum + p.amount, 0);

  const yearlyRevenue = payments
    .filter(p => p.status === 'Completed' && isThisYear(p.date))
    .reduce((sum, p) => sum + p.amount, 0);

  const activeUsersCount = payments.filter(p => p.status === 'Completed').length;
  const avgRevenuePerUser = activeUsersCount > 0 ? Math.round(monthlyRevenue / activeUsersCount) : 0;

  // Build chart dataset
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const chartData = [];
  const todayVal = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(todayVal.getFullYear(), todayVal.getMonth() - i, 1);
    const monthName = months[d.getMonth()];
    const year = d.getFullYear();
    
    const rev = payments
      .filter(p => {
        const pDate = new Date(p.date);
        return p.status === 'Completed' && 
               pDate.getMonth() === d.getMonth() && 
               pDate.getFullYear() === year;
      })
      .reduce((sum, p) => sum + p.amount, 0);

    const target = rev > 0 ? Math.round(rev * 0.95) : 3000 + (6 - i) * 800;

    chartData.push({
      month: monthName,
      revenue: rev,
      target: target
    });
  }

  // Top paying restaurants from live data
  const topPaying = [...payments]
    .filter(p => p.status === 'Completed')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)
    .map(p => ({
      name: p.restaurantName,
      revenue: p.amount
    }));

  // Plan counts & revenues
  const starterCount = payments.filter(p => p.status === 'Completed' && (p.plan === 'Starter' || p.plan === 'Basic')).length;
  const starterRev = payments.filter(p => p.status === 'Completed' && (p.plan === 'Starter' || p.plan === 'Basic')).reduce((sum, p) => sum + p.amount, 0);
  
  const proCount = payments.filter(p => p.status === 'Completed' && (p.plan === 'Pro' || p.plan === 'Standard')).length;
  const proRev = payments.filter(p => p.status === 'Completed' && (p.plan === 'Pro' || p.plan === 'Standard')).reduce((sum, p) => sum + p.amount, 0);

  const premiumCount = payments.filter(p => p.status === 'Completed' && p.plan === 'Premium').length;
  const premiumRev = payments.filter(p => p.status === 'Completed' && p.plan === 'Premium').reduce((sum, p) => sum + p.amount, 0);

  const totalRevSum = starterRev + proRev + premiumRev;
  const starterPercent = totalRevSum > 0 ? ((starterRev / totalRevSum) * 100).toFixed(1) : '0';
  const proPercent = totalRevSum > 0 ? ((proRev / totalRevSum) * 100).toFixed(1) : '0';
  const premiumPercent = totalRevSum > 0 ? ((premiumRev / totalRevSum) * 100).toFixed(1) : '0';

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
              <IndianRupee className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-[#6B7280]">Today's Revenue</p>
          </div>
          <p className="text-3xl font-semibold text-[#1A1A1A]">₹{todayRevenue.toLocaleString()}</p>
          <p className="text-sm text-green-600 mt-2">Active subscriptions today</p>
        </Card>
        <Card className="p-6 bg-white border-[#E5E7EB]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-[#6B7280]">Monthly Revenue</p>
          </div>
          <p className="text-3xl font-semibold text-[#1A1A1A]">₹{monthlyRevenue.toLocaleString()}</p>
          <p className="text-sm text-green-600 mt-2">Current month total</p>
        </Card>
        <Card className="p-6 bg-white border-[#E5E7EB]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm text-[#6B7280]">Yearly Revenue</p>
          </div>
          <p className="text-3xl font-semibold text-[#1A1A1A]">₹{yearlyRevenue.toLocaleString()}</p>
          <p className="text-sm text-green-600 mt-2">Current year total</p>
        </Card>
        <Card className="p-6 bg-white border-[#E5E7EB]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-sm text-[#6B7280]">Avg Revenue Per User</p>
          </div>
          <p className="text-3xl font-semibold text-[#1A1A1A]">₹{avgRevenuePerUser.toLocaleString()}</p>
          <p className="text-sm text-blue-600 mt-2">Active subscribers average</p>
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
          <LineChart data={chartData}>
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
          <BarChart data={topPaying} layout="vertical">
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
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Starter Plan Revenue</h3>
          <p className="text-3xl font-semibold text-[#1A1A1A]">₹{starterRev.toLocaleString()}</p>
          <p className="text-sm text-[#6B7280] mt-2">{starterCount} subscribers</p>
          <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
            <p className="text-sm text-[#6B7280]">% of Total Revenue</p>
            <p className="text-xl font-semibold text-[#1A1A1A] mt-1">{starterPercent}%</p>
          </div>
        </Card>
        <Card className="p-6 bg-white border-[#E5E7EB]">
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Pro Plan Revenue</h3>
          <p className="text-3xl font-semibold text-[#1A1A1A]">₹{proRev.toLocaleString()}</p>
          <p className="text-sm text-[#6B7280] mt-2">{proCount} subscribers</p>
          <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
            <p className="text-sm text-[#6B7280]">% of Total Revenue</p>
            <p className="text-xl font-semibold text-[#1A1A1A] mt-1">{proPercent}%</p>
          </div>
        </Card>
        <Card className="p-6 bg-white border-[#E5E7EB]">
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Premium Plan Revenue</h3>
          <p className="text-3xl font-semibold text-[#1A1A1A]">₹{premiumRev.toLocaleString()}</p>
          <p className="text-sm text-[#6B7280] mt-2">{premiumCount} subscribers</p>
          <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
            <p className="text-sm text-[#6B7280]">% of Total Revenue</p>
            <p className="text-xl font-semibold text-[#1A1A1A] mt-1">{premiumPercent}%</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
