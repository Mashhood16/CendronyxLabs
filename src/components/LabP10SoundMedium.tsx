import { useState, useEffect } from 'react';
import {Plus, Trash2, CheckCircle, XCircle, Power } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from '../i18n';
import { useLab } from '../store';

interface LabProps {
 onExit?: () => void;
}

interface DataPoint {
 id: string;
 pressure: number;
 db: number;
}

export default function LabP10SoundMedium({ onExit }: LabProps) {

const { recordLabData } = useLab();
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [pressure, setPressure] = useState<number>(1.0);
 const [bellOn, setBellOn] = useState<boolean>(false);
 const [data, setData] = useState<DataPoint[]>([]);
 
 const [assessmentAnswer, setAssessmentAnswer] = useState<string>('');
 const [assessmentResult, setAssessmentResult] = useState<'idle' | 'correct' | 'incorrect'>('idle');

 // Sound Intensity Level Model: L = 85 + 20 * log10(P + 0.001)
 const calculateDecibels = (p: number) => {
 if (!bellOn) return 0;
 const baseL = 85;
 // Add small offset to prevent log(0) and represent structural transmission
 const db = baseL + 20 * Math.log10(p + 0.005);
 // Add realistic noise
 const noise = (Math.random() * 0.4) - 0.2;
 return Math.max(0, db + noise);
 };

 const [currentDb, setCurrentDb] = useState<number>(0);

 useEffect(() => {
 if (bellOn) {
 const interval = setInterval(() => {
 setCurrentDb(calculateDecibels(pressure));
 }, 500);
 return () => clearInterval(interval);
 } else {
 setCurrentDb(0);
 }
 }, [pressure, bellOn]);

 const handleRecordData = () => {
 if (!bellOn) return;
 const newPoint: DataPoint = {
 id: Math.random().toString(36).substring(2, 9),
 pressure: parseFloat(pressure.toFixed(2)),
 db: parseFloat(currentDb.toFixed(1)),
 };
 setData([...data, newPoint]);
 
 recordLabData({ timestamp: Date.now() });
};

 const handleClearData = () => {
 setData([]);
 };

 const checkAssessment = () => {
 const ans = parseFloat(assessmentAnswer);
 // Question: If intensity drops by 20 dB, what fraction of pressure remains?
 // 20 dB drop = 1/10th of the pressure.
 if (!isNaN(ans) && Math.abs(ans - 0.1) < 0.02) {
 setAssessmentResult('correct');
 } else {
 setAssessmentResult('incorrect');
 }
 };

 return (
 <div className="flex flex-col min- bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
 {/* Header */}
 <LabHeader onExit={onExit} title={t('lab.p10soundmedium_medium_for_propagation')} subtitle={t('lab.subtitle_investigate_sound_transmission')} />

 {/* Main Grid */}
 
 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.p10soundmedium_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.10soundmedium_lab')}</button>
 </div>
 <div className="lg:flex-1 p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 max-w-7xl mx-auto w-full lg:overflow-visible">
 
 {/* Column 1: Theory and Setup */}
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col ? 'flex' : 'hidden'} lg:flex`}>
 <div className={`bg-slate-100 dark:bg-[#121212] border-b border-slate-200 dark:border-[#1c1b1b] p-4 flex-col ${activeMobileTab === 'theory' ? 'flex' : activeMobileTab === 'lab' ? 'flex mb-4' : 'hidden'} lg:flex lg:order-none`}>
 <h2 className="font-semibold text-slate-800 dark:text-[#ffffff]">{t('lab.10soundmedium_theory_andsetup')}</h2>
 </div>
 <div className={`p-5 flex-1 lg:overflow-y-auto space-y-6 ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
 <div className="space-y-2 text-sm text-slate-600 dark:text-[#a1a1aa]">
 <p>
 
 {t('lab.p10soundmedium_sound_waves_are_mechanical_wav')}
 </p>
 <p>
 
 {t('lab.p10soundmedium_in_this_classic_experiment_an_')}
 </p>
 <p>
 
 {t('lab.p10soundmedium_as_the_air_is_removed_the_soun')}
 </p>
 </div>

 <div className="border-t border-slate-100 pt-4 space-y-6">
 <div className="space-y-2">
 <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff]">
 
 {t('lab.p10soundmedium_electric_bell_power')}
 </label>
 <button
 onClick={() => setBellOn(!bellOn)}
 className={`w-full py-3 flex items-center justify-center gap-2 font-bold rounded-lg transition-colors border-2 ${ bellOn ? 'bg-rose-50 border-rose-500 text-rose-700 hover:bg-rose-100' : 'bg-emerald-50 border-emerald-500 text-emerald-700 hover:bg-emerald-100' }`}
 >
 <Power className="w-5 h-5" />
 {bellOn ? 'Turn Bell OFF' : 'Turn Bell ON'}
 </button>
 </div>

 <div className="space-y-2">
 <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff]">
 <span>{t('lab.p10soundmedium_air_pressure_atm')}</span>
 <span className="font-mono text-blue-700">{pressure.toFixed(2)}</span>
 </label>
 <input
 type="range"
 min="0"
 max="1"
 step="0.01"
 value={pressure}
 onChange={(e) => setPressure(parseFloat(e.target.value))}
 className="w-full accent-blue-600"
 />
 <div className="flex justify-between text-xs text-slate-400">
 <span>{t('lab.p10soundmedium_vacuum_0')}</span>
 <span>{t('lab.p10soundmedium_1_atm_air')}</span>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Column 2: Simulation */}
 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex flex-col lg:col-span-1 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
 <div className={`bg-slate-100 dark:bg-[#121212] border-b border-slate-200 dark:border-[#1c1b1b] p-4 justify-between items-center flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="font-semibold text-slate-800 dark:text-[#ffffff]">{t('lab.10soundmedium_simulationview')}</h2>
 </div>
 <div className="p-4 flex-1 flex flex-col items-center justify-center bg-[#000000] dark:bg-[#121212] relative overflow-hidden">
 
 <div className="relative w-64 h-80 flex flex-col items-center z-10 scale-90 sm:scale-100">
 {/* Battery / Wires top */}
 <div className={`w-full w-16 h-8 bg-zinc-800 rounded-t-lg z-20 flex justify-center gap-2 pt-2 shadow-lg flex-col 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
 <div className="w-2 h-12 bg-rose-600" />
 <div className="w-2 h-12 bg-[#000000] dark:bg-[#121212]" />
 </div>

 {/* Bell Jar */}
 <div className="w-56 h-64 border-4 border-slate-400 dark:border-[#1c1b1b]/50 rounded-t-[112px] relative flex flex-col items-center justify-center shadow-[inset_0_0_30px_rgba(255,255,255,0.1)] transition-all duration-1000 overflow-hidden bg-slate-50 dark:bg-[#121212]/5">
 
 {/* Air particles */}
 <div className="absolute inset-0 pointer-events-none rounded-t-[108px] opacity-100 transition-opacity duration-300" style={{ opacity: pressure }}>
 {[...Array(60)].map((_,i) => (
 <div key={i} className="absolute w-1 h-1 bg-slate-300 dark:bg-[#121212] rounded-full animate-pulse" style={{
 top: `${Math.random() * 100}%`,
 left: `${Math.random() * 100}%`,
 animationDelay: `${Math.random() * 2}s`
 }} />
 ))}
 </div>

 {/* The Bell */}
 <div className="relative w-24 h-32 flex flex-col items-center justify-center z-10">
 <div className="w-16 h-16 bg-amber-500 rounded-t-full border-b-2 border-amber-700 shadow-inner dark:bg-[#121212] dark:border-[#1c1b1b]" />
 <div className="w-20 h-3 bg-amber-800 rounded-b-md shadow-md" />
 
 {/* Clapper */}
 <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-12 origin-top flex flex-col items-center">
 <div className="w-1.5 h-8 bg-zinc-400" />
 <div className={`w-5 h-5 bg-zinc-700 rounded-full shadow-lg ${bellOn ? 'animate-[shake_0.05s_infinite]' : ''}`} />
 </div>
 </div>

 {/* Sound waves overlay */}
 {bellOn && (
 <div 
 className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300"
 style={{ opacity: Math.max(0, pressure - 0.1) + 0.1 }} // Min opacity for visual
 >
 <div className="absolute inset-0 border-2 border-rose-500/30 rounded-full scale-150 animate-[ping_1s_infinite]" />
 <div className="absolute inset-0 border-2 border-rose-500/20 rounded-full scale-150 animate-[ping_1s_infinite_0.3s]" />
 </div>
 )}
 </div>
 
 {/* Base plate */}
 <div className="w-64 h-10 bg-zinc-800 rounded-b-xl border-t-2 border-zinc-600 relative flex justify-center shadow-xl">
 {/* Pump tube */}
 <div className="absolute -bottom-12 w-6 h-12 bg-blue-500/30 border-x-2 border-blue-400/50 flex items-center justify-center overflow-hidden dark:bg-teal-950/20 dark:border-teal-900">
 {/* Flow animation when pressure is low? static for now */}
 <div className="w-1 h-full bg-blue-300/50" />
 </div>
 </div>
 </div>

 <style>{`
 @keyframes shake {
 0% { transform: rotate(-15deg); }
 50% { transform: rotate(15deg); }
 100% { transform: rotate(-15deg); }
 }
 `}</style>

 {/* Readout */}
 <div className="mt-12 w-full max-w-xs bg-[#121212] dark:!bg-[#121212] p-4 rounded-xl border border-[#1c1b1b] dark:border-[#1c1b1b] flex items-center justify-between px-6 shadow-lg">
 <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">{t('lab.10soundmedium_soundlevel')}</span>
 <span className={`text-3xl font-mono ${bellOn ? 'text-rose-400' : 'text-slate-600 dark:text-[#ffffff]'}`}>
 {bellOn ? `${currentDb.toFixed(1)} dB` : 'OFF'}
 </span>
 </div>

 </div>
 </div>

 {/* Column 3: Data & Analysis */}
 <div className="bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col overflow-hidden">
 <div className={`bg-slate-100 dark:bg-[#121212] border-b border-slate-200 dark:border-[#1c1b1b] p-4 justify-between items-center flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="font-semibold text-slate-800 dark:text-[#ffffff]">{t('lab.10soundmedium_data_andanalysis')}</h2>
 <div className="flex gap-2">
 <button
 onClick={handleRecordData}
 disabled={!bellOn}
 className="flex items-center gap-1 bg-amber-600 text-white px-3 py-1.5 rounded-md hover:bg-amber-700 disabled:bg-slate-300 transition-colors text-sm font-medium dark:text-white dark:text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40"
 >
 <Plus className="w-4 h-4" /> {t('lab.p10soundmedium_record')}
 </button>
 <button
 onClick={handleClearData}
 className="flex items-center gap-1 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] px-3 py-1.5 rounded-md hover:bg-slate-300 dark:bg-[#121212] transition-colors text-sm font-medium"
 >
 <Trash2 className="w-4 h-4" /> {t('lab.p10soundmedium_clear')}
 </button>
 </div>
 </div>
 
 <div className="p-4 flex-1 lg:overflow-y-auto space-y-6">
 
 {/* Data Table */}
 <div className="border border-slate-200 dark:border-[#1c1b1b] rounded-lg overflow-hidden">
 <table className="w-full text-sm text-left">
 <thead className="bg-slate-50 dark:bg-[#121212] text-slate-600 dark:text-[#a1a1aa] font-medium border-b border-slate-200 dark:border-[#1c1b1b]">
 <tr>
 <th className="px-3 py-2 text-center">{t('lab.p10soundmedium_pressure_atm')}</th>
 <th className="px-3 py-2 text-center">{t('lab.p10soundmedium_intensity_level_db')}</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {data.length === 0 ? (
 <tr>
 <td colSpan={2} className="px-3 py-6 text-center text-slate-400 italic">
 
 {t('lab.p10soundmedium_turn_on_bell_and_record_data')}
 </td>
 </tr>
 ) : (
 data.map((point) => (
 <tr key={point.id} className="hover:bg-slate-50 dark:bg-[#121212]">
 <td className="px-3 py-2 text-center font-mono">{point.pressure.toFixed(2)}</td>
 <td className="px-3 py-2 text-center font-semibold text-rose-600">{point.db.toFixed(1)}</td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>

 {/* Graph */}
 <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h3 className="text-sm font-bold text-slate-700 dark:text-[#ffffff] mb-2 text-center">{t('lab.10soundmedium_pressurevssoundlevel')}</h3>
 <div className="relative w-full aspect-square max-w-[250px] mx-auto bg-slate-50 dark:bg-[#121212] border-l-2 border-b-2 border-slate-600 dark:border-[#1c1b1b]">
 {/* Grid lines */}
 {[0.2, 0.4, 0.6, 0.8, 1.0].map((val) => (
 <div key={`grid-${val}`}>
 <div className="absolute left-0 right-0 border-t border-slate-100" style={{ bottom: `${val * 100}%` }} />
 <div className="absolute top-0 bottom-0 border-l border-slate-100" style={{ left: `${val * 100}%` }} />
 </div>
 ))}
 
 {/* Axis Labels */}
 <div className="absolute -bottom-6 left-0 right-0 text-center text-[10px] text-slate-500 dark:text-[#71717a] font-medium">{t('lab.p10soundmedium_pressure_atm')}</div>
 <div className="absolute top-0 bottom-0 -left-6 flex items-center">
 <div className="transform -rotate-90 text-[10px] text-slate-500 dark:text-[#71717a] font-medium whitespace-nowrap">{t('lab.p10soundmedium_sound_db')}</div>
 </div>

 {/* Data Points */}
 {data.map((point) => (
 <div
 key={`pt-${point.id}`}
 className="absolute w-2 h-2 bg-amber-600 rounded-full transform -translate-x-1/2 translate-y-1/2 shadow-sm"
 style={{
 left: `${point.pressure * 100}%`,
 bottom: `${(point.db / 100.0) * 100}%`, // Assuming max 100dB
 }}
 />
 ))}
 </div>
 </div>

 {/* Assessment */}
 <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 dark:bg-[#121212] dark:border-[#1c1b1b]">
 <h3 className="font-semibold text-amber-900 mb-2 dark:text-[#ffffff]">{t('lab.10soundmedium_analysis')}</h3>
 <p className="text-sm text-amber-800 mb-3 dark:text-[#ffffff]">
 
 {t('lab.p10soundmedium_using_your_data_approximately_')} <strong>{t('lab.p10soundmedium_20_db_drop')}</strong> {t('lab.p10soundmedium_in_sound_intensity_level_enter')}
 </p>
 <div className="flex gap-2 items-center">
 <input
 type="number"
 step="0.01"
 placeholder={t('lab.p10soundmedium_t_lab_10soundmedium_eg05')}
 value={assessmentAnswer}
 onChange={(e) => setAssessmentAnswer(e.target.value)}
 className="w-full p-2 rounded border border-amber-200 text-sm focus:ring-2 focus:ring-amber-500"
 />
 <button
 onClick={checkAssessment}
 className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded hover:bg-amber-700 transition-colors whitespace-nowrap dark:text-white dark:text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40"
 >
 
 {t('lab.p10soundmedium_check')}
 </button>
 </div>
 
 {assessmentResult === 'correct' && (
 <div className="mt-3 flex items-center gap-2 text-emerald-600 bg-emerald-50 p-2 rounded border border-emerald-200">
 <CheckCircle className="w-5 h-5" />
 <span className="text-sm font-medium">{t('lab.p10soundmedium_correct_a_20_db_drop_correspon')}</span>
 </div>
 )}
 {assessmentResult === 'incorrect' && (
 <div className="mt-3 flex items-center gap-2 text-rose-600 bg-rose-50 p-2 rounded border border-rose-200 dark:bg-[#121212] dark:border-[#1c1b1b]">
 <XCircle className="w-5 h-5" />
 <span className="text-sm font-medium">{t('lab.p10soundmedium_incorrect_compare_the_db_level')}</span>
 </div>
 )}
 </div>

 </div>
 </div>

 </div>
 </div>
 );
}
