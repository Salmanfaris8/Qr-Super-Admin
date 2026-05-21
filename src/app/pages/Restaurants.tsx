import { useState } from 'react';
import { Link } from 'react-router';
import { Search, Filter, Download, Eye, Edit, Ban, Trash2, Plus } from 'lucide-react';
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
import { restaurants } from '../data/mockData';

export function Restaurants() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlan = filterPlan === 'all' || restaurant.subscriptionPlan === filterPlan;
    const matchesStatus = filterStatus === 'all' || restaurant.accountStatus === filterStatus;

    return matchesSearch && matchesPlan && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">Restaurants</h1>
          <p className="text-sm text-[#6B7280] mt-1">Manage all registered restaurants on the platform</p>
        </div>
        <Button className="bg-[#1E88E5] hover:bg-[#1E88E5]/90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Restaurant
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
              <SelectItem value="Basic">Basic</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
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
          <Button variant="outline" className="border-[#E5E7EB]">
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
                <tr key={restaurant.id} className="hover:bg-[#F5F7FA] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1E88E5] to-[#00C853] flex items-center justify-center text-white font-medium">
                        {restaurant.name.charAt(0)}
                      </div>
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
                    <p className="text-sm font-medium text-[#1A1A1A]">${restaurant.monthlyRevenue}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Link to={`/restaurants/${restaurant.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-600">
                        <Ban className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
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
          <Card key={restaurant.id} className="p-4 bg-white border-[#E5E7EB]">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#1E88E5] to-[#00C853] flex items-center justify-center text-white font-medium text-lg">
                  {restaurant.name.charAt(0)}
                </div>
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
              <Link to={`/restaurants/${restaurant.id}`} className="flex-1">
                <Button variant="outline" className="w-full border-[#E5E7EB]">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </Link>
              <Button variant="outline" className="border-[#E5E7EB]">
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="border-[#E5E7EB] text-orange-600">
                <Ban className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="border-[#E5E7EB] text-red-600">
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
