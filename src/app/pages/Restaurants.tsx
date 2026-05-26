import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Search, Filter, Download, Eye, Edit, Ban, Trash2, Plus, RefreshCw, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export function Restaurants() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/superadmin/restaurants`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success) {
        setRestaurants(res.data.data || []);
      } else {
        setError(res.data?.message || 'Failed to load restaurants.');
      }
    } catch (err: any) {
      console.error('Fetch restaurants failed:', err);
      setError(err.response?.data?.message || 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleToggleStatus = async (restaurant: any) => {
    const currentStatus = restaurant.accountStatus;
    const newStatus = currentStatus === 'Active' ? 'suspended' : 'active';
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `${API_BASE_URL}/superadmin/restaurants/${restaurant.dbId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success) {
        setRestaurants(prev =>
          prev.map(r =>
            r.dbId === restaurant.dbId
              ? { ...r, accountStatus: newStatus === 'active' ? 'Active' : 'Suspended' }
              : r
          )
        );
        window.dispatchEvent(new Event('notificationsUpdated'));
      }
    } catch (err: any) {
      console.error('Toggle restaurant status failed:', err);
      alert(err.response?.data?.message || 'Failed to update restaurant status.');
    }
  };

  const handleDeleteRestaurant = async (dbId: number) => {
    if (!confirm('Are you sure you want to delete this restaurant and all associated menus, items, categories, QR codes, and administrator credentials? This action cannot be undone.')) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`${API_BASE_URL}/superadmin/restaurants/${dbId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success) {
        setRestaurants(prev => prev.filter(r => r.dbId !== dbId));
        window.dispatchEvent(new Event('notificationsUpdated'));
      }
    } catch (err: any) {
      console.error('Delete restaurant failed:', err);
      alert(err.response?.data?.message || 'Failed to delete restaurant.');
    }
  };

  const handleExportPDF = async () => {
    const input = document.createElement("div");
    input.style.position = "fixed";
    input.style.top = "-9999px";
    input.style.left = "-9999px";
    input.style.width = "1100px";

    const tableRows = filteredRestaurants.map(r => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; font-weight: 500; font-size: 13px;">${r.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; font-family: monospace; font-size: 13px;">${r.id}</td>
        <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; font-size: 13px;">${r.ownerName}</td>
        <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; font-size: 13px;">${r.location}</td>
        <td style="padding: 10px; border-bottom: 1px solid #E5E7EB;">
          <span style="padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;
            background-color: ${r.subscriptionPlan === 'Premium' ? '#FAF5FF' : r.subscriptionPlan === 'Standard' ? '#EFF6FF' : '#F3F4F6'};
            color: ${r.subscriptionPlan === 'Premium' ? '#6B21A8' : r.subscriptionPlan === 'Standard' ? '#1D4ED8' : '#374151'};">
            ${r.subscriptionPlan}
          </span>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #E5E7EB;">
          <span style="padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;
            background-color: ${r.accountStatus === 'Active' ? '#ECFDF5' : r.accountStatus === 'Suspended' ? '#FEF2F2' : '#FEF3C7'};
            color: ${r.accountStatus === 'Active' ? '#047857' : r.accountStatus === 'Suspended' ? '#B91C1C' : '#D97706'};">
            ${r.accountStatus}
          </span>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; font-weight: bold; font-size: 13px;">&#8377;${r.monthlyRevenue}</td>
      </tr>
    `).join('');

    input.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 40px; color: #1A1A1A; background: #ffffff; width: 1100px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 2px solid #E5E7EB; padding-bottom: 20px;">
          <div>
            <div style="font-size: 26px; font-weight: bold; color: #1E88E5;">QR Restaurant System</div>
            <div style="font-size: 14px; color: #6B7280; margin-top: 4px;">Super Admin Portal — Registered Restaurants Directory</div>
          </div>
          <div style="font-size: 13px; color: #6B7280; text-align: right;">
            <div><strong>Generated:</strong> ${new Date().toLocaleDateString()}</div>
            <div><strong>Plan Filter:</strong> ${filterPlan === 'all' ? 'All Plans' : filterPlan}</div>
            <div><strong>Status Filter:</strong> ${filterStatus === 'all' ? 'All Statuses' : filterStatus}</div>
            <div><strong>Total Records:</strong> ${filteredRestaurants.length}</div>
          </div>
        </div>

        <div style="display: flex; gap: 16px; margin-bottom: 28px;">
          <div style="flex: 1; background: #EFF6FF; border-radius: 8px; padding: 16px;">
            <div style="font-size: 12px; color: #6B7280;">Total</div>
            <div style="font-size: 22px; font-weight: bold; color: #1E40AF;">${restaurants.length}</div>
          </div>
          <div style="flex: 1; background: #ECFDF5; border-radius: 8px; padding: 16px;">
            <div style="font-size: 12px; color: #6B7280;">Active</div>
            <div style="font-size: 22px; font-weight: bold; color: #047857;">${restaurants.filter(r => r.accountStatus === 'Active').length}</div>
          </div>
          <div style="flex: 1; background: #FEF2F2; border-radius: 8px; padding: 16px;">
            <div style="font-size: 12px; color: #6B7280;">Suspended</div>
            <div style="font-size: 22px; font-weight: bold; color: #B91C1C;">${restaurants.filter(r => r.accountStatus === 'Suspended').length}</div>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #F8FAFC;">
              <th style="text-align: left; padding: 10px 12px; font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #E5E7EB;">Name</th>
              <th style="text-align: left; padding: 10px 12px; font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #E5E7EB;">ID</th>
              <th style="text-align: left; padding: 10px 12px; font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #E5E7EB;">Owner</th>
              <th style="text-align: left; padding: 10px 12px; font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #E5E7EB;">Location</th>
              <th style="text-align: left; padding: 10px 12px; font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #E5E7EB;">Plan</th>
              <th style="text-align: left; padding: 10px 12px; font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #E5E7EB;">Status</th>
              <th style="text-align: left; padding: 10px 12px; font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #E5E7EB;">Revenue</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div style="margin-top: 30px; font-size: 11px; color: #9CA3AF; text-align: center; border-top: 1px solid #E5E7EB; padding-top: 12px;">
          QR Restaurant System &bull; Super Admin Export &bull; ${new Date().toLocaleString()}
        </div>
      </div>
    `;

    document.body.appendChild(input);

    try {
      const canvas = await html2canvas(input.firstElementChild as HTMLElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      // Handle multi-page if content overflows one A4 page
      let position = 0;
      let remaining = imgHeight;

      while (remaining > 0) {
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        remaining -= pdfHeight;
        position -= pdfHeight;
        if (remaining > 0) pdf.addPage();
      }

      pdf.save(`restaurants-${new Date().toISOString().slice(0, 10)}.pdf`);
    } finally {
      document.body.removeChild(input);
    }
  };

  // Add this function (place it alongside your other handlers)
  const handleRefresh = () => {
    setSearchQuery('');
    setFilterPlan('all');
    setFilterStatus('all');
    fetchRestaurants();
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlan = filterPlan === 'all' || restaurant.subscriptionPlan === filterPlan;
    const matchesStatus = filterStatus === 'all' || restaurant.accountStatus === filterStatus;

    return matchesSearch && matchesPlan && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <RefreshCw className="w-8 h-8 text-[#1E88E5] animate-spin" />
        <p className="text-sm text-[#6B7280]">Loading restaurants list...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 bg-red-50 border-red-200 text-center max-w-lg mx-auto mt-8">
        <p className="text-red-700 font-medium mb-3">{error}</p>
        <Button onClick={fetchRestaurants} className="bg-red-600 hover:bg-red-700 text-white">
          Retry Connection
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">Restaurants</h1>
          <p className="text-sm text-[#6B7280] mt-1">Manage all registered restaurants on the platform</p>
        </div>
        <Button className="bg-[#1E88E5] hover:bg-[#1E88E5]/90 text-white" onClick={handleRefresh}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh List
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-white border-[#E5E7EB]">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <Input
                type="search"
                placeholder="Search by name, owner, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Plan Filter */}
          <Select value={filterPlan} onValueChange={setFilterPlan}>
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="Filter by plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="Starter">Starter</SelectItem>
              <SelectItem value="Pro">Pro</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          {/* Export Button */}
          <Button variant="outline" className="border-[#E5E7EB]" onClick={handleExportPDF}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-white border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">Total Restaurants</p>
              <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">{restaurants.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 text-xl font-bold">{restaurants.length}</span>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-white border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">Active</p>
              <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">
                {restaurants.filter(r => r.accountStatus === 'Active').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <span className="text-green-600 text-xl font-bold">
                {restaurants.filter(r => r.accountStatus === 'Active').length}
              </span>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-white border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">Suspended</p>
              <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">
                {restaurants.filter(r => r.accountStatus === 'Suspended').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
              <span className="text-red-600 text-xl font-bold">
                {restaurants.filter(r => r.accountStatus === 'Suspended').length}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Desktop Table View */}
      <Card className="bg-white border-[#E5E7EB] overflow-hidden hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F7FA] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Restaurant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredRestaurants.map((restaurant) => (
                <tr key={restaurant.dbId} className="hover:bg-[#F5F7FA] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {restaurant.logo ? (
                        <img src={restaurant.logo.startsWith('http') ? restaurant.logo : `${API_BASE_URL.replace('/api', '')}/${restaurant.logo}`} alt="logo" className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1E88E5] to-[#00C853] flex items-center justify-center text-white font-medium">
                          {restaurant.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-[#1A1A1A]">{restaurant.name}</p>
                        <p className="text-sm text-[#6B7280]">{restaurant.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-[#1A1A1A]">{restaurant.ownerName}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-[#1A1A1A]">{restaurant.location}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      className={`
                        ${restaurant.subscriptionPlan === 'Premium' ? 'bg-purple-100 text-purple-700' : ''}
                        ${restaurant.subscriptionPlan === 'Standard' ? 'bg-blue-100 text-blue-700' : ''}
                        ${restaurant.subscriptionPlan === 'Basic' ? 'bg-gray-100 text-gray-700' : ''}
                      `}
                    >
                      {restaurant.subscriptionPlan}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      className={`
                        ${restaurant.accountStatus === 'Active' ? 'bg-green-100 text-green-700' : ''}
                        ${restaurant.accountStatus === 'Suspended' ? 'bg-red-100 text-red-700' : ''}
                        ${restaurant.accountStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                      `}
                    >
                      {restaurant.accountStatus}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-[#1A1A1A]">₹{restaurant.monthlyRevenue}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Link to={`/restaurants/${restaurant.dbId}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggleStatus(restaurant)} title={restaurant.accountStatus === 'Active' ? 'Suspend Restaurant' : 'Activate Restaurant'}>
                        {restaurant.accountStatus === 'Active' ? (
                          <Ban className="w-4 h-4 text-orange-600" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => handleDeleteRestaurant(restaurant.dbId)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile/Tablet Card View */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {filteredRestaurants.map((restaurant) => (
          <Card key={restaurant.dbId} className="p-4 bg-white border-[#E5E7EB]">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {restaurant.logo ? (
                  <img src={restaurant.logo.startsWith('http') ? restaurant.logo : `${API_BASE_URL.replace('/api', '')}/${restaurant.logo}`} alt="logo" className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#1E88E5] to-[#00C853] flex items-center justify-center text-white font-medium text-lg">
                    {restaurant.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-medium text-[#1A1A1A]">{restaurant.name}</p>
                  <p className="text-sm text-[#6B7280]">{restaurant.id}</p>
                </div>
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

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-[#6B7280]">Owner:</span>
                <span className="text-sm font-medium text-[#1A1A1A]">{restaurant.ownerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#6B7280]">Location:</span>
                <span className="text-sm font-medium text-[#1A1A1A]">{restaurant.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#6B7280]">Plan:</span>
                <Badge
                  className={`
                    ${restaurant.subscriptionPlan === 'Premium' ? 'bg-purple-100 text-purple-700' : ''}
                    ${restaurant.subscriptionPlan === 'Standard' ? 'bg-blue-100 text-blue-700' : ''}
                    ${restaurant.subscriptionPlan === 'Basic' ? 'bg-gray-100 text-gray-700' : ''}
                  `}
                >
                  {restaurant.subscriptionPlan}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#6B7280]">Revenue:</span>
                <span className="text-sm font-medium text-[#1A1A1A]">${restaurant.monthlyRevenue}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-[#E5E7EB]">
              <Link to={`/restaurants/${restaurant.dbId}`} className="flex-1">
                <Button variant="outline" className="w-full border-[#E5E7EB]">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </Link>
              <Button variant="outline" className="border-[#E5E7EB]" onClick={() => handleToggleStatus(restaurant)} title={restaurant.accountStatus === 'Active' ? 'Suspend Restaurant' : 'Activate Restaurant'}>
                {restaurant.accountStatus === 'Active' ? (
                  <Ban className="w-4 h-4 text-orange-600" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
              </Button>
              <Button variant="outline" className="border-[#E5E7EB] text-red-600" onClick={() => handleDeleteRestaurant(restaurant.dbId)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredRestaurants.length === 0 && (
        <Card className="p-12 bg-white border-[#E5E7EB] text-center">
          <p className="text-[#6B7280]">No restaurants found matching your filters.</p>
        </Card>
      )}
    </div>
  );
}

