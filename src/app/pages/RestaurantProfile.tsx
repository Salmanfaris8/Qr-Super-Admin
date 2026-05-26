import { useParams, Link } from 'react-router';
import { useState, useEffect } from 'react';
import axios from 'axios';
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
  Edit,
  RefreshCw,
  FolderHeart,
  Utensils
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export function RestaurantProfile() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurantDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/superadmin/restaurants/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success) {
        setRestaurant(res.data.data);
      } else {
        setError(res.data?.message || 'Failed to load restaurant details.');
      }
    } catch (err: any) {
      console.error('Fetch restaurant details failed:', err);
      setError(err.response?.data?.message || 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRestaurantDetails();
    }
  }, [id]);

  const handleToggleStatus = async () => {
    if (!restaurant) return;
    const currentStatus = restaurant.accountStatus; // 'Active', 'Suspended', or 'Pending'
    const newStatus = currentStatus === 'Active' ? 'suspended' : 'active';
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `${API_BASE_URL}/superadmin/restaurants/${restaurant.dbId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success) {
        setRestaurant((prev: any) => ({
          ...prev,
          status: newStatus,
          accountStatus: newStatus === 'active' ? 'Active' : 'Suspended'
        }));
      }
    } catch (err: any) {
      console.error('Toggle restaurant status failed:', err);
      alert(err.response?.data?.message || 'Failed to update restaurant status.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <RefreshCw className="w-8 h-8 text-[#1E88E5] animate-spin" />
        <p className="text-sm text-[#6B7280]">Loading restaurant profile...</p>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/restaurants">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">Restaurant Profile</h1>
        </div>
        <Card className="p-12 bg-white border-[#E5E7EB] text-center max-w-lg mx-auto">
          <p className="text-red-600 font-medium mb-4">{error || 'The requested restaurant could not be found.'}</p>
          <Button onClick={fetchRestaurantDetails} className="bg-[#1E88E5] text-white">
            Retry Connection
          </Button>
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

  // Dynamic Theme resolution
  const currentTheme = restaurant.activeThemeId ? `Template ${restaurant.activeThemeId}` : 'Rimberio Custom';

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
          {restaurant.accountStatus === 'Active' ? (
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={handleToggleStatus}>
              <Ban className="w-4 h-4 mr-2" />
              Suspend
            </Button>
          ) : (
            <Button variant="outline" className="border-green-200 text-green-600 hover:bg-green-50" onClick={handleToggleStatus}>
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
          {restaurant.logo ? (
            <img
              src={restaurant.logo.startsWith('http') ? restaurant.logo : `${API_BASE_URL.replace('/api', '')}/${restaurant.logo}`}
              alt="logo"
              className="w-24 h-24 rounded-xl object-cover shrink-0"
            />
          ) : (
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-[#1E88E5] to-[#00C853] flex items-center justify-center text-white text-3xl font-bold shrink-0">
              {restaurant.name.charAt(0)}
            </div>
          )}

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
                <span className="text-sm">{restaurant.email || restaurant.owner?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-[#6B7280]">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{restaurant.phone || restaurant.owner?.mobile || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 text-[#6B7280]">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{restaurant.address || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 text-[#6B7280]">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Joined {new Date(restaurant.createdAt).toLocaleDateString()}</span>
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
          <p className="text-2xl font-semibold text-[#1A1A1A]">{restaurant.owner?.subscription?.planName || 'Basic'}</p>
          <p className="text-sm text-[#6B7280] mt-1">${restaurant.owner?.subscription?.price || 0}/month</p>
        </Card>

        <Card className="p-6 bg-white border-[#E5E7EB]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <QrCode className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-[#6B7280]">QR Codes</p>
          </div>
          <p className="text-2xl font-semibold text-[#1A1A1A]">{restaurant.stats?.qrCodesCount || 0}</p>
          <p className="text-sm text-[#6B7280] mt-1">Physical table stickers</p>
        </Card>

        <Card className="p-6 bg-white border-[#E5E7EB]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <FolderHeart className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-[#6B7280]">Categories</p>
          </div>
          <p className="text-2xl font-semibold text-[#1A1A1A]">{restaurant.stats?.categoriesCount || 0}</p>
          <p className="text-sm text-[#6B7280] mt-1">Active menu categories</p>
        </Card>

        <Card className="p-6 bg-white border-[#E5E7EB]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Utensils className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-sm text-[#6B7280]">Menu Items</p>
          </div>
          <p className="text-2xl font-semibold text-[#1A1A1A]">{restaurant.stats?.itemsCount || 0}</p>
          <p className="text-sm text-[#6B7280] mt-1">Total dishes managed</p>
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
              <p className="font-medium text-[#1A1A1A]">{restaurant.owner?.name || 'N/A'}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Email Address</p>
              <p className="font-medium text-[#1A1A1A]">{restaurant.owner?.email || 'N/A'}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Phone Number</p>
              <p className="font-medium text-[#1A1A1A]">{restaurant.owner?.mobile || 'N/A'}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Location</p>
              <p className="font-medium text-[#1A1A1A]">{restaurant.address || 'N/A'}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Auth Type</p>
              <Badge variant="outline" className="capitalize">
                {restaurant.owner?.provider || 'Email'}
              </Badge>
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
            <p className="text-xl font-semibold text-[#1A1A1A]">{restaurant.owner?.subscription?.planName || 'Basic'}</p>
          </div>
          <div>
            <p className="text-sm text-[#6B7280] mb-1">Monthly Fee</p>
            <p className="text-xl font-semibold text-[#1A1A1A]">₹{restaurant.owner?.subscription?.price || 0}</p>
          </div>
          <div>
            <p className="text-sm text-[#6B7280] mb-1">Billing Cycle</p>
            <p className="text-xl font-semibold text-[#1A1A1A]">Monthly</p>
          </div>
          <div>
            <p className="text-sm text-[#6B7280] mb-1">Expiry Date</p>
            <p className="text-xl font-semibold text-[#1A1A1A]">
              {restaurant.owner?.subscription?.expiryDate
                ? new Date(restaurant.owner.subscription.expiryDate).toLocaleDateString()
                : 'Lifetime'}
            </p>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="bg-[#1E88E5] hover:bg-[#1E88E5]/90 text-white" onClick={() => alert('Upgrade options managed on hotel admin portal.')}>
            Configure Limits
          </Button>
          <Button variant="outline" className="border-[#E5E7EB]" onClick={() => alert('No transaction records found.')}>
            View Payment History
          </Button>
          <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={handleToggleStatus}>
            {restaurant.accountStatus === 'Active' ? 'Suspend Account' : 'Activate Account'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

