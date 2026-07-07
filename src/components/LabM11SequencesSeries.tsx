import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import MathText from './MathText';
import { useTranslate } from "../i18n";

export default function LabM11SequencesSeries({ onExit }: { onExit?: () => void }) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 // Pendulum state
 const [initialAngle, setInitialAngle] = useState<number>(45); // degrees
 const [decayRatio, setDecayRatio] = useState<number>(0.8);
 const [isPlaying, setIsPlaying] = useState<boolean>(false);
 const [swingCount, setSwingCount] = useState<number>(0);
 const [currentAngle, setCurrentAngle] = useState<number>(45);
 
 // Assessment
 const [studentAnswer, setStudentAnswer] = useState<string>('');
 const [feedback, setFeedback] = useState<string>('');
 
 // Animation ref
 const requestRef = useRef<number>(0);
 const timeRef = useRef<number>(0);

 // Math variables
 // S = a / (1 - r) for pendulum total angular distance
 const expectedTotalDistance = initialAngle / (1 - decayRatio);

 const checkAnswer = () => {
 const ans = parseFloat(studentAnswer);
 if (isNaN(ans)) {
  setFeedback('Please enter a valid number.');
  return;
 }
 if (Math.abs(ans - expectedTotalDistance) < 0.5) {
  setFeedback('Correct! You found the sum of the infinite geometric series.');
 } else {
  setFeedback('Incorrect. Remember the formula for infinite sum: S = a / (1 - r).');
 }
 };

 const animate = (time: number) => {
 if (!timeRef.current) timeRef.current = time;
 const deltaTime = time - timeRef.current;
 
 const totalTime = deltaTime / 1000; 
 const currentSwingIndex = Math.floor(totalTime);
 const phase = totalTime - currentSwingIndex; // 0 to 1
 
 const direction = currentSwingIndex % 2 === 0 ? 1 : -1;
 const amplitude = initialAngle * Math.pow(decayRatio, currentSwingIndex);
 
 const currentAng = direction * amplitude * Math.cos(Math.PI * phase);
 
 setCurrentAngle(currentAng);
 setSwingCount(currentSwingIndex);
 
 if (isPlaying) {
  requestRef.current = requestAnimationFrame(animate);
 }
 };

 useEffect(() => {
 if (isPlaying) {
  requestRef.current = requestAnimationFrame(animate);
 } else {
  cancelAnimationFrame(requestRef.current);
 }
 return () => cancelAnimationFrame(requestRef.current);
 }, [isPlaying, initialAngle, decayRatio]);

 const reset = () => {
 setIsPlaying(false);
 cancelAnimationFrame(requestRef.current);
 timeRef.current = 0;
 setCurrentAngle(initialAngle);
 setSwingCount(0);
 setStudentAnswer('');
 setFeedback('');
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.m11sequencesseries_sequences_series_geometric_dec')} />

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.m11sequencesseries_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.m11sequencesseries_lab')}</button>
  </div>
  <div className="lg:flex-1 min-w-0 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:overflow-visible">
  {/* Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-indigo-700 mb-4">{t('lab.m11sequencesseries_theory_context')}</h2>
   <div className="prose prose-slate">
   <p>
    A <strong>{t('lab.m11sequencesseries_geometric_sequence')}</strong>  {t('lab.m11sequencesseries_is_a_sequence_of_numbers_where')} <em>{t('lab.m11sequencesseries_common_ratio')}</em>  {t('lab.m11sequencesseries_r')}
                            </p>
   <p>
    <MathText>{t('lab.m11sequencesseries_in_our_pendulum_example_due_to')} {"$$a$$"}  {t('lab.m11sequencesseries_and_the_decay_ratio_is')} {"$$r$$"}{t('lab.m11sequencesseries_the_sequence_of_swing_amplitud')}</MathText>
   </p>
   <p className={`text-center font-mono bg-slate-100 dark:bg-[#121212] p-2 rounded flex-col `}>
    <MathText>{t('lab.m11sequencesseries_a_a_r_a_r_a_r')}</MathText>
   </p>
   <p>
    
                             {t('lab.m11sequencesseries_the')} <strong>{t('lab.m11sequencesseries_sum_of_an_infinite_geometric_s')}</strong>  {t('lab.m11sequencesseries_when_r_lt_1_tells_us_the_total')}
                            </p>
   <p className={`text-center font-mono bg-slate-100 dark:bg-[#121212] p-2 rounded flex-col `}>
    <MathText>{"$$S_{\\infty} = \\frac{a}{1 - r}$$"}</MathText>
   </p>
   <div className={`mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded dark:bg-teal-950/20 dark:border-teal-900 flex-col `}>
    <h3 className="font-bold text-blue-800 dark:text-[#ffffff]">{t('lab.m11sequencesseries_lab_objectives')}</h3>
    <ul className="list-disc ml-5 text-blue-900 text-sm mt-2 dark:text-[#ffffff]">
    <li>{t('lab.m11sequencesseries_observe_the_geometric_decay_of')}</li>
    <li>{t('lab.m11sequencesseries_identify_the_initial_term_a_an')}</li>
    <li>{t('lab.m11sequencesseries_calculate_the_total_angular_di')}</li>
    </ul>
   </div>
   </div>
  </div>

  {/* Visualizer */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col items-center '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-indigo-700 mb-4">{t('lab.m11sequencesseries_interactive_pendulum')}</h2>
   
   <div className={`w-full flex justify-center items-center bg-slate-100 dark:bg-[#121212] rounded-lg p-4 mb-6 relative h-64 overflow- `}>
   <svg width="200" height="200" viewBox="-100 -20 200 220" className="overflow-visible">
    <circle cx="0" cy="0" r="4" fill="#334155" />
    <line x1="0" y1="0" x2="0" y2="180" stroke="#cbd5e1" strokeDasharray="4 4" />
    
    <g transform={`rotate(${currentAngle})`}>
    <line x1="0" y1="0" x2="0" y2="150" stroke="#475569" strokeWidth="3" />
    <circle cx="0" cy="150" r="15" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
    </g>

    <path 
    d={`M 0 50 A 50 50 0 0 ${currentAngle > 0 ? 1 : 0} ${50 * Math.sin(currentAngle * Math.PI / 180)} ${50 * Math.cos(currentAngle * Math.PI / 180)}`}
    fill="none" 
    stroke="#3b82f6" 
    strokeWidth="2"
    strokeDasharray="2 2"
    />
   </svg>
   <div className="absolute top-2 right-2 bg-slate-50 dark:bg-[#121212]/80 px-3 py-1 rounded shadow text-sm font-mono">
    
                             {t('lab.m11sequencesseries_angle')} {Math.abs(currentAngle).toFixed(1)}°
   </div>
   <div className="absolute top-10 right-2 bg-slate-50 dark:bg-[#121212]/80 px-3 py-1 rounded shadow text-sm font-mono">
    
                             {t('lab.m11sequencesseries_swing')} {swingCount}
   </div>
   </div>

   <div className="w-full space-y-4">
   <div>
    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff]">
    
                                 {t('lab.m11sequencesseries_initial_angle_a')} {initialAngle}°
    </label>
    <input 
    type="range" min="10" max="90" step="5" 
    value={initialAngle} 
    onChange={(e) => {setInitialAngle(Number(e.target.value)); reset();}}
    className="w-full"
    disabled={isPlaying}
    />
   </div>
   <div>
    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff]">
    
                                 {t('lab.m11sequencesseries_decay_ratio_r')} {decayRatio}
    </label>
    <input 
    type="range" min="0.1" max="0.95" step="0.05" 
    value={decayRatio} 
    onChange={(e) => {setDecayRatio(Number(e.target.value)); reset();}}
    className="w-full"
    disabled={isPlaying}
    />
   </div>
   
   <div className="flex gap-2 justify-center pt-4">
    <button 
    onClick={() => {
     if(!isPlaying) { timeRef.current = 0; }
     setIsPlaying(!isPlaying);
    }}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white ${isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
    >
    {isPlaying ? <><Pause size={18}/>  {t('lab.m11sequencesseries_pause')}</> : <><Play size={18}/>  {t('lab.m11sequencesseries_start')}</>}
    </button>
    <button 
    onClick={reset}
    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] hover:bg-slate-300 dark:bg-[#121212]"
    >
    <RotateCcw size={18} />  {t('lab.m11sequencesseries_reset')}
                                 </button>
   </div>
   </div>
  </div>

  {/* Assessment */}
  <div className={`bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-indigo-700 mb-4">{t('lab.m11sequencesseries_data_logging_assessment')}</h2>
   
   <div className="mb-6">
   <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.m11sequencesseries_measured_values')}</h3>
   <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] space-y-2 font-mono text-sm flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <div className="flex justify-between">
    <span>{t('lab.m11sequencesseries_first_swing_amplitude_a')}</span>
    <span className="font-bold text-indigo-600">{initialAngle}°</span>
    </div>
    <div className="flex justify-between">
    <span>{t('lab.m11sequencesseries_second_swing_amplitude_a_r')}</span>
    <span className="font-bold text-indigo-600">{(initialAngle * decayRatio).toFixed(1)}°</span>
    </div>
    <div className="flex justify-between">
    <span>{t('lab.m11sequencesseries_common_ratio_r')}</span>
    <span className="font-bold text-indigo-600">{decayRatio.toFixed(2)}</span>
    </div>
   </div>
   </div>

   <div className="space-y-4 flex-1">
   <h3 className="font-semibold text-slate-800 dark:text-[#ffffff]">{t('lab.m11sequencesseries_task_calculate_total_distance')}</h3>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">
    
                             {t('lab.m11sequencesseries_using_the_formula_for_the_sum_')}
                            </p>
   
   <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff]">{t('lab.m11sequencesseries_total_angular_distance')}</label>
    <input 
    type="number" 
    value={studentAnswer}
    onChange={(e) => setStudentAnswer(e.target.value)}
    placeholder={t('lab.m11sequencesseries_e_g_150')}
    className="px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
   </div>

   <button 
    onClick={checkAnswer}
    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors mt-2 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
   >
    <CheckCircle size={18} />  {t('lab.m11sequencesseries_check_answer')}
                            </button>

   {feedback && (
    <div className={`p-4 rounded-lg mt-4 flex items-start gap-3 ${feedback.includes('Correct') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
    {feedback.includes('Correct') ? <CheckCircle size={20} className="text-emerald-500 shrink-0 mt-0.5" /> : <XCircle size={20} className="text-rose-500 shrink-0 mt-0.5" />}
    <p className="text-sm">{feedback}</p>
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
