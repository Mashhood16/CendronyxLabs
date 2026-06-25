import { useEffect } from 'react';
import { useHistory } from '../store';
import Layout from '../components/Layout';
import { Clock, Trophy, Timer, Beaker } from 'lucide-react';

const SUBJECT_COLORS: Record<string, string> = {
  physics: 'from-blue-500 to-indigo-600',
  chemistry: 'from-emerald-500 to-teal-600',
  biology: 'from-rose-500 to-pink-600',
  math: 'from-violet-500 to-purple-600',
  computer: 'from-sky-500 to-cyan-600',
  science: 'from-amber-500 to-orange-600',
};

export default function HistoryDashboard() {
  const { history, refreshHistory } = useHistory();

  // Always fetch fresh history from IndexedDB when this page mounts
  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  return (
    <Layout>
      <div className="flex flex-col min-h-[70vh] bg-white rounded-3xl border border-slate-200 shadow-sm mt-8 p-8 md:p-12">
        <div className="flex items-center gap-4 mb-10 border-b border-slate-100 pb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Clock className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-800 font-outfit tracking-tight">Lab History</h2>
            <p className="text-slate-500">Verified telemetry and performance metrics from your completed labs.</p>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4">
              <Beaker className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No Labs Visited Yet</h3>
            <p className="text-slate-500 max-w-sm text-center">Your completed labs and measured results will appear here automatically.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {history.map((record, i) => {
              const subjectGradient = SUBJECT_COLORS[record.subject.toLowerCase()] || 'from-slate-500 to-slate-600';
              const passed = record.score >= (record.maxScore * 0.8);
              return (
                <div key={i} className="bg-white border-2 border-slate-100 rounded-2xl p-6 hover:border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  {/* Subject badge + date */}
                  <div className="flex justify-between items-start mb-4">
                    <span className={`bg-gradient-to-r ${subjectGradient} text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm`}>{record.subject}</span>
                    <span className="text-xs font-medium text-slate-400">{new Date(record.timestamp).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2 leading-tight font-outfit">{record.title}</h3>

                  {record.experimentData && Object.keys(record.experimentData).length > 0 && (
                    <div className="mb-4 bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Experiment Data</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(record.experimentData).map(([key, value]) => (
                          <div key={key} className="flex flex-col">
                            <span className="text-[10px] text-slate-400 font-medium truncate">{key}</span>
                            <span className="text-sm font-bold text-slate-700">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className={`w-4 h-4 ${passed ? 'text-emerald-500' : 'text-amber-500'}`} />
                      <div className="flex flex-col">
                        <span className={`text-xl font-bold font-outfit ${passed ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {record.score}<span className="text-sm text-slate-400 font-medium"> / {record.maxScore}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Timer className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-bold text-slate-500">{Math.floor(record.timeSpentSeconds / 60)}m {record.timeSpentSeconds % 60}s</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
