import { useState, type ReactNode } from 'react';
import { ArrowLeft, Sun, Moon, Calculator, Languages } from 'lucide-react';
import { useTheme, useLab } from '../store';
import { useTranslate } from '../i18n';
import ScientificCalculator from './ScientificCalculator';

export type LabHeaderVariant = 'light' | 'dark' | 'emerald' | 'amber' | 'blue';

interface LabHeaderProps {
  onExit?: () => void;
  title: string;
  /** Optional translation key. If provided, title is translated via t(titleKey). */
  titleKey?: string;
  subtitle?: string;
  /** Optional translation key for subtitle. */
  subtitleKey?: string;
  icon?: ReactNode;
  rightContent?: ReactNode;
  variant?: LabHeaderVariant;
}

interface SolidTheme {
  lightBg: string;
  darkBg: string;
  text: string;
  subtext: string;
  button: string;
}

const SOLID_THEMES: SolidTheme[] = [
  {
    lightBg: 'bg-indigo-600 shadow-md shadow-indigo-500/10',
    darkBg: 'bg-indigo-900 shadow-md shadow-indigo-950/40 border-b border-indigo-800/50',
    text: 'text-white',
    subtext: 'text-indigo-100/90',
    button: 'p-2 rounded-full transition-colors text-white hover:bg-white/20 border-0 outline-none focus:outline-none focus:ring-0',
  },
  {
    lightBg: 'bg-emerald-600 shadow-md shadow-emerald-500/10',
    darkBg: 'bg-emerald-900 shadow-md shadow-emerald-950/40 border-b border-emerald-800/50',
    text: 'text-white',
    subtext: 'text-emerald-100/90',
    button: 'p-2 rounded-full transition-colors text-white hover:bg-white/20 border-0 outline-none focus:outline-none focus:ring-0',
  },
  {
    lightBg: 'bg-rose-600 shadow-md shadow-rose-500/10',
    darkBg: 'bg-rose-900 shadow-md shadow-rose-950/40 border-b border-rose-800/50',
    text: 'text-white',
    subtext: 'text-rose-100/90',
    button: 'p-2 rounded-full transition-colors text-white hover:bg-white/20 border-0 outline-none focus:outline-none focus:ring-0',
  },
  {
    lightBg: 'bg-amber-600 shadow-md shadow-amber-500/10',
    darkBg: 'bg-amber-900 shadow-md shadow-amber-950/40 border-b border-amber-800/50',
    text: 'text-white',
    subtext: 'text-amber-100/90',
    button: 'p-2 rounded-full transition-colors text-white hover:bg-white/20 border-0 outline-none focus:outline-none focus:ring-0',
  },
  {
    lightBg: 'bg-blue-600 shadow-md shadow-blue-500/10',
    darkBg: 'bg-blue-900 shadow-md shadow-blue-950/40 border-b border-blue-800/50',
    text: 'text-white',
    subtext: 'text-blue-100/90',
    button: 'p-2 rounded-full transition-colors text-white hover:bg-white/20 border-0 outline-none focus:outline-none focus:ring-0',
  },
  {
    lightBg: 'bg-purple-600 shadow-md shadow-purple-500/10',
    darkBg: 'bg-purple-900 shadow-md shadow-purple-950/40 border-b border-purple-800/50',
    text: 'text-white',
    subtext: 'text-purple-100/90',
    button: 'p-2 rounded-full transition-colors text-white hover:bg-white/20 border-0 outline-none focus:outline-none focus:ring-0',
  }
];

export default function LabHeader({ onExit, title, titleKey, subtitle, subtitleKey, icon, rightContent }: LabHeaderProps) {
  const [calcOpen, setCalcOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { hideCalculator } = useLab();
  const { t, language, setLanguage } = useTranslate();
  
  const displayTitle = titleKey ? t(titleKey) : title;
  const displaySubtitle = subtitleKey ? t(subtitleKey) : subtitle;
  
  const getThemeIndex = (text: string) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % SOLID_THEMES.length;
  };

  const themeIndex = getThemeIndex(title);
  const activeTheme = SOLID_THEMES[themeIndex];
  
  // Use lightBg (vibrant solid color) regardless of theme, as requested by user
  const containerClass = activeTheme.lightBg;
  const titleClass = activeTheme.text;
  const subtitleClass = activeTheme.subtext;
  const buttonClass = activeTheme.button;

  return (
    <>
      <div className={`lab-header-container ${containerClass} px-4 py-3 md:px-6 md:py-4 flex flex-wrap items-center justify-between gap-2 sticky top-0 z-10 shadow-sm shrink-0`}>
        <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
          {onExit && (
            <button
              onClick={onExit}
              className={`${buttonClass} shrink-0`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="min-w-0 w-full md:w-auto">
            <h1 className={`text-base md:text-xl font-bold ${titleClass} flex items-center gap-2`}>
              {icon}
              <span className="truncate">{displayTitle}</span>
            </h1>
            {displaySubtitle && (
              <p className={`text-xs md:text-sm ${subtitleClass}`}>{displaySubtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 shrink-0 ml-2 md:ml-4">
          {rightContent}
          {!hideCalculator && (
            <button
              onClick={() => setCalcOpen(!calcOpen)}
              className={buttonClass}
              title={t('lab.open_calculator')}
            >
              <Calculator className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          )}
          <button
            onClick={toggleTheme}
            className={buttonClass}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => {
              const langs: ('en' | 'roman-urdu')[] = ['en', 'roman-urdu'];
              const next = langs[(langs.indexOf(language) + 1) % langs.length];
              setLanguage(next);
            }}
            className={`${buttonClass} flex items-center gap-1.5 px-3 py-1.5 rounded-full`}
            title={language === 'en' ? 'Roman Urdu mein dekhein' : 'Switch to English'}
          >
            <Languages className="w-5 h-5" />
            <span className="font-bold text-xs">{language === 'en' ? 'EN' : 'RU'}</span>
          </button>
        </div>
      </div>
      {calcOpen && <ScientificCalculator onClose={() => setCalcOpen(false)} />}
    </>
  );
}
