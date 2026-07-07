import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../store';
import { useTranslate } from '../i18n';
import { Home, Clock, Settings, Search } from 'lucide-react';

interface BottomNavProps {
  onSearchOpen: () => void;
}

export default function BottomNav({ onSearchOpen }: BottomNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { t } = useTranslate();

  const getActive = () => {
    if (location.pathname.startsWith('/history') || location.pathname.startsWith('/progress')) return 'history';
    if (location.pathname.startsWith('/settings')) return 'settings';
    if (location.pathname.startsWith('/class/')) return 'home';
    return 'home';
  };
  const active = getActive();

  const navItems = [
    { id: 'home', label: t('nav.home'), icon: Home, action: () => navigate('/') },
    { id: 'search', label: t('nav.search'), icon: Search, action: onSearchOpen },
    { id: 'history', label: t('nav.history'), icon: Clock, action: () => navigate('/history') },
    { id: 'settings', label: t('nav.settings'), icon: Settings, action: () => navigate('/settings') },
  ];

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50 border-t ${
      isDark 
        ? 'bg-[#121212]/95 border-[#1c1b1b] backdrop-blur-lg' 
        : 'bg-white/95 border-slate-200 backdrop-blur-lg'
    }`}>
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all ${
                isActive
                  ? isDark ? 'text-[#5560F1]' : 'text-indigo-600'
                  : isDark ? 'text-[#71717a] hover:text-[#a1a1aa]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
