import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LAB_MODULES } from '../data/labModules';
import Layout from '../components/Layout';
import { FlaskConical, Atom, Dna, Calculator, Cpu, Microscope, LayoutGrid, List, Rocket, Sparkles, ArrowRight, Beaker } from 'lucide-react';
import { useTheme } from '../store';
import { useTranslate } from '../i18n';

const CLASS_CONFIG: Record<string, { color: string; icon: typeof FlaskConical; iconBg: string; textColor: string; label: string; desc: string }> = {
  '6':  { color: '#f97316', icon: FlaskConical, iconBg: 'bg-orange-500/20', textColor: 'text-orange-500', label: 'Science', desc: 'Foundations of Science. Introduction to basic concepts and principles.' },
  '7':  { color: '#3b82f6', icon: Atom,         iconBg: 'bg-blue-500/20',   textColor: 'text-blue-500',   label: 'Physics', desc: 'Exploring physical and chemical changes, acids, bases and salts.' },
  '8':  { color: '#5560F1', icon: Cpu,          iconBg: 'bg-violet-500/20', textColor: 'text-violet-500', label: 'Tech', desc: 'Forces, pressure, sound, and the universe. Intermediate science.' },
  '9':  { color: '#ec4899', icon: Dna,          iconBg: 'bg-pink-500/20',   textColor: 'text-pink-500',   label: 'Biology', desc: 'Matter, atoms, motion, and fundamental units of life.' },
  '10': { color: '#eab308', icon: Microscope,   iconBg: 'bg-yellow-500/20', textColor: 'text-yellow-500', label: 'Chem', desc: 'Chemical reactions, life processes, light, and electricity.' },
  '11': { color: '#6366f1', icon: Calculator,   iconBg: 'bg-indigo-500/20', textColor: 'text-indigo-500', label: 'Math', desc: 'Advanced physics, chemistry, and biology. Preparation for higher studies.' },
  '12': { color: '#10b981', icon: Rocket,       iconBg: 'bg-emerald-500/20', textColor: 'text-emerald-500', label: 'Advanced', desc: 'Capstone simulations in advanced subjects and engineering principles.' },
};

export default function ClassSelection() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { t } = useTranslate();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const moduleCount = useMemo(() => LAB_MODULES.filter(m => m.built).length, []);

  return (
    <Layout>
      <div className="flex flex-col relative max-w-5xl mx-auto pb-24 md:pb-12">
        {/* Hero Section with Animated Gradient */}
        <div className="relative overflow-hidden rounded-2xl mb-6 shadow-lg">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 animate-gradient-x"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent"></div>
          
          {/* Dot pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgCGU9IjIiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
          
          <div className="relative z-10 px-5 py-6 sm:px-7 md:px-9 md:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white/90 text-xs font-semibold mb-3 border border-white/20">
                <Sparkles className="w-3.5 h-3.5" />
                {t('class.platform_tagline')}
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 font-outfit tracking-tight leading-tight">
                {t('class.platform_name')}
              </h1>
              
              <p className="text-white/85 text-sm sm:text-base max-w-xl font-medium leading-relaxed">
                Explore{' '}
                <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded-lg shadow-sm inline-flex items-center gap-1.5">
                  <Beaker className="w-4 h-4" />
                  {moduleCount} immersive simulations
                </span>{' '}
                through hands-on experiments across science, math, and technology.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 md:shrink-0">
              <button 
                onClick={() => document.getElementById('class-grid')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-indigo-600 font-bold rounded-xl hover:bg-white/90 transition-all shadow-md hover:shadow-lg hover:scale-105"
              >
                {t('class.start_exploring')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div id="class-grid" className="flex items-center justify-between mb-6 scroll-mt-20">
          <h2 className={`text-xl md:text-2xl font-bold tracking-tight ${isDark ? 'text-[#ffffff]' : 'text-slate-800'}`}>
            {t('class.select')}
          </h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? (isDark ? 'bg-[#121212] border border-[#1c1b1b] text-[#ffffff]' : 'bg-slate-100 border border-slate-200 text-slate-800') : (isDark ? 'bg-[#121212]/50 border border-[#1c1b1b]/50 text-[#71717a] hover:text-[#a1a1aa]' : 'bg-white border border-slate-100 text-slate-400 hover:text-slate-600')}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? (isDark ? 'bg-[#121212] border border-[#1c1b1b] text-[#ffffff]' : 'bg-slate-100 border border-slate-200 text-slate-800') : (isDark ? 'bg-[#121212]/50 border border-[#1c1b1b]/50 text-[#71717a] hover:text-[#a1a1aa]' : 'bg-white border border-slate-100 text-slate-400 hover:text-slate-600')}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cards Grid / List */}
        <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
          {Object.entries(CLASS_CONFIG).map(([cls, config]) => {
            const Icon = config.icon;
            const classModuleCount = LAB_MODULES.filter(m => m.built && m.classLevel === cls).length;

            return (
              <button
                key={cls}
                onClick={() => navigate(`/class/${cls}`)}
                className={`group p-6 rounded-2xl border transition-all duration-300 text-left overflow-hidden relative ${
                  isDark ? 'bg-[#121212] border-[#1c1b1b] hover:border-[#2a2a2a]' : 'bg-white border-slate-200 hover:shadow-xl'
                } ${viewMode === 'list' ? 'flex items-center gap-5 sm:gap-8' : 'flex flex-col'}`}
              >
                {/* Colored Top or Left Border */}
                <div 
                  className={`absolute ${viewMode === 'list' ? 'top-0 bottom-0 left-0 w-1' : 'top-0 left-0 right-0 h-1'}`} 
                  style={{ backgroundColor: config.color }}
                />

                {viewMode === 'grid' ? (
                  <>
                    <div className="flex items-start justify-between mb-4 mt-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.iconBg} ${config.textColor}`}>
                        <Icon className="w-5 h-5" strokeWidth={2.5} />
                      </div>
                      <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isDark ? 'bg-[#1c1b1b] text-[#71717a]' : 'bg-slate-100 text-slate-500'}`}>
                        {t('class.modules_count', { count: classModuleCount })}
                      </div>
                    </div>

                    <h3 className={`text-xl font-bold font-outfit mb-2 ${isDark ? 'text-[#ffffff]' : 'text-slate-800'}`}>
                      Class {cls}
                    </h3>
                    
                    <p className={`text-sm mb-6 flex-1 ${isDark ? 'text-[#a1a1aa]' : 'text-slate-500'}`}>
                      {config.desc}
                    </p>

                    <div className={`text-sm font-bold flex items-center gap-1 ${config.textColor} transition-transform group-hover:translate-x-1`}>
                      {t('class.enter_curriculum')}
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${config.iconBg} ${config.textColor}`}>
                      <Icon className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className={`text-xl font-bold font-outfit ${isDark ? 'text-[#ffffff]' : 'text-slate-800'}`}>{t('class.title', { number: cls })}</h3>
                        <div className={`text-[10px] font-semibold px-2 py-0.5 rounded-full sm:hidden ${isDark ? 'bg-[#1c1b1b] text-[#71717a]' : 'bg-slate-100 text-slate-500'}`}>
                          {classModuleCount} {t('class.modules')}
                        </div>
                      </div>
                      <p className={`text-sm truncate ${isDark ? 'text-[#a1a1aa]' : 'text-slate-500'}`}>{config.desc}</p>
                    </div>
                    <div className={`text-xs font-semibold px-3 py-1.5 rounded-full shrink-0 hidden sm:block ${isDark ? 'bg-[#1c1b1b] text-[#71717a]' : 'bg-slate-100 text-slate-500'}`}>
                      {t('class.modules_count', { count: classModuleCount })}
                    </div>
                    <div className={`text-sm font-bold flex items-center gap-1 ${config.textColor} transition-transform group-hover:translate-x-1 shrink-0 ml-2 hidden md:flex`}>
                      {t('class.enter_curriculum')}
                    </div>
                  </>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </Layout>
  );
}
