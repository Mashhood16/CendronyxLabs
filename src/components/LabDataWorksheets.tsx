import { useState } from 'react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabDataWorksheets({ onExit }: LabProps) {
  const [scenario, setScenario] = useState<'heights' | 'budget' | 'bills'>('heights');
  
  // Data grids for the 3 scenarios
  const [heightData, setHeightData] = useState([
    { label: 'Ali', val: 150 },
    { label: 'Bilal', val: 165 },
    { label: 'Zahra', val: 140 },
    { label: 'Fatima', val: 155 }
  ]);
  
  const [budgetData, setBudgetData] = useState([
    { label: 'Rent', val: 20000 },
    { label: 'Food', val: 15000 },
    { label: 'Utilities', val: 8000 },
    { label: 'Savings', val: 5000 }
  ]);

  const [billData, setBillData] = useState([
    { label: 'Jan', val: 300 },
    { label: 'Feb', val: 250 },
    { label: 'Mar', val: 400 },
    { label: 'Apr', val: 500 }
  ]);

  // Derive current data based on scenario
  const currentData = scenario === 'heights' ? heightData : scenario === 'budget' ? budgetData : billData;
  const setFn = scenario === 'heights' ? setHeightData : scenario === 'budget' ? setBudgetData : setBillData;
  
  const updateData = (index: number, key: 'label'|'val', value: string|number) => {
    const newData = [...currentData];
    newData[index] = { ...newData[index], [key]: value };
    setFn(newData);
  };

  const maxVal = Math.max(...currentData.map(d => d.val), 1);

  return (
    <div className="overflow-y-auto w-full h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans">
      <LabHeader onExit={onExit} title="Act 2.2: Worksheet and Chart Creation" subtitle="Prepare data and draw corresponding charts for 3 scenarios." variant="emerald" />

      <div className="flex-1 flex lg:overflow-hidden">
        
        {/* Scenarios Panel */}
        <div className="w-64 bg-slate-100 dark:bg-slate-800 border-r border-slate-300 dark:border-slate-700 dark:border-slate-500 flex flex-col p-4 gap-2">
           <h3 className="font-bold text-slate-600 dark:text-slate-300 mb-2 uppercase tracking-widest text-xs">Scenarios</h3>
           
           <button 
             onClick={() => setScenario('heights')}
             className={`p-4 rounded-lg text-left font-bold transition-colors ${scenario === 'heights' ? 'bg-[#1d6f42] text-white shadow-md' : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:border-slate-500'}`}
           >
             Student Heights (Bar Chart)
           </button>
           <button 
             onClick={() => setScenario('budget')}
             className={`p-4 rounded-lg text-left font-bold transition-colors ${scenario === 'budget' ? 'bg-[#1d6f42] text-white shadow-md' : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:border-slate-500'}`}
           >
             Home Budget (Pie Chart)
           </button>
           <button 
             onClick={() => setScenario('bills')}
             className={`p-4 rounded-lg text-left font-bold transition-colors ${scenario === 'bills' ? 'bg-[#1d6f42] text-white shadow-md' : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:border-slate-500'}`}
           >
             Electricity Bill (Line Chart)
           </button>
        </div>

        {/* Spreadsheet Input */}
        <div className="flex-1 bg-slate-50 dark:bg-slate-900 p-8 flex flex-col relative lg:overflow-hidden">
           <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Data Worksheet</h2>
           <div className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 dark:border-slate-500 rounded-lg overflow-hidden shadow-sm">
              <table className="w-full text-left font-mono">
                 <thead className="bg-slate-200 dark:bg-slate-800">
                    <tr>
                       <th className="p-3 border-b border-r border-slate-300 dark:border-slate-700 dark:border-slate-500 text-slate-600 dark:text-slate-300 font-normal">Item / Name</th>
                       <th className="p-3 border-b border-slate-300 dark:border-slate-700 dark:border-slate-500 text-slate-600 dark:text-slate-300 font-normal">Value</th>
                    </tr>
                 </thead>
                 <tbody>
                    {currentData.map((row, i) => (
                      <tr key={i} className="border-b border-slate-200 dark:border-slate-700 dark:border-slate-500">
                         <td className="p-0 border-r border-slate-200 dark:border-slate-700 dark:border-slate-500">
                            <input 
                              type="text" 
                              value={row.label} 
                              onChange={(e) => updateData(i, 'label', e.target.value)}
                              className="w-full p-3 outline-none focus:bg-sky-50"
                            />
                         </td>
                         <td className="p-0">
                            <input 
                              type="number" 
                              value={row.val} 
                              onChange={(e) => updateData(i, 'val', Number(e.target.value))}
                              className="w-full p-3 outline-none focus:bg-sky-50"
                            />
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Dynamic Chart Output */}
        <div className="flex-1 bg-slate-50 dark:bg-slate-900 border-l border-slate-300 dark:border-slate-700 dark:border-slate-500 p-8 flex flex-col justify-center items-center relative shadow-inner bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]">
           <h2 className="absolute top-8 left-8 text-2xl font-bold text-slate-800 dark:text-slate-100">Generated Chart</h2>
           
           <div className="w-full max-w-md h-80 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 dark:border-slate-500 shadow-xl rounded-xl p-8 flex items-end justify-between relative">
              
              {/* Conditional Chart Rendering */}
              {scenario === 'heights' && (
                 <div className="w-full h-full flex items-end justify-between border-l-2 border-b-2 border-slate-400 dark:border-slate-500 pb-0 px-4 pt-4 gap-4">
                    {currentData.map((d, i) => (
                       <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
                          <div 
                            className="w-full bg-blue-500 rounded-t transition-all duration-500 group-hover:bg-blue-400 shadow-inner"
                            style={{ height: `${(d.val / maxVal) * 100}%` }}
                          ></div>
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2 truncate w-full text-center">{d.label}</span>
                       </div>
                    ))}
                 </div>
              )}

              {scenario === 'bills' && (
                 <div className="w-full h-full border-l-2 border-b-2 border-slate-400 dark:border-slate-500 relative">
                    <svg className="absolute inset-0 w-full h-full overflow-visible">
                       <polyline 
                         fill="none" 
                         stroke="#ef4444" 
                         strokeWidth="4" 
                         strokeLinecap="round"
                         strokeLinejoin="round"
                         points={currentData.map((d, i) => {
                            const x = (i / (currentData.length - 1)) * 100;
                            const y = 100 - ((d.val / maxVal) * 100);
                            return `${x}%,${y}%`;
                         }).join(' ')}
                         className="transition-all duration-500"
                       />
                       {currentData.map((d, i) => {
                          const x = (i / (currentData.length - 1)) * 100;
                          const y = 100 - ((d.val / maxVal) * 100);
                          return <circle key={i} cx={`${x}%`} cy={`${y}%`} r="6" fill="#ef4444" stroke="#fff" strokeWidth="2" />;
                       })}
                    </svg>
                    <div className="absolute -bottom-8 w-full flex justify-between">
                       {currentData.map((d, i) => (
                          <span key={i} className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate w-12 text-center" style={{ marginLeft: i === 0 ? '-24px' : i === currentData.length-1 ? '0' : '-12px' }}>{d.label}</span>
                       ))}
                    </div>
                 </div>
              )}

              {scenario === 'budget' && (
                 <div className="w-full h-full flex items-center justify-center">
                    {/* SVG Pie Chart */}
                    <svg viewBox="0 0 100 100" className="w-64 h-64 -rotate-90 rounded-full shadow-lg">
                       {(() => {
                         const total = currentData.reduce((acc, curr) => acc + curr.val, 0) || 1;
                         let cumulativePercent = 0;
                         const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
                         
                         return currentData.map((d, i) => {
                           const percent = (d.val / total) * 100;
                           const strokeDasharray = `${percent} ${100 - percent}`;
                           const strokeDashoffset = -cumulativePercent;
                           cumulativePercent += percent;
                           
                           return (
                             <circle 
                               key={i}
                               r="25" 
                               cx="50" 
                               cy="50" 
                               fill="transparent" 
                               stroke={colors[i%colors.length]} 
                               strokeWidth="50" 
                               strokeDasharray={strokeDasharray} 
                               strokeDashoffset={strokeDashoffset}
                               className="transition-all duration-500 cursor-pointer hover:opacity-80"
                             />
                           );
                         });
                       })()}
                    </svg>
                    
                    {/* Legend */}
                    <div className="absolute right-[-40px] flex flex-col gap-2">
                       {currentData.map((d, i) => {
                         const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-red-500'];
                         return (
                           <div key={i} className="flex items-center gap-2">
                             <div className={`w-3 h-3 rounded-full ${colors[i%colors.length]}`}></div>
                             <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{d.label}</span>
                           </div>
                         );
                       })}
                    </div>
                 </div>
              )}

           </div>
        </div>

      </div>
    </div>
  );
}
