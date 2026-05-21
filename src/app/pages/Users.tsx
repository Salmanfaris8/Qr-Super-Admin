import { useState } from 'react';
import { Search, Filter, Plus, Eye, Edit, Ban, Trash2 } from 'lucide-react';
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
import { users } from '../data/mockData';

export function Users() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">User Management</h1>
          <p className="text-sm text-[#6B7280] mt-1">Manage all platform users and access roles</p>
        </div>
        <Button className="bg-[#1E88E5] hover:bg-[#1E88E5]/90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-white border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280]">Total Users</p>
          <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">{users.length}</p>
        </Card>
        <Card className="p-4 bg-white border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280]">Active Users</p>
          <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">
            {users.filter(u => u.status === 'Active').length}
          </p>
        </Card>
        <Card className="p-4 bg-white border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280]">Inactive Users</p>
          <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">
            {users.filter(u => u.status === 'Inactive').length}
          </p>
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
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-full lg:w-[200px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Restaurant Admin">Restaurant Admin</SelectItem>
              <SelectItem value="Staff">Staff</SelectItem>
              <SelectItem value="Super Admin">Super Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Desktop Table */}
      <Card className="bg-white border-[#E5E7EB] overflow-hidden hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F7FA] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Restaurant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#F5F7FA] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E88E5] to-[#00C853] flex items-center justify-center text-white font-medium">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-[#1A1A1A]">{user.name}</p>
                        <p className="text-sm text-[#6B7280]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      className={`
                        ${user.role === 'Super Admin' ? 'bg-red-100 text-red-700' : ''}
                        ${user.role === 'Restaurant Admin' ? 'bg-blue-100 text-blue-700' : ''}
                        ${user.role === 'Staff' ? 'bg-gray-100 text-gray-700' : ''}
                      `}
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-[#1A1A1A]">{user.restaurant}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      className={`
                        ${user.status === 'Active' ? 'bg-green-100 text-green-700' : ''}
                        ${user.status === 'Inactive' ? 'bg-gray-100 text-gray-700' : ''}
                      `}
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-[#6B7280]">{user.lastLogin}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
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

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="p-4 bg-white border-[#E5E7EB]">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E88E5] to-[#00C853] flex items-center justify-center text-white font-medium">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium text-[#1A1A1A]">{user.name}</p>
                  <p className="text-sm text-[#6B7280]">{user.email}</p>
                </div>
              </div>
              <Badge
                className={`
                  ${user.status === 'Active' ? 'bg-green-100 text-green-700' : ''}
                  ${user.status === 'Inactive' ? 'bg-gray-100 text-gray-700' : ''}
                `}
              >
                {user.status}
              </Badge>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-[#6B7280]">Role:</span>
                <Badge
                  className={`
                    ${user.role === 'Super Admin' ? 'bg-red-100 text-red-700' : ''}
                    ${user.role === 'Restaurant Admin' ? 'bg-blue-100 text-blue-700' : ''}
                    ${user.role === 'Staff' ? 'bg-gray-100 text-gray-700' : ''}
                  `}
                >
                  {user.role}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#6B7280]">Restaurant:</span>
                <span className="text-sm font-medium text-[#1A1A1A]">{user.restaurant}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#6B7280]">Last Login:</span>
                <span className="text-sm text-[#1A1A1A]">{user.lastLogin}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-[#E5E7EB]">
              <Button variant="outline" className="flex-1 border-[#E5E7EB]">
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
              <Button variant="outline" className="border-[#E5E7EB]">
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="border-[#E5E7EB] text-orange-600">
                <Ban className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredUsers.length === 0 && (
        <Card className="p-12 bg-white border-[#E5E7EB] text-center">
          <p className="text-[#6B7280]">No users found matching your filters.</p>
        </Card>
      )}
    </div>
  );
}
