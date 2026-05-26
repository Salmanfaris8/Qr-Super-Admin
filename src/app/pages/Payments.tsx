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

export function Payments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlan, setFilterPlan] = useState('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/superadmin/restaurants`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success) {
        // Map the restaurants to payment records
        const mappedPayments = res.data.data.map((r: any) => {
          let paymentStatus: 'Completed' | 'Pending' | 'Failed' = 'Completed';
          if (r.accountStatus === 'Pending') {
            paymentStatus = 'Pending';
          } else if (r.accountStatus === 'Suspended') {
            paymentStatus = 'Failed';
          }

          const invoiceYear = r.createdAt ? new Date(r.createdAt).getFullYear() : new Date().getFullYear();
          const invoiceId = `INV-${invoiceYear}-${String(r.dbId).padStart(3, '0')}`;

          return {
            id: `PAY-${r.dbId}`,
            restaurantName: r.name,
            amount: r.monthlyRevenue || 0,
            plan: r.subscriptionPlan || 'Basic',
            date: r.createdAt || new Date().toISOString(),
            status: paymentStatus,
            invoiceId: invoiceId
          };
        });
        setPayments(mappedPayments);
      }
    } catch (err: any) {
      console.error('Fetch payments failed:', err);
      setError(err.response?.data?.message || 'Failed to load payment details from backend.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleExportPDF = async () => {
    const input = document.createElement("div");
    input.style.position = "fixed";
    input.style.top = "-9999px";
    input.style.left = "-9999px";
    input.style.width = "1100px";

    const tableRows = filteredPayments.map(p => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; font-family: monospace; font-size: 13px;">${p.invoiceId}</td>
        <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; font-weight: 500; font-size: 13px;">${p.restaurantName}</td>
        <td style="padding: 10px; border-bottom: 1px solid #E5E7EB;">
          <span style="padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;
            background-color: ${p.plan === 'Premium' ? '#FAF5FF' : p.plan === 'Pro' ? '#EFF6FF' : '#F3F4F6'};
            color: ${p.plan === 'Premium' ? '#6B21A8' : p.plan === 'Pro' ? '#1D4ED8' : '#374151'};">
            ${p.plan}
          </span>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; font-weight: bold; font-size: 13px;">&#8377;${p.amount.toLocaleString()}</td>
        <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; font-size: 13px;">${new Date(p.date).toLocaleDateString()}</td>
        <td style="padding: 10px; border-bottom: 1px solid #E5E7EB;">
          <span style="padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;
            background-color: ${p.status === 'Completed' ? '#ECFDF5' : p.status === 'Pending' ? '#FEF3C7' : '#FEF2F2'};
            color: ${p.status === 'Completed' ? '#047857' : p.status === 'Pending' ? '#D97706' : '#B91C1C'};">
            ${p.status}
          </span>
        </td>
      </tr>
    `).join('');

    input.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 40px; color: #1A1A1A; background: #ffffff; width: 1100px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 2px solid #E5E7EB; padding-bottom: 20px;">
          <div>
            <div style="font-size: 26px; font-weight: bold; color: #1E88E5;">QR Restaurant System</div>
            <div style="font-size: 14px; color: #6B7280; margin-top: 4px;">Super Admin Portal — Subscriptions & Payments Directory</div>
          </div>
          <div style="font-size: 13px; color: #6B7280; text-align: right;">
            <div><strong>Generated:</strong> ${new Date().toLocaleDateString()}</div>
            <div><strong>Plan Filter:</strong> ${filterPlan === 'all' ? 'All Plans' : filterPlan}</div>
            <div><strong>Status Filter:</strong> ${filterStatus === 'all' ? 'All Statuses' : filterStatus}</div>
            <div><strong>Total Transactions:</strong> ${filteredPayments.length}</div>
          </div>
        </div>

        <div style="display: flex; gap: 16px; margin-bottom: 28px;">
          <div style="flex: 1; background: #EFF6FF; border-radius: 8px; padding: 16px;">
            <div style="font-size: 12px; color: #6B7280;">Total Revenue</div>
            <div style="font-size: 22px; font-weight: bold; color: #1E40AF;">&#8377;${totalRevenue.toLocaleString()}</div>
          </div>
          <div style="flex: 1; background: #FEF3C7; border-radius: 8px; padding: 16px;">
            <div style="font-size: 12px; color: #6B7280;">Pending Amount</div>
            <div style="font-size: 22px; font-weight: bold; color: #D97706;">&#8377;${pendingAmount.toLocaleString()}</div>
          </div>
          <div style="flex: 1; background: #FEF2F2; border-radius: 8px; padding: 16px;">
            <div style="font-size: 12px; color: #6B7280;">Failed Count</div>
            <div style="font-size: 22px; font-weight: bold; color: #B91C1C;">${failedCount}</div>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #F8FAFC;">
              <th style="text-align: left; padding: 10px 12px; font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #E5E7EB;">Invoice ID</th>
              <th style="text-align: left; padding: 10px 12px; font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #E5E7EB;">Restaurant</th>
              <th style="text-align: left; padding: 10px 12px; font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #E5E7EB;">Plan</th>
              <th style="text-align: left; padding: 10px 12px; font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #E5E7EB;">Amount</th>
              <th style="text-align: left; padding: 10px 12px; font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #E5E7EB;">Date</th>
              <th style="text-align: left; padding: 10px 12px; font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #E5E7EB;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div style="margin-top: 30px; font-size: 11px; color: #9CA3AF; text-align: center; border-top: 1px solid #E5E7EB; padding-top: 12px;">
          QR Restaurant System &bull; Super Admin Payment Export &bull; ${new Date().toLocaleString()}
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
        if (remaining > 0) pdf.addPage();
      }

      pdf.save(`payments-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      document.body.removeChild(input);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-[#1E88E5] mx-auto mb-4" />
          <p className="text-[#6B7280]">Loading payment records...</p>
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
            <h3 className="font-semibold text-red-900 mb-2">Error Loading Payments</h3>
            <p className="text-red-700">{error}</p>
            <Button onClick={fetchPayments} variant="outline" className="mt-4 border-red-300 text-red-700 hover:bg-red-100">
              Try Again
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">Payment Management</h1>
          <p className="text-sm text-[#6B7280] mt-1">Track all subscription payments and transactions</p>
        </div>
        <Button className="bg-[#1E88E5] hover:bg-[#1E88E5]/90 text-white" onClick={handleExportPDF}>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280]">Total Revenue</p>
          <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">₹{totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-green-600 mt-1">This month</p>
        </Card>
        <Card className="p-4 bg-white border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280]">Pending Payments</p>
          <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">₹{pendingAmount.toLocaleString()}</p>
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
              <SelectItem value="Starter">Starter</SelectItem>
              <SelectItem value="Pro">Pro</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-[#E5E7EB]" onClick={handleExportPDF}>
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
                    <p className="text-sm font-semibold text-[#1A1A1A]">₹{payment.amount.toLocaleString()}</p>
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
                <span className="text-sm font-semibold text-[#1A1A1A]">₹{payment.amount.toLocaleString()}</span>
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
