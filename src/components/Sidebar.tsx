import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { LAB_MODULES } from '../data/labModules';
import { useSyncStatus } from '../hooks/useSyncStatus';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOnline, pendingCount, isSyncing, triggerSync } = useSyncStatus();
  
  const moduleCount = useMemo(() => LAB_MODULES.filter(m => m.built).length, []);

  const getActive = () => {
    if (location.pathname.startsWith('/history')) return 'History';
    if (location.pathname.startsWith('/settings')) return 'Settings';
    return 'Modules';
  };
  const active = getActive();

  const handleNav = (name: string) => {
    if (name === 'History') navigate('/history');
    else if (name === 'Settings') navigate('/settings');
    else navigate('/');
    onClose();
  };

  const navItems = [
    { name: 'Modules', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { name: 'History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' }
  ];

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        data-sidebar
        className={`
          bg-[#0f172a] overflow-y-auto h-screen w-72 flex-col z-50 border-r border-slate-800/50
          fixed top-0 left-0
          md:static
          transition-transform duration-300 ease-in-out md:transition-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-8 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/40 transform hover:rotate-12 transition-transform cursor-pointer">
              V
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white font-outfit">
              Virtual<span className="text-blue-400">Lab</span>
            </h2>
          </div>
        </div>
        
        <div className="px-6 py-4">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNav(item.name)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative ${
                active === item.name 
                  ? 'bg-blue-600/15 text-blue-400 shadow-inner' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 hover:translate-x-1'
              }`}
            >
              {active === item.name && (
                <div className="absolute inset-0 bg-blue-500/5 rounded-xl blur-md"></div>
              )}
              <svg className={`w-5 h-5 transition-colors relative z-10 ${active === item.name ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]' : 'text-slate-500 group-hover:text-slate-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active === item.name ? 2.5 : 2} d={item.icon} />
              </svg>
              <span className={`font-semibold relative z-10 ${active === item.name ? 'tracking-wide' : ''}`}>{item.name}</span>
              {active === item.name && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,1)] relative z-10 animate-pulse"></div>
              )}
            </button>
          ))}
        </nav>
        <div className="p-6 mt-auto space-y-3">
          {/* Online / Offline Indicator */}
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-300 ${
            isOnline
              ? 'bg-emerald-500/15 text-emerald-400'
              : 'bg-rose-500/15 text-rose-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              isOnline
                ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                : 'bg-rose-400 animate-pulse'
            }`}></span>
            {isOnline ? 'Online' : 'Offline'}
            {pendingCount > 0 && (
              <span className="ml-auto text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
                {pendingCount} pending
              </span>
            )}
            {isOnline && pendingCount > 0 && !isSyncing && (
              <button
                onClick={triggerSync}
                className="ml-1 text-blue-400 hover:text-blue-300 underline text-xs transition-colors"
              >
                Sync
              </button>
            )}
            {isSyncing && (
              <svg className="animate-spin w-3 h-3 ml-auto text-amber-400" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </div>

          {/* System Status Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-colors cursor-pointer group">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 font-outfit">System Status</p>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-75"></div>
              </div>
              <span className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors">{moduleCount} Modules Online</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
