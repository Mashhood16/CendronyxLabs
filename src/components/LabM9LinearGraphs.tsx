import { useState, useEffect } from 'react';
import { CheckCircle, Calculator, HelpCircle, Trash2, TrendingUp, MapPin } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit?: () => void;
}

export default function LabM9LinearGraphs({ onExit }: LabProps) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [rate, setRate] = useState<number>(2);
 const [base, setBase] = useState<number>(10);
 const [distance, setDistance] = useState<number>(15);

 const [logs, setLogs] = useState<{ d: number; c: number }[]>([]);
 const [targetDist, setTargetDist] = useState<number>(0);
 const [userAns, setUserAns] = useState<string>('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 useEffect(() => {
 setTargetDist(Math.floor(Math.random() * 15) + 30);
 }, []);

 const currentCost = rate * distance + base;

 const logData = () => {
 if (!logs.find((l) => l.d === distance)) {
  setLogs([...logs, { d: distance, c: currentCost }].sort((a, b) => a.d - b.d));
 }
 };

 const clearLogs = () => setLogs([]);

 const checkAns = () => {
 const expected = rate * targetDist + base;
 if (parseFloat(userAns) === expected) {
  setIsCorrect(true);
 } else {
  setIsCorrect(false);
 }
 };

 const SVG_SIZE = 400;
 const MAX_X = 50;
 const MAX_Y = 250;
 const scaleX = SVG_SIZE / MAX_X;
 const scaleY = SVG_SIZE / MAX_Y;

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.m9lineargraphs_lab_m9_1_linear_graphs_in_real')} subtitle={t('lab.subtitle_modeling_taxi_fares')} />
  

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.m9lineargraphs_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.m9lineargraphs_lab')}</button>
  </div>
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:flex-1 max-w-7xl mx-auto w-full lg:overflow-visible">
  {/* Column 1: Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex-col gap-4 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
   <HelpCircle className="text-indigo-600" size={20} />
   
                        {t('lab.m9lineargraphs_linear_equations_theory')}
                        </h2>
   <div className="prose prose-slate text-sm">
   <p>
    
                             {t('lab.m9lineargraphs_linear_graphs_represent_relati')} <strong>{t('lab.m9lineargraphs_y_mx_c')}</strong>.
   </p>
   <ul className="list-disc pl-5 space-y-2 mt-2">
    <li><strong>{t('lab.m9lineargraphs_y_dependent_variable')}</strong>  {t('lab.m9lineargraphs_total_cost')}</li>
    <li><strong>{t('lab.m9lineargraphs_x_independent_variable')}</strong>  {t('lab.m9lineargraphs_distance_traveled')}</li>
    <li><strong>{t('lab.m9lineargraphs_m_slope_gradient')}</strong>  {t('lab.m9lineargraphs_rate_per_km')}</li>
    <li><strong>{t('lab.m9lineargraphs_c_y_intercept')}</strong>  {t('lab.m9lineargraphs_base_fare_cost_at_0_km')}</li>
   </ul>
   <div className={`mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100 dark:bg-[#121212] dark:border-[#1c1b1b] flex-col `}>
    <p className="font-mono text-indigo-900 text-center text-lg dark:text-[#ffffff]">
    
                                 {t('lab.m9lineargraphs_cost')}{rate}  {t('lab.m9lineargraphs_distance')} {base}
    </p>
   </div>
   <p className="mt-4">
    
                             {t('lab.m9lineargraphs_use_the_simulator_to_visualize')}
                            </p>
   </div>
  </div>

  {/* Column 2: Simulator */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex-col gap-4 '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
   <TrendingUp className="text-indigo-600" size={20} />
   
                        {t('lab.m9lineargraphs_interactive_graph_plotter')}
                        </h2>
   
   <div className="flex-1 min-w-0 flex flex-col items-center justify-center relative">
   <svg width={SVG_SIZE} height={SVG_SIZE} className={`bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] rounded-lg overflow- flex-col `}>
    {/* Grid Lines */}
    {Array.from({ length: 11 }).map((_, i) => (
    <g key={`grid-${i}`}>
     {/* Vertical lines every 5 units */}
     <line x1={i * 5 * scaleX} y1={0} x2={i * 5 * scaleX} y2={SVG_SIZE} stroke="#e2e8f0" strokeWidth="1" />
     {/* Horizontal lines every 25 units */}
     <line x1={0} y1={SVG_SIZE - (i * 25 * scaleY)} x2={SVG_SIZE} y2={SVG_SIZE - (i * 25 * scaleY)} stroke="#e2e8f0" strokeWidth="1" />
    </g>
    ))}
    
    {/* Axes */}
    <line x1={0} y1={SVG_SIZE} x2={SVG_SIZE} y2={SVG_SIZE} stroke="#64748b" strokeWidth="4" />
    <line x1={0} y1={0} x2={0} y2={SVG_SIZE} stroke="#64748b" strokeWidth="4" />
    
    {/* Plotting the main line */}
    <line 
    x1={0} 
    y1={SVG_SIZE - (base * scaleY)} 
    x2={MAX_X * scaleX} 
    y2={SVG_SIZE - ((rate * MAX_X + base) * scaleY)} 
    stroke="#4f46e5" 
    strokeWidth="3" 
    />

    {/* Current Point */}
    <circle 
    cx={distance * scaleX} 
    cy={SVG_SIZE - (currentCost * scaleY)} 
    r={6} 
    fill="#ef4444" 
    />
    <text 
    x={distance * scaleX + 10} 
    y={SVG_SIZE - (currentCost * scaleY) - 10} 
    className="text-xs font-bold fill-slate-700"
    >
    ({distance}, {currentCost})
    </text>
   </svg>
   
   <div className="absolute bottom-2 right-2 text-xs text-slate-400 font-mono">
    
                             {t('lab.m9lineargraphs_x_distance_km_y_cost')}
                            </div>
   </div>

   <div className="grid grid-cols-2 gap-4 mt-2">
   <div>
    <label className="text-xs font-bold text-slate-500 dark:text-[#71717a] mb-1 block">{t('lab.m9lineargraphs_base_fare_c')}{base}</label>
    <input type="range" min="0" max="50" step="5" value={base} onChange={(e) => setBase(Number(e.target.value))} className="w-full accent-indigo-600" />
   </div>
   <div>
    <label className="text-xs font-bold text-slate-500 dark:text-[#71717a] mb-1 block">{t('lab.m9lineargraphs_rate_km_m')}{rate}</label>
    <input type="range" min="0.5" max="5" step="0.5" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-indigo-600" />
   </div>
   <div className="col-span-2">
    <label className="text-xs font-bold text-slate-500 dark:text-[#71717a] mb-1 block">{t('lab.m9lineargraphs_test_distance_x')} {distance} km</label>
    <input type="range" min="0" max="40" step="1" value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full accent-red-500" />
   </div>
   </div>
   
   <button onClick={logData} className={`w-full py-2 bg-[#121212] dark:bg-[#121212] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-slate-700 dark:bg-[#121212] transition-colors `}>
   <MapPin size={18} />  {t('lab.m9lineargraphs_record_point')}{distance}, {currentCost})
   </button>
  </div>

  {/* Column 3: Analysis */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex-col gap-4 '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
   <Calculator className="text-indigo-600" size={20} />
   
                        {t('lab.m9lineargraphs_data_log_assessment')}
                        </h2>
   
   <div className="flex-1 min-w-0 border border-slate-200 dark:border-[#1c1b1b] rounded-lg lg:overflow-y-auto">
   <table className="w-full text-sm text-left">
    <thead className="bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#a1a1aa] sticky top-0">
    <tr>
     <th className="p-3">{t('lab.m9lineargraphs_distance_x')}</th>
     <th className="p-3">{t('lab.m9lineargraphs_cost_y')}</th>
    </tr>
    </thead>
    <tbody>
    {logs.length === 0 ? (
     <tr>
     <td colSpan={2} className="p-4 text-center text-slate-400 italic">{t('lab.m9lineargraphs_no_data_recorded')}</td>
     </tr>
    ) : (
     logs.map((log, idx) => (
     <tr key={idx} className="border-b border-slate-100 last:border-0">
      <td className="p-3 font-mono">{log.d} km</td>
      <td className="p-3 font-mono">${log.c.toFixed(2)}</td>
     </tr>
     ))
    )}
    </tbody>
   </table>
   </div>
   {logs.length > 0 && (
   <button onClick={clearLogs} className="text-xs text-red-500 flex items-center gap-1 self-start hover:underline">
    <Trash2 size={14} />  {t('lab.m9lineargraphs_clear_logs')}
                            </button>
   )}

   <div className="mt-4 bg-indigo-50 p-4 rounded-xl border border-indigo-100 dark:bg-[#121212] dark:border-[#1c1b1b]">
   <h3 className="font-bold text-indigo-900 mb-2 dark:text-[#ffffff]">{t('lab.m9lineargraphs_knowledge_check')}</h3>
   <p className="text-sm text-indigo-800 mb-3 dark:text-[#ffffff]">
    
                             {t('lab.m9lineargraphs_given_the_current_rate_of')} <strong>${rate}{t('lab.m9lineargraphs_km')}</strong>  {t('lab.m9lineargraphs_and_a_base_fare_of')} <strong>${base}</strong>{t('lab.m9lineargraphs_calculate_the_total_cost_for_a')} <strong>{targetDist} km</strong>  {t('lab.m9lineargraphs_trip')}
                            </p>
   <div className="flex flex-wrap gap-2">
    <input 
    type="number" 
    placeholder={t('lab.m9lineargraphs_total_cost_1')} 
    value={userAns}
    onChange={(e) => setUserAns(e.target.value)}
    className="flex-1 min-w-0 px-3 py-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
    <button 
    onClick={checkAns}
    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
    >
    
                                 {t('lab.m9lineargraphs_check')}
                                 </button>
   </div>
   
   {isCorrect === true && (
    <div className="mt-3 p-2 bg-green-100 text-green-700 rounded-lg flex items-center gap-2 text-sm">
    <CheckCircle size={16} />  {t('lab.m9lineargraphs_correct_excellent_calculation')}
                                 </div>
   )}
   {isCorrect === false && (
    <div className="mt-3 p-2 bg-red-100 text-red-700 rounded-lg text-sm">
    
                                 {t('lab.m9lineargraphs_incorrect_remember_cost_rate_d')}
                                 </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
