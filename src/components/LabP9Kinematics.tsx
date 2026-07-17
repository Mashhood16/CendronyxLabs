import { useState, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, Play, RotateCcw, Lightbulb, BarChart3 } from 'lucide-react';
import LabHeader from './LabHeader';
import { DIFFICULTY_CONFIGS, type DifficultyLevel } from '../utils/labScaffolding';
import PredictionChallenge from './PredictionChallenge';
import { useTranslate } from '../i18n';

export default function LabP9Kinematics({ onExit }: { onExit?: () => void }) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [difficulty, setDifficulty] = useState<DifficultyLevel>('understand');
 const config = DIFFICULTY_CONFIGS[difficulty];

 const pitchLength = 20.12; // meters
 const [speedTrue, setSpeedTrue] = useState(30); // m/s
 const [ballX, setBallX] = useState(0); // 0 to 100%
 const [isBowling, setIsBowling] = useState(false);
 const [stopwatchTime, setStopwatchTime] = useState(0);
 const [isTiming, setIsTiming] = useState(false);
 
 const animationRef = useRef<number>(0);
 const startTimeRef = useRef<number>(0);
 const stopWatchStartRef = useRef<number>(0);
 const stopWatchIntervalRef = useRef<number>(0);

 const [inputSpeed, setInputSpeed] = useState('');
 const [feedback, setFeedback] = useState<string | null>(null);

 // Sig fig part
 const [sigFigInput, setSigFigInput] = useState('');
 const [sigFigFeedback, setSigFigFeedback] = useState<string | null>(null);

 useEffect(() => {
 resetBowl();
 return () => {
 if (animationRef.current) cancelAnimationFrame(animationRef.current);
 clearInterval(stopWatchIntervalRef.current);
 };
 }, []);

 const resetBowl = () => {
 setSpeedTrue(Math.floor(Math.random() * 15) + 25); // 25 to 39 m/s
 setBallX(0);
 setIsBowling(false);
 setStopwatchTime(0);
 setIsTiming(false);
 if (animationRef.current) cancelAnimationFrame(animationRef.current);
 clearInterval(stopWatchIntervalRef.current);
 };

 const startBowl = () => {
 if (isBowling) return;
 resetBowl();
 setIsBowling(true);
 startTimeRef.current = performance.now();
 animateBall(performance.now());
 };

 const animateBall = (currentTime: number) => {
 const elapsed = (currentTime - startTimeRef.current) / 1000; // seconds
 const distanceTraveled = elapsed * speedTrue;
 const progress = (distanceTraveled / pitchLength) * 100;

 if (progress >= 100) {
 setBallX(100);
 setIsBowling(false);
 } else {
 setBallX(progress);
 animationRef.current = requestAnimationFrame(animateBall);
 }
 };

 const toggleStopwatch = () => {
 if (isTiming) {
 setIsTiming(false);
 clearInterval(stopWatchIntervalRef.current);
 } else {
 setIsTiming(true);
 setStopwatchTime(0);
 stopWatchStartRef.current = Date.now();
 stopWatchIntervalRef.current = window.setInterval(() => {
 setStopwatchTime((Date.now() - stopWatchStartRef.current) / 1000);
 }, 10);
 }
 };

 const checkAnswer = () => {
 const userV = parseFloat(inputSpeed);
 if (isNaN(userV)) return;
 // We check against the time they measured! 
 // Add measurement noise for realism
 const expectedSpeed = pitchLength / stopwatchTime;
 const noiseTolerance = difficulty === 'understand' ? 0.5 : difficulty === 'apply' ? 0.8 : 1.0;
 
 if (Math.abs(userV - expectedSpeed) < noiseTolerance) {
 setFeedback('correct');
 } else {
 setFeedback('incorrect');
 }
 };

 const checkSigFigs = () => {
 // We want 3 sig figs: e.g., 24.5
 if (sigFigInput.trim() === '24.5') {
 setSigFigFeedback('correct');
 } else {
 setSigFigFeedback('incorrect');
 }
 };

 return (
 <div className="flex flex-col min- bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.p9kinematics_physics_grade_9_kinematics_pre')} />

 <div className="px-4 pt-2 lg:pt-0">
 
 </div>

 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.tab.theory')}</button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.tab.lab')}</button>
 </div>
 <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:overflow-visible"> {/* Column 1: Theory */}
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex-col gap-4 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-lg font-bold border-b border-slate-200 dark:border-[#1c1b1b] pb-2">{t('lab.p9kinematics_theory')}</h2>
 <div className="prose prose-sm space-y-4">
 <div>
 <h3 className="font-semibold text-blue-800 dark:text-[#ffffff]">{t('lab.p9kinematics_1_speed_and_velocity')}</h3>
 <p>
 
 {t('lab.p9kinematics_average_speed_is_the_total_dis')}
 </p>
 <div className={`bg-blue-50 p-2 rounded text-center font-mono my-2 border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900 flex-col `}>
 
 {t('lab.p9kinematics_speed_v_distance_d_time_t')}
 </div>
 </div>
 
 <div>
 <h3 className="font-semibold text-blue-800 dark:text-[#ffffff]">{t('lab.p9kinematics_2_significant_figures')}</h3>
 <p>
 
 {t('lab.p9kinematics_when_taking_a_measurement_reco')}
 </p>
 </div>
 <div className={`bg-yellow-50 border border-yellow-200 p-3 rounded-lg mt-4 text-xs text-yellow-800 flex-col `}>
 <strong>{t('lab.p9kinematics_instructions')}</strong><br/>
 
 {t('lab.p9kinematics_click')} <em>{t('lab.p9kinematics_bowl_delivery')}</em>{t('lab.p9kinematics_manually_start_and_stop_the_st')}
 </div>
 </div>
 </div>

 {/* Column 2: Simulator */}
 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex-col items-center '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 {config.showHints && (
 <div className="w-full mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex gap-2 text-sm text-blue-700 dark:text-blue-300">
 <Lightbulb className="w-4 h-4 mt-0.5 shrink-0" />
 <span><strong>{t('lab.p9kinematics_hint')}</strong> {t('lab.p9kinematics_speed_distance_time_the_pitch_')} {pitchLength}{t('lab.p9kinematics_m_try_measuring_the_time_accur')}</span>
 </div>
 )}
 <h2 className="text-lg font-bold border-b border-slate-200 dark:border-[#1c1b1b] pb-2 w-full mb-4">{t('lab.p9kinematics_cricket_pitch_simulator')}</h2>
 
 <div className={`w-full relative h-32 bg-green-600 border-4 border-green-800 rounded-lg flex items-center mb-8 dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40 flex-col `}>
 {/* Pitch */}
 <div className="absolute left-[10%] right-[10%] h-16 bg-[#e8dbb0] border-2 border-[#c2b280] shadow-inner flex items-center justify-between px-2 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
 <div className="w-1 h-12 bg-slate-50 dark:bg-[#121212]"></div> {/* Crease line left */}
 <div className="w-1 h-12 bg-slate-50 dark:bg-[#121212]"></div> {/* Crease line right */}
 </div>
 
 {/* Ball */}
 <div 
 className="absolute w-4 h-4 bg-red-600 rounded-full shadow-lg border border-red-800 transition-none z-10"
 style={{ left: `calc(10% + (80% * ${ballX / 100}))`, top: '50%', transform: 'translate(-50%, -50%)' }}
 ></div>
 </div>

 <div className="flex gap-4 mb-8">
 <button 
 onClick={startBowl}
 disabled={isBowling}
 className={`px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 shadow-md dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40 `}
 >
 <Play size={18} /> {t('lab.p9kinematics_bowl_delivery')}
 </button>
 <button 
 onClick={resetBowl}
 className="px-4 py-3 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] font-bold rounded-lg hover:bg-slate-300 dark:bg-[#121212] transition-colors flex items-center gap-2"
 >
 <RotateCcw size={18} />
 </button>
 </div>

 <div className="w-full max-w-sm bg-[#121212] dark:!bg-[#121212] text-white rounded-xl p-6 shadow-xl flex flex-col items-center border-4 border-[#1c1b1b] dark:border-[#1c1b1b]">
 <div className="text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wider">{t('lab.p9kinematics_digital_stopwatch')}</div>
 <div className="text-5xl font-mono mb-6 text-green-400 font-light tracking-wider">
 {stopwatchTime.toFixed(2)}<span className="text-2xl text-slate-500 dark:text-[#71717a]">s</span>
 </div>
 <div className="flex gap-4 w-full">
 <button 
 onClick={toggleStopwatch}
 className={`flex-1 py-3 font-bold rounded-lg ${isTiming ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
 >
 {isTiming ? 'STOP' : 'START'}
 </button>
 </div>
 </div>
 </div>

 {/* Column 3: Analysis */}
 <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex-col gap-6 lg:overflow-y-auto ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 {config.predictionPhase && !feedback && stopwatchTime === 0 && (
 <div className="mb-4">
 <PredictionChallenge
 challenge={{
 question: "Before running the experiment: if the ball travels 20.12m in 0.67 seconds, what speed do you expect?",
 options: ["About 15 m/s", "About 30 m/s", "About 45 m/s", "About 60 m/s"],
 correctOption: 1,
 explanation: "v = d/t = 20.12m / 0.67s ≈ 30 m/s. That's fast — like a real cricket bowler!"
 }}
 onComplete={() => {}}
 />
 </div>
 )}
 <div>
 <h2 className="text-lg font-bold border-b border-slate-200 dark:border-[#1c1b1b] pb-2 mb-4">{t('lab.p9kinematics_1_speed_calculation')}</h2>
 <div className="space-y-3">
 <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">
 
 {t('lab.p9kinematics_distance')} <strong>{pitchLength} m</strong><br/>
 
 {t('lab.p9kinematics_time_your_measurement')} <strong>{stopwatchTime > 0 ? stopwatchTime.toFixed(2) : '--'} s</strong>
 </p>
 <div>
 <label className="block text-xs font-medium text-slate-700 dark:text-[#ffffff] mb-1">{t('lab.p9kinematics_calculated_speed_m_s')}</label>
 <input 
 type="number" 
 value={inputSpeed} 
 onChange={(e)=>setInputSpeed(e.target.value)} 
 className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
 placeholder={t('lab.p9kinematics_e_g_32_5')}
 />
 </div>
 <button 
 onClick={checkAnswer}
 disabled={stopwatchTime === 0}
 className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
 >
 
 {t('lab.p9kinematics_check_speed')}
 </button>
 
 {feedback === 'correct' && (
 <p className="text-sm text-green-700 flex items-center gap-1 mt-2">
 <CheckCircle size={16}/> {t('lab.p9kinematics_correct_based_on_your_time_tru')} {speedTrue} {t('lab.p9kinematics_m_s')}
 </p>
 )}
 {feedback === 'incorrect' && (
 <p className="text-sm text-red-700 flex items-center gap-1 mt-2">
 <XCircle size={16}/> {t('lab.p9kinematics_incorrect_divide_distance_by_y')}
 </p>
 )}
 </div>
 </div>

 <div>
 <h2 className="text-lg font-bold border-b border-slate-200 dark:border-[#1c1b1b] pb-2 mb-4">{t('lab.p9kinematics_2_significant_figures')}</h2>
 <div className="bg-slate-100 dark:bg-[#121212] p-4 rounded-lg relative mb-3">
 {/* Fake ruler measuring a textbook block */}
 <div className="w-full h-8 bg-blue-300 rounded mb-1 shadow-sm"></div>
 <div className="w-full h-6 bg-yellow-200 border-t border-slate-400 dark:border-[#1c1b1b] relative">
 {/* 24cm is here, 25cm is here */}
 <div className="absolute left-[10%] bottom-0 h-4 border-l border-slate-600 dark:border-[#1c1b1b]"><span className="text-[10px] ml-1">24</span></div>
 <div className="absolute left-[50%] bottom-0 h-3 border-l border-slate-500 dark:border-[#1c1b1b]"></div> {/* 24.5 */}
 <div className="absolute left-[90%] bottom-0 h-4 border-l border-slate-600 dark:border-[#1c1b1b]"><span className="text-[10px] ml-1">25</span></div>
 </div>
 {/* Measurement red line indicating exactly 24.5 */}
 <div className="absolute left-[50%] top-0 bottom-6 w-0.5 bg-red-500 shadow-[0_0_2px_rgba(255,0,0,0.5)]"></div>
 </div>
 <p className="text-xs text-slate-600 dark:text-[#a1a1aa] mb-2">
 
 {t('lab.p9kinematics_the_red_line_shows_the_edge_of')}
 </p>
 <div className="flex gap-2">
 <input 
 type="text" 
 value={sigFigInput} 
 onChange={(e)=>setSigFigInput(e.target.value)} 
 className="flex-1 border rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
 placeholder={t('lab.p9kinematics_e_g_24_5')}
 />
 <button 
 onClick={checkSigFigs}
 className="px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
 >
 
 {t('lab.p9kinematics_submit')}
 </button>
 </div>
 {sigFigFeedback === 'correct' && (
 <p className="text-sm text-green-700 flex items-center gap-1 mt-2">
 <CheckCircle size={16}/> {t('lab.p9kinematics_correct_3_sig_figs')}
 </p>
 )}
 {sigFigFeedback === 'incorrect' && (
 <p className="text-sm text-red-700 flex items-center gap-1 mt-2">
 <XCircle size={16}/> {t('lab.p9kinematics_incorrect_look_closely_at_the_')}
 </p>
 )}
 </div>
 </div>
 </div>
 </div>
 );
}
