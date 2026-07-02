import { useState, type ReactNode } from 'react';
import { ArrowLeft, Sun, Moon, Calculator } from 'lucide-react';
import { useTheme } from '../store';
import ScientificCalculator from './ScientificCalculator';

export type LabHeaderVariant = 'light' | 'dark' | 'emerald' | 'amber' | 'blue';

interface LabHeaderProps {
 onExit?: () => void;
 title: string;
 subtitle?: string;
 icon?: ReactNode;
 rightContent?: ReactNode;
 variant?: LabHeaderVariant;
}

const variantStyles: Record<LabHeaderVariant, { container: string; button: string; title: string; subtitle: string }> = {
 light: {
 container: 'bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:bg-none dark:bg-[#121212] border-b border-slate-200 dark:border-[#1c1b1b] shadow-sm',
 button: 'p-2 rounded-full transition-colors text-slate-600 dark:text-[#ffffff] hover:bg-slate-100/50 dark:hover:bg-white/10',
 title: 'text-slate-800 dark:text-white',
 subtitle: 'text-slate-500 dark:text-[#a1a1aa]',
 },
 dark: {
 container: 'bg-[#121212] dark:bg-[#121212] border-b border-[#1c1b1b] dark:border-[#1c1b1b] text-white',
 button: 'p-2 rounded-full transition-colors text-slate-300 hover:bg-white/10 dark:text-[#ffffff]',
 title: 'text-white dark:text-white',
 subtitle: 'text-slate-300 dark:text-[#a1a1aa]',
 },
 emerald: {
 container: 'bg-emerald-700 text-white dark:bg-emerald-900',
 button: 'p-2 rounded-full transition-colors text-white/80 hover:bg-white/10',
 title: 'text-white',
 subtitle: 'text-emerald-100',
 },
 amber: {
 container: 'bg-amber-700 text-white dark:bg-amber-900',
 button: 'p-2 rounded-full transition-colors text-white/80 hover:bg-white/10',
 title: 'text-white',
 subtitle: 'text-amber-100',
 },
 blue: {
 container: 'bg-blue-900 text-white',
 button: 'p-2 rounded-full transition-colors text-white/80 hover:bg-white/10',
 title: 'text-white',
 subtitle: 'text-blue-200',
 },
};

export default function LabHeader({ onExit, title, subtitle, icon, rightContent, variant = 'light' }: LabHeaderProps) {
 const [calcOpen, setCalcOpen] = useState(false);
 const styles = variantStyles[variant];
 const { theme, toggleTheme } = useTheme();
 return (
 <>
  <div className={`${styles.container} px-4 py-3 md:px-6 md:py-4 flex flex-wrap items-center justify-between gap-2 sticky top-0 z-10 shadow-sm shrink-0`}>
   <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
    {onExit && (
     <button
      onClick={onExit}
      className={`${styles.button} shrink-0`}
     >
      <ArrowLeft className="w-5 h-5" />
     </button>
    )}
    <div className="min-w-0 w-full md:w-auto">
     <h1 className={`text-base md:text-xl font-bold ${styles.title} flex items-center gap-2 truncate`}>
      {icon}
      {title}
     </h1>
     {subtitle && (
      <p className={`text-xs md:text-sm ${styles.subtitle} truncate`}>{subtitle}</p>
     )}
    </div>
   </div>
   <div className="flex items-center gap-2 md:gap-3 shrink-0 ml-2 md:ml-4">
    {rightContent}
    <button
     onClick={() => setCalcOpen(true)}
     className={`${styles.button} shrink-0 relative group`}
     title="Scientific Calculator"
    >
     <Calculator className="w-5 h-5" />
     <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
      Calculator
     </span>
    </button>
    <button
     onClick={toggleTheme}
     className={`${styles.button} shrink-0`}
     title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
     {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
   </div>
  </div>
  {calcOpen && <ScientificCalculator onClose={() => setCalcOpen(false)} />}
 </>
 );
}
