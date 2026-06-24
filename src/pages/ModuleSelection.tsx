import { useParams, useNavigate } from 'react-router-dom';
import { LAB_MODULES, formatSubject } from '../data/labModules';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';

export default function ModuleSelection() {
  const { classId, subjectId } = useParams();
  const navigate = useNavigate();

  const filteredModules = LAB_MODULES.filter(m => m.classLevel === classId && m.subject === subjectId);

  return (
    <Layout>
      <div className="flex flex-col">
        <Breadcrumbs />

        {filteredModules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Modules Coming Soon</h3>
            <p className="text-slate-500 max-w-md text-center">We are actively developing premium virtual labs for Class {classId} {subjectId && formatSubject(subjectId)}. Check back soon!</p>
          </div>
        ) : (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Curriculum Modules</h2>
            <p className="text-slate-500 mt-1 mb-6">High-End Interactive Experiments (Class {classId} {subjectId && formatSubject(subjectId)})</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map(lab => (
                <div
                  key={lab.id}
                  onClick={() => lab.built && navigate(`/class/${classId}/${subjectId}/lab/${lab.id}`)}
                  className={`glass rounded-3xl ${lab.built ? 'hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 border-slate-50/40 cursor-pointer' : 'border-dashed border-slate-300 opacity-80'} overflow-hidden transition-all duration-300 group flex flex-col h-full relative`}
                >
                  {lab.built && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-10 pointer-events-none"></div>}
                  <div className={`h-48 relative overflow-hidden ${!lab.built && 'grayscale-[50%]'}`}>
                    <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${lab.id}&backgroundColor=transparent`} alt={lab.title} className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3" loading="lazy" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${lab.bg} mix-blend-color opacity-90`}></div>
                    <div className={`absolute inset-0 bg-gradient-to-br ${lab.bg} opacity-70`}></div>
                    <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>

                    <div className="absolute bottom-4 left-4 flex gap-2 z-10">
                      <span className="bg-slate-50/30 backdrop-blur-md border border-slate-50/40 text-white text-xs font-bold tracking-wide px-3 py-1.5 rounded-full shadow-sm">{formatSubject(lab.subject)}</span>
                      <span className="bg-black/30 backdrop-blur-md border border-slate-50/20 text-white text-xs font-bold tracking-wide px-3 py-1.5 rounded-full shadow-sm">Class {lab.classLevel}</span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col relative bg-slate-50/60/60 backdrop-blur-sm">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className={`text-xl font-bold font-outfit ${lab.built ? 'text-slate-800 group-hover:text-blue-700' : 'text-slate-600'} transition-colors leading-tight`}>{lab.title}</h3>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-3 mb-6 font-medium">
                      {lab.desc}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-200/60/60">
                      <div className="flex items-center gap-2 bg-slate-100/80 px-2.5 py-1 rounded-md">
                        <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs font-bold text-slate-600">15 MIN</span>
                      </div>
                      {lab.built ? (
                        <button
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 flex items-center gap-2 transition-all z-20 transform group-hover:scale-105 pointer-events-none"
                        >
                          Launch
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-300">Coming Soon</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
