import React, { useState, useEffect } from 'react';
import { Gift, ShoppingBag, Search, Lock } from 'lucide-react';
import { getRewards, redeemReward, searchMemberByDni } from '../services/dataService';
import { Reward, Member } from '../types';

const Rewards: React.FC = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [activeMember, setActiveMember] = useState<Member | null>(null);
  const [dniInput, setDniInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRewards().then(setRewards);
  }, []);

  const handleMemberLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dniInput) return;
    const member = await searchMemberByDni(dniInput);
    if (member) {
      setActiveMember(member);
    } else {
      alert("Member not found");
    }
  };

  const handleRedeem = async (reward: Reward) => {
    if (!activeMember) return;
    if (!window.confirm(`Redeem ${reward.title} for ${reward.points_cost} points?`)) return;

    setLoading(true);
    const res = await redeemReward(activeMember.id, reward);
    setLoading(false);

    if (res.success) {
      alert("Reward redeemed successfully!");
      // Refresh member data
      const updatedMember = await searchMemberByDni(activeMember.dni);
      if (updatedMember) setActiveMember(updatedMember);
    } else {
      alert("Redemption failed: " + res.error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Rewards Catalog</h2>
          <p className="text-slate-500">Redeem accumulated points for construction gear.</p>
        </div>
        
        {/* Simple "Login" to check points context */}
        <div className="w-full md:w-auto bg-white p-3 rounded-lg shadow-sm border border-slate-200">
           {activeMember ? (
             <div className="flex items-center gap-4">
               <div>
                 <p className="text-xs text-slate-400 uppercase">Redeeming as</p>
                 <p className="font-bold text-slate-800">{activeMember.full_name}</p>
               </div>
               <div className="text-right border-l pl-4 border-slate-100">
                 <p className="text-xs text-slate-400 uppercase">Balance</p>
                 <p className="font-industrial font-bold text-const-primary text-xl">{activeMember.points_balance}</p>
               </div>
               <button 
                onClick={() => { setActiveMember(null); setDniInput(''); }}
                className="text-xs text-red-500 hover:underline"
               >
                 Change
               </button>
             </div>
           ) : (
             <form onSubmit={handleMemberLogin} className="flex gap-2">
               <input 
                 placeholder="Enter DNI to Redeem" 
                 className="px-3 py-1.5 text-sm border border-slate-300 rounded outline-none focus:border-const-primary"
                 value={dniInput}
                 onChange={e => setDniInput(e.target.value)}
               />
               <button type="submit" className="bg-slate-800 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-slate-700">
                 Check Points
               </button>
             </form>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {rewards.map((reward) => {
          const canAfford = activeMember ? activeMember.points_balance >= reward.points_cost : false;
          
          return (
            <div key={reward.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group flex flex-col">
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img 
                  src={reward.image_url} 
                  alt={reward.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Gift size={12} className="text-const-accent" />
                  {reward.points_cost} PTS
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-slate-800 text-lg mb-1">{reward.title}</h3>
                <p className="text-sm text-slate-500 mb-4 flex-1">Industrial grade equipment for professionals.</p>
                
                <button
                  onClick={() => handleRedeem(reward)}
                  disabled={!activeMember || !canAfford || loading}
                  className={`w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all
                    ${!activeMember 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : canAfford 
                        ? 'bg-const-primary hover:bg-const-secondary text-white shadow-md' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                >
                  {!activeMember ? (
                    <span className="text-xs">Enter DNI to Redeem</span>
                  ) : canAfford ? (
                    <>
                      <ShoppingBag size={18} /> Redeem Now
                    </>
                  ) : (
                    <>
                      <Lock size={16} /> Insufficient Points
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Rewards;