import React from 'react';
import { LayoutDashboard, Users, PlusCircle, Gift, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
  onLogout: () => void;
  isMobileOpen: boolean;
  toggleMobile: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout, isMobileOpen, toggleMobile }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'members', label: 'Directory', icon: Users },
    { id: 'points', label: 'Add Points', icon: PlusCircle },
    { id: 'rewards', label: 'Rewards Catalog', icon: Gift },
    { id: 'setup', label: 'Database Setup', icon: Settings },
  ];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-40 w-64 bg-const-primary text-white transform transition-transform duration-300 ease-in-out shadow-xl
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0 md:static
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={toggleMobile}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 bg-const-accent rounded-sm flex items-center justify-center transform rotate-45">
              <div className="w-4 h-4 bg-const-primary transform -rotate-45"></div>
            </div>
            <div>
              <h1 className="font-industrial font-bold text-xl tracking-wide uppercase">Club</h1>
              <h2 className="text-xs text-emerald-200 tracking-widest uppercase">Construbanda</h2>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setView(item.id);
                    if (window.innerWidth < 768) toggleMobile();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
                    ${isActive 
                      ? 'bg-white/10 text-white shadow-lg border-l-4 border-const-accent' 
                      : 'text-emerald-100 hover:bg-emerald-700/50 hover:text-white'
                    }`}
                >
                  <Icon size={20} className={isActive ? 'text-const-accent' : 'text-emerald-300 group-hover:text-white'} />
                  <span className="font-medium tracking-wide">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-emerald-200 hover:bg-red-500/10 hover:text-red-200 transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;