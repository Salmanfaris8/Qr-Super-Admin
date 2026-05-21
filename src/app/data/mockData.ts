// Mock data for the QR Hotels Super Admin Dashboard

export interface Restaurant {
  id: string;
  name: string;
  ownerName: string;
  location: string;
  subscriptionPlan: 'Basic' | 'Standard' | 'Premium';
  accountStatus: 'Active' | 'Suspended' | 'Pending';
  monthlyRevenue: number;
  qrScans: number;
  joinedDate: string;
  email: string;
  phone: string;
  address: string;
  menuTheme: string;
  logo?: string;
}

export interface Payment {
  id: string;
  restaurantName: string;
  amount: number;
  plan: string;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  invoiceId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Restaurant Admin' | 'Staff' | 'Super Admin';
  restaurant: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

export interface SupportTicket {
  id: string;
  restaurant: string;
  subject: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdDate: string;
  assignedTo?: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  message: string;
  timestamp: string;
  read: boolean;
}

export interface SystemLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  ipAddress: string;
}

export interface MenuTheme {
  id: string;
  name: string;
  preview: string;
  downloads: number;
  rating: number;
  category: string;
}

export interface PendingRestaurant {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  location: string;
  requestedPlan: string;
  submittedDate: string;
  businessLicense: string;
}

// Mock Restaurants
export const restaurants: Restaurant[] = [
  {
    id: 'R001',
    name: 'The Golden Fork',
    ownerName: 'John Smith',
    location: 'New York, NY',
    subscriptionPlan: 'Premium',
    accountStatus: 'Active',
    monthlyRevenue: 299,
    qrScans: 15234,
    joinedDate: '2024-01-15',
    email: 'john@goldenfork.com',
    phone: '+1 234-567-8901',
    address: '123 Main St, New York, NY 10001',
    menuTheme: 'Modern Dark'
  },
  {
    id: 'R002',
    name: 'Bella Italia',
    ownerName: 'Maria Rossi',
    location: 'Los Angeles, CA',
    subscriptionPlan: 'Standard',
    accountStatus: 'Active',
    monthlyRevenue: 149,
    qrScans: 8456,
    joinedDate: '2024-02-20',
    email: 'maria@bellaitalia.com',
    phone: '+1 234-567-8902',
    address: '456 Sunset Blvd, Los Angeles, CA 90028',
    menuTheme: 'Classic Elegant'
  },
  {
    id: 'R003',
    name: 'Sushi Paradise',
    ownerName: 'Takeshi Yamamoto',
    location: 'San Francisco, CA',
    subscriptionPlan: 'Premium',
    accountStatus: 'Active',
    monthlyRevenue: 299,
    qrScans: 12890,
    joinedDate: '2024-01-10',
    email: 'takeshi@sushiparadise.com',
    phone: '+1 234-567-8903',
    address: '789 Market St, San Francisco, CA 94103',
    menuTheme: 'Minimalist Asian'
  },
  {
    id: 'R004',
    name: 'Burger House',
    ownerName: 'Mike Johnson',
    location: 'Chicago, IL',
    subscriptionPlan: 'Basic',
    accountStatus: 'Active',
    monthlyRevenue: 49,
    qrScans: 3245,
    joinedDate: '2024-03-05',
    email: 'mike@burgerhouse.com',
    phone: '+1 234-567-8904',
    address: '321 Lake Shore Dr, Chicago, IL 60611',
    menuTheme: 'Vintage Casual'
  },
  {
    id: 'R005',
    name: 'Cafe Parisien',
    ownerName: 'Sophie Dubois',
    location: 'Miami, FL',
    subscriptionPlan: 'Standard',
    accountStatus: 'Suspended',
    monthlyRevenue: 149,
    qrScans: 5621,
    joinedDate: '2024-02-14',
    email: 'sophie@cafeparisien.com',
    phone: '+1 234-567-8905',
    address: '654 Ocean Dr, Miami, FL 33139',
    menuTheme: 'French Bistro'
  },
  {
    id: 'R006',
    name: 'Dragon Wok',
    ownerName: 'Chen Wei',
    location: 'Seattle, WA',
    subscriptionPlan: 'Premium',
    accountStatus: 'Active',
    monthlyRevenue: 299,
    qrScans: 11456,
    joinedDate: '2024-01-28',
    email: 'chen@dragonwok.com',
    phone: '+1 234-567-8906',
    address: '987 Pine St, Seattle, WA 98101',
    menuTheme: 'Modern Asian'
  },
  {
    id: 'R007',
    name: 'Taco Fiesta',
    ownerName: 'Carlos Rodriguez',
    location: 'Austin, TX',
    subscriptionPlan: 'Basic',
    accountStatus: 'Active',
    monthlyRevenue: 49,
    qrScans: 4123,
    joinedDate: '2024-03-12',
    email: 'carlos@tacofiesta.com',
    phone: '+1 234-567-8907',
    address: '147 Congress Ave, Austin, TX 78701',
    menuTheme: 'Colorful Mexican'
  },
  {
    id: 'R008',
    name: 'The Steakhouse',
    ownerName: 'Robert Brown',
    location: 'Dallas, TX',
    subscriptionPlan: 'Premium',
    accountStatus: 'Active',
    monthlyRevenue: 299,
    qrScans: 9876,
    joinedDate: '2024-02-01',
    email: 'robert@thesteakhouse.com',
    phone: '+1 234-567-8908',
    address: '258 Main St, Dallas, TX 75201',
    menuTheme: 'Luxury Dark'
  }
];

// Mock Payments
export const payments: Payment[] = [
  {
    id: 'PAY001',
    restaurantName: 'The Golden Fork',
    amount: 299,
    plan: 'Premium',
    date: '2026-03-01',
    status: 'Completed',
    invoiceId: 'INV-2026-001'
  },
  {
    id: 'PAY002',
    restaurantName: 'Bella Italia',
    amount: 149,
    plan: 'Standard',
    date: '2026-03-02',
    status: 'Completed',
    invoiceId: 'INV-2026-002'
  },
  {
    id: 'PAY003',
    restaurantName: 'Sushi Paradise',
    amount: 299,
    plan: 'Premium',
    date: '2026-03-03',
    status: 'Completed',
    invoiceId: 'INV-2026-003'
  },
  {
    id: 'PAY004',
    restaurantName: 'Burger House',
    amount: 49,
    plan: 'Basic',
    date: '2026-03-05',
    status: 'Pending',
    invoiceId: 'INV-2026-004'
  },
  {
    id: 'PAY005',
    restaurantName: 'Dragon Wok',
    amount: 299,
    plan: 'Premium',
    date: '2026-03-06',
    status: 'Completed',
    invoiceId: 'INV-2026-005'
  },
  {
    id: 'PAY006',
    restaurantName: 'Cafe Parisien',
    amount: 149,
    plan: 'Standard',
    date: '2026-03-07',
    status: 'Failed',
    invoiceId: 'INV-2026-006'
  }
];

// Mock Users
export const users: User[] = [
  {
    id: 'U001',
    name: 'John Smith',
    email: 'john@goldenfork.com',
    role: 'Restaurant Admin',
    restaurant: 'The Golden Fork',
    status: 'Active',
    lastLogin: '2026-03-16 10:30 AM'
  },
  {
    id: 'U002',
    name: 'Maria Rossi',
    email: 'maria@bellaitalia.com',
    role: 'Restaurant Admin',
    restaurant: 'Bella Italia',
    status: 'Active',
    lastLogin: '2026-03-15 02:45 PM'
  },
  {
    id: 'U003',
    name: 'James Cook',
    email: 'james@goldenfork.com',
    role: 'Staff',
    restaurant: 'The Golden Fork',
    status: 'Active',
    lastLogin: '2026-03-16 09:15 AM'
  },
  {
    id: 'U004',
    name: 'Sarah Wilson',
    email: 'sarah@bellaitalia.com',
    role: 'Staff',
    restaurant: 'Bella Italia',
    status: 'Active',
    lastLogin: '2026-03-14 11:20 AM'
  },
  {
    id: 'U005',
    name: 'Admin User',
    email: 'admin@qrhotels.com',
    role: 'Super Admin',
    restaurant: 'Platform',
    status: 'Active',
    lastLogin: '2026-03-16 08:00 AM'
  }
];

// Mock Support Tickets
export const supportTickets: SupportTicket[] = [
  {
    id: 'TKT001',
    restaurant: 'The Golden Fork',
    subject: 'QR code not scanning properly',
    priority: 'High',
    status: 'In Progress',
    createdDate: '2026-03-15',
    assignedTo: 'Support Team A'
  },
  {
    id: 'TKT002',
    restaurant: 'Bella Italia',
    subject: 'Need help with menu theme customization',
    priority: 'Medium',
    status: 'Open',
    createdDate: '2026-03-14',
    assignedTo: 'Support Team B'
  },
  {
    id: 'TKT003',
    restaurant: 'Burger House',
    subject: 'Payment failed - need assistance',
    priority: 'Urgent',
    status: 'Open',
    createdDate: '2026-03-16',
    assignedTo: 'Support Team A'
  },
  {
    id: 'TKT004',
    restaurant: 'Sushi Paradise',
    subject: 'How to add multi-language menu?',
    priority: 'Low',
    status: 'Resolved',
    createdDate: '2026-03-10',
    assignedTo: 'Support Team C'
  },
  {
    id: 'TKT005',
    restaurant: 'Dragon Wok',
    subject: 'Analytics dashboard not loading',
    priority: 'High',
    status: 'In Progress',
    createdDate: '2026-03-15',
    assignedTo: 'Support Team B'
  }
];

// Mock Notifications
export const notifications: Notification[] = [
  {
    id: 'N001',
    type: 'success',
    message: 'New restaurant "Taco Fiesta" approved and activated',
    timestamp: '2026-03-16 09:30 AM',
    read: false
  },
  {
    id: 'N002',
    type: 'warning',
    message: 'Payment failed for Cafe Parisien - follow up required',
    timestamp: '2026-03-16 08:15 AM',
    read: false
  },
  {
    id: 'N003',
    type: 'info',
    message: '3 new restaurant approval requests pending',
    timestamp: '2026-03-15 03:45 PM',
    read: true
  },
  {
    id: 'N004',
    type: 'error',
    message: 'System backup failed - immediate action required',
    timestamp: '2026-03-15 02:00 PM',
    read: false
  },
  {
    id: 'N005',
    type: 'success',
    message: 'Monthly revenue target reached: $12,450',
    timestamp: '2026-03-15 10:00 AM',
    read: true
  }
];

// Mock System Logs
export const systemLogs: SystemLog[] = [
  {
    id: 'LOG001',
    action: 'Restaurant Approved',
    user: 'Admin User',
    timestamp: '2026-03-16 09:30 AM',
    details: 'Approved restaurant: Taco Fiesta',
    ipAddress: '192.168.1.100'
  },
  {
    id: 'LOG002',
    action: 'Subscription Updated',
    user: 'System',
    timestamp: '2026-03-16 08:00 AM',
    details: 'Auto-renewed subscription for The Golden Fork',
    ipAddress: '10.0.0.1'
  },
  {
    id: 'LOG003',
    action: 'Account Suspended',
    user: 'Admin User',
    timestamp: '2026-03-15 04:30 PM',
    details: 'Suspended account: Cafe Parisien - Payment failure',
    ipAddress: '192.168.1.100'
  },
  {
    id: 'LOG004',
    action: 'Theme Added',
    user: 'Admin User',
    timestamp: '2026-03-15 02:15 PM',
    details: 'Added new menu theme: Nordic Minimal',
    ipAddress: '192.168.1.100'
  },
  {
    id: 'LOG005',
    action: 'User Login',
    user: 'John Smith',
    timestamp: '2026-03-16 10:30 AM',
    details: 'Restaurant admin logged in',
    ipAddress: '203.45.67.89'
  }
];

// Mock Menu Themes
export const menuThemes: MenuTheme[] = [
  {
    id: 'T001',
    name: 'Modern Dark',
    preview: 'dark-modern',
    downloads: 234,
    rating: 4.8,
    category: 'Modern'
  },
  {
    id: 'T002',
    name: 'Classic Elegant',
    preview: 'classic-elegant',
    downloads: 189,
    rating: 4.6,
    category: 'Classic'
  },
  {
    id: 'T003',
    name: 'Minimalist Asian',
    preview: 'minimal-asian',
    downloads: 312,
    rating: 4.9,
    category: 'Minimalist'
  },
  {
    id: 'T004',
    name: 'Vintage Casual',
    preview: 'vintage-casual',
    downloads: 156,
    rating: 4.4,
    category: 'Vintage'
  },
  {
    id: 'T005',
    name: 'French Bistro',
    preview: 'french-bistro',
    downloads: 198,
    rating: 4.7,
    category: 'Classic'
  },
  {
    id: 'T006',
    name: 'Modern Asian',
    preview: 'modern-asian',
    downloads: 267,
    rating: 4.8,
    category: 'Modern'
  },
  {
    id: 'T007',
    name: 'Colorful Mexican',
    preview: 'colorful-mexican',
    downloads: 145,
    rating: 4.5,
    category: 'Colorful'
  },
  {
    id: 'T008',
    name: 'Luxury Dark',
    preview: 'luxury-dark',
    downloads: 289,
    rating: 4.9,
    category: 'Luxury'
  }
];

// Mock Pending Restaurants
export const pendingRestaurants: PendingRestaurant[] = [
  {
    id: 'P001',
    name: 'Ocean Breeze Cafe',
    ownerName: 'Emily Watson',
    email: 'emily@oceanbreeze.com',
    phone: '+1 234-567-9001',
    location: 'San Diego, CA',
    requestedPlan: 'Standard',
    submittedDate: '2026-03-14',
    businessLicense: 'BL-2026-CA-12345'
  },
  {
    id: 'P002',
    name: 'Mountain View Restaurant',
    ownerName: 'David Lee',
    email: 'david@mountainview.com',
    phone: '+1 234-567-9002',
    location: 'Denver, CO',
    requestedPlan: 'Premium',
    submittedDate: '2026-03-15',
    businessLicense: 'BL-2026-CO-67890'
  },
  {
    id: 'P003',
    name: 'Downtown Diner',
    ownerName: 'Lisa Anderson',
    email: 'lisa@downtowndiner.com',
    phone: '+1 234-567-9003',
    location: 'Portland, OR',
    requestedPlan: 'Basic',
    submittedDate: '2026-03-16',
    businessLicense: 'BL-2026-OR-11223'
  }
];

// Analytics data for charts
export const restaurantGrowthData = [
  { month: 'Sep', count: 45 },
  { month: 'Oct', count: 52 },
  { month: 'Nov', count: 61 },
  { month: 'Dec', count: 68 },
  { month: 'Jan', count: 78 },
  { month: 'Feb', count: 89 },
  { month: 'Mar', count: 98 }
];

export const revenueGrowthData = [
  { month: 'Sep', revenue: 8500 },
  { month: 'Oct', revenue: 9200 },
  { month: 'Nov', revenue: 10100 },
  { month: 'Dec', revenue: 10800 },
  { month: 'Jan', revenue: 11500 },
  { month: 'Feb', revenue: 11900 },
  { month: 'Mar', revenue: 12450 }
];

export const qrScansData = [
  { day: 'Mon', scans: 2340 },
  { day: 'Tue', scans: 2580 },
  { day: 'Wed', scans: 2890 },
  { day: 'Thu', scans: 3120 },
  { day: 'Fri', scans: 4560 },
  { day: 'Sat', scans: 5230 },
  { day: 'Sun', scans: 4890 }
];

export const peakHoursData = [
  { hour: '6AM', scans: 120 },
  { hour: '9AM', scans: 340 },
  { hour: '12PM', scans: 1580 },
  { hour: '3PM', scans: 890 },
  { hour: '6PM', scans: 2340 },
  { hour: '9PM', scans: 1650 },
  { hour: '12AM', scans: 420 }
];

export const topPayingRestaurants = [
  { name: 'The Golden Fork', revenue: 3588 },
  { name: 'Dragon Wok', revenue: 3588 },
  { name: 'Sushi Paradise', revenue: 3588 },
  { name: 'The Steakhouse', revenue: 2691 },
  { name: 'Bella Italia', revenue: 2086 }
];
