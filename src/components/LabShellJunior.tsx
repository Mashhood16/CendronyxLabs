import { type ReactNode } from 'react';
import LabHeader from './LabHeader';
import { theme } from '../utils/labTheme';

interface LabShellJuniorProps {
  onExit?: () => void;
  title: string;
  /** Optional subtitle shown below the title */
  subtitle?: string;
  /** Extra elements to render in the header (passed to LabHeader's rightContent) */
  headerExtras?: ReactNode;
  /** Optional tabs/mode switcher shown above the left column */
  tabs?: ReactNode;
  /** Left column content (controls / theory) */
  left: ReactNode;
  /** Right column content (simulation / canvas) */
  right: ReactNode;
}

/**
 * Standardized 2-column layout shell for Classes 6–8 English labs.
 * Uses LabHeader internally for consistent header appearance across all labs.
 * Features:
 * - LabHeader with back button, title, theme toggle, calculator, language switch
 * - Responsive 2-column layout (1/3 + 2/3 by default)
 * - Consistent dark mode classes
 */
export default function LabShellJunior({
  onExit,
  title,
  subtitle,
  headerExtras,
  tabs,
  left,
  right,
}: LabShellJuniorProps) {
  return (
    <div className={`flex flex-col min-h-screen lg:h-screen ${theme.page.bg} font-sans select-none ${theme.text.primary} overflow-x-hidden w-full`}>
      {/* Uses the same LabHeader as all other labs */}
      <LabHeader onExit={onExit} title={title} subtitle={subtitle} rightContent={headerExtras} />

      {/* Tabs (above left column) */}
      {tabs && (
        <div className="w-full px-4 py-3 md:px-6 flex-shrink-0 z-10">
          {tabs}
        </div>
      )}

      {/* Main 2-column layout */}
      <div className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden">
        {/* Left Column (1/3) */}
        <div className="w-full lg:w-1/3 p-4 md:p-6 lg:overflow-y-auto border-r border-slate-200 dark:border-[#1c1b1b] flex flex-col">
          {left}
        </div>

        {/* Right Column (2/3) */}
        <div className="w-full lg:w-2/3 p-4 md:p-6 lg:overflow-y-auto bg-slate-50 dark:bg-[#121212] flex flex-col relative">
          {right}
        </div>
      </div>
    </div>
  );
}
