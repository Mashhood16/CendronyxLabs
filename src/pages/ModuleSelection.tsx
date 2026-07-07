import { useParams, useNavigate } from 'react-router-dom';
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
import { Rocket, Lock, Atom, Calculator, Dna, Laptop, Activity, BookOpen, Beaker } from 'lucide-react';
import { useTranslate } from '../i18n';
import { translateLabDesc } from '../i18n/labContent';

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

  const filteredModules = LAB_MODULES.filter(m => m.classLevel === classId && m.subject === subjectId);
  const accent = SUBJECT_ACCENT[subjectId || ''] || 'from-slate-500 to-slate-600';
  const { t, language } = useTranslate();

  return (
    <Layout>
      <div className="flex flex-col">
        <Breadcrumbs />

        {filteredModules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 glass rounded-2xl border border-dashed border-slate-200/50 dark:border-neutral-900/50">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${accent} flex items-center justify-center mb-4 opacity-50`}>
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">{t('module.no_modules')}</h3>
            <p className="text-slate-500 max-w-md text-center">{t('module.no_modules_desc', { classId: classId! })}</p>
          </div>
        ) : (
          <>
            {/* Subject Banner */}
            <div className="relative overflow-hidden rounded-2xl mb-6 shadow-lg">
              <div className={`absolute inset-0 bg-gradient-to-br ${(subjectId && SUBJECT_BANNER[subjectId]?.gradient) || 'from-slate-500 to-slate-600'}`}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="relative z-10 px-6 py-8 md:px-10 md:py-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    {subjectId && SUBJECT_BANNER[subjectId] ? (() => {
                      const Icon = SUBJECT_BANNER[subjectId].icon;
                      return <Icon className="w-5 h-5 text-white" />;
                    })() : <BookOpen className="w-5 h-5 text-white" />}
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Class {classId} {subjectId && formatSubject(subjectId)}</h1>
                    <p className="text-white/80 text-sm">{(subjectId && SUBJECT_BANNER[subjectId]?.description) || 'Interactive experiments and virtual labs'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map((lab) => {
                const isBuilt = lab.built;
                return (
                  <div
                    key={lab.id}
                    onClick={() => isBuilt && navigate(`/class/${classId}/${subjectId}/lab/${lab.id}`)}
                    className={`relative group rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full ${
                      isBuilt
                        ? 'glass border border-slate-200/50 dark:border-[#1c1b1b]/50 hover:-translate-y-2 hover:shadow-xl hover:border-transparent cursor-pointer hover:gradient-border'
                        : 'glass border border-dashed border-slate-200/50 dark:border-[#1c1b1b]/50 opacity-70'
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
                        {formatSubject(lab.subject)} &middot; Class {lab.classLevel}
                      </div>
                      
                      {/* Built indicator */}
                      {isBuilt ? (
                        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-500/90 text-white text-xs font-bold backdrop-blur-sm">                            <Rocket className="w-3.5 h-3.5" /> {t('module.ready')}
                        </div>
                      ) : (
                        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/30 text-white/70 text-xs font-bold backdrop-blur-sm">                            {t('module.coming_soon')}
                        </div>
                      )}
                    </div>

                    {/* Card body */}
                    <div className="p-6 flex-1 flex flex-col bg-transparent">
                      <h3 className={`text-base font-bold font-outfit leading-snug mb-2 ${isBuilt ? 'text-slate-800 group-hover:text-slate-900' : 'text-slate-600'}`}>
                        {lab.title}
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2 flex-1">
                        {translateLabDesc(lab.id, lab.desc, language)}
                      </p>

                      {/* Bottom row */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs font-bold">                            {t('module.time_estimate', { min: 15 })}</span>
                        </div>
                        {isBuilt ? (
                          <span className={`text-xs font-bold text-white px-3 py-1.5 rounded-lg bg-gradient-to-r ${accent} group-hover:scale-105 transition-transform`}>
                            {t('module.launch')}
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
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
