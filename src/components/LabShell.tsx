import { useState, type ReactNode } from 'react';
import LabHeader from './LabHeader';
import { theme } from '../utils/labTheme';

interface LabShellProps {
  onExit?: () => void;
  title: string;
  subtitle?: string;
  /** Translated text for the Theory mobile tab button */
  theoryTabLabel?: string;
  /** Translated text for the Lab mobile tab button */
  labTabLabel?: string;
  theory: ReactNode;
  simulation: ReactNode;
  assessment: ReactNode;
  header?: ReactNode;
}

/**
 * Reusable 3-column layout shell for classes 9–12 labs.
 * Handles mobile tab switching, dark mode, and responsive grid layout.
 */
export default function LabShell({
  onExit,
  title,
  subtitle,
  theoryTabLabel = 'Theory',
  labTabLabel = 'Lab',
  theory,
  simulation,
  assessment,
  header,
}: LabShellProps) {
  const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

  return (
    <div className={`flex flex-col min-h-screen lg:h-screen ${theme.page.bg} font-sans select-none overflow-x-hidden w-full`}>
      {header ?? <LabHeader onExit={onExit} title={title} subtitle={subtitle} />}

      {/* Mobile Tab Navigation */}
      <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
        <button
          onClick={() => setActiveMobileTab('theory')}
          className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : theme.tab.inactive}`}
        >
          {theoryTabLabel}
        </button>
        <button
          onClick={() => setActiveMobileTab('lab')}
          className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : theme.tab.inactive}`}
        >
          {labTabLabel}
        </button>
      </div>

      <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:overflow-visible">
        {/* Theory Column */}
        <div className={`w-full rounded-xl shadow-sm border ${theme.border.default} p-5 flex flex-col ${theme.card.bg} ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
          {theory}
        </div>

        {/* Simulation Column */}
        <div className={`w-full rounded-xl shadow-sm border ${theme.border.default} p-5 flex flex-col ${theme.card.bg} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
          {simulation}
        </div>

        {/* Assessment Column */}
        <div className={`w-full rounded-xl shadow-sm border ${theme.border.default} p-5 flex flex-col ${theme.card.bg} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
          {assessment}
        </div>
      </div>
    </div>
  );
}
