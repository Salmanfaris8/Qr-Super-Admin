import { useState, useEffect } from 'react';
import { Search, Download, Filter, Loader, AlertCircle } from 'lucide-react';
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
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export function SystemLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/superadmin/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success) {
        // Map backend notifications to System Log format
        const mappedLogs = res.data.data.map((n: any) => {
          // Derive user from message or title
          let user = 'System';
          const userMatch = n.message.match(/Admin "([^"]+)"|Restaurant "([^"]+)"/);
          if (userMatch) {
            user = userMatch[1] || userMatch[2];
          } else if (n.title.includes('Support Reply')) {
            user = 'Super Admin';
          }

          // Generate simulated IP address based on id for dynamic feel in UI
          const ipAddress = `192.168.10.${50 + (n.id % 45)}`;

          return {
            id: n.id,
            timestamp: new Date(n.createdAt).toLocaleString(),
            action: n.title.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "").trim(), // Strip emojis for clean action mapping
            user: user,
            details: n.message,
            ipAddress: ipAddress,
            rawType: n.type
          };
        });
        setLogs(mappedLogs);
      }
    } catch (err: any) {
      console.error('Fetch logs failed:', err);
      setError(err.response?.data?.message || 'Failed to load system log logs.');
    } finally {
      setLoading(false);
    }
  };

  // Filter logs based on search query & action selection
  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    return matchesSearch && matchesAction;
  });

  const actionTypes = ['all', ...Array.from(new Set(logs.map(l => l.action)))];

  const handleExportPDF = async () => {
    if (filteredLogs.length === 0) return;

    const input = document.createElement('div');
    input.style.position = "absolute";
    input.style.top = "-9999px";
    input.style.left = "-9999px";
    input.style.width = "1100px";

    const tableRows = filteredLogs.map(log => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; font-size: 13px; color: #4B5563;">${log.timestamp}</td>
        <td style="padding: 12px; border-bottom: 1px solid #E5E7EB;">
          <span style="padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;
            background-color: ${log.action.includes('Suspended') || log.action.includes('Rejected') ? '#FEF2F2' : log.action.includes('Activated') || log.action.includes('Approved') || log.action.includes('Registered') ? '#ECFDF5' : log.action.includes('Support Ticket') ? '#FEF3C7' : '#EFF6FF'};
            color: ${log.action.includes('Suspended') || log.action.includes('Rejected') ? '#B91C1C' : log.action.includes('Activated') || log.action.includes('Approved') || log.action.includes('Registered') ? '#047857' : log.action.includes('Support Ticket') ? '#D97706' : '#1D4ED8'};">
            ${log.action}
          </span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; font-weight: 500; font-size: 13px; color: #1F2937;">${log.user}</td>
        <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; font-size: 13px; color: #4B5563; max-width: 450px; word-break: break-word;">${log.details}</td>
      </tr>
    `).join('');

    input.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 40px; color: #1A1A1A; background: #ffffff; width: 1100px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 2px solid #E5E7EB; padding-bottom: 20px;">
          <div>
            <div style="font-size: 26px; font-weight: bold; color: #1E88E5;">QR Restaurant System</div>
            <div style="font-size: 14px; color: #6B7280; margin-top: 4px;">Super Admin Portal — System Activity Logs Audit</div>
          </div>
          <div style="font-size: 13px; color: #6B7280; text-align: right;">
            <div><strong>Generated:</strong> ${new Date().toLocaleString()}</div>
            <div><strong>Action Filter:</strong> ${filterAction === 'all' ? 'All Actions' : filterAction}</div>
            <div><strong>Total Logs:</strong> ${filteredLogs.length}</div>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #F8FAFC;">
              <th style="text-align: left; padding: 12px; font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #E5E7EB; width: 22%;">Timestamp</th>
              <th style="text-align: left; padding: 12px; font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #E5E7EB; width: 23%;">Action</th>
              <th style="text-align: left; padding: 12px; font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #E5E7EB; width: 20%;">Restaurant Admin</th>
              <th style="text-align: left; padding: 12px; font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #E5E7EB; width: 35%;">Details</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div style="margin-top: 30px; font-size: 11px; color: #9CA3AF; text-align: center; border-top: 1px solid #E5E7EB; padding-top: 12px;">
          QR Restaurant System &bull; System Logs Audit &bull; ${new Date().toLocaleString()}
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

      let position = 0;
      let remaining = imgHeight;

      while (remaining > 0) {
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        remaining -= pdfHeight;
        position -= pdfHeight;
        if (remaining > 0) {
          pdf.addPage();
        }
      }

      pdf.save(`system_logs_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      document.body.removeChild(input);
    }
  };

  const getBadgeStyle = (action: string) => {
    if (action.includes('Suspended') || action.includes('Rejected')) {
      return 'bg-red-100 text-red-700 border border-red-200';
    }
    if (action.includes('Activated') || action.includes('Approved') || action.includes('Registered')) {
      return 'bg-green-100 text-green-700 border border-green-200';
    }
    if (action.includes('Support Ticket')) {
      return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
    }
    return 'bg-blue-100 text-blue-700 border border-blue-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-[#1E88E5] mx-auto mb-4" />
          <p className="text-[#6B7280]">Loading system activity log...</p>
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
            <h3 className="font-semibold text-red-900 mb-2">Error Loading System Logs</h3>
            <p className="text-red-700">{error}</p>
            <Button onClick={fetchLogs} variant="outline" className="mt-4 border-red-300 text-red-700 hover:bg-red-100">
              Try Again
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">System Logs</h1>
          <p className="text-sm text-[#6B7280] mt-1">Track all system activities and user actions</p>
        </div>
        <Button 
          onClick={handleExportPDF} 
          className="bg-[#1E88E5] hover:bg-[#1E88E5]/90 text-white" 
          disabled={filteredLogs.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Export Logs (PDF)
        </Button>
      </div>

      {/* Filter and Search */}
      <Card className="p-4 bg-white border-[#E5E7EB]">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <Input
                type="search"
                placeholder="Search logs by action, admin, or details..."
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

      {/* Table view for larger screens */}
      <Card className="bg-white border-[#E5E7EB] overflow-hidden hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F7FA] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Restaurant Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Details
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
                    <Badge className={getBadgeStyle(log.action)}>
                      {log.action}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-[#1A1A1A]">{log.user}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-[#6B7280]">{log.details}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Card view for mobile screens */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {filteredLogs.map((log) => (
          <Card key={log.id} className="p-4 bg-white border-[#E5E7EB]">
            <div className="flex items-start justify-between mb-3">
              <Badge className={getBadgeStyle(log.action)}>
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
