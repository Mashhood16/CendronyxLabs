import { useState } from 'react';
import { CheckCircle2, XCircle, TrendingDown, Biohazard } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

export default function LabM10FunctionApplications({ onExit }: { onExit: () => void }) {
    const { setLabScore } = useLab();
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [mode, setMode] = useState<'virus' | 'depreciation'>('virus');

 // Virus state
 const [r0, setR0] = useState(1.5);
 const [days, setDays] = useState(0); 

 // Depreciation state
 const [initialValue] = useState(10000);
 const [rate, setRate] = useState(15); 
 const [year, setYear] = useState(5);

 // Assessment state
 const [ans, setAns] = useState('');
 const [status, setStatus] = useState<'none' | 'correct' | 'incorrect'>('none');

 const resetAns = () => {
 setAns('');
 setStatus('none');
 };

 const handleModeChange = (m: 'virus' | 'depreciation') => {
 setMode(m);
 resetAns();
 };

 // Virus logic
 const gridCols = 20;
 const gridCells = 400; // 20x20
 const infectedCount = Math.min(gridCells, Math.floor(1 * Math.pow(r0, days)));

 // Depreciation logic
 const linearValue = Math.max(0, initialValue - (initialValue * (rate/100)) * year);
 const expValue = initialValue * Math.pow(1 - rate/100, year);

 const checkAns = () => {
 let correct = 0;
 if (mode === 'virus') {
  correct = Math.ceil(Math.log(200) / Math.log(r0));
 } else {
  const lin = Math.max(0, initialValue - (initialValue * (rate/100)) * year);
  const exp = initialValue * Math.pow(1 - rate/100, year);
  correct = Math.round(Math.abs(lin - exp));
 }
 
 if (Math.abs(parseFloat(ans) - correct) <= 1.0) {
  setStatus('correct');
  setLabScore(100, 100);
 } else {
  setStatus('incorrect');
  setLabScore(0, 100);
 }
 };

 // SVG drawing for depreciation
 const width = 400;
 const height = 240;
 const padding = 30;
 const maxYear = 10;

 const getLinePath = (isLinear: boolean) => {
 let path = `M ${padding} ${height - padding}`;
 for (let y = 0; y <= maxYear; y++) {
  const val = isLinear 
  ? Math.max(0, initialValue - (initialValue * (rate/100)) * y)
  : initialValue * Math.pow(1 - rate/100, y);
  
  const px = padding + (y / maxYear) * (width - 2 * padding);
  const py = height - padding - (val / initialValue) * (height - 2 * padding);
  if (y === 0) path = `M ${px} ${py}`;
  else path += ` L ${px} ${py}`;
 }
 return path;
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.m10functionapplications_mathematical_function_applicat')} />

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.m10functionapplications_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.m10functionapplications_lab')}</button>
  </div>
  <div className="lg:flex-1 min-w-0 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:overflow-visible">
  {/* Theory Column */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 border-b pb-2">{t('lab.m10functionapplications_theory_formulas')}</h2>
   <div className={`flex-1 min-w-0 lg:overflow-y-auto pr-2 space-y-4 text-slate-700 dark:text-[#ffffff] ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block`}>
   {mode === 'virus' ? (
    <>
    <p><strong>{t('lab.m10functionapplications_exponential_growth')}</strong>  {t('lab.m10functionapplications_functions_describe_scenarios_w')}</p>
    <div className={`bg-indigo-50 p-4 rounded-lg text-center font-mono font-bold text-indigo-800 dark:bg-[#121212] dark:border-[#1c1b1b] dark:text-[#ffffff] flex-col `}>
     
                                      {t('lab.m10functionapplications_n_t_n_r')}
                                     </div>
    <p>{t('lab.m10functionapplications_in_epidemiology_n_is_the_initi')}</p>
    <ul className="list-disc pl-5 space-y-1 text-sm">
     <li>{t('lab.m10functionapplications_if_r_gt_1_the_spread_is_expone')}</li>
     <li>{t('lab.m10functionapplications_if_r_lt_1_the_spread_will_die_')}</li>
    </ul>
    </>
   ) : (
    <>
    <p><strong>{t('lab.m10functionapplications_depreciation')}</strong>  {t('lab.m10functionapplications_models_how_the_value_of_an_ass')}</p>
    <p className="font-semibold mt-4">{t('lab.m10functionapplications_1_linear_straight_line')}</p>
    <div className={`bg-red-50 p-3 rounded-lg text-center font-mono font-bold text-red-800 text-sm flex-col `}>
     
                                          {t('lab.m10functionapplications_v_t_v_v_r_t')}
                                         </div>
    <p className="text-sm">{t('lab.m10functionapplications_value_drops_by_a_fixed')} <em>{t('lab.m10functionapplications_amount')}</em>  {t('lab.m10functionapplications_every_year')}</p>
    
    <p className="font-semibold mt-4">{t('lab.m10functionapplications_2_exponential_reducing_balance')}</p>
    <div className={`bg-blue-50 p-3 rounded-lg text-center font-mono font-bold text-blue-800 text-sm dark:bg-teal-950/20 dark:border-teal-900 dark:text-[#ffffff] flex-col `}>
     
                                          {t('lab.m10functionapplications_v_t_v_1_r')}
                                         </div>
    <p className="text-sm">{t('lab.m10functionapplications_value_drops_by_a_fixed')} <em>{t('lab.m10functionapplications_percentage')}</em>  {t('lab.m10functionapplications_of_its_current_value_every_yea')}</p>
    </>
   )}
   </div>
  </div>

  {/* Interactive Column */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex space-x-2 mb-6">
   <button 
    onClick={() => handleModeChange('virus')}
    className={`flex-1 flex items-center justify-center py-2 rounded-lg font-medium transition-colors ${mode === 'virus' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}
   >
    <Biohazard size={18} className="mr-2" />  {t('lab.m10functionapplications_viral_spread')}
                            </button>
   <button 
    onClick={() => handleModeChange('depreciation')}
    className={`flex-1 flex items-center justify-center py-2 rounded-lg font-medium transition-colors ${mode === 'depreciation' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}
   >
    <TrendingDown size={18} className="mr-2" />  {t('lab.m10functionapplications_depreciation')}
                            </button>
   </div>

   {/* Visualizer */}
   <div className={`w-full relative h-64 bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#121212] rounded-xl mb-6 overflow- border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] items-center justify-center p-4 flex-col '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   {mode === 'virus' ? (
    <div className="w-full h-full flex flex-col items-center justify-center">
    <div className="grid gap-[2px] bg-slate-300 dark:bg-[#121212] p-2 rounded-lg" style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}>
     {Array.from({ length: gridCells }).map((_, i) => (
     <div key={i} className={`w-3 h-3 sm:w-4 sm:h-4 rounded-sm ${i < infectedCount ? 'bg-indigo-600' : 'bg-slate-50 dark:bg-[#121212]'}`} />
     ))}
    </div>
    <div className="mt-4 font-bold text-slate-700 dark:text-[#ffffff] bg-slate-50 dark:bg-[#121212] px-4 py-1 rounded-full shadow-sm">
     
                                      {t('lab.m10functionapplications_day')} {days}: <span className="text-indigo-600">{infectedCount}</span>  {t('lab.m10functionapplications_infected')}
                                     </div>
    </div>
   ) : (
    <div className="w-full h-full flex flex-col">
    <div className="flex justify-between px-8 text-xs font-bold mb-2">
     <span className="text-red-500">{t('lab.m10functionapplications_linear')}{Math.round(linearValue)}</span>
     <span className="text-blue-500">{t('lab.m10functionapplications_exponential')}{Math.round(expValue)}</span>
    </div>
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full flex-1">
     {/* Grid / Axes */}
     <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="2" />
     <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="2" />
     
     {/* Labels */}
     <text x={padding - 5} y={padding + 5} fontSize="10" textAnchor="end" fill="#64748b">{t('lab.m10functionapplications_10k')}</text>
     <text x={padding - 5} y={height - padding} fontSize="10" textAnchor="end" fill="#64748b">$0</text>
     <text x={width - padding} y={height - padding + 15} fontSize="10" textAnchor="middle" fill="#64748b">{t('lab.m10functionapplications_yr_10')}</text>
     
     {/* Paths */}
     <path d={getLinePath(true)} fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="5,5" />
     <path d={getLinePath(false)} fill="none" stroke="#3b82f6" strokeWidth="3" />
     
     {/* Current year marker */}
     <line 
     x1={padding + (year / maxYear) * (width - 2 * padding)} 
     y1={padding} 
     x2={padding + (year / maxYear) * (width - 2 * padding)} 
     y2={height - padding} 
     stroke="#10b981" strokeWidth="2" strokeDasharray="4,4" 
     />
     <circle cx={padding + (year / maxYear) * (width - 2 * padding)} cy={height - padding - (expValue / initialValue) * (height - 2 * padding)} r="5" fill="#3b82f6" />
     <circle cx={padding + (year / maxYear) * (width - 2 * padding)} cy={height - padding - (linearValue / initialValue) * (height - 2 * padding)} r="5" fill="#ef4444" />
    </svg>
    </div>
   )}
   </div>

   {/* Sliders */}
   <div className="space-y-5">
   {mode === 'virus' ? (
    <>
    <div>
     <div className="flex justify-between text-sm font-medium text-indigo-700 mb-1">
     <span>{t('lab.m10functionapplications_reproduction_rate_r')}</span>
     <span>{r0.toFixed(1)}</span>
     </div>
     <input type="range" min="1.1" max="3.0" step="0.1" value={r0} onChange={e => {setR0(Number(e.target.value)); resetAns()}} className="w-full accent-indigo-600" />
    </div>
    <div>
     <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
     <span>{t('lab.m10functionapplications_days_elapsed')}</span>
     <span>{t('lab.m10functionapplications_day')} {days}</span>
     </div>
     <input type="range" min="0" max="15" step="1" value={days} onChange={e => {setDays(Number(e.target.value)); resetAns()}} className="w-full" />
    </div>
    </>
   ) : (
    <>
    <div>
     <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
     <span>{t('lab.m10functionapplications_depreciation_rate')}</span>
     <span>{rate}{t('lab.m10functionapplications_year')}</span>
     </div>
     <input type="range" min="5" max="30" step="1" value={rate} onChange={e => {setRate(Number(e.target.value)); resetAns()}} className="w-full accent-emerald-600" />
    </div>
    <div>
     <div className="flex justify-between text-sm font-medium text-emerald-700 mb-1">
     <span>{t('lab.m10functionapplications_years_elapsed')}</span>
     <span>{t('lab.m10functionapplications_year_1')} {year}</span>
     </div>
     <input type="range" min="0" max="10" step="1" value={year} onChange={e => {setYear(Number(e.target.value)); resetAns()}} className="w-full accent-emerald-600" />
    </div>
    </>
   )}
   </div>
  </div>

  {/* Assessment Column */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 border-b pb-2">{t('lab.m10functionapplications_data_analysis')}</h2>
   <div className="flex-1 min-w-0 space-y-6">
   <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <p className="text-slate-700 dark:text-[#ffffff] font-medium mb-3">
    {mode === 'virus' 
     ? `If R₀ is ${r0.toFixed(1)}, on what exact day will the number of infected individuals first reach or exceed 200?` 
     : `At year ${year}, what is the absolute difference between the linear and exponential depreciated values?`}
    </p>
    <p className="text-xs text-slate-500 dark:text-[#71717a] mb-4">{t('lab.m10functionapplications_round_to_nearest_whole_number')}</p>
    
    <div className="flex items-center space-x-3">
    <input 
     type="number" 
     value={ans}
     onChange={e => setAns(e.target.value)}
     placeholder={t('lab.m10functionapplications_e_g_5')}
     className="flex-1 min-w-0 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
    <button 
     onClick={checkAns}
     className="px-4 py-2 bg-[#121212] dark:bg-[#121212] text-white rounded-lg hover:bg-slate-700 dark:bg-[#121212] transition-colors"
    >
     
                                      {t('lab.m10functionapplications_check')}
                                     </button>
    </div>

    {status === 'correct' && (
    <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center dark:bg-[#121212] dark:border-[#1c1b1b]">
     <CheckCircle2 size={20} className="mr-2 shrink-0" />
     <span className="font-medium">{t('lab.m10functionapplications_correct_great_calculation')}</span>
    </div>
    )}
    {status === 'incorrect' && (
    <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
     <XCircle size={20} className="mr-2 shrink-0" />
     <span className="font-medium">{t('lab.m10functionapplications_not_quite_right_try_again_usin')}</span>
    </div>
    )}
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
