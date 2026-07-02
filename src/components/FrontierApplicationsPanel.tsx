import { useState } from 'react';
import { Atom, Leaf, Cpu, ChevronDown, ChevronRight, ExternalLink, FlaskConical, Crosshair } from 'lucide-react';

export interface FrontierTopic {
  id: string;
  icon: 'nanotech' | 'greenchem' | 'quantum';
  title: string;
  summary: string;
  connectionToLab: string;
  currentResearch: string;
  careerPath: string;
  keyConcept: string;
}

interface FrontierApplicationsPanelProps {
  topics: FrontierTopic[];
  defaultExpanded?: boolean;
}

const ICON_MAP = {
  nanotech: Atom,
  greenchem: Leaf,
  quantum: Cpu,
};

const THEME_MAP = {
  nanotech: { border: 'border-cyan-200 dark:border-cyan-800/50', bg: 'from-cyan-50/80 to-white dark:from-cyan-950/20 dark:to-[#121212]', icon: 'text-cyan-600 dark:text-cyan-400', badge: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400' },
  greenchem: { border: 'border-emerald-200 dark:border-emerald-800/50', bg: 'from-emerald-50/80 to-white dark:from-emerald-950/20 dark:to-[#121212]', icon: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' },
  quantum: { border: 'border-violet-200 dark:border-violet-800/50', bg: 'from-violet-50/80 to-white dark:from-violet-950/20 dark:to-[#121212]', icon: 'text-violet-600 dark:text-violet-400', badge: 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400' },
};

const TOPIC_LABELS = {
  nanotech: 'Nanotechnology',
  greenchem: 'Green Chemistry',
  quantum: 'Quantum Computing',
};

function TopicCard({ topic }: { topic: FrontierTopic }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = ICON_MAP[topic.icon];
  const theme = THEME_MAP[topic.icon];

  return (
    <div className={`border ${theme.border} rounded-xl overflow-hidden bg-gradient-to-br ${theme.bg}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 hover:opacity-80 transition-opacity"
      >
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${theme.icon}`} />
          <span className="text-sm font-bold text-slate-800 dark:text-[#ffffff]">
            {topic.title}
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${theme.badge}`}>
            {TOPIC_LABELS[topic.icon]}
          </span>
        </div>
        {expanded ? <ChevronDown className={`w-4 h-4 ${theme.icon}`} /> : <ChevronRight className={`w-4 h-4 ${theme.icon}`} />}
      </button>

      {expanded && (
        <div className="p-4 pt-2 space-y-3">
          <p className="text-xs text-slate-600 dark:text-[#a1a1aa] leading-relaxed">
            {topic.summary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="bg-white/50 dark:bg-[#000000]/30 rounded-lg p-2.5 border border-slate-200 dark:border-[#1c1b1b]">
              <div className="flex items-center gap-1.5 mb-1">
                <FlaskConical className="w-3 h-3 text-indigo-500" />
                <span className="text-[10px] font-bold text-slate-600 dark:text-[#a1a1aa] uppercase tracking-wider">
                  Connection to this Lab
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-[#ffffff]">{topic.connectionToLab}</p>
            </div>

            <div className="bg-white/50 dark:bg-[#000000]/30 rounded-lg p-2.5 border border-slate-200 dark:border-[#1c1b1b]">
              <div className="flex items-center gap-1.5 mb-1">
                <Crosshair className="w-3 h-3 text-amber-500" />
                <span className="text-[10px] font-bold text-slate-600 dark:text-[#a1a1aa] uppercase tracking-wider">
                  Current Research
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-[#ffffff]">{topic.currentResearch}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="bg-white/50 dark:bg-[#000000]/30 rounded-lg p-2.5 border border-slate-200 dark:border-[#1c1b1b]">
              <div className="flex items-center gap-1.5 mb-1">
                <ExternalLink className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] font-bold text-slate-600 dark:text-[#a1a1aa] uppercase tracking-wider">
                  Career Pathway
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-[#ffffff]">{topic.careerPath}</p>
            </div>

            <div className="bg-white/50 dark:bg-[#000000]/30 rounded-lg p-2.5 border border-slate-200 dark:border-[#1c1b1b]">
              <div className="flex items-center gap-1.5 mb-1">
                <Cpu className="w-3 h-3 text-violet-500" />
                <span className="text-[10px] font-bold text-slate-600 dark:text-[#a1a1aa] uppercase tracking-wider">
                  Key Concept
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-[#ffffff]">{topic.keyConcept}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FrontierApplicationsPanel({ topics, defaultExpanded = false }: FrontierApplicationsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="mt-4 border border-emerald-200 dark:border-emerald-800/50 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-50/80 to-white dark:from-emerald-950/20 dark:to-[#121212]">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/20 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
            Frontier Applications
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
            Cutting Edge
          </span>
        </div>
        {isExpanded ? <ChevronDown className="w-4 h-4 text-emerald-500" /> : <ChevronRight className="w-4 h-4 text-emerald-500" />}
      </button>

      {isExpanded && (
        <div className="p-4 pt-2 space-y-3">
          <p className="text-xs text-slate-500 dark:text-[#71717a] mb-2">
            Explore how the concepts from this lab are applied in cutting-edge research and emerging technologies.
          </p>
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      )}
    </div>
  );
}
