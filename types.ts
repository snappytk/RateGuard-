
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
  id: string;
  carrier: string;
  origin: string;
  destination: string;
  weight: number;
  totalCost: number;
  surcharges: Array<{ name: string; amount: number }>;
  transitTime: string;
  status: 'pending' | 'analyzed' | 'flagged' | 'optimal';
  workflowStatus: 'uploaded' | 'analyzed' | 'reviewed' | 'approved';
  disputeDrafted?: boolean;
  reliabilityScore: number; // 0-100
  notes: Comment[];
  targetRate?: number;
  timestamp: number;
}

export interface LaneTrend {
  lane: string;
  history: Array<{ date: string; rate: number }>;
}

export type AppView = 'landing' | 'dashboard' | 'quotes' | 'history' | 'analysis' | 'settings' | 'billing' | 'studio' | 'support' | 'scorecards' | 'team' | 'privacy' | 'terms' | 'cookies';

export enum ImageSize {
  K1 = '1K',
  K2 = '2K',
  K4 = '4K'
}
