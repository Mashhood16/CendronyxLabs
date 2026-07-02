import { useState } from 'react';
import { GraduationCap, ChevronDown, ChevronRight, Lightbulb, Sigma, BookOpen, ArrowRight } from 'lucide-react';

interface DerivationStep {
  label: string;
  latex: string;
  explanation: string;
}

interface Derivation {
  title: string;
  question: string;
  steps: DerivationStep[];
  conclusion: string;
  realWorldApplication: string;
}

interface DeepDivePanelProps {
  derivation: Derivation;
  defaultExpanded?: boolean;
}

const StepBlock = ({ step, index, isLast }: { step: DerivationStep; index: number; isLast: boolean }) => {
  const [expanded, setExpanded] = useState(index === 0);
  return (
    <div className="border-l-2 border-indigo-500/30 pl-4 ml-2 mb-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm font-semibold text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-indigo-200 transition-colors"
      >
        {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded font-mono">
          Step {index + 1}
        </span>
        {step.label}
      </button>
      {expanded && (
        <div className="mt-2 space-y-2">
          <div className="bg-[#000000] dark:bg-[#000000] rounded-lg p-3 border border-indigo-500/20 overflow-x-auto">
            <code className="text-green-400 text-xs font-mono whitespace-pre-wrap leading-relaxed">
              {step.latex}
            </code>
          </div>
          <p className="text-xs text-slate-600 dark:text-[#a1a1aa] leading-relaxed pl-1">
            {step.explanation}
          </p>
          {!isLast && (
            <div className="flex justify-center py-1">
              <ArrowRight className="w-4 h-4 text-indigo-400" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function DeepDivePanel({ derivation, defaultExpanded = false }: DeepDivePanelProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="mt-4 border border-indigo-200 dark:border-indigo-800/50 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-50/80 to-white dark:from-indigo-950/20 dark:to-[#121212]">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/20 transition-colors"
      >
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-bold text-indigo-800 dark:text-indigo-300">
            Deep Dive: {derivation.title}
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
            STEM Track
          </span>
        </div>
        {isExpanded ? <ChevronDown className="w-4 h-4 text-indigo-500" /> : <ChevronRight className="w-4 h-4 text-indigo-500" />}
      </button>

      {isExpanded && (
        <div className="p-4 pt-2 space-y-4">
          {/* The Core Question */}
          <div className="bg-indigo-100/50 dark:bg-indigo-900/20 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800/30">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-[#ffffff] uppercase tracking-wider">Core Question</span>
                <p className="text-sm text-slate-700 dark:text-[#ffffff] mt-1 font-medium">
                  {derivation.question}
                </p>
              </div>
            </div>
          </div>

          {/* Derivation Steps */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sigma className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-bold text-slate-600 dark:text-[#a1a1aa] uppercase tracking-wider">
                Step-by-Step Derivation
              </span>
            </div>
            {derivation.steps.map((step, idx) => (
              <StepBlock key={idx} step={step} index={idx} isLast={idx === derivation.steps.length - 1} />
            ))}
          </div>

          {/* Conclusion */}
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800/30">
            <div className="flex items-start gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Conclusion</span>
                <p className="text-sm text-slate-700 dark:text-[#ffffff] mt-1">{derivation.conclusion}</p>
              </div>
            </div>
          </div>

          {/* Real-world Application */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800/30">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Real-World Application</span>
                <p className="text-sm text-slate-700 dark:text-[#ffffff] mt-1">{derivation.realWorldApplication}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
