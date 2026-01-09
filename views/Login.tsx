import React, { useState } from 'react';
import { HardHat, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simplified auth for demonstration. Real app would use Supabase Auth.
    if (username && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
      
      <div className="bg-white relative z-10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-2 bg-const-accent w-full"></div>
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-const-primary text-white rounded-lg mx-auto flex items-center justify-center mb-4 transform rotate-3 shadow-lg">
              <HardHat size={32} />
            </div>
            <h1 className="text-2xl font-industrial font-bold text-slate-900 uppercase tracking-wide">Club Construbanda</h1>
            <p className="text-slate-500 text-sm mt-1">Admin Portal Access</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Username / ID</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-const-primary focus:border-transparent outline-none transition-all"
                placeholder="admin"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-const-primary focus:border-transparent outline-none transition-all"
                placeholder="••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-const-primary hover:bg-const-secondary text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
            >
              Access Dashboard
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400">Restricted access for authorized personnel only.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;