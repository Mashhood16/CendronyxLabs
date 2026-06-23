import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { PhysicsDataPoint } from '../physics/gravitation';

interface DataLedgerProps {
  data: PhysicsDataPoint[];
  onRecordData: () => void;
}

export default function DataLedger({ data, onRecordData }: DataLedgerProps) {
  return (
    <div className="overflow-y-auto h-screen bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-700 overflow-hidden flex flex-col h-full shadow-xl">
      <div className="px-4 py-3 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Data Ledger
        </h3>
        <button
          onClick={onRecordData}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          Record Point
        </button>
      </div>
      
      <div className="flex-1 overflow-auto p-4 flex flex-col gap-6">
        <div className="h-48 bg-slate-800/30 p-2 rounded-xl border border-slate-700/50">
          <h4 className="text-[10px] text-slate-400 font-semibold mb-2 uppercase tracking-wider text-center">Gravity vs Altitude (km)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="altitude" stroke="#94a3b8" fontSize={10} tickFormatter={(val) => `${val}`} />
              <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }} 
                itemStyle={{ color: '#60a5fa' }}
              />
              <Line type="monotone" dataKey="gravity" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6', stroke: '#1e293b', strokeWidth: 1 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-700 shadow-inner">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 sticky top-0 backdrop-blur-md">
              <tr>
                <th className="px-3 py-2 font-medium">Time (m)</th>
                <th className="px-3 py-2 font-medium">Alt (km)</th>
                <th className="px-3 py-2 font-medium">Vel (m/s)</th>
                <th className="px-3 py-2 font-medium text-blue-400">g (m/s²)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-center text-slate-500 italic">Click 'Record Point' to log data.</td>
                </tr>
              ) : (
                data.map((pt, i) => (
                  <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-3 py-2">{pt.time}</td>
                    <td className="px-3 py-2">{pt.altitude}</td>
                    <td className="px-3 py-2">{pt.velocity}</td>
                    <td className="px-3 py-2 font-bold text-blue-400">{pt.gravity}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
