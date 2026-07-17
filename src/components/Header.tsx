import { useState, useRef, useEffect } from 'react';
import { Search, Bell, LogIn, LogOut, Sun, Moon, Menu, ChevronDown, Clock, X, Languages, RefreshCw } from 'lucide-react';
import { useAuth, useTheme } from '../store';
import { useTranslate } from '../i18n';
import type { Language } from '../i18n/types';
import { useNavigate } from 'react-router-dom';
import { LAB_MODULES, formatSubject } from '../data/labModules';

const RECENT_SEARCHES_KEY = 'cendronyx-recent-searches';
const SUBJECT_FILTERS = ['all', 'physics', 'chemistry', 'biology', 'math', 'computer', 'science', 'english'];

interface HeaderProps {
  onToggleSidebar: () => void;
  onMobileSearchOpen?: () => void;
  mobileSearchOpen?: boolean;
  onMobileSearchClose?: () => void;
}

export default function Header({ onToggleSidebar, onMobileSearchOpen, mobileSearchOpen: externalMobileSearchOpen, onMobileSearchClose }: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useTranslate();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [subjectFilter, setSubjectFilter] = useState('all');
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const isDark = theme === 'dark';

  const isMobileSearchOpen = externalMobileSearchOpen ?? mobileSearchOpen;
  const closeMobileSearch = onMobileSearchClose ?? (() => setMobileSearchOpen(false));

  useEffect(() => {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  const saveRecentSearch = (search: string) => {
    if (!search.trim()) return;
    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const input = searchRef.current?.querySelector('input');
        input?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setMobileSearchOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (mobileSearchOpen && mobileSearchRef.current) {
      mobileSearchRef.current.focus();
    }
  }, [mobileSearchOpen]);

  const results = query.trim()
    ? LAB_MODULES.filter((m) => {
        const q = query.toLowerCase();
        const matchesQuery = (
          m.title.toLowerCase().includes(q) ||
          m.desc.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          `class ${m.classLevel}`.includes(q)
        );
        const matchesFilter = subjectFilter === 'all' || m.subject === subjectFilter;
        return matchesQuery && matchesFilter;
      }).slice(0, 8)
    : [];

  const handleSelect = (lab: typeof LAB_MODULES[number]) => {
    saveRecentSearch(query);
    setIsOpen(false);
    closeMobileSearch();
    setQuery('');
    navigate(`/class/${lab.classLevel}/${lab.subject}/lab/${lab.id}`);
  };

  const handleHardReload = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let registration of registrations) {
          await registration.unregister();
        }
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(key => caches.delete(key)));
      }
    } catch (e) {
      console.error('Failed to clear cache', e);
    }
    // Use a cache-busting query param to bypass browser HTTP cache & Vercel CDN cache
    const url = new URL(window.location.href);
    url.searchParams.set('_cb', Date.now().toString());
    window.location.href = url.toString();
  };

  return (
    <header className={`${isDark ? 'bg-[#121212] border-b border-[#1c1b1b]' : 'bg-[#faf8ff] border-b border-slate-200'} px-5 md:px-10 h-[72px] flex items-center justify-between sticky top-0 z-50 shrink-0`}>
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onToggleSidebar}
            className={`p-2 -ml-2 rounded-xl transition-colors ${isDark ? 'text-slate-400 hover:text-[#4158D1] hover:bg-[#1c1b1b]' : 'text-slate-500 hover:text-[#4158D1] hover:bg-indigo-50'}`}
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <img 
            src="/logo.png" 
            alt={t("Logo")} 
            className={`h-8 w-auto object-contain pointer-events-none ${isDark ? 'drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]'}`}
          />
        </div>

        {/* Desktop Search Bar */}
        <div ref={searchRef} className="hidden lg:block relative w-[400px]">
          <div className={`flex items-center rounded-lg px-4 py-2.5 transition-all ${isDark ? 'bg-[#000000] border border-[#1c1b1b] focus-within:gradient-border' : 'bg-white border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-300 shadow-sm'}`}>
            <Search className={`w-4 h-4 mr-3 shrink-0 ${isDark ? 'text-[#a1a1aa]' : 'text-slate-600'}`} />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
              onFocus={() => setIsOpen(true)}
              placeholder={t('search.placeholder')}
              autoComplete="off"
              className={`!bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-sm w-full font-medium ${isDark ? 'text-[#ffffff] placeholder:text-[#71717a]' : 'text-slate-900 placeholder:text-slate-500'}`}
            />
            <div className={`ml-2 px-1.5 py-0.5 rounded border text-[10px] font-bold tracking-wide flex items-center shrink-0 ${isDark ? 'border-[#1c1b1b] bg-[#000000] text-[#71717a]' : 'border-slate-300 bg-slate-100 text-slate-500 shadow-sm'}`}>
              {t("ctrl + k")}
            </div>
          </div>

          {/* Desktop Dropdown */}
          {isOpen && query.trim() !== '' && (
            <div className={`absolute top-full mt-2 w-full rounded-xl shadow-2xl overflow-hidden z-50 ${isDark ? 'bg-[#121212] border border-[#1c1b1b]' : 'bg-white border border-slate-200'}`}>
              {results.length > 0 ? (
                <ul className="max-h-80 overflow-y-auto py-2">
                  {results.map((lab) => (
                    <li key={lab.id}>
                      <button
                         onClick={() => handleSelect(lab)}
                        className={`w-full text-left px-5 py-3 transition-colors flex flex-col gap-1 border-b last:border-0 ${isDark ? 'hover:bg-[#1c1b1b] border-[#1c1b1b]' : 'hover:bg-slate-50 border-slate-50'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-semibold text-sm ${isDark ? 'text-[#ffffff]' : 'text-slate-800'}`}>{lab.title}</span>
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded whitespace-nowrap ml-2 ${isDark ? 'bg-[#000000] text-[#a1a1aa] border border-[#1c1b1b]' : 'bg-slate-100 text-slate-600'}`}>
                            {t("Class")} {lab.classLevel} · {t(formatSubject(lab.subject))}
                          </span>
                        </div>
                        <span className={`text-xs line-clamp-1 ${isDark ? 'text-[#71717a]' : 'text-slate-500'}`}>{lab.desc}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={`p-6 text-center text-sm ${isDark ? 'text-[#a1a1aa]' : 'text-slate-500'}`}>
                  {t('search.no_results', { query })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 sm:gap-4 shrink-0">
        <button
          onClick={() => onMobileSearchOpen ? onMobileSearchOpen() : setMobileSearchOpen(true)}
          className={`lg:hidden p-1.5 sm:p-2 rounded-full transition-colors ${isDark ? 'text-[#a1a1aa] hover:text-[#6366f1] hover:bg-[#121212]' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'}`}
          aria-label="Search labs"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Reload / Clear Cache */}
        <button
          onClick={handleHardReload}
          className={`p-1.5 sm:p-2 rounded-full transition-colors ${isDark ? 'text-[#a1a1aa] hover:text-[#6366f1] hover:bg-[#121212]' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'}`}
          title={t("Clear Cache & Reload")}
        >
          <RefreshCw className="w-5 h-5" />
        </button>

        {/* Language Switcher */}
        <div className="relative group">
          <button
            className={`p-1.5 sm:p-2 rounded-full transition-colors ${isDark ? 'text-[#a1a1aa] hover:text-[#6366f1] hover:bg-[#121212]' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'}`}
            title={t('settings.language')}
          >
            <Languages className="w-5 h-5" />
          </button>
          <div className={`absolute right-0 top-12 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl rounded-xl overflow-hidden z-50 min-w-[160px] ${
            isDark ? 'bg-[#121212] border border-[#1c1b1b]' : 'bg-white border border-slate-200'
          }`}>
            {[
              { value: 'en' as Language, label: 'English' },
              { value: 'roman-urdu' as Language, label: 'Roman Urdu' },
            ].map((lang) => (
              <button
                key={lang.value}
                onClick={() => setLanguage(lang.value)}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                  language === lang.value
                    ? isDark ? 'bg-[#1c1b1b] text-[#5560F1]' : 'bg-indigo-50 text-indigo-600'
                    : isDark ? 'text-[#a1a1aa] hover:bg-[#1c1b1b]' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className={`p-1.5 sm:p-2 rounded-full transition-colors ${isDark ? 'text-[#a1a1aa] hover:text-[#6366f1] hover:bg-[#121212]' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'}`}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button className={`relative p-1.5 sm:p-2 rounded-full transition-colors hidden sm:block ${isDark ? 'text-[#a1a1aa] hover:text-[#ffffff] hover:bg-[#121212]' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'}`}>
          <Bell className="w-5 h-5" />
        </button>

        {user ? (
          <div className="flex items-center gap-2 sm:gap-3 group relative ml-1 sm:ml-2 pl-2 sm:pl-4 border-l border-[#1c1b1b] cursor-pointer">
            <div className="hidden sm:block text-right">
              <p className={`text-sm font-semibold leading-tight ${isDark ? 'text-[#ffffff]' : 'text-slate-800'}`}>{user.name}</p>
              <p className={`text-[10px] font-medium ${isDark ? 'text-[#71717a]' : 'text-slate-500'}`}>{user.email || 'student@school.edu'}</p>
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#5560F1] flex items-center justify-center text-white font-bold text-sm tracking-wide">
              {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 ${isDark ? 'text-[#71717a]' : 'text-slate-400'}`} />
            
            <div className={`absolute right-0 top-10 sm:top-12 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl rounded-xl p-2 flex flex-col gap-1 font-semibold text-sm min-w-[180px] z-50 ${isDark ? 'bg-[#121212] border border-[#1c1b1b]' : 'bg-white border border-slate-200'}`}>
              <button
                onClick={() => navigate('/create-lab')}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${isDark ? 'text-slate-200 hover:bg-[#1c1b1b]' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                🧪 Create Custom Lab
              </button>
              <button
                onClick={() => navigate('/simulation-studio')}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${isDark ? 'text-slate-200 hover:bg-[#1c1b1b]' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                🎨 Simulation Studio
              </button>
              <button
                onClick={() => navigate('/admin/review')}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${isDark ? 'text-slate-200 hover:bg-[#1c1b1b]' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                🛡️ Review Submissions
              </button>
              <div className={`border-t my-1 ${isDark ? 'border-[#1c1b1b]' : 'border-slate-100'}`} />
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${isDark ? 'text-rose-400 hover:bg-[#1a1515]' : 'text-rose-600 hover:bg-rose-50'}`}
              >
                <LogOut className="w-4 h-4" />
                {t('auth.sign_out')}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-3 sm:px-5 py-1.5 sm:py-2 text-sm sm:text-base bg-[#6366f1] text-white font-semibold rounded-lg hover:bg-[#4f46e5] transition-colors ml-1 sm:ml-2"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:block">{t('auth.log_in')}</span>
          </button>
        )}
      </div>

      {/* Mobile search overlay */}
      {isMobileSearchOpen && (
        <div className={`fixed inset-0 z-[100] flex flex-col ${isDark ? 'bg-[#121212]' : 'bg-white'}`}>
          <div className={`flex items-center gap-3 px-4 py-3 ${isDark ? 'border-b border-[#1c1b1b]' : 'border-b border-slate-200'}`}>
            <button
              onClick={() => { closeMobileSearch(); setQuery(''); }}
              className={`p-2 -ml-2 transition-colors shrink-0 ${isDark ? 'text-[#a1a1aa] hover:text-[#ffffff]' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className={`flex items-center flex-1 rounded-xl px-4 py-2.5 ${isDark ? 'bg-[#000000] border border-[#1c1b1b]' : 'bg-white border border-slate-200 shadow-sm'}`}>
              <Search className={`w-4 h-4 mr-3 shrink-0 ${isDark ? 'text-[#a1a1aa]' : 'text-slate-600'}`} />
              <input
                ref={mobileSearchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search.placeholder')}
                autoComplete="off"
                className={`!bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-sm w-full font-medium ${isDark ? 'text-[#ffffff] placeholder:text-[#71717a]' : 'text-slate-900 placeholder:text-slate-500'}`}
              />
            </div>
          </div>
          
          {/* Subject filters */}
          <div className={`px-4 py-2 flex gap-2 overflow-x-auto ${isDark ? 'border-b border-[#1c1b1b]' : 'border-b border-slate-100'}`}>
            {SUBJECT_FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setSubjectFilter(filter)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  subjectFilter === filter
                    ? 'bg-indigo-500 text-white'
                    : isDark ? 'bg-[#1c1b1b] text-[#71717a] hover:text-[#a1a1aa]' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {filter === 'all' ? t('search.filter_all') : t(formatSubject(filter))}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {query.trim() !== '' ? (
              results.length > 0 ? (
                <ul className="py-2">
                  {results.map((lab) => (
                    <li key={lab.id}>
                      <button
                        onClick={() => handleSelect(lab)}
                        className={`w-full text-left px-5 py-3 transition-colors flex flex-col gap-1 border-b last:border-0 ${isDark ? 'hover:bg-[#121212] border-[#1c1b1b]' : 'hover:bg-slate-50 border-slate-50'}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`font-semibold text-sm ${isDark ? 'text-[#ffffff]' : 'text-slate-800'}`}>{lab.title}</span>
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded whitespace-nowrap ${isDark ? 'bg-[#1c1b1b] text-[#71717a]' : 'bg-slate-100 text-slate-500'}`}>
                            {t("Class")} {lab.classLevel}
                          </span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={`p-10 text-center text-sm ${isDark ? 'text-[#71717a]' : 'text-slate-500'}`}>
                  {t('search.no_results', { query })}
                </div>
              )
            ) : (
              <div className="p-4">
                {recentSearches.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2 px-1">
                      <span className={`text-xs font-semibold ${isDark ? 'text-[#71717a]' : 'text-slate-400'}`}>{t('search.recent')}</span>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-indigo-500 hover:text-indigo-600 font-medium"
                      >
                        {t('search.clear')}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, idx) => (
                        <button
                          key={idx}
                          onClick={() => { setQuery(search); setSubjectFilter('all'); }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            isDark ? 'bg-[#1c1b1b] text-[#a1a1aa] hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className={`p-8 text-center text-sm ${isDark ? 'text-[#71717a]' : 'text-slate-400'}`}>
                  <Search className="w-8 h-8 mx-auto mb-3 opacity-30" />
                  <p>{t('search.type_hint')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
