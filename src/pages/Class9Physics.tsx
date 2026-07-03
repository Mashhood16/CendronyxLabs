import { useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LAB_MODULES, formatSubject } from '../data/labModules';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import { Rocket, GraduationCap, Beaker, Atom, ChevronRight, ArrowRight, BookOpen } from 'lucide-react';

const SUBJECT_ACCENT: Record<string, string> = {
  physics: 'from-blue-500 to-indigo-600',
};

export default function Class9Physics() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const classId = '9';
  const subjectId = 'physics';
  const activeTab = (searchParams.get('tab') as 'labs' | 'derivations') ?? 'labs';

  const setActiveTab = (tab: 'labs' | 'derivations') => {
    setSearchParams({ tab }, { replace: true });
  };

  // Save scroll position before navigating away and restore on back-navigation
  const goToLab = (path: string) => {
    sessionStorage.setItem(`scroll_${classId}_${subjectId}`, String(window.scrollY));
    navigate(path);
  };

  useEffect(() => {
    const saved = sessionStorage.getItem(`scroll_${classId}_${subjectId}`);
    if (saved) {
      const scrollY = parseInt(saved, 10);
      if (!isNaN(scrollY)) {
        requestAnimationFrame(() => window.scrollTo(0, scrollY));
      }
      sessionStorage.removeItem(`scroll_${classId}_${subjectId}`);
    }
  }, []);
  const accent = SUBJECT_ACCENT[subjectId] || 'from-slate-500 to-slate-600';

  const filteredModules = useMemo(
    () => LAB_MODULES.filter(m => m.classLevel === classId && m.subject === subjectId),
    []
  );

  const derivationModules = useMemo(
    () => LAB_MODULES.filter(m => m.classLevel === classId && m.subject === subjectId && m.id.startsWith('p9_deriv_')),
    []
  );

  const readyCount = filteredModules.filter(m => m.built).length;

  return (
    <Layout>
      <div className="flex flex-col min-h-[calc(100vh-80px)]">
        <Breadcrumbs />

        {/* Page Header */}
        <div className="relative overflow-hidden rounded-2xl mb-6 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          <div className="relative z-10 px-6 py-8 md:px-10 md:py-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Atom className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Class 9 Physics</h1>
                <p className="text-white/80 text-sm">Forces, Motion, Energy & Pressure — with interactive labs and step-by-step derivations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-[#1c1b1b] p-1.5 rounded-xl w-full sm:w-fit">
          <button
            onClick={() => setActiveTab('labs')}
            className={`flex flex-1 sm:flex-none justify-center items-center gap-2 px-3 sm:px-5 py-2.5 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'labs'
                ? 'bg-white dark:bg-[#121212] text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Beaker className="w-4 h-4" />
            Labs
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              {readyCount - derivationModules.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('derivations')}
            className={`flex flex-1 sm:flex-none justify-center items-center gap-2 px-3 sm:px-5 py-2.5 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'derivations'
                ? 'bg-white dark:bg-[#121212] text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Derivations
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              {derivationModules.length}
            </span>
          </button>
        </div>

        {/* Labs Tab */}
        {activeTab === 'labs' && (
          <div className="flex-1">
            {filteredModules.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 glass rounded-2xl border border-dashed border-slate-200/50 dark:border-neutral-900/50">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 opacity-50">
                  <Rocket className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">No Labs Available</h3>
                <p className="text-slate-500 max-w-md text-center">There are no labs available for this selection.</p>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredModules.filter(m => !m.id.startsWith('p9_deriv_')).map((lab) => {
                    const isBuilt = lab.built;
                    return (
                      <div
                        key={lab.id}
                        onClick={() => isBuilt && goToLab(`/class/${classId}/${subjectId}/lab/${lab.id}`)}
                        className={`relative group rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full ${
                          isBuilt
                            ? 'glass border border-slate-200/50 dark:border-[#1c1b1b]/50 hover:-translate-y-2 hover:shadow-xl hover:border-transparent cursor-pointer hover:gradient-border'
                            : 'glass border border-dashed border-slate-200/50 dark:border-[#1c1b1b]/50 opacity-70'
                        }`}
                      >
                        <div className={`relative h-32 bg-gradient-to-br ${lab.bg} overflow-hidden`}>
                          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
                          {isBuilt && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>}
                          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/20 backdrop-blur-md text-white text-xs font-bold tracking-wider border border-white/20">
                            {formatSubject(lab.subject)} &middot; Class {lab.classLevel}
                          </div>
                          {isBuilt ? (
                            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-500/90 text-white text-xs font-bold backdrop-blur-sm">
                              <Rocket className="w-3.5 h-3.5" /> Ready
                            </div>
                          ) : (
                            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/30 text-white/70 text-xs font-bold backdrop-blur-sm">
                              Coming Soon
                            </div>
                          )}
                        </div>
                        <div className="p-6 flex-1 flex flex-col bg-transparent">
                          <h3 className={`text-base font-bold font-outfit leading-snug mb-2 ${isBuilt ? 'text-slate-800 group-hover:text-slate-900' : 'text-slate-600'}`}>
                            {lab.title}
                          </h3>
                          <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2 flex-1">
                            {lab.desc}
                          </p>
                          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-xs font-bold">~15 min</span>
                            </div>
                            {isBuilt ? (
                              <span className="text-xs font-bold text-white px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 group-hover:scale-105 transition-transform inline-flex items-center gap-1">
                                Launch <ArrowRight className="w-3 h-3" />
                              </span>
                            ) : (
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Soon</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Derivations Tab */}
        {activeTab === 'derivations' && (
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {derivationModules.map((lab) => {
                const isBuilt = lab.built;
                return (
                  <div
                    key={lab.id}
                    onClick={() => isBuilt && goToLab(`/class/${classId}/${subjectId}/lab/${lab.id}`)}
                    className={`relative group rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full ${
                      isBuilt
                        ? 'glass border border-slate-200/50 dark:border-[#1c1b1b]/50 hover:-translate-y-2 hover:shadow-xl hover:border-transparent cursor-pointer hover:gradient-border'
                        : 'glass border border-dashed border-slate-200/50 dark:border-[#1c1b1b]/50 opacity-70'
                    }`}
                  >
                    <div className={`relative h-32 bg-gradient-to-br ${lab.bg} overflow-hidden`}>
                      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
                      {isBuilt && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>}
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/20 backdrop-blur-md text-white text-xs font-bold tracking-wider border border-white/20">
                        Derivation &middot; Class 9 Physics
                      </div>
                      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/90 text-white text-xs font-bold backdrop-blur-sm">
                        <BookOpen className="w-3.5 h-3.5" /> Step-by-Step
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col bg-transparent">
                      <h3 className={`text-base font-bold font-outfit leading-snug mb-2 ${isBuilt ? 'text-slate-800 group-hover:text-slate-900' : 'text-slate-600'}`}>
                        {lab.title}
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2 flex-1">
                        {lab.desc}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <GraduationCap className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold">Interactive</span>
                        </div>
                        {isBuilt ? (
                          <span className="text-xs font-bold text-white px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 group-hover:scale-105 transition-transform inline-flex items-center gap-1">
                            Start Derivation <ArrowRight className="w-3 h-3" />
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Soon</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
