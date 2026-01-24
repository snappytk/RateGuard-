
import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  History, 
  BarChart2, 
  Settings,
  HelpCircle,
  Image as ImageIcon,
  CreditCard,
  Award,
  Users
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Executive Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'quotes', label: 'Review Queue (Ops)', icon: <FileText size={18} /> },
  { id: 'history', label: 'Lane Memory', icon: <History size={18} /> },
  { id: 'team', label: 'Team Workspace', icon: <Users size={18} /> },
];

export const SYSTEM_ITEMS = [
  { id: 'scorecards', label: 'Carrier Scorecards', icon: <Award size={16} /> },
  { id: 'analysis', label: 'Analytics', icon: <BarChart2 size={16} /> },
  { id: 'studio', label: 'Media Studio', icon: <ImageIcon size={16} /> },
  { id: 'billing', label: 'Billing', icon: <CreditCard size={16} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
  { id: 'support', label: 'Support', icon: <HelpCircle size={16} /> },
];

export const PRICING_PLAN = {
  name: 'Global Enterprise',
  price: 199,
  period: 'month',
  features: [
    'Unlimited Atlas AI Audits',
    'Profit Guard™ Lane Memory',
    'Carrier Scorecards & Reliability Analytics',
    'Auto-Dispute Email Generator',
    'Team Collaboration Sidebar'
  ]
};
