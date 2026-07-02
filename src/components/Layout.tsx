import { useState, useRef, useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';
import WelcomeTour from './WelcomeTour';
import { useTheme } from '../store';

interface LayoutProps {
  children: ReactNode;
  hideBottomNav?: boolean;
}

export default function Layout({ children, hideBottomNav = false }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const mainRef = useRef<HTMLElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (mainRef.current) {
      const savedScroll = sessionStorage.getItem(`scroll-${location.key}`);
      if (savedScroll !== null) {
        requestAnimationFrame(() => {
          if (mainRef.current) {
            mainRef.current.scrollTop = parseInt(savedScroll, 10);
          }
        });
      } else {
        mainRef.current.scrollTop = 0;
      }
    }
  }, [location.key]);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    sessionStorage.setItem(`scroll-${location.key}`, e.currentTarget.scrollTop.toString());
  };

  return (
    <div className={`flex h-screen overflow-hidden font-sans relative ${isDark ? 'bg-[#000000] text-zinc-400 selection:bg-indigo-500/30 selection:text-indigo-200' : 'bg-[#faf8ff] text-slate-800 dark:text-[#ffffff] selection:bg-blue-200 selection:text-blue-900'}`}>
      <WelcomeTour />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Header 
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          onMobileSearchOpen={() => setMobileSearchOpen(true)}
          mobileSearchOpen={mobileSearchOpen}
          onMobileSearchClose={() => { setMobileSearchOpen(false); }}
        />
        <main 
          ref={mainRef}
          onScroll={handleScroll}
          className={`flex-1 overflow-y-auto px-5 md:px-10 py-6 md:py-8 will-change-scroll ${isDark ? 'bg-[#000000]' : 'bg-[#faf8ff]'} ${!hideBottomNav ? 'pb-24 md:pb-8' : ''}`}
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        {!hideBottomNav && <BottomNav onSearchOpen={() => setMobileSearchOpen(true)} />}
      </div>
    </div>
  );
}
