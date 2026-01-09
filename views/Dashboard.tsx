import React, { useEffect, useState } from 'react';
import { Users, Ticket, Award, TrendingUp } from 'lucide-react';
import { getDashboardStats } from '../services/dataService';
import { DashboardStats } from '../types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    pointsIssuedToday: 0,
    pendingRewards: 0,
  });

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: any, color: string }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between group hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-industrial font-bold mt-2 text-slate-800">{value}</p>
      </div>
      <div className={`p-4 rounded-full ${color} text-white group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
          <p className="text-slate-500">Welcome back, Admin. Here is today's overview.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1.5 rounded-md border shadow-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          System Operational
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Members" 
          value={stats.totalMembers} 
          icon={Users} 
          color="bg-const-primary" 
        />
        <StatCard 
          title="Points Issued Today" 
          value={stats.pointsIssuedToday} 
          icon={TrendingUp} 
          color="bg-const-accent" 
        />
        <StatCard 
          title="Pending Rewards" 
          value={stats.pendingRewards} 
          icon={Award} 
          color="bg-blue-600" 
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Ticket className="text-const-primary" size={20} />
          Recent Activity
        </h3>
        <div className="h-48 flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
          <p>Activity chart visualization would go here (using Recharts)</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;