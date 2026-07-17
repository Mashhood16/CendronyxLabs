import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LAB_MODULES, formatSubject } from '../data/labModules';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import Class9Physics from './Class9Physics';
import Class10Physics from './Class10Physics';
import Class11Physics from './Class11Physics';
import Class12Physics from './Class12Physics';
import Class9Math from './Class9Math';
import Class10Math from './Class10Math';
import Class11Math from './Class11Math';
import Class12Math from './Class12Math';
import { Rocket, Lock, Atom, Calculator, Dna, Laptop, Activity, BookOpen, Beaker, Edit3, Trash2, ShieldAlert, Plus } from 'lucide-react';
import { useTranslate } from '../i18n';
import { translateLabDesc } from '../i18n/labContent';
import { theme } from '../utils/labTheme';
import { useAuth } from '../store';
import { customLabService } from '../services/customLabService';

const SUBJECT_ACCENT: Record<string, string> = {
  physics: 'from-blue-500 to-indigo-600',
  chemistry: 'from-emerald-500 to-teal-600',
  biology: 'from-rose-500 to-pink-600',
  math: 'from-violet-500 to-indigo-600',
  computer: 'from-sky-500 to-cyan-600',
  science: 'from-amber-500 to-orange-600',
  english: 'from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 dark:from-cyan-400 dark:to-cyan-400 dark:hover:from-cyan-300 dark:hover:to-cyan-300 dark:!text-black shadow-lg shadow-blue-500/30 dark:shadow-none',
};

const SUBJECT_BANNER: Record<string, { icon: typeof Atom; gradient: string; description: string }> = {
  physics:    { icon: Atom,        gradient: 'from-blue-600 via-indigo-600 to-purple-600',    description: 'Forces, Energy, Waves, Light & Electromagnetism — with interactive labs and step-by-step derivations' },
  chemistry:  { icon: Beaker,      gradient: 'from-emerald-600 via-teal-600 to-cyan-600',     description: 'Reactions, Bonding, Atomic Structure & Organic Chemistry — with virtual lab experiments and simulations' },
  biology:    { icon: Dna,         gradient: 'from-rose-600 via-pink-600 to-fuchsia-600',     description: 'Cells, Genetics, Ecology & Human Body Systems — with interactive dissections and microscopy' },
  math:       { icon: Calculator,  gradient: 'from-violet-500 via-purple-600 to-indigo-600',  description: 'Algebra, Geometry, Trigonometry & Calculus — with interactive problem solving and theorem proofs' },
  computer:   { icon: Laptop,      gradient: 'from-sky-500 via-blue-600 to-indigo-700',       description: 'Programming, Networks, AI, Data Science & Cyber Safety — with hands-on coding and simulations' },
  science:    { icon: Activity,    gradient: 'from-amber-500 via-orange-600 to-red-600',       description: 'Integrated Science Curriculum — covering physics, chemistry, and biology fundamentals' },
  english:    { icon: BookOpen,    gradient: 'from-fuchsia-500 via-pink-600 to-rose-600',      description: 'Grammar, Vocabulary, Reading Comprehension & Writing Mechanics — with interactive exercises' },
};

export default function ModuleSelection() {
  const { classId, subjectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [customLabs, setCustomLabs] = useState<any[]>([]);

  const loadCustomLabs = async () => {
    if (!classId || !subjectId) return;
    try {
      // 1. Fetch user's own custom labs (including private ones and drafts/pending)
      const userLabs = user ? await customLabService.getUserLabs(user.id) : [];
      // 2. Fetch approved public custom labs
      const publicLabs = await customLabService.getApprovedLabs();

      // Combine and filter matching current class/subject
      const allCustom = [...userLabs, ...publicLabs];
      
      // Deduplicate by ID
      const uniqueMap = new Map<string, any>();
      allCustom.forEach(lab => {
        if (lab.classLevel === classId && lab.subject === subjectId) {
          uniqueMap.set(lab.id, lab);
        }
      });

      const filteredCustom = Array.from(uniqueMap.values()).map(lab => ({
        id: lab.id,
        classLevel: lab.classLevel,
        subject: lab.subject,
        title: lab.title,
        desc: lab.desc,
        built: true,
        bg: 'from-pink-500 to-rose-600',
        creatorName: lab.creatorName,
        isPrivate: lab.isPrivate,
        status: lab.status,
        userId: lab.userId
      }));

      setCustomLabs(filteredCustom);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCustomLabs();
  }, [classId, subjectId, user?.id]);

  // Class 9-12 Physics get a special tabbed view with Labs and Derivations
  if (classId === '9' && subjectId === 'physics') {
    return <Class9Physics />;
  }
  if (classId === '10' && subjectId === 'physics') {
    return <Class10Physics />;
  }
  if (classId === '11' && subjectId === 'physics') {
    return <Class11Physics />;
  }
  if (classId === '12' && subjectId === 'physics') {
    return <Class12Physics />;
  }

  // Class 9-12 Math get a special tabbed view with Labs and Theorems
  if (classId === '9' && subjectId === 'math') {
    return <Class9Math />;
  }
  if (classId === '10' && subjectId === 'math') {
    return <Class10Math />;
  }
  if (classId === '11' && subjectId === 'math') {
    return <Class11Math />;
  }
  if (classId === '12' && subjectId === 'math') {
    return <Class12Math />;
  }

  const staticModules = LAB_MODULES.filter(m => m.classLevel === classId && m.subject === subjectId);
  const filteredModules = [...customLabs, ...staticModules];
  const accent = SUBJECT_ACCENT[subjectId || ''] || 'from-slate-500 to-slate-600';
  const { t, language } = useTranslate();

  const handleDeleteCustomLab = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this custom lab?')) {
      await customLabService.deleteLab(id);
      loadCustomLabs();
    }
  };

  return (
    <Layout>
      <div className="flex flex-col">
        <Breadcrumbs />

        {filteredModules.length === 0 ? (
          <div className={`flex flex-col items-center justify-center py-20 ${theme.card.bg} rounded-2xl border border-dashed ${theme.border.default}`}>
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${accent} flex items-center justify-center mb-4 opacity-50`}>
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h3 className={`text-xl font-bold ${theme.text.secondary} mb-2`}>{t('module.no_modules')}</h3>
            <p className={`${theme.text.subtle} max-w-md text-center`}>{t('module.no_modules_desc', { classId: classId! })}</p>
          </div>
        ) : (
          <>
            {/* Subject Banner */}
            <div className="relative overflow-hidden rounded-2xl mb-6 shadow-lg">
              <div className={`absolute inset-0 bg-gradient-to-br ${(subjectId && SUBJECT_BANNER[subjectId]?.gradient) || 'from-slate-500 to-slate-600'}`}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="relative z-10 px-6 py-8 md:px-10 md:py-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      {subjectId && SUBJECT_BANNER[subjectId] ? (() => {
                        const Icon = SUBJECT_BANNER[subjectId].icon;
                        return <Icon className="w-5 h-5 text-white" />;
                      })() : <BookOpen className="w-5 h-5 text-white" />}
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-white">{t("Class")} {classId} {subjectId && t(formatSubject(subjectId))}</h1>
                      <p className="text-white/80 text-sm">{(subjectId && SUBJECT_BANNER[subjectId]?.description) || 'Interactive experiments and virtual labs'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => navigate('/create-lab')}
                      className="px-4 py-2 bg-white text-indigo-700 hover:bg-white/90 dark:bg-[#121212] dark:text-white dark:hover:bg-[#1c1b1b] rounded-xl font-bold text-xs shadow-md transition-colors flex items-center gap-2"
                    >
                      <Plus size={14} /> {t("Create Custom Lab")}
                    </button>
                    <button
                      onClick={() => navigate('/simulation-studio')}
                      className="px-4 py-2 bg-white text-indigo-700 hover:bg-white/90 dark:bg-[#121212] dark:text-white dark:hover:bg-[#1c1b1b] rounded-xl font-bold text-xs shadow-md transition-colors flex items-center gap-2"
                    >
                      <Plus size={14} /> {t("Simulation Studio")}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map((lab: any) => {
                const isBuilt = lab.built;
                const isCustom = lab.id.startsWith('custom_');
                const isOwn = isCustom && lab.userId === user?.id;

                return (
                  <div
                    key={lab.id}
                    onClick={() => isBuilt && navigate(`/class/${classId}/${subjectId}/lab/${lab.id}`)}
                    className={`relative group rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full ${
                      isBuilt
                        ? `${theme.card.bg} border ${theme.border.default} hover:-translate-y-2 hover:shadow-xl hover:border-transparent cursor-pointer hover:gradient-border`
                        : `${theme.card.bg} border border-dashed ${theme.border.default} opacity-70`
                    }`}
                  >
                    {/* Gradient header strip */}
                    <div className={`relative h-32 bg-gradient-to-br ${lab.bg} overflow-hidden`}>
                      {/* Dot pattern overlay */}
                      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
                      
                      {/* Shine effect on hover */}
                      {isBuilt && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>}
                      
                      {/* Module number badge */}
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/20 backdrop-blur-md text-white text-xs font-bold tracking-wider border border-white/20">
                        {t(formatSubject(lab.subject))} {t("&middot; Class")} {lab.classLevel}
                      </div>
                      
                      {/* Custom lab edit/delete overlay for owner */}
                      {isOwn && (
                        <div className="absolute top-3 right-3 flex items-center gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/edit-lab/${lab.id}`); }}
                            className="p-1.5 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white rounded-lg transition-colors border border-white/10"
                            title="Edit Custom Lab"
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            onClick={(e) => handleDeleteCustomLab(lab.id, e)}
                            className="p-1.5 bg-red-900/60 hover:bg-red-900/80 backdrop-blur-md text-white rounded-lg transition-colors border border-red-800/30"
                            title="Delete Custom Lab"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                      
                      {/* Built/Status indicator */}
                      {isCustom ? (
                        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600/90 text-white text-xs font-bold backdrop-blur-sm">
                          {lab.isPrivate ? '🔒 Private' : lab.status === 'pending' ? '⏳ Review' : '🌍 Public'}
                        </div>
                      ) : isBuilt ? (
                        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-500/90 text-white text-xs font-bold backdrop-blur-sm">
                          <Rocket className="w-3.5 h-3.5" /> {t('module.ready')}
                        </div>
                      ) : (
                        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/30 text-white/70 text-xs font-bold backdrop-blur-sm">
                          {t('module.coming_soon')}
                        </div>
                      )}
                    </div>

                    {/* Card body */}
                    <div className="p-6 flex-1 flex flex-col bg-transparent">
                      <h3 className={`text-base font-bold font-outfit leading-snug mb-2 ${isBuilt ? `${theme.text.primary} group-hover:text-slate-900 dark:group-hover:text-white` : theme.text.subtle}`}>
                        {lab.title}
                      </h3>
                      <p className={`text-sm ${theme.text.muted} leading-relaxed mb-4 line-clamp-2 flex-1`}>
                        {isCustom ? lab.desc : translateLabDesc(lab.id, lab.desc, language)}
                      </p>

                      {/* Bottom row */}
                      <div className={`flex items-center justify-between pt-3 border-t ${theme.border.subtle}`}>
                        <div className={`flex items-center gap-1.5 ${theme.text.faint}`}>
                          {isCustom ? (
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">
                              By: {lab.creatorName}
                            </span>
                          ) : (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-xs font-bold">{t('module.time_estimate', { min: 15 })}</span>
                            </>
                          )}
                        </div>
                        {isBuilt ? (
                          <span className={`text-xs font-bold text-white px-3 py-1.5 rounded-lg bg-gradient-to-r ${accent} group-hover:scale-105 transition-transform`}>
                            {t('module.launch')}
                          </span>
                        ) : (
                          <span className={`text-xs font-bold ${theme.text.faint} uppercase tracking-wider`}>
                            {t('module.coming_soon')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
