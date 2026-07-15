import { useMemo, useEffect } from 'react';
import { theme } from '../utils/labTheme';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LAB_MODULES, formatSubject, hasCalculator } from '../data/labModules';
import { useTranslate } from '../i18n';
import { translateLabDesc } from '../i18n/labContent';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import { Rocket, GraduationCap, Beaker, Calculator, ArrowRight, BookOpen } from 'lucide-react';

export default function Class9Math() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const classId = '9';
  const subjectId = 'math';
  const activeTab = (searchParams.get('tab') as 'labs' | 'theorems') ?? 'labs';

  const setActiveTab = (tab: 'labs' | 'theorems') => {
    setSearchParams({ tab }, { replace: true });
  };

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

  const { language } = useTranslate();

  const filteredModules = useMemo(
    () => LAB_MODULES.filter(m => m.classLevel === classId && m.subject === subjectId),
    []
  );

  const theoremModules = useMemo(
    () => LAB_MODULES.filter(m => m.classLevel === classId && m.subject === subjectId && m.id.includes('_theorem_')),
    []
  );

  const readyCount = filteredModules.filter(m => m.built).length;

  return (
    <Layout>
      <div className="flex flex-col min-h-[calc(100vh-80px)]">
        <Breadcrumbs />

        {/* Page Header */}
        <div className="relative overflow-hidden rounded-2xl mb-6 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          <div className="relative z-10 px-6 py-8 md:px-10 md:py-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">{t("Class 9 Mathematics")}</h1>
                <p className="text-white/80 text-sm">{t("Algebra, Geometry, Statistics & Problem Solving — with interactive labs and step-by-step theorem walkthroughs")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`flex gap-2 mb-6 ${theme.innerCard.bg} border ${theme.innerCard.border} p-1.5 rounded-xl w-full sm:w-fit`}>
          <button
            onClick={() => setActiveTab('labs')}
            className={`flex flex-1 sm:flex-none justify-center items-center gap-2 px-3 sm:px-5 py-2.5 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'labs'
                ? 'bg-white dark:bg-[#121212] text-violet-600 dark:text-violet-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Beaker className="w-4 h-4" />
            {t("Labs")}
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
              {readyCount - theoremModules.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('theorems')}
            className={`flex flex-1 sm:flex-none justify-center items-center gap-2 px-3 sm:px-5 py-2.5 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'theorems'
                ? 'bg-white dark:bg-[#121212] text-violet-600 dark:text-violet-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            {t("Theorems")}
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              {theoremModules.length}
            </span>
          </button>
        </div>

        {/* Labs Tab */}
        {activeTab === 'labs' && (
          <div className="flex-1">
            {filteredModules.filter(m => !m.id.includes('_theorem_')).length === 0 ? (
              <div className={`flex flex-col items-center justify-center py-20 ${theme.card.bg} rounded-2xl border border-dashed ${theme.border.default}`}>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-4 opacity-50">
                  <Rocket className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold ${theme.text.secondary} mb-2">{t("No Labs Available")}</h3>
                <p className="${theme.text.subtle} max-w-md text-center">{t("There are no labs available for this selection.")}</p>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredModules.filter(m => !m.id.includes('_theorem_')).map((lab) => {
                    const isBuilt = lab.built;
                    return (
                      <div
                        key={lab.id}
                        onClick={() => isBuilt && goToLab(`/class/${classId}/${subjectId}/lab/${lab.id}`)}
                        className={`relative group rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full ${
                          isBuilt ? `${theme.card.bg} border ${theme.border.default} hover:-translate-y-2 hover:shadow-xl hover:border-transparent cursor-pointer hover:gradient-border` : `${theme.card.bg} border border-dashed ${theme.border.default} opacity-70`
                        }`}
                      >
                        <div className={`relative h-32 bg-gradient-to-br ${lab.bg} overflow-hidden`}>
                          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
                          {isBuilt && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>}
                          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/20 backdrop-blur-md text-white text-xs font-bold tracking-wider border border-white/20">
                            {t(formatSubject(lab.subject))} {t("&middot; Class")} {lab.classLevel}
                          </div>
                          {hasCalculator(lab) && (
                            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-400/90 text-amber-900 text-[10px] font-bold backdrop-blur-sm shadow-sm">
                              {t("🧮 Calc")}
                            </div>
                          )}
                          {isBuilt ? (
                            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-500/90 text-white text-xs font-bold backdrop-blur-sm">
                              <Rocket className="w-3.5 h-3.5" /> {t("Ready")}
                            </div>
                          ) : (
                            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/30 text-white/70 text-xs font-bold backdrop-blur-sm">
                              {t("Coming Soon")}
                            </div>
                          )}
                        </div>
                        <div className="p-6 flex-1 flex flex-col bg-transparent">
                          <h3 className={`text-base font-bold font-outfit leading-snug mb-2 ${isBuilt ? `${theme.text.primary} group-hover:text-slate-900 dark:group-hover:text-white` : theme.text.subtle}`}>
                            {lab.title}
                          </h3>
                          <p className={`text-sm ${theme.text.muted} leading-relaxed mb-4 line-clamp-2 flex-1`}>
                            {translateLabDesc(lab.id, lab.desc, language)}
                          </p>
                          <div className={`flex items-center justify-between pt-3 border-t ${theme.border.subtle}`}>
                            <div className={`flex items-center gap-1.5 ${theme.text.faint}`}>
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-xs font-bold">{t("~15 min")}</span>
                            </div>
                            {isBuilt ? (
                              <span className="text-xs font-bold text-white px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-600 group-hover:scale-105 transition-transform inline-flex items-center gap-1">
                                {t("Launch")} <ArrowRight className="w-3 h-3" />
                              </span>
                            ) : (
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t("Soon")}</span>
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

        {/* Theorems Tab */}
        {activeTab === 'theorems' && (
          <div className="flex-1">
            {theoremModules.length === 0 ? (
              <div className={`flex flex-col items-center justify-center py-20 ${theme.card.bg} rounded-2xl border border-dashed ${theme.border.default}`}>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-4 opacity-50">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold ${theme.text.secondary} mb-2">{t("Theorems Coming Soon")}</h3>
                <p className="${theme.text.subtle} max-w-md text-center">{t("We are developing interactive theorem walkthroughs for Class 9 Mathematics. Check back soon!")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {theoremModules.map((lab) => {
                  const isBuilt = lab.built;
                  return (
                    <div
                      key={lab.id}
                      onClick={() => isBuilt && goToLab(`/class/${classId}/${subjectId}/lab/${lab.id}`)}
                      className={`relative group rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full ${
                        isBuilt ? `${theme.card.bg} border ${theme.border.default} hover:-translate-y-2 hover:shadow-xl hover:border-transparent cursor-pointer hover:gradient-border` : `${theme.card.bg} border border-dashed ${theme.border.default} opacity-70`
                      }`}
                    >
                      <div className={`relative h-32 bg-gradient-to-br ${lab.bg} overflow-hidden`}>
                        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
                        {isBuilt && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>}
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/20 backdrop-blur-md text-white text-xs font-bold tracking-wider border border-white/20">
                          {t("Theorem &middot; Class 9 Math")}
                        </div>
                        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/90 text-white text-xs font-bold backdrop-blur-sm">
                          <BookOpen className="w-3.5 h-3.5" /> {t("Step-by-Step")}
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col bg-transparent">
                        <h3 className={`text-base font-bold font-outfit leading-snug mb-2 ${isBuilt ? `${theme.text.primary} group-hover:text-slate-900 dark:group-hover:text-white` : theme.text.subtle}`}>
                          {lab.title}
                        </h3>
                        <p className={`text-sm ${theme.text.muted} leading-relaxed mb-4 line-clamp-2 flex-1`}>
                          {translateLabDesc(lab.id, lab.desc, language)}
                        </p>
                        <div className={`flex items-center justify-between pt-3 border-t ${theme.border.subtle}`}>
                          <div className={`flex items-center gap-1.5 ${theme.text.faint}`}>
                            <GraduationCap className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold">{t("Interactive")}</span>
                          </div>
                          {isBuilt ? (
                            <span className="text-xs font-bold text-white px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 group-hover:scale-105 transition-transform inline-flex items-center gap-1">
                              {t("Start Theorem")} <ArrowRight className="w-3 h-3" />
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t("Soon")}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
