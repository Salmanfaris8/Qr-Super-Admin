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
import { systemLogs } from '../data/mockData';

export function SystemLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  const filteredLogs = systemLogs.filter(log => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    return matchesSearch && matchesAction;
  });

  const actionTypes = ['all', ...Array.from(new Set(systemLogs.map(l => l.action)))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">System Logs</h1>
          <p className="text-sm text-[#6B7280] mt-1">Track all system activities and user actions</p>
        </div>
        <Button className="bg-[#1E88E5] hover:bg-[#1E88E5]/90 text-white">
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      <Card className="p-4 bg-white border-[#E5E7EB]">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <Input
                type="search"
                placeholder="Search logs by action, user, or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterAction} onValueChange={setFilterAction}>
            <SelectTrigger className="w-full lg:w-[200px]">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              {actionTypes.map((action) => (
                <SelectItem key={action} value={action}>
                  {action === 'all' ? 'All Actions' : action}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="bg-white border-[#E5E7EB] overflow-hidden hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F7FA] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#F5F7FA] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-[#6B7280]">{log.timestamp}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      className={`
                        ${log.action.includes('Approved') ? 'bg-green-100 text-green-700' : ''}
                        ${log.action.includes('Suspended') ? 'bg-red-100 text-red-700' : ''}
                        ${log.action.includes('Updated') ? 'bg-blue-100 text-blue-700' : ''}
                        ${log.action.includes('Added') ? 'bg-purple-100 text-purple-700' : ''}
                        ${log.action.includes('Login') ? 'bg-gray-100 text-gray-700' : ''}
                      `}
                    >
                      {log.action}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-[#1A1A1A]">{log.user}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-[#6B7280]">{log.details}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-mono text-[#6B7280]">{log.ipAddress}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {filteredLogs.map((log) => (
          <Card key={log.id} className="p-4 bg-white border-[#E5E7EB]">
            <div className="flex items-start justify-between mb-3">
              <Badge
                className={`
                  ${log.action.includes('Approved') ? 'bg-green-100 text-green-700' : ''}
                  ${log.action.includes('Suspended') ? 'bg-red-100 text-red-700' : ''}
                  ${log.action.includes('Updated') ? 'bg-blue-100 text-blue-700' : ''}
                  ${log.action.includes('Added') ? 'bg-purple-100 text-purple-700' : ''}
                  ${log.action.includes('Login') ? 'bg-gray-100 text-gray-700' : ''}
                `}
              >
                {log.action}
              </Badge>
              <p className="text-xs text-[#6B7280]">{log.timestamp}</p>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-sm text-[#6B7280]">User:</span>
                <span className="text-sm font-medium text-[#1A1A1A] ml-2">{log.user}</span>
              </div>
              <div>
                <span className="text-sm text-[#6B7280]">Details:</span>
                <p className="text-sm text-[#1A1A1A] mt-1">{log.details}</p>
              </div>
              <div>
                <span className="text-sm text-[#6B7280]">IP Address:</span>
                <span className="text-sm font-mono text-[#1A1A1A] ml-2">{log.ipAddress}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredLogs.length === 0 && (
        <Card className="p-12 bg-white border-[#E5E7EB] text-center">
          <p className="text-[#6B7280]">No system logs found matching your search.</p>
        </Card>
      )}
    </div>
  );
}
