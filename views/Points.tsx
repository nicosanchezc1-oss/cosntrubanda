import React, { useState } from 'react';
import { Search, PlusCircle, Calculator, CheckCircle, AlertCircle } from 'lucide-react';
import { searchMemberByDni, addPoints } from '../services/dataService';
import { Member } from '../types';

const Points: React.FC = () => {
  const [dniSearch, setDniSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [searchError, setSearchError] = useState('');
  
  // Transaction Form
  const [amount, setAmount] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{success: boolean, message: string} | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setSelectedMember(null);
    setResult(null);

    if (!dniSearch.trim()) return;

    const member = await searchMemberByDni(dniSearch);
    if (member) {
      setSelectedMember(member);
    } else {
      setSearchError('Member not found. Please register them first.');
    }
  };

  const calculatedPoints = amount ? Math.floor(parseFloat(amount) / 1000) : 0;

  const handleSubmitPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    setLoading(true);
    const res = await addPoints(selectedMember.id, parseFloat(amount), ticketNumber);
    setLoading(false);

    if (res.success) {
      setResult({ success: true, message: `Successfully added ${res.points} points to ${selectedMember.full_name}.` });
      setAmount('');
      setTicketNumber('');
      setDniSearch('');
      setSelectedMember(null);
    } else {
      setResult({ success: false, message: res.error || 'Unknown error occurred' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-slate-800">Issue Points</h2>
        <p className="text-slate-500">Record a purchase to award loyalty points.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1: Find Member */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full">
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs">1</span>
              Find Member
            </h3>
            <form onSubmit={handleSearch} className="space-y-3">
              <input 
                placeholder="Enter Member DNI" 
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-const-primary outline-none font-mono"
                value={dniSearch}
                onChange={e => setDniSearch(e.target.value)}
              />
              <button 
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Search size={16} /> Search
              </button>
            </form>
            
            {searchError && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                {searchError}
              </div>
            )}

            {selectedMember && (
              <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-lg animate-fade-in">
                <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wide">Selected Member</p>
                <p className="font-bold text-slate-800 text-lg">{selectedMember.full_name}</p>
                <p className="text-slate-600 text-sm">{selectedMember.specialty}</p>
                <div className="mt-2 pt-2 border-t border-emerald-200 flex justify-between items-center">
                  <span className="text-sm text-emerald-800">Current Balance:</span>
                  <span className="font-mono font-bold text-emerald-700">{selectedMember.points_balance} pts</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Enter Details */}
        <div className="md:col-span-2">
          <div className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full transition-opacity ${!selectedMember ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
             <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs">2</span>
              Transaction Details
            </h3>

            <form onSubmit={handleSubmitPoints} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ticket / Invoice #</label>
                  <input 
                    required
                    type="text"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-const-primary outline-none font-mono"
                    placeholder="INV-0000"
                    value={ticketNumber}
                    onChange={e => setTicketNumber(e.target.value)}
                  />
                  <p className="text-xs text-slate-400 mt-1">Must be unique per transaction</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Amount ($)</label>
                  <input 
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-const-primary outline-none font-mono"
                    placeholder="0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                  />
                </div>
              </div>

              {/* Calculator Preview */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <Calculator size={20} />
                  <span className="text-sm">Points Calculation (Amt / 1000)</span>
                </div>
                <div className="text-right">
                  <span className="block text-xs text-slate-400">Total Points to Add</span>
                  <span className="text-2xl font-industrial font-bold text-const-primary">
                    +{calculatedPoints}
                  </span>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading || calculatedPoints <= 0}
                className="w-full bg-const-primary hover:bg-const-secondary disabled:bg-slate-300 text-white font-bold py-3 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
              >
                {loading ? 'Processing...' : <><PlusCircle size={20} /> Add Points to Account</>}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Result Notification */}
      {result && (
        <div className={`p-4 rounded-lg border flex items-center gap-3 animate-fade-in ${result.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {result.success ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
          <div>
            <h4 className="font-bold">{result.success ? 'Success!' : 'Error'}</h4>
            <p className="text-sm">{result.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Points;