import { useHistory } from '../store';
import Layout from '../components/Layout';

export default function HistoryDashboard() {
  const { history } = useHistory();

  return (
    <Layout>
      <div className="flex flex-col min-h-[70vh] bg-slate-50 rounded-3xl border border-slate-200 shadow-sm mt-8 p-12">
        <div className="flex items-center gap-4 mb-10 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-800 font-outfit tracking-tight">Lab History</h2>
            <p className="text-slate-500 text-lg">Verified telemetry and performance metrics from your completed labs.</p>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No Labs Visited Yet</h3>
            <p className="text-slate-500 max-w-sm text-center">Your completed labs and measured results will appear here automatically.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((record, i) => (
              <div key={i} className="border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all group bg-gradient-to-b from-white to-slate-50/50">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{record.subject}</span>
                  <span className="text-sm font-medium text-slate-400">{new Date(record.timestamp).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2 leading-tight">{record.title}</h3>

                {record.experimentData && Object.keys(record.experimentData).length > 0 && (
                  <div className="mt-4 mb-2 bg-slate-50 rounded-lg p-3 border border-slate-100 shadow-inner">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-200 pb-1">Experiment Data</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(record.experimentData).map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                          <span className="text-[10px] text-slate-500 font-medium truncate">{key}</span>
                          <span className="text-sm font-bold text-slate-700">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Score</span>
                    <span className={`text-2xl font-bold font-outfit ${record.score >= (record.maxScore * 0.8) ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {record.score} <span className="text-sm text-slate-400 font-medium">/ {record.maxScore}</span>
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Time</span>
                    <span className="text-lg font-bold text-slate-600">{Math.floor(record.timeSpentSeconds / 60)}m {record.timeSpentSeconds % 60}s</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
