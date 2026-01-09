import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import Members from './views/Members';
import Points from './views/Points';
import Rewards from './views/Rewards';
import Login from './views/Login';
import Setup from './views/Setup';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'members': return <Members />;
      case 'points': return <Points />;
      case 'rewards': return <Rewards />;
      case 'setup': return <Setup />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        onLogout={() => setIsLoggedIn(false)}
        isMobileOpen={isMobileOpen}
        toggleMobile={() => setIsMobileOpen(!isMobileOpen)}
      />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-const-primary text-white flex items-center px-4 shrink-0 shadow-md z-20">
          <button onClick={() => setIsMobileOpen(true)} className="p-2 -ml-2">
            <Menu size={24} />
          </button>
          <span className="font-industrial font-bold ml-2">CLUB CONSTRUBANDA</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {renderView()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;