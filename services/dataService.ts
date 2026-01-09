import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { Member, MemberInsert, Reward, DashboardStats } from '../types';

// --- MOCK DATA FOR DEMO MODE ---
const MOCK_MEMBERS: Member[] = [
  { id: '1', dni: '12345678', full_name: 'Roberto Gomez', phone: '555-0101', specialty: 'Mason', points_balance: 1500 },
  { id: '2', dni: '87654321', full_name: 'Maria Rodriguez', phone: '555-0202', specialty: 'Electrician', points_balance: 320 },
  { id: '3', dni: '11223344', full_name: 'Carlos Silva', phone: '555-0303', specialty: 'Plumber', points_balance: 850 },
];

const MOCK_REWARDS: Reward[] = [
  { id: '1', title: 'Professional Hammer', points_cost: 500, image_url: 'https://picsum.photos/300/200?random=1' },
  { id: '2', title: 'Power Drill Set', points_cost: 2500, image_url: 'https://picsum.photos/300/200?random=2' },
  { id: '3', title: 'Safety Vest', points_cost: 200, image_url: 'https://picsum.photos/300/200?random=3' },
  { id: '4', title: 'Angle Grinder', points_cost: 1800, image_url: 'https://picsum.photos/300/200?random=4' },
];

// --- SERVICE METHODS ---

export const getDashboardStats = async (): Promise<DashboardStats> => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { count: memberCount } = await supabase.from('members').select('*', { count: 'exact', head: true });
      
      // Calculate points issued today (simplified query)
      const today = new Date().toISOString().split('T')[0];
      const { data: transactions } = await supabase
        .from('points_transactions')
        .select('amount_points')
        .eq('type', 'EARN')
        .gte('created_at', today);
        
      const pointsToday = transactions?.reduce((acc, curr) => acc + curr.amount_points, 0) || 0;

      return {
        totalMembers: memberCount || 0,
        pointsIssuedToday: pointsToday,
        pendingRewards: 5, // Mocked for simplicity as it requires a separate status table
      };
    } catch (e) {
      console.error("Supabase error:", e);
      return { totalMembers: 0, pointsIssuedToday: 0, pendingRewards: 0 };
    }
  }

  // Mock Return
  return {
    totalMembers: MOCK_MEMBERS.length,
    pointsIssuedToday: 450,
    pendingRewards: 3
  };
};

export const searchMemberByDni = async (dni: string): Promise<Member | null> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('dni', dni)
      .single();
    if (error) return null;
    return data as Member;
  }
  return MOCK_MEMBERS.find(m => m.dni === dni) || null;
};

export const getAllMembers = async (): Promise<Member[]> => {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('members').select('*').order('created_at', { ascending: false });
    return (data as Member[]) || [];
  }
  return [...MOCK_MEMBERS];
};

export const registerMember = async (member: MemberInsert): Promise<{ success: boolean; error?: string }> => {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('members').insert([{ ...member, points_balance: 0 }]);
    if (error) return { success: false, error: error.message };
    return { success: true };
  }
  
  MOCK_MEMBERS.push({
    id: Math.random().toString(),
    ...member,
    points_balance: 0,
    created_at: new Date().toISOString()
  });
  return { success: true };
};

export const addPoints = async (memberId: string, amountPurchased: number, ticketNumber: string): Promise<{ success: boolean; points: number; error?: string }> => {
  const points = Math.floor(amountPurchased / 1000);
  
  if (points <= 0) return { success: false, points: 0, error: "Amount too low to earn points." };

  if (isSupabaseConfigured && supabase) {
    // Transaction logic usually requires stored procedures or RLS policies for atomicity, 
    // doing client-side for simplicity of this specific prompt.
    
    // 1. Check if ticket exists
    const { data: existingTicket } = await supabase
        .from('points_transactions')
        .select('id')
        .eq('description', `Ticket #${ticketNumber}`)
        .single();
    
    if (existingTicket) return { success: false, points: 0, error: "Invoice number already used." };

    // 2. Add Transaction
    const { error: txError } = await supabase.from('points_transactions').insert([{
      member_id: memberId,
      type: 'EARN',
      amount_points: points,
      description: `Ticket #${ticketNumber}`
    }]);

    if (txError) return { success: false, points: 0, error: txError.message };

    // 3. Update Member Balance
    // NOTE: This race condition is handled better with a DB trigger/function
    const { data: member } = await supabase.from('members').select('points_balance').eq('id', memberId).single();
    const newBalance = (member?.points_balance || 0) + points;
    
    await supabase.from('members').update({ points_balance: newBalance }).eq('id', memberId);

    return { success: true, points };
  }

  // Mock Logic
  const member = MOCK_MEMBERS.find(m => m.id === memberId);
  if (member) {
    member.points_balance += points;
    return { success: true, points };
  }
  return { success: false, points: 0, error: "Member not found" };
};

export const getRewards = async (): Promise<Reward[]> => {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('rewards').select('*');
    return (data as Reward[]) || [];
  }
  return MOCK_REWARDS;
};

export const redeemReward = async (memberId: string, reward: Reward): Promise<{ success: boolean; error?: string }> => {
  if (isSupabaseConfigured && supabase) {
    const { data: member } = await supabase.from('members').select('points_balance').eq('id', memberId).single();
    
    if (!member || member.points_balance < reward.points_cost) {
      return { success: false, error: "Insufficient points" };
    }

    const { error: txError } = await supabase.from('points_transactions').insert([{
      member_id: memberId,
      type: 'REDEEM',
      amount_points: -reward.points_cost,
      description: `Redeemed: ${reward.title}`
    }]);

    if (txError) return { success: false, error: txError.message };

    const newBalance = member.points_balance - reward.points_cost;
    await supabase.from('members').update({ points_balance: newBalance }).eq('id', memberId);
    
    return { success: true };
  }

  // Mock Logic
  const member = MOCK_MEMBERS.find(m => m.id === memberId);
  if (member) {
    if (member.points_balance >= reward.points_cost) {
      member.points_balance -= reward.points_cost;
      return { success: true };
    }
    return { success: false, error: "Insufficient points" };
  }
  return { success: false, error: "Member not found" };
};