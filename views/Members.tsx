import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Hammer, Wrench, HardHat, PenTool } from 'lucide-react';
import { getAllMembers, registerMember } from '../services/dataService';
import { Member } from '../types';

const SpecialtyBadge = ({ type }: { type: string }) => {
  let color = "bg-slate-100 text-slate-600";
  let Icon = HardHat;

  switch (type.toLowerCase()) {
    case 'mason': 
      color = "bg-orange-100 text-orange-700 border-orange-200"; 
      Icon = Hammer;
      break;
    case 'plumber': 
      color = "bg-blue-100 text-blue-700 border-blue-200"; 
      Icon = Wrench;
      break;
    case 'electrician': 
      color = "bg-yellow-100 text-yellow-700 border-yellow-200"; 
      Icon = PenTool;
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${color}`}>
      <Icon size={12} />
      {type}
    </span>
  );
};

const Members: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ dni: '', full_name: '', phone: '', specialty: 'Mason' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    const data = await getAllMembers();
    setMembers(data);
  };

  const filteredMembers = members.filter(m => 
    m.dni.includes(search) || m.full_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await registerMember(formData);
    setLoading(false);
    
    if (res.success) {
      setShowForm(false);
      setFormData({ dni: '', full_name: '', phone: '', specialty: 'Mason' });
      loadMembers();
    } else {
      alert("Error registering member: " + res.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Member Directory</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-const-primary hover:bg-const-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md"
        >
          {showForm ? 'Cancel' : <><UserPlus size={18} /> Register Member</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-const-accent animate-fade-in">
          <h3 className="text-lg font-bold mb-4">New Member Registration</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input 
                required
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-const-primary focus:border-transparent outline-none"
                value={formData.full_name}
                onChange={e => setFormData({...formData, full_name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">DNI (ID Number)</label>
              <input 
                required
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-const-primary focus:border-transparent outline-none font-mono"
                value={formData.dni}
                onChange={e => setFormData({...formData, dni: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input 
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-const-primary focus:border-transparent outline-none"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Specialty</label>
              <select 
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-const-primary focus:border-transparent outline-none bg-white"
                value={formData.specialty}
                onChange={e => setFormData({...formData, specialty: e.target.value})}
              >
                <option value="Mason">Mason</option>
                <option value="Plumber">Plumber</option>
                <option value="Electrician">Electrician</option>
                <option value="Carpenter">Carpenter</option>
                <option value="General">General</option>
              </select>
            </div>
            <div className="md:col-span-2 pt-2">
              <button 
                disabled={loading}
                type="submit" 
                className="w-full bg-const-accent hover:bg-amber-600 text-white font-bold py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Member'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input 
              placeholder="Search by DNI or Name..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-const-primary outline-none text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">Member Info</th>
                <th className="px-6 py-4 font-semibold">DNI</th>
                <th className="px-6 py-4 font-semibold">Specialty</th>
                <th className="px-6 py-4 font-semibold text-right">Points Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No members found matching your search.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{member.full_name}</div>
                      <div className="text-slate-500 text-xs">{member.phone}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600">{member.dni}</td>
                    <td className="px-6 py-4">
                      <SpecialtyBadge type={member.specialty} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-industrial font-bold text-lg text-const-primary">
                        {member.points_balance.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 ml-1">pts</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Members;