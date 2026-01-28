
export interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'Processor' | 'Manager';
  status: 'Online' | 'Offline';
  activity: string;
}

export interface QuoteData {
  id: string; // Firestore AutoID
  userId: string;
  carrier: string;
  origin: string;
  destination: string;
  weight: number;
  totalCost: number; // Mapped from totalAmount
  surcharges: Array<{ name: string; amount: number }>;
  transitTime: string;
  status: 'pending' | 'analyzed' | 'flagged' | 'optimal';
  workflowStatus: 'uploaded' | 'analyzed' | 'reviewed' | 'approved';
  disputeDrafted?: boolean;
  reliabilityScore: number;
  notes: Comment[];
  pdfBase64?: string; // Stored directly in Firestore < 1MB
  geminiRaw?: any; // Raw JSON map
  createdAt: number;
}

export interface LiveRate {
  id: string;
  pair: string;
  timestamp: number;
  midMarketRate: number;
  bankRate: number; 
  rateGuardRate: number;
  savingsPips: number;
  trend: 'up' | 'down';
}

export interface LaneTrend {
  lane: string;
  history: Array<{ date: string; rate: number }>;
}

export interface CompanyProfile {
  name: string;
  profitGoal: number;
  currency: string;
}

export interface Organization {
  id: string;
  name: string;
  admins: string[]; // Array of User UIDs
  members: string[]; // Array of User UIDs
  createdAt: number;
}

export interface Audit {
  id: string;
  orgId: string;
  userId: string;
  userName: string;
  pair: string;
  amount: number;
  bankRate: number;
  midMarketRate: number;
  leakage: number; // The money lost due to bad spread
  timestamp: number;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  orgId?: string; // Link to the Organization
  role: 'free' | 'enterprise';
  credits: number;
  companyName?: string;
  country?: string; // For compliance (ZW or US)
  taxID?: string;   // For compliance
  createdAt?: number;
  lastSeen?: number;
}

export type AppView = 'landing' | 'onboarding' | 'dashboard' | 'quotes' | 'history' | 'analysis' | 'settings' | 'billing' | 'studio' | 'support' | 'scorecards' | 'team' | 'privacy' | 'terms' | 'cookies' | 'payment';

export enum ImageSize {
  K1 = '1K',
  K2 = '2K',
  K4 = '4K'
}
