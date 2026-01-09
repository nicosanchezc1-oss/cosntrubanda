import React from 'react';
import { Database, AlertTriangle, CheckCircle, Copy } from 'lucide-react';
import { isSupabaseConfigured } from '../supabaseClient';

const Setup: React.FC = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("SQL copied to clipboard!");
  };

  const sqlScript = `
-- 1. Create Members Table
CREATE TABLE members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  dni TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  specialty TEXT,
  points_balance INTEGER DEFAULT 0
);

-- 2. Create Transactions Table
CREATE TABLE points_transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  member_id uuid REFERENCES members(id),
  type TEXT CHECK (type IN ('EARN', 'REDEEM')),
  amount_points INTEGER NOT NULL,
  description TEXT
);

-- 3. Create Rewards Table
CREATE TABLE rewards (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  title TEXT NOT NULL,
  points_cost INTEGER NOT NULL,
  image_url TEXT,
  stock INTEGER DEFAULT 100
);

-- 4. Insert Sample Rewards
INSERT INTO rewards (title, points_cost, image_url) VALUES
('Pro Hammer', 500, 'https://picsum.photos/300/200'),
('Drill Set', 2500, 'https://picsum.photos/300/200'),
('Safety Helmet', 300, 'https://picsum.photos/300/200');
  `;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-slate-800 rounded-lg text-white">
          <Database size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Database Setup</h2>
          <p className="text-slate-500">Backend configuration status and instructions.</p>
        </div>
      </div>

      <div className={`p-4 rounded-xl border flex items-center gap-4 ${isSupabaseConfigured ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
        {isSupabaseConfigured ? (
          <CheckCircle className="text-green-600" size={28} />
        ) : (
          <AlertTriangle className="text-amber-600" size={28} />
        )}
        <div>
          <h3 className={`font-bold ${isSupabaseConfigured ? 'text-green-800' : 'text-amber-800'}`}>
            {isSupabaseConfigured ? 'Supabase Connected' : 'Supabase Keys Missing'}
          </h3>
          <p className="text-sm text-slate-600">
            {isSupabaseConfigured 
              ? 'The application has detected environment variables. Ensure the tables below exist.' 
              : 'App is running in DEMO MODE. Data changes will not persist. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env to go live.'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-mono font-bold text-slate-700">SQL Schema Initialization</h3>
          <button 
            onClick={() => copyToClipboard(sqlScript)}
            className="text-xs flex items-center gap-1 bg-white border border-slate-300 px-2 py-1 rounded hover:bg-slate-100"
          >
            <Copy size={12} /> Copy SQL
          </button>
        </div>
        <div className="p-4 bg-slate-900 overflow-x-auto">
          <pre className="text-emerald-400 font-mono text-xs leading-relaxed">
            {sqlScript}
          </pre>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-sm text-slate-500">
          Run this in your Supabase SQL Editor to create the necessary tables for the app.
        </div>
      </div>
    </div>
  );
};

export default Setup;