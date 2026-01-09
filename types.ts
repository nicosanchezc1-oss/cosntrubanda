export interface Member {
  id: string;
  dni: string;
  full_name: string;
  phone: string;
  specialty: 'Mason' | 'Plumber' | 'Electrician' | 'Carpenter' | 'General' | string;
  points_balance: number;
  created_at?: string;
}

export interface Reward {
  id: string;
  title: string;
  description?: string;
  points_cost: number;
  image_url: string;
  stock?: number;
}

export interface Transaction {
  id: string;
  member_id: string;
  type: 'EARN' | 'REDEEM';
  amount_points: number;
  description: string; // "Invoice #123" or "Redeemed Hammer"
  created_at: string;
}

export interface DashboardStats {
  totalMembers: number;
  pointsIssuedToday: number;
  pendingRewards: number;
}

// Supabase table row types matching the above loosely
export type MemberInsert = Omit<Member, 'id' | 'created_at' | 'points_balance'>;