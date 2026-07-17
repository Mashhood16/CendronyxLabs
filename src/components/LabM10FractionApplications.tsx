import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, XCircle, Car, Train, Clock, Hammer } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

export default function LabM10FractionApplications({ onExit }: { onExit: () => void }) {
 const { setLabScore } = useLab();
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [mode, setMode] = useState<'travel' | 'work'>('travel');
 const [isPlaying, setIsPlaying] = useState(false);
 const [time, setTime] = useState(0);

 // Travel state
 const [distance, setDistance] = useState(120);
 const [carSpeed, setCarSpeed] = useState(40);
 const [trainSpeed, setTrainSpeed] = useState(60);

 // Work state
 const [timeA, setTimeA] = useState(3);
 const [timeB, setTimeB] = useState(6);

 // Assessment state
 const [ans, setAns] = useState('');
 const [status, setStatus] = useState<'none' | 'correct' | 'incorrect'>('none');

 useEffect(() => {
 let timer: number;
 if (isPlaying) {
 timer = window.setInterval(() => {
 setTime(t => {
 const newT = t + 0.05;
 let maxT = 0;
 if (mode === 'travel') {
 maxT = distance / Math.min(carSpeed, trainSpeed);
 } else {
 maxT = 1 / (1/timeA + 1/timeB);
 }
 if (newT >= maxT) {
 setIsPlaying(false);
 return maxT;
 }
 return newT;
 });
 }, 50);
 }
 return () => window.clearInterval(timer);
 }, [isPlaying, mode, distance, carSpeed, trainSpeed, timeA, timeB]);

 const reset = () => {
 setIsPlaying(false);
 setTime(0);
 setAns('');
 setStatus('none');
 };

 const handleModeChange = (m: 'travel' | 'work') => {
 setMode(m);
 reset();
 };

 const checkAns = () => {
 let correct = 0;
 if (mode === 'travel') {
 correct = Math.abs((distance / carSpeed) - (distance / trainSpeed));
 } else {
 correct = 1 / (1/timeA + 1/timeB);
 }
 
 if (Math.abs(parseFloat(ans) - correct) <= 0.05) {
 setStatus('correct');
 setLabScore(100, 100);
 } else {
 setStatus('incorrect');
 setLabScore(0, 100);
 }
 };

 // derived values for UI
 const carProgress = Math.min(100, (carSpeed * time / distance) * 100);
 const trainProgress = Math.min(100, (trainSpeed * time / distance) * 100);

 const bricksTotal = 60;
 const rateA = 1 / timeA;
 const rateB = 1 / timeB;
 const bricksA = Math.min(bricksTotal, Math.floor(rateA * time * bricksTotal));
 const bricksB = Math.min(bricksTotal - bricksA, Math.floor(rateB * time * bricksTotal));

 return (
 <div className="flex flex-col min- bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.m10fractionapplications_rational_fraction_applications')} />

 
 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.m10fractionapplications_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.m10fractionapplications_lab')}</button>
 </div>
 <div className="lg:flex-1 min-w-0 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:overflow-visible">
 {/* Theory Column */}
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 border-b pb-2">{t('lab.m10fractionapplications_theory_formulas')}</h2>
 <div className={`flex-1 min-w-0 lg:overflow-y-auto pr-2 space-y-4 text-slate-700 dark:text-[#ffffff] ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block`}>
 {mode === 'travel' ? (
 <>
 <p><strong>{t('lab.m10fractionapplications_distance_speed_and_time')}</strong> {t('lab.m10fractionapplications_are_related_by_rational_equati')}</p>
 <div className={`bg-blue-50 p-4 rounded-lg text-center font-mono font-bold text-blue-800 dark:bg-teal-950/20 dark:border-teal-900 dark:text-[#ffffff] flex-col `}>
 
 {t('lab.m10fractionapplications_time_distance_speed')}
 </div>
 <p>{t('lab.m10fractionapplications_when_comparing_two_vehicles_co')}</p>
 <div className={`bg-slate-100 dark:bg-[#121212] p-4 rounded-lg text-center font-mono font-bold flex-col `}>
 
 {t('lab.m10fractionapplications_t_d_v_d_v')}
 </div>
 <p className="text-sm text-slate-500 dark:text-[#71717a] mt-4">{t('lab.m10fractionapplications_in_this_simulator_observe_how_')}</p>
 </>
 ) : (
 <>
 <p><strong>{t('lab.m10fractionapplications_work_rate_problems')}</strong> {t('lab.m10fractionapplications_involve_adding_fractions_if_so')} <em>t</em> {t('lab.m10fractionapplications_hours_their_rate_is')} <em>{t('lab.m10fractionapplications_1_t')}</em> {t('lab.m10fractionapplications_jobs_per_hour')}</p>
 <div className={`bg-green-50 p-4 rounded-lg text-center font-mono font-bold text-green-800 dark:bg-[#121212] dark:border-[#1c1b1b] dark:text-[#ffffff] flex-col `}>
 
 {t('lab.m10fractionapplications_rate_1_time')}
 </div>
 <p>{t('lab.m10fractionapplications_when_two_workers_collaborate_t')}</p>
 <div className="bg-slate-100 dark:bg-[#121212] p-4 rounded-lg text-center font-mono font-bold">
 
 {t('lab.m10fractionapplications_combined_rate_1_t_1_t')}
 </div>
 <p>{t('lab.m10fractionapplications_the_total_time_to_complete_the')}</p>
 </>
 )}
 </div>
 </div>

 {/* Interactive Column */}
 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex space-x-2 mb-6">
 <button 
 onClick={() => handleModeChange('travel')}
 className={`flex-1 flex items-center justify-center py-2 rounded-lg font-medium transition-colors ${mode === 'travel' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}
 >
 <Car size={18} className="mr-2" /> {t('lab.m10fractionapplications_travel_race')}
 </button>
 <button 
 onClick={() => handleModeChange('work')}
 className={`flex-1 flex items-center justify-center py-2 rounded-lg font-medium transition-colors ${mode === 'work' ? 'bg-green-600 text-white' : 'bg-slate-100 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212]'}`}
 >
 <Hammer size={18} className="mr-2" /> {t('lab.m10fractionapplications_work_rates')}
 </button>
 </div>

 {/* Visualizer */}
 <div className={`w-full relative h-64 bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#121212] rounded-xl mb-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col justify-center p-4 '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 {mode === 'travel' ? (
 <div className="space-y-8 w-full relative">
 <div className="relative h-12 w-full border-b-2 border-dashed border-slate-400 dark:border-[#1c1b1b]">
 <div className="absolute bottom-0 text-slate-500 dark:text-[#71717a] text-xs font-bold font-mono">{t('lab.m10fractionapplications_car_v')}{carSpeed})</div>
 <Car className="absolute bottom-1 text-blue-500 transition-all duration-75" size={32} style={{ left: `calc(${carProgress}% - 32px)` }} />
 </div>
 <div className="relative h-12 w-full border-b-2 border-[#1c1b1b] dark:border-[#1c1b1b]">
 <div className="absolute bottom-0 text-slate-500 dark:text-[#71717a] text-xs font-bold font-mono">{t('lab.m10fractionapplications_train_v')}{trainSpeed})</div>
 <Train className="absolute bottom-1 text-red-500 transition-all duration-75" size={32} style={{ left: `calc(${trainProgress}% - 32px)` }} />
 </div>
 <div className="absolute right-0 top-0 h-full border-r-4 border-green-500 opacity-50"></div>
 </div>
 ) : (
 <div className="w-full h-full flex flex-col">
 <div className="text-center font-bold text-slate-600 dark:text-[#a1a1aa] mb-2">{t('lab.m10fractionapplications_wall_progress_60_bricks')}</div>
 <div className="flex-1 min-w-0 grid grid-cols-10 gap-1 content-start">
 {Array.from({ length: bricksTotal }).map((_, i) => {
 let bgColor = 'bg-slate-200 dark:bg-[#121212]';
 if (i < bricksA) bgColor = 'bg-blue-500';
 else if (i < bricksA + bricksB) bgColor = 'bg-green-500';
 return <div key={i} className={`h-4 rounded-sm ${bgColor} transition-colors duration-100`} />
 })}
 </div>
 <div className="flex justify-between mt-2 text-xs font-bold">
 <span className="text-blue-600">{t('lab.m10fractionapplications_worker_a')} {bricksA} {t('lab.m10fractionapplications_bricks')}</span>
 <span className="text-green-600">{t('lab.m10fractionapplications_worker_b')} {bricksB} {t('lab.m10fractionapplications_bricks')}</span>
 </div>
 </div>
 )}
 
 <div className="absolute top-2 right-4 font-mono font-bold text-slate-700 dark:text-[#ffffff] flex items-center bg-slate-50 dark:bg-[#121212]/80 px-2 py-1 rounded">
 <Clock size={16} className="mr-2" />
 {time.toFixed(1)} h
 </div>
 </div>

 {/* Controls */}
 <div className="flex justify-center space-x-4 mb-6">
 <button 
 onClick={() => setIsPlaying(!isPlaying)}
 className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
 >
 {isPlaying ? <Pause size={20} className="mr-2"/> : <Play size={20} className="mr-2"/>}
 {isPlaying ? 'Pause' : 'Start'}
 </button>
 <button 
 onClick={reset}
 className="flex items-center px-4 py-2 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] rounded-lg hover:bg-slate-300 dark:bg-[#121212] transition-colors"
 >
 <RotateCcw size={20} className="mr-2"/>
 
 {t('lab.m10fractionapplications_reset')}
 </button>
 </div>

 {/* Sliders */}
 <div className="space-y-4">
 {mode === 'travel' ? (
 <>
 <div>
 <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
 <span>{t('lab.m10fractionapplications_distance_km')}</span>
 <span>{distance} km</span>
 </div>
 <input type="range" min="10" max="300" step="10" value={distance} onChange={e => {setDistance(Number(e.target.value)); reset()}} className="w-full" />
 </div>
 <div>
 <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
 <span>{t('lab.m10fractionapplications_car_speed_km_h')}</span>
 <span>{carSpeed} {t('lab.m10fractionapplications_km_h')}</span>
 </div>
 <input type="range" min="10" max="150" step="5" value={carSpeed} onChange={e => {setCarSpeed(Number(e.target.value)); reset()}} className="w-full" />
 </div>
 <div>
 <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
 <span>{t('lab.m10fractionapplications_train_speed_km_h')}</span>
 <span>{trainSpeed} {t('lab.m10fractionapplications_km_h')}</span>
 </div>
 <input type="range" min="10" max="150" step="5" value={trainSpeed} onChange={e => {setTrainSpeed(Number(e.target.value)); reset()}} className="w-full" />
 </div>
 </>
 ) : (
 <>
 <div>
 <div className="flex justify-between text-sm font-medium text-blue-700 mb-1">
 <span>{t('lab.m10fractionapplications_worker_a_time_hours')}</span>
 <span>{timeA} h</span>
 </div>
 <input type="range" min="1" max="12" step="1" value={timeA} onChange={e => {setTimeA(Number(e.target.value)); reset()}} className="w-full accent-blue-600" />
 </div>
 <div>
 <div className="flex justify-between text-sm font-medium text-green-700 mb-1">
 <span>{t('lab.m10fractionapplications_worker_b_time_hours')}</span>
 <span>{timeB} h</span>
 </div>
 <input type="range" min="1" max="12" step="1" value={timeB} onChange={e => {setTimeB(Number(e.target.value)); reset()}} className="w-full accent-green-600" />
 </div>
 </>
 )}
 </div>
 </div>

 {/* Assessment Column */}
 <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 border-b pb-2">{t('lab.m10fractionapplications_data_analysis')}</h2>
 <div className="flex-1 min-w-0 space-y-6">
 <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <p className="text-slate-700 dark:text-[#ffffff] font-medium mb-3">
 {mode === 'travel' 
 ? `Given the distance of ${distance}km, how many more hours does the slower vehicle take compared to the faster vehicle?` 
 : `If Worker A takes ${timeA}h and Worker B takes ${timeB}h, how many hours does it take them to build the wall together?`}
 </p>
 <p className="text-xs text-slate-500 dark:text-[#71717a] mb-4">{t('lab.m10fractionapplications_round_to_2_decimal_places_if_n')}</p>
 
 <div className="flex items-center space-x-3">
 <input 
 type="number" 
 step="0.01"
 value={ans}
 onChange={e => setAns(e.target.value)}
 placeholder={t('lab.m10fractionapplications_e_g_1_25')}
 className="flex-1 min-w-0 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
 />
 <button 
 onClick={checkAns}
 className="px-4 py-2 bg-[#121212] dark:bg-[#121212] text-white rounded-lg hover:bg-slate-700 dark:bg-[#121212] transition-colors"
 >
 
 {t('lab.m10fractionapplications_check')}
 </button>
 </div>

 {status === 'correct' && (
 <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center dark:bg-[#121212] dark:border-[#1c1b1b]">
 <CheckCircle2 size={20} className="mr-2 shrink-0" />
 <span className="font-medium">{t('lab.m10fractionapplications_correct_great_calculation')}</span>
 </div>
 )}
 {status === 'incorrect' && (
 <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
 <XCircle size={20} className="mr-2 shrink-0" />
 <span className="font-medium">{t('lab.m10fractionapplications_not_quite_right_use_the_formul')}</span>
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
