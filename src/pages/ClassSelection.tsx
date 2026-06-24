import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LAB_MODULES } from '../data/labModules';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';

const CLASSES = ['6', '7', '8', '9', '10', '11', '12'];

export default function ClassSelection() {
  const navigate = useNavigate();
  const moduleCount = useMemo(() => LAB_MODULES.filter(m => m.built).length, []);

  return (
    <Layout>
      <div className="flex flex-col relative">
        <Breadcrumbs />

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 p-10 mb-12 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-40 h-40 bg-slate-50 opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-40 h-40 bg-slate-50 opacity-10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 font-outfit tracking-tight">
              Welcome to Virtual<span className="text-blue-300">Lab</span>
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8 font-medium">
              Explore our massive library of <span className="font-bold text-white bg-blue-500/30 px-2 py-0.5 rounded">{moduleCount} interactive modules</span> across Physics, Chemistry, Biology, Mathematics, and Computer Science.
            </p>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Select Class</h2>
          <p className="text-slate-500 mt-1 mb-6">Choose your grade level to browse available experiments.</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {CLASSES.map(cls => (
              <button
                key={cls}
                onClick={() => navigate(`/class/${cls}`)}
                className="glass p-8 rounded-3xl hover:border-blue-400 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col items-center justify-center gap-4 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 flex items-center justify-center text-3xl font-extrabold shadow-inner group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white group-hover:rotate-6 transition-all duration-300 font-outfit">
                  {cls}
                </div>
                <span className="text-xl font-bold text-slate-700 group-hover:text-blue-700 font-outfit transition-colors">Class {cls}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
