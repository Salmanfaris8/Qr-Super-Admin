import { useState } from 'react';
import { Search, Download, Filter } from 'lucide-react';
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
import { payments } from '../data/mockData';

export function Payments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlan, setFilterPlan] = useState('all');

  const filteredPayments = payments.filter(payment => {
    const matchesSearch =
      payment.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.invoiceId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchesPlan = filterPlan === 'all' || payment.plan === filterPlan;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const totalRevenue = payments
    .filter(p => p.status === 'Completed')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments
    .filter(p => p.status === 'Pending')
    .reduce((sum, p) => sum + p.amount, 0);
  const failedCount = payments.filter(p => p.status === 'Failed').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">Payment Management</h1>
          <p className="text-sm text-[#6B7280] mt-1">Track all subscription payments and transactions</p>
        </div>
        <Button className="bg-[#1E88E5] hover:bg-[#1E88E5]/90 text-white">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280]">Total Revenue</p>
          <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">${totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-green-600 mt-1">This month</p>
        </Card>
        <Card className="p-4 bg-white border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280]">Pending Payments</p>
          <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">${pendingAmount}</p>
          <p className="text-sm text-yellow-600 mt-1">Awaiting confirmation</p>
        </Card>
        <Card className="p-4 bg-white border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280]">Failed Transactions</p>
          <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">{failedCount}</p>
          <p className="text-sm text-red-600 mt-1">Requires attention</p>
        </Card>
        <Card className="p-4 bg-white border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280]">Total Transactions</p>
          <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">{payments.length}</p>
          <p className="text-sm text-[#6B7280] mt-1">All time</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-white border-[#E5E7EB]">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <Input
                type="search"
                placeholder="Search by restaurant or invoice..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>
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
          <Button variant="outline" className="border-[#E5E7EB]">
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" className="border-[#E5E7EB]">
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
        </div>
      </Card>

      {/* Desktop Table */}
      <Card className="bg-white border-[#E5E7EB] overflow-hidden hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F7FA] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">
                  Invoice ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">
                  Restaurant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-[#F5F7FA] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-mono text-sm text-[#1A1A1A]">{payment.invoiceId}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-[#1A1A1A]">{payment.restaurantName}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      className={`
                        ${payment.plan === 'Premium' ? 'bg-purple-100 text-purple-700' : ''}
                        ${payment.plan === 'Standard' ? 'bg-blue-100 text-blue-700' : ''}
                        ${payment.plan === 'Basic' ? 'bg-gray-100 text-gray-700' : ''}
                      `}
                    >
                      {payment.plan}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-semibold text-[#1A1A1A]">${payment.amount}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-[#6B7280]">
                      {new Date(payment.date).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      className={`
                        ${payment.status === 'Completed' ? 'bg-green-100 text-green-700' : ''}
                        ${payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                        ${payment.status === 'Failed' ? 'bg-red-100 text-red-700' : ''}
                      `}
                    >
                      {payment.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button variant="link" className="text-[#1E88E5] p-0 h-auto">
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {filteredPayments.map((payment) => (
          <Card key={payment.id} className="p-4 bg-white border-[#E5E7EB]">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-mono text-sm text-[#1A1A1A] font-medium">{payment.invoiceId}</p>
                <p className="text-xs text-[#6B7280] mt-1">{payment.restaurantName}</p>
              </div>
              <Badge
                className={`
                  ${payment.status === 'Completed' ? 'bg-green-100 text-green-700' : ''}
                  ${payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                  ${payment.status === 'Failed' ? 'bg-red-100 text-red-700' : ''}
                `}
              >
                {payment.status}
              </Badge>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-[#6B7280]">Plan:</span>
                <Badge
                  className={`
                    ${payment.plan === 'Premium' ? 'bg-purple-100 text-purple-700' : ''}
                    ${payment.plan === 'Standard' ? 'bg-blue-100 text-blue-700' : ''}
                    ${payment.plan === 'Basic' ? 'bg-gray-100 text-gray-700' : ''}
                  `}
                >
                  {payment.plan}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#6B7280]">Amount:</span>
                <span className="text-sm font-semibold text-[#1A1A1A]">${payment.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#6B7280]">Date:</span>
                <span className="text-sm text-[#1A1A1A]">
                  {new Date(payment.date).toLocaleDateString()}
                </span>
              </div>
            </div>

            <Button variant="outline" className="w-full border-[#E5E7EB] text-[#1E88E5]">
              View Details
            </Button>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredPayments.length === 0 && (
        <Card className="p-12 bg-white border-[#E5E7EB] text-center">
          <p className="text-[#6B7280]">No payments found matching your filters.</p>
        </Card>
      )}
    </div>
  );
}
