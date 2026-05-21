import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, MessageSquare, CheckCircle } from 'lucide-react';
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

const API = import.meta.env.VITE_API_URL;

export function Support() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const token = localStorage.getItem("token")

  // ---------------- FETCH TICKETS ----------------
  const fetchTickets = async () => {
    try {
      const res = await axios.get(
        `${API}/superadmin/support/tickets`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTickets(res.data.data || []);
    } catch (err) {
      console.log("Ticket fetch error:", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // ---------------- UPDATE STATUS ----------------
  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.put(
        `${API}/superadmin/support/tickets/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // refresh tickets after update
      fetchTickets();
    } catch (err) {
      console.log("Status update error:", err);
    }
  };

  // ---------------- UPDATE PRIORITY ----------------
  const updatePriority = async (id: string, priority: string) => {
    try {
      await axios.put(
        `${API}/superadmin/support/tickets/${id}/priority`,
        { priority },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTickets(); // refresh
    } catch (err) {
      console.log("Priority update error:", err);
    }
  };

  // ---------------- FILTER ----------------
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch =
      ticket.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketNumber?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' || ticket.status === filterStatus;

    const matchesPriority =
      filterPriority === 'all' || ticket.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // ---------------- UI (UNCHANGED) ----------------
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">Support Tickets</h1>
          <p className="text-sm text-[#6B7280] mt-1">Manage customer support requests</p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280]">Open</p>
          <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">
            {tickets.filter(t => t.status === 'open').length}
          </p>
        </Card>

        <Card className="p-4 bg-white border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280]">In Progress</p>
          <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">
            {tickets.filter(t => t.status === 'in_progress').length}
          </p>
        </Card>

        <Card className="p-4 bg-white border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280]">Resolved</p>
          <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">
            {tickets.filter(t => t.status === 'resolved').length}
          </p>
        </Card>

        <Card className="p-4 bg-white border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280]">Total</p>
          <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">
            {tickets.length}
          </p>
        </Card>
      </div>

      {/* FILTERS (UNCHANGED) */}
      <Card className="p-4 bg-white border-[#E5E7EB]">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <Input
                type="search"
                placeholder="Search tickets..."
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
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* TICKETS LIST (UI SAME, DATA FIXED) */}
      <div className="space-y-4">
  {filteredTickets.map((ticket) => (
    <Card key={ticket.id} className="p-6 bg-white border-[#E5E7EB] hover:shadow-lg transition-shadow">
      <div className="flex flex-col lg:flex-row gap-6">

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">

            <div>
              <h3 className="text-lg font-semibold text-[#1A1A1A]">
                {ticket.subject}
              </h3>

              <p className="text-sm text-[#6B7280] mt-1">
                Ticket #{ticket.ticketNumber}
              </p>

              {/* message preview */}
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                {ticket.message}
              </p>

              {/* admin reply */}
              {ticket.adminReply && (
                <p className="text-xs text-green-600 mt-2">
                  Reply: {ticket.adminReply}
                </p>
              )}
            </div>

            <div className="flex gap-2">
            {ticket.status === "closed" ? (
              <Badge
                className={`
                  h-8 px-3 py-1 rounded-full flex items-center gap-2
                  text-white
                  ${ticket.priority === "urgent" ? "bg-red-500" : ""}
                  ${ticket.priority === "high" ? "bg-orange-500" : ""}
                  ${ticket.priority === "medium" ? "bg-yellow-500" : ""}
                  ${ticket.priority === "low" ? "bg-blue-500" : ""}
                `}
              >
                <span className="w-2 h-2 rounded-full bg-white/80" />
                <span className="text-xs font-semibold capitalize">
                  {ticket.priority}
                </span>
              </Badge>
            ) : (
              <Select
                value={ticket.priority}
                onValueChange={(value) => updatePriority(ticket.id, value)}
              >
                <SelectTrigger className="h-8 px-3 py-1 border rounded-full shadow-sm bg-white hover:bg-gray-50 transition flex items-center gap-2">
                  
                  <span
                    className={`w-2 h-2 rounded-full
                      ${ticket.priority === "urgent" ? "bg-red-500" : ""}
                      ${ticket.priority === "high" ? "bg-orange-500" : ""}
                      ${ticket.priority === "medium" ? "bg-yellow-500" : ""}
                      ${ticket.priority === "low" ? "bg-blue-500" : ""}
                    `}
                  />

                  <span
                    className={`text-xs font-semibold capitalize
                      ${ticket.priority === "urgent" ? "text-red-700" : ""}
                      ${ticket.priority === "high" ? "text-orange-700" : ""}
                      ${ticket.priority === "medium" ? "text-yellow-700" : ""}
                      ${ticket.priority === "low" ? "text-blue-700" : ""}
                    `}
                  >
                    {ticket.priority}
                  </span>

                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            )}

                {/* STATUS BADGE */}
                <Badge
                  className={` rounded-full
                    ${ticket.status === "open" ? "bg-gray-100 text-gray-700" : ""}
                    ${ticket.status === "in_progress" ? "bg-blue-100 text-blue-700" : ""}
                    ${ticket.status === "resolved" ? "bg-green-100 text-green-700" : ""}
                    ${ticket.status === "closed" ? "bg-gray-200 text-gray-700" : ""}
                  `}
                >
                  {ticket.status.replace("_", " ").toUpperCase()}
                </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-[#6B7280]">Created</p>
              <p className="font-medium text-[#1A1A1A] mt-1">
                {new Date(ticket.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#6B7280]">Assigned To</p>
              <p className="font-medium text-[#1A1A1A] mt-1">
                {ticket.assignedTo || "Unassigned"}
              </p>
            </div>

            {ticket.repliedAt && (
              <div className="col-span-2">
                <p className="text-sm text-[#6B7280]">Replied At</p>
                <p className="font-medium text-[#1A1A1A] mt-1">
                  {new Date(ticket.repliedAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex lg:flex-col gap-2 lg:w-48">

          <Button className="flex-1 lg:flex-none bg-[#1E88E5] hover:bg-[#1E88E5]/90 text-white">
            <MessageSquare className="w-4 h-4 mr-2" />
            Reply
          </Button>

          <Button variant="outline" className="flex-1 lg:flex-none border-[#E5E7EB]">
            View Details
          </Button>

          {/* CLOSED STATE */}
          {ticket.status === "closed" ? (
  <div className="flex items-center justify-center gap-2 text-gray-500 border border-gray-200 rounded-md py-2">
    <CheckCircle className="w-4 h-4 text-gray-500" />
    <span className="text-sm font-medium">Closed</span>
  </div>
) : ticket.status === "resolved" ? (
  <Button
    variant="outline"
    className="flex-1 lg:flex-none border-gray-300 text-gray-600 hover:bg-gray-50"
    onClick={() => updateStatus(ticket.id, "closed")}
  >
    Close Ticket
  </Button>
) : ticket.status === "in_progress" ? (
  <Button
    variant="outline"
    className="flex-1 lg:flex-none border-yellow-200 text-yellow-700 hover:bg-yellow-50"
    onClick={() => updateStatus(ticket.id, "resolved")}
  >
    Mark Resolved
  </Button>
) : ticket.status === "open" ? (
  <Button
    className="flex-1 lg:flex-none bg-blue-600 hover:bg-blue-700 text-white"
    onClick={() => updateStatus(ticket.id, "in_progress")}
  >
    Start Progress
  </Button>
) : (
  <Button
    variant="outline"
    className="flex-1 lg:flex-none border-green-200 text-green-600 hover:bg-green-50"
    onClick={() => updateStatus(ticket.id, "resolved")}
  >
    Resolve
  </Button>
)}

        </div>

      </div>
    </Card>
  ))}
</div>

      {filteredTickets.length === 0 && (
        <Card className="p-12 bg-white border-[#E5E7EB] text-center">
          <p className="text-[#6B7280]">No support tickets found matching your filters.</p>
        </Card>
      )}
    </div>
  );
}