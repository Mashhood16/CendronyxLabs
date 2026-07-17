import { useState, useEffect } from 'react';
import { BookOpen, Activity, Play, CheckCircle, RefreshCw} from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

export default function LabC12Biochemistry({ onExit }: { onExit?: () => void }) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [activeTab, setActiveTab] = useState<'kinetics' | 'electrophoresis'>('kinetics');

 // Kinetics state
 const [substrate, setSubstrate] = useState<number>(50);
 const [inhibitor, setInhibitor] = useState<number>(0);
 const [inhType, setInhType] = useState<'None'|'Competitive'|'Non-competitive'>('None');

 const vmax = 100;
 const km = 20;
 const ki = 10;

 let appKm = km;
 let appVmax = vmax;
 if (inhType === 'Competitive') appKm = km * (1 + inhibitor / ki);
 if (inhType === 'Non-competitive') appVmax = vmax / (1 + inhibitor / ki);
 
 const currentV = (appVmax * substrate) / (appKm + substrate);

 const points = [];
 for(let s = 0; s <= 100; s += 2) {
 const v = (appVmax * s) / (appKm + s);
 points.push(`${s * 3},${200 - v * 2}`);
 }
 const pathD = `M ${points.join(' L ')}`;

 // Electrophoresis state
 const [pH, setPH] = useState<number>(7);
 const [runTime, setRunTime] = useState<number>(0);
 const [isRunning, setIsRunning] = useState(false);

 useEffect(() => {
 let timer: ReturnType<typeof setInterval>;
 if (isRunning) {
 timer = setInterval(() => {
 setRunTime(prev => {
 if (prev >= 100) {
 setIsRunning(false);
 return 100;
 }
 return prev + 1;
 });
 }, 50);
 }
 return () => clearInterval(timer);
 }, [isRunning]);

 const posA = 150 + (pH - 3.0) * runTime * 0.5;
 const posB = 150 + (pH - 6.0) * runTime * 0.5;
 const posC = 150 + (pH - 9.7) * runTime * 0.5;

 // Assessment
 const [q1, setQ1] = useState('');
 const [q2, setQ2] = useState('');
 const [score, setScore] = useState<number | null>(null);

 const checkAnswers = () => {
 let s = 0;
 if (q1.trim() === '40') s++;
 if (q2.trim() === '6' || q2.trim() === '6.0') s++;
 setScore(s);
 };

 return (
 <div className="flex flex-col bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.c12biochemistry_biochemistry_kinetics_electrop')} />

 
 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.c12biochemistry_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.c12biochemistry_lab')}</button>
 </div>
 <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:flex-1 min-h-0 lg:overflow-hidden">
 {/* Theory */}
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
 <BookOpen size={20} className="text-pink-600" />
 
 {t('lab.c12biochemistry_biochemical_concepts')}
 </h2>
 
 <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa]">
 <h3 className="text-md font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.c12biochemistry_enzyme_inhibition')}</h3>
 <p>
 <strong>{t('lab.c12biochemistry_competitive_inhibitors')}</strong> {t('lab.c12biochemistry_bind_to_the_enzyme_s_active_si')}
 </p>
 <p>
 <strong>{t('lab.c12biochemistry_non_competitive_inhibitors')}</strong> {t('lab.c12biochemistry_bind_to_an_allosteric_site_alt')}
 </p>

 <h3 className="text-md font-semibold text-slate-700 dark:text-[#ffffff] mt-4">{t('lab.c12biochemistry_gel_electrophoresis')}</h3>
 <p>
 
 {t('lab.c12biochemistry_amino_acids_possess_an_isoelec')}
 </p>
 </div>
 </div>

 {/* Simulation */}
 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col gap-4 '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className={`flex gap-2 bg-slate-100 dark:bg-[#121212] p-1 rounded-lg flex-col `}>
 <button 
 className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'kinetics' ? 'bg-slate-50 dark:bg-[#121212] shadow text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-[#a1a1aa] hover:text-slate-700 dark:text-[#ffffff]'}`}
 onClick={() => setActiveTab('kinetics')}
 >
 
 {t('lab.c12biochemistry_enzyme_kinetics')}
 </button>
 <button 
 className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'electrophoresis' ? 'bg-slate-50 dark:bg-[#121212] shadow text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-[#a1a1aa] hover:text-slate-700 dark:text-[#ffffff]'}`}
 onClick={() => setActiveTab('electrophoresis')}
 >
 
 {t('lab.c12biochemistry_electrophoresis')}
 </button>
 </div>

 {activeTab === 'kinetics' ? (
 <div className="flex flex-col gap-4 flex-1">
 <div className={`bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg p-4 relative h-48 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <svg viewBox="0 0 300 200" className="w-full h-full overflow-visible">
 {/* Axes */}
 <line x1="0" y1="200" x2="300" y2="200" stroke="#94a3b8" strokeWidth="2" />
 <line x1="0" y1="0" x2="0" y2="200" stroke="#94a3b8" strokeWidth="2" />
 <text x="140" y="215" fontSize="10" fill="#64748b">{t('lab.c12biochemistry_substrate')}</text>
 <text x="-120" y="-10" fontSize="10" fill="#64748b" transform="rotate(-90)">{t('lab.c12biochemistry_velocity_v')}</text>
 
 {/* Vmax line */}
 <line x1="0" y1={200 - appVmax*2} x2="300" y2={200 - appVmax*2} stroke="#cbd5e1" strokeDasharray="4" strokeWidth="1" />
 <text x="305" y={200 - appVmax*2 + 4} fontSize="10" fill="#94a3b8">{t('lab.c12biochemistry_vmax')}</text>

 {/* Curve */}
 <path d={pathD} fill="none" stroke="#ec4899" strokeWidth="3" />
 
 {/* Current Point */}
 <circle cx={substrate * 3} cy={200 - currentV * 2} r="5" fill="#1e293b" />
 </svg>
 <div className={`w-full absolute top-2 left-10 text-xs font-mono bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] px-2 py-1 border rounded shadow-sm flex-col 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
 
 {t('lab.c12biochemistry_v')} {currentV.toFixed(1)} {t('lab.c12biochemistry_m_s')}
 </div>
 </div>

 <div className="space-y-3">
 <div>
 <label className="text-xs font-semibold text-slate-600 dark:text-[#a1a1aa] flex justify-between">
 <span>{t('lab.c12biochemistry_substrate')}</span> <span>{substrate} mM</span>
 </label>
 <input type="range" min="0" max="100" value={substrate} onChange={e => setSubstrate(Number(e.target.value))} className="w-full accent-pink-500" />
 </div>
 <div>
 <label className="text-xs font-semibold text-slate-600 dark:text-[#a1a1aa] flex justify-between">
 <span>{t('lab.c12biochemistry_inhibitor')}</span> <span>{inhibitor} mM</span>
 </label>
 <input type="range" min="0" max="50" value={inhibitor} onChange={e => setInhibitor(Number(e.target.value))} className="w-full accent-slate-500" />
 </div>
 <div className="flex gap-2 mt-2">
 {['None', 'Competitive', 'Non-competitive'].map(t => (
 <button 
 key={t}
 onClick={() => setInhType(t as any)}
 className={`px-2 py-1 text-xs rounded border ${inhType === t ? 'bg-pink-100 border-pink-400 text-pink-800' : 'bg-slate-50 dark:bg-[#121212] border-slate-300 dark:border-[#1c1b1b] text-slate-600 dark:text-[#ffffff]'}`}
 >
 {t}
 </button>
 ))}
 </div>
 </div>
 </div>
 ) : (
 <div className="flex flex-col gap-4 flex-1">
 <div className={`bg-slate-100 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] rounded-lg p-4 relative h-48 flex items-center justify-center flex-col `}>
 <div className="absolute top-2 left-4 font-bold text-red-500">{t('lab.c12biochemistry_anode')}</div>
 <div className="absolute top-2 right-4 font-bold text-blue-500">{t('lab.c12biochemistry_cathode')}</div>
 
 <svg viewBox="0 0 300 100" className="w-full h-full bg-slate-200 dark:bg-[#121212] rounded drop-shadow-inner">
 <line x1="150" y1="0" x2="150" y2="100" stroke="#cbd5e1" strokeDasharray="4" />
 
 {/* AA A */}
 <rect x={posA - 4} y="15" width="8" height="20" fill="#3b82f6" rx="2" />
 <text x={posA} y="45" fontSize="10" textAnchor="middle" fill="#1e3a8a">{t('lab.c12biochemistry_pi_3')}</text>

 {/* AA B */}
 <rect x={posB - 4} y="50" width="8" height="20" fill="#10b981" rx="2" />
 <text x={posB} y="80" fontSize="10" textAnchor="middle" fill="#064e3b">{t('lab.c12biochemistry_pi_6')}</text>

 {/* AA C */}
 <rect x={posC - 4} y="85" width="8" height="10" fill="#f59e0b" rx="2" />
 <text x={posC} y="98" fontSize="10" textAnchor="middle" fill="#78350f">{t('lab.c12biochemistry_pi_9_7')}</text>
 </svg>
 </div>

 <div className="space-y-4">
 <div>
 <label className="text-xs font-semibold text-slate-600 dark:text-[#a1a1aa] flex justify-between">
 <span>{t('lab.c12biochemistry_buffer_ph')}</span> <span>{pH.toFixed(1)}</span>
 </label>
 <input type="range" min="1" max="14" step="0.5" value={pH} onChange={e => {setPH(Number(e.target.value)); setRunTime(0);}} className="w-full accent-blue-500" disabled={isRunning} />
 </div>
 <div className="flex gap-2">
 <button 
 onClick={() => setIsRunning(true)}
 disabled={isRunning || runTime >= 100}
 className="flex-1 py-2 bg-blue-600 text-white rounded font-medium flex justify-center items-center gap-2 hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
 >
 <Play size={16} /> {t('lab.c12biochemistry_run_gel')}
 </button>
 <button 
 onClick={() => {setIsRunning(false); setRunTime(0);}}
 className="py-2 px-4 bg-slate-300 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] rounded font-medium hover:bg-slate-400 dark:bg-[#121212]"
 >
 <RefreshCw size={16} />
 </button>
 </div>
 </div>
 </div>
 )}
 </div>

 {/* Assessment */}
 <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
 <Activity size={20} className="text-blue-600" />
 
 {t('lab.c12biochemistry_computational_analysis')}
 </h2>

 <div className="flex-1 lg:overflow-y-auto pr-2 space-y-5">
 <div className="space-y-2">
 <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff] block">
 
 {t('lab.c12biochemistry_1_given_km_20_mm_and_ki_10_mm_')}
 </label>
 <input 
 type="number" 
 value={q1} 
 onChange={(e) => setQ1(e.target.value)}
 className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:ring-2 focus:ring-blue-500"
 placeholder={t('lab.c12biochemistry_enter_value_in_mm')}
 />
 </div>

 <div className="space-y-2">
 <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff] block">
 
 {t('lab.c12biochemistry_2_at_what_exact_ph_will_amino_')}
 </label>
 <input 
 type="number" 
 value={q2} 
 onChange={(e) => setQ2(e.target.value)}
 className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:ring-2 focus:ring-blue-500"
 placeholder={t('lab.c12biochemistry_enter_ph')}
 />
 </div>
 </div>

 <div className="pt-4 border-t border-slate-100">
 <button 
 onClick={checkAnswers}
 className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
 >
 <CheckCircle size={18} /> {t('lab.c12biochemistry_verify_results')}
 </button>

 {score !== null && (
 <div className={`mt-4 p-3 rounded-md text-center font-bold ${score === 2 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
 
 {t('lab.c12biochemistry_score')} {score} / 2 {score === 2 ? '🎉 Excellent!' : '❌ Review theory and retry.'}
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 );
}
