import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LAB_MODULES } from '../data/labModules';
import Layout from '../components/Layout';
import { FlaskConical, Atom, Dna, Calculator, Cpu, Microscope, LayoutGrid, List, Rocket, Sparkles, ArrowRight, Beaker } from 'lucide-react';
import { useTheme } from '../store';

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
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const moduleCount = useMemo(() => LAB_MODULES.filter(m => m.built).length, []);

  const featuredLabs = useMemo(() => 
    LAB_MODULES.filter(m => m.built).slice(0, 6), 
  []);

  return (
    <Layout>
      <div className="flex flex-col relative max-w-5xl mx-auto pb-24 md:pb-12">
        {/* Hero Section with Animated Gradient */}
        <div className="relative overflow-hidden rounded-3xl mb-10 shadow-2xl">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 animate-gradient-x"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          
          {/* Floating orbs */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float-slow"></div>
          <div className="absolute bottom-10 right-20 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl animate-float-medium"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-pink-400/15 rounded-full blur-2xl animate-float-fast"></div>
          
          {/* Dot pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgCGU9IjIiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
          
          <div className="relative z-10 p-8 md:p-14 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white/90 text-xs font-semibold mb-6 border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              Interactive Learning Platform
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 font-outfit tracking-tight leading-tight">
              Next-Generation<br />
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">Cendronyx Labs</span>
            </h1>
            
            <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-2xl mb-8 font-medium leading-relaxed">
              Step inside and explore a growing library of{' '}
              <span className="font-bold text-white bg-white/20 px-2.5 py-1 rounded-lg shadow-sm inline-flex items-center gap-1.5">
                <Beaker className="w-4 h-4" />
                {moduleCount} immersive simulations
              </span>{' '}
              Master complex scientific concepts through interactive, hands-on experimentation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => document.getElementById('class-grid')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-white/90 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Start Exploring
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Featured Labs Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className={`text-xl md:text-2xl font-bold tracking-tight ${isDark ? 'text-[#ffffff]' : 'text-slate-800'}`}>
                Featured Labs
              </h2>
              <p className={`text-sm mt-1 ${isDark ? 'text-[#71717a]' : 'text-slate-500'}`}>
                Popular interactive simulations to get you started
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredLabs.map((lab) => (
              <button
                key={lab.id}
                onClick={() => navigate(`/class/${lab.classLevel}/${lab.subject}/lab/${lab.id}`)}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 text-left hover:-translate-y-1 hover:shadow-lg ${
                  isDark ? 'bg-[#121212] border-[#1c1b1b] hover:border-[#2a2a2a]' : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`h-2 bg-gradient-to-r ${lab.bg}`}></div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className={`text-sm font-bold leading-snug ${isDark ? 'text-[#ffffff]' : 'text-slate-800'}`}>
                      {lab.title}
                    </h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${isDark ? 'bg-[#1c1b1b] text-[#71717a]' : 'bg-slate-100 text-slate-500'}`}>
                      Class {lab.classLevel}
                    </span>
                  </div>
                  <p className={`text-xs line-clamp-2 ${isDark ? 'text-[#71717a]' : 'text-slate-500'}`}>
                    {lab.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Section Header */}
        <div id="class-grid" className="flex items-center justify-between mb-6 scroll-mt-20">
          <h2 className={`text-xl md:text-2xl font-bold tracking-tight ${isDark ? 'text-[#ffffff]' : 'text-slate-800'}`}>
            Select Class
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
                        {classModuleCount} Modules
                      </div>
                    </div>

                    <h3 className={`text-xl font-bold font-outfit mb-2 ${isDark ? 'text-[#ffffff]' : 'text-slate-800'}`}>
                      Class {cls}
                    </h3>
                    
                    <p className={`text-sm mb-6 flex-1 ${isDark ? 'text-[#a1a1aa]' : 'text-slate-500'}`}>
                      {config.desc}
                    </p>

                    <div className={`text-sm font-bold flex items-center gap-1 ${config.textColor} transition-transform group-hover:translate-x-1`}>
                      Enter curriculum <span>→</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${config.iconBg} ${config.textColor}`}>
                      <Icon className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className={`text-xl font-bold font-outfit ${isDark ? 'text-[#ffffff]' : 'text-slate-800'}`}>Class {cls}</h3>
                        <div className={`text-[10px] font-semibold px-2 py-0.5 rounded-full sm:hidden ${isDark ? 'bg-[#1c1b1b] text-[#71717a]' : 'bg-slate-100 text-slate-500'}`}>
                          {classModuleCount} Mod
                        </div>
                      </div>
                      <p className={`text-sm truncate ${isDark ? 'text-[#a1a1aa]' : 'text-slate-500'}`}>{config.desc}</p>
                    </div>
                    <div className={`text-xs font-semibold px-3 py-1.5 rounded-full shrink-0 hidden sm:block ${isDark ? 'bg-[#1c1b1b] text-[#71717a]' : 'bg-slate-100 text-slate-500'}`}>
                      {classModuleCount} Modules
                    </div>
                    <div className={`text-sm font-bold flex items-center gap-1 ${config.textColor} transition-transform group-hover:translate-x-1 shrink-0 ml-2 hidden md:flex`}>
                      Enter curriculum <span>→</span>
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
