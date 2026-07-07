import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Check, X, Info, Star, Timer, Lightbulb, Award } from 'lucide-react';
import { useTranslate } from "../i18n";

const PB_KEY = 'cendronyx-m6-pb';

function getPB(): { lcm: number | null; hcf: number | null } {
  try {
    const raw = localStorage.getItem(PB_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { lcm: null, hcf: null };
}

function savePB(pb: { lcm: number | null; hcf: number | null }) {
  try { localStorage.setItem(PB_KEY, JSON.stringify(pb)); } catch {}
}

function formatTime(seconds: number) {
  const s = seconds.toFixed(1);
  return `${s}s`;
}

export default function LabM6Factors({ onExit }: { onExit?: () => void }) {
    const { t } = useTranslate();
 const [activeTab, setActiveTab] = useState<'LCM' | 'HCF'>('LCM');

 // LCM State
 const [lh1, setLh1] = useState<number>(3);
 const [lh2, setLh2] = useState<number>(4);
 const [lcmInput, setLcmInput] = useState<string>('');
 const [lcmFeedback, setLcmFeedback] = useState<{status: 'correct' | 'incorrect' | null, msg: string}>({status: null, msg: ''});
 const [time, setTime] = useState<number>(0);
 const [isPlaying, setIsPlaying] = useState<boolean>(false);
 const [lcmSolved, setLcmSolved] = useState(false);
 const [lcmStartTime, setLcmStartTime] = useState<number | null>(null);
 const [lcmElapsed, setLcmElapsed] = useState<number | null>(null);
 const [showLcmDemo, setShowLcmDemo] = useState(false);
 const [lcmDemoStep, setLcmDemoStep] = useState(0);
 const lcmDemoRef = useRef<ReturnType<typeof setInterval> | null>(null);
 const hcfDemoRef = useRef<ReturnType<typeof setInterval> | null>(null);
 const [personalBest, setPersonalBest] = useState(getPB());

 useEffect(() => {
 let timer: ReturnType<typeof setTimeout>;
 if (isPlaying) {
  timer = setInterval(() => {
  setTime(prev => (prev + 1) % 61); // Loops at 60
  }, 500); // Half second ticks
 }
 return () => clearInterval(timer);
 }, [isPlaying]);

 // Track solve time for LCM
 useEffect(() => {
  if (lcmSolved && lcmStartTime !== null) {
    const elapsed = Date.now() - lcmStartTime;
    const elapsedSec = parseFloat((elapsed / 1000).toFixed(1));
    setLcmElapsed(elapsedSec);
    if (personalBest.lcm === null || elapsedSec < personalBest.lcm) {
      const newPB = { ...personalBest, lcm: elapsedSec };
      setPersonalBest(newPB);
      savePB(newPB);
    }
  }
 }, [lcmSolved]);

 const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
 const calcLcm = (a: number, b: number) => (a * b) / gcd(a, b);

 // LCM step-by-step demo
 const lcmMultiplesA = useRef<number[]>([]);
 const lcmMultiplesB = useRef<number[]>([]);

 const runLcmDemo = useCallback(() => {
  const lcm = (lh1 * lh2) / gcd(lh1, lh2);
  const ma: number[] = [];
  const mb: number[] = [];
  for (let i = 1; i <= 12; i++) {
    const va = lh1 * i;
    const vb = lh2 * i;
    if (va <= lcm * 2) ma.push(va);
    if (vb <= lcm * 2) mb.push(vb);
  }
  lcmMultiplesA.current = ma;
  lcmMultiplesB.current = mb;
  setShowLcmDemo(true);
  setLcmDemoStep(0);
  // Auto-advance steps
  let step = 0;
  if (lcmDemoRef.current) clearInterval(lcmDemoRef.current);
  lcmDemoRef.current = setInterval(() => {
    step++;
    if (step > 5) {
      if (lcmDemoRef.current) clearInterval(lcmDemoRef.current);
      lcmDemoRef.current = null;
      return;
    }
    setLcmDemoStep(step);
  }, 1200);
 }, [lh1, lh2]);

 const handleLcmCheck = () => {
 const ans = parseInt(lcmInput);
 if (isNaN(ans)) return;
 if (ans === calcLcm(lh1, lh2)) {
  setLcmFeedback({status: 'correct', msg: 'Great job! You found the Least Common Multiple.'});
  setLcmSolved(true);
  if (lcmStartTime === null) setLcmStartTime(Date.now());
 } else {
  setLcmFeedback({status: 'incorrect', msg: 'Not quite. Find the smallest number that is a multiple of both.'});
 }
 };

 // HCF State
 const [pipe1, setPipe1] = useState<number>(12);
 const [pipe2, setPipe2] = useState<number>(18);
 const [hcfInput, setHcfInput] = useState<string>('');
 const [hcfFeedback, setHcfFeedback] = useState<{status: 'correct' | 'incorrect' | null, msg: string}>({status: null, msg: ''});
 const [hcfSolved, setHcfSolved] = useState(false);
 const [hcfStartTime, setHcfStartTime] = useState<number | null>(null);
 const [hcfElapsed, setHcfElapsed] = useState<number | null>(null);
 const [showHcfDemo, setShowHcfDemo] = useState(false);
 const [hcfDemoStep, setHcfDemoStep] = useState(0);

 // Track solve time for HCF
 useEffect(() => {
  if (hcfSolved && hcfStartTime !== null) {
    const elapsed = Date.now() - hcfStartTime;
    const elapsedSec = parseFloat((elapsed / 1000).toFixed(1));
    setHcfElapsed(elapsedSec);
    if (personalBest.hcf === null || elapsedSec < personalBest.hcf) {
      const newPB = { ...personalBest, hcf: elapsedSec };
      setPersonalBest(newPB);
      savePB(newPB);
    }
  }
 }, [hcfSolved]);

 const handleHcfCheck = () => {
 const ans = parseInt(hcfInput);
 if (isNaN(ans)) return;
 if (ans === gcd(pipe1, pipe2)) {
  setHcfFeedback({status: 'correct', msg: 'Excellent! You found the Highest Common Factor.'});
  setHcfSolved(true);
  if (hcfStartTime === null) setHcfStartTime(Date.now());
 } else {
  setHcfFeedback({status: 'incorrect', msg: 'Not quite. Find the largest number that divides both equally.'});
 }
 };

 const runHcfDemo = useCallback(() => {
  setShowHcfDemo(true);
  setHcfDemoStep(0);
  let step = 0;
  if (hcfDemoRef.current) clearInterval(hcfDemoRef.current);
  hcfDemoRef.current = setInterval(() => {
    step++;
    if (step > 4) {
      if (hcfDemoRef.current) clearInterval(hcfDemoRef.current);
      hcfDemoRef.current = null;
      return;
    }
    setHcfDemoStep(step);
  }, 1400);
 }, []);

 // Cleanup intervals on unmount
 useEffect(() => {
  return () => {
    if (lcmDemoRef.current) clearInterval(lcmDemoRef.current);
    if (hcfDemoRef.current) clearInterval(hcfDemoRef.current);
  };
 }, []);

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff] font-sans transition-colors duration-300 min-h-screen lg:h-screen overflow-x-hidden w-full">
  {/* Header */}
  <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-[#1c1b1b] shadow-sm z-10">
  <div className="flex items-center gap-4">
   <button
   onClick={onExit}
   className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
   title={t('lab.m6factors_go_back')}
   >
   <ArrowLeft className="w-6 h-6" />
   </button>
   <h1 className="text-lg md:text-xl font-bold">{t('lab.m6factors_class_6_math_factors_multiples')}</h1>
  </div>
  <div className="flex bg-slate-100 dark:bg-[#121212] rounded-lg p-1">
   <button
   onClick={() => setActiveTab('LCM')}
   className={`px-4 py-2 rounded-md font-medium transition-colors ${ activeTab === 'LCM' ? ' shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-[#a1a1aa] hover:text-slate-900 dark:hover:text-slate-200' }`}
   >
   
                        {t('lab.m6factors_lcm_lighthouses')}
                        </button>
   <button
   onClick={() => setActiveTab('HCF')}
   className={`px-4 py-2 rounded-md font-medium transition-colors ${ activeTab === 'HCF' ? ' shadow-sm text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-[#a1a1aa] hover:text-slate-900 dark:hover:text-slate-200' }`}
   >
   
                        {t('lab.m6factors_hcf_pipe_cutting')}
                        </button>
  </div>
  </header>

  {/* Main 2-Column Layout */}
  <div className="flex flex-1 overflow-hidden">
  
  {/* Left Column: Controls & Workspace */}
  <div className="w-1/2 p-6 lg:overflow-y-auto border-r border-slate-200 dark:border-[#1c1b1b] flex flex-col gap-6">
   {activeTab === 'LCM' ? (
   <>
    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50">
    <h2 className="text-lg font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2 mb-2">
     <Info className="w-5 h-5" />  {t('lab.m6factors_mission_synchronize_lighthouse')}
                                     </h2>
    <p className="text-sm text-blue-700 dark:text-blue-400">
     
                                      {t('lab.m6factors_two_lighthouses_flash_at_diffe')} <strong>{t('lab.m6factors_least_common_multiple_lcm')}</strong>  {t('lab.m6factors_of_their_intervals')}
                                     </p>
    <button
     onClick={runLcmDemo}
     className="mt-3 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 dark:bg-indigo-500 dark:hover:bg-indigo-400"
    >
     <Lightbulb className="w-4 h-4" />
     
                                      {t('lab.m6factors_show_me_how_step_by_step_demo')}
                                     </button>
    </div>

    <div className="space-y-4">
    <h3 className="font-semibold text-lg">{t('lab.m6factors_settings')}</h3>
    
    <div className="flex flex-col gap-2">
     <label className="text-sm font-medium">{t('lab.m6factors_lighthouse_a_flashes_every')} {lh1}  {t('lab.m6factors_seconds')}</label>
     <input 
     type="range" min="2" max="10" value={lh1} 
     onChange={(e) => {setLh1(parseInt(e.target.value)); setTime(0); setIsPlaying(false); setLcmFeedback({status:null,msg:''});}}
     className="w-full accent-blue-600"
     />
    </div>

    <div className="flex flex-col gap-2">
     <label className="text-sm font-medium">{t('lab.m6factors_lighthouse_b_flashes_every')} {lh2}  {t('lab.m6factors_seconds')}</label>
     <input 
     type="range" min="2" max="10" value={lh2} 
     onChange={(e) => {setLh2(parseInt(e.target.value)); setTime(0); setIsPlaying(false); setLcmFeedback({status:null,msg:''});}}
     className="w-full accent-red-600"
     />
    </div>
    </div>

    {/* Personal Best / Speed Badge */}
    <div className="flex items-center gap-3">
     <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
      <Timer className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
      <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
        {lcmElapsed !== null ? formatTime(lcmElapsed) : '--'}
      </span>
     </div>
     {personalBest.lcm !== null && (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
       <Award className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
       <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
         
                                                  {t('lab.m6factors_best')} {formatTime(personalBest.lcm)}
       </span>
      </div>
     )}
     {lcmElapsed !== null && personalBest.lcm !== null && lcmElapsed === personalBest.lcm && (
      <span className="text-xs font-bold text-green-600 dark:text-green-400 animate-pulse">{t('lab.m6factors_new_record')}</span>
     )}
    </div>

    <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] mt-auto">
    <h3 className="font-semibold text-lg mb-3">{t('lab.m6factors_solve')}</h3>
    <p className="text-sm mb-4">{t('lab.m6factors_when_will_both_lighthouses_fla')}</p>
    
    <div className="flex gap-3">
     <input 
     type="number"
     value={lcmInput}
     onChange={(e) => setLcmInput(e.target.value)}
     placeholder={t('lab.m6factors_enter_time_in_sec')}
     className="flex-1 min-w-0 px-4 py-2 rounded-lg border border-slate-300 dark:border-[#1c1b1b] focus:ring-2 focus:ring-blue-500 outline-none"
     />
     <button 
     onClick={handleLcmCheck}
     className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
     >
     
                                          {t('lab.m6factors_check')}
                                          </button>
    </div>

    {lcmFeedback.status && (
     <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 ${ lcmFeedback.status === 'correct' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' }`}>
     {lcmFeedback.status === 'correct' ? <Check className="w-5 h-5 shrink-0 mt-0.5" /> : <X className="w-5 h-5 shrink-0 mt-0.5" />}
     <p className="text-sm">{lcmFeedback.msg}</p>
     </div>
    )}
    </div>
   </>
   ) : (
   <>
    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800/50">
    <h2 className="text-lg font-bold text-green-800 dark:text-green-300 flex items-center gap-2 mb-2">
     <Info className="w-5 h-5" />  {t('lab.m6factors_mission_cut_the_pipes')}
                                         </h2>
    <p className="text-sm text-green-700 dark:text-green-400">
     
                                          {t('lab.m6factors_you_have_two_pipes_of_differen')} <strong>{t('lab.m6factors_equal_maximum_length')}</strong>  {t('lab.m6factors_with_no_leftovers_this_is_the')} <strong>{t('lab.m6factors_highest_common_factor_hcf')}</strong>.
    </p>
    <button
     onClick={runHcfDemo}
     className="mt-3 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 dark:bg-indigo-500 dark:hover:bg-indigo-400"
    >
     <Lightbulb className="w-4 h-4" />
     
                                          {t('lab.m6factors_show_me_how_pipe_cutting_demo')}
                                         </button>
    </div>

    <div className="space-y-4">
    <h3 className="font-semibold text-lg">{t('lab.m6factors_settings')}</h3>
    
    <div className="flex flex-col gap-2">
     <label className="text-sm font-medium">{t('lab.m6factors_pipe_a_length')} {pipe1} m</label>
     <input 
     type="range" min="4" max="36" step="2" value={pipe1} 
     onChange={(e) => {setPipe1(parseInt(e.target.value)); setHcfFeedback({status:null,msg:''});}}
     className="w-full accent-green-600"
     />
    </div>

    <div className="flex flex-col gap-2">
     <label className="text-sm font-medium">{t('lab.m6factors_pipe_b_length')} {pipe2} m</label>
     <input 
     type="range" min="4" max="36" step="2" value={pipe2} 
     onChange={(e) => {setPipe2(parseInt(e.target.value)); setHcfFeedback({status:null,msg:''});}}
     className="w-full accent-emerald-600"
     />
    </div>
    </div>

    {/* Personal Best / Speed Badge - HCF */}
    <div className="flex items-center gap-3">
     <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
      <Timer className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
      <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
        {hcfElapsed !== null ? formatTime(hcfElapsed) : '--'}
      </span>
     </div>
     {personalBest.hcf !== null && (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
       <Award className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
       <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
         
                                                      {t('lab.m6factors_best')} {formatTime(personalBest.hcf)}
       </span>
      </div>
     )}
     {hcfElapsed !== null && personalBest.hcf !== null && hcfElapsed === personalBest.hcf && (
      <span className="text-xs font-bold text-green-600 dark:text-green-400 animate-pulse">{t('lab.m6factors_new_record')}</span>
     )}
    </div>

    <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] mt-auto">
    <h3 className="font-semibold text-lg mb-3">{t('lab.m6factors_solve')}</h3>
    <p className="text-sm mb-4">{t('lab.m6factors_what_is_the_maximum_equal_leng')}</p>
    
    <div className="flex gap-3">
     <input 
     type="number"
     value={hcfInput}
     onChange={(e) => setHcfInput(e.target.value)}
     placeholder={t('lab.m6factors_enter_length_in_m')}
     className="flex-1 min-w-0 px-4 py-2 rounded-lg border border-slate-300 dark:border-[#1c1b1b] focus:ring-2 focus:ring-green-500 outline-none"
     />
     <button 
     onClick={handleHcfCheck}
     className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40"
     >
     
                                              {t('lab.m6factors_check')}
                                              </button>
    </div>

    {hcfFeedback.status && (
     <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 ${ hcfFeedback.status === 'correct' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' }`}>
     {hcfFeedback.status === 'correct' ? <Check className="w-5 h-5 shrink-0 mt-0.5" /> : <X className="w-5 h-5 shrink-0 mt-0.5" />}
     <p className="text-sm">{hcfFeedback.msg}</p>
     </div>
    )}
    </div>
   </>
   )}
  </div>

  {/* Right Column: Simulation Stage */}
  <style>{`
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes bounceIn { 0% { opacity: 0; transform: scale(0.5); } 60% { opacity: 1; transform: scale(1.1); } 100% { transform: scale(1); } }
    .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
    .animate-bounce-in { animation: bounceIn 0.6s ease-out forwards; }
  `}</style>
  <div className="w-1/2 bg-slate-100 dark:bg-[#121212] p-6 flex flex-col relative overflow-hidden">
   {activeTab === 'LCM' ? (
   <div className="flex flex-col h-full">
    {/* LCM Step-by-Step Demo Overlay */}
    {showLcmDemo && (
     <div className="absolute inset-0 z-20 bg-white dark:bg-[#121212] dark:border-[#1c1b1b]/95 dark:bg-[#121212]/95 p-6 flex flex-col overflow-y-auto" onClick={() => setShowLcmDemo(false)}>
      <div className="flex items-center justify-between mb-4" onClick={e => e.stopPropagation()}>
       <h3 className="text-lg font-bold flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
        <Lightbulb className="w-5 h-5" />  {t('lab.m6factors_how_lighthouses_sync')}
                                                </h3>
       <button onClick={() => setShowLcmDemo(false)} className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 px-2 py-1 rounded bg-slate-100 dark:bg-slate-700">{t('lab.m6factors_close')}</button>
      </div>
      
      <div className="flex-1 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
       {/* Step 1: Show multiples of A */}
       {lcmDemoStep >= 1 && (
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 animate-fadeIn">
         <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
          
                                                           {t('lab.m6factors_1_multiples_of_lighthouse_a_ev')} {lh1}{t('lab.m6factors_s')}
                                                          </p>
         <div className="flex flex-wrap gap-1.5">
          {lcmMultiplesA.current.slice(0, 6).map((m, i) => (
           <span key={i} className={`px-2 py-1 rounded text-xs font-mono font-bold ${m === calcLcm(lh1, lh2) ? 'bg-yellow-300 text-yellow-900 ring-2 ring-yellow-500' : 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200'}`}>
            {m}
           </span>
          ))}
         </div>
        </div>
       )}

       {/* Step 2: Show multiples of B */}
       {lcmDemoStep >= 2 && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-fadeIn">
         <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">
          
                                                           {t('lab.m6factors_2_multiples_of_lighthouse_b_ev')} {lh2}{t('lab.m6factors_s')}
                                                          </p>
         <div className="flex flex-wrap gap-1.5">
          {lcmMultiplesB.current.slice(0, 6).map((m, i) => (
           <span key={i} className={`px-2 py-1 rounded text-xs font-mono font-bold ${m === calcLcm(lh1, lh2) ? 'bg-yellow-300 text-yellow-900 ring-2 ring-yellow-500' : 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200'}`}>
            {m}
           </span>
          ))}
         </div>
        </div>
       )}

       {/* Step 3: Show common multiples */}
       {lcmDemoStep >= 3 && (
        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 animate-fadeIn">
         <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">
          
                                                           {t('lab.m6factors_3_common_multiples_appear_in_b')}
                                                          </p>
         <div className="flex flex-wrap gap-2">
          {(() => {
           const common = lcmMultiplesA.current.filter(v => lcmMultiplesB.current.includes(v));
           return common.length > 0 ? common.map((m, i) => (
            <span key={i} className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200 ring-2 ring-green-400">
             {m}
            </span>
           )) : <span className="text-xs text-slate-500">{t('lab.m6factors_none_yet_keep_looking')}</span>;
          })()}
         </div>
        </div>
       )}

       {/* Step 4: Highlight LCM */}
       {lcmDemoStep >= 4 && (
        <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 animate-bounce-in text-center">
         <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
         <p className="text-sm font-bold text-yellow-800 dark:text-yellow-300">
          
                                                           {t('lab.m6factors_lcm')} {calcLcm(lh1, lh2)}
         </p>
         <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
          
                                                           {t('lab.m6factors_both_lighthouses_flash_togethe')} {calcLcm(lh1, lh2)}  {t('lab.m6factors_seconds_1')}
                                                          </p>
        </div>
       )}

       {/* Step 5: Show timeline visualization */}
       {lcmDemoStep >= 5 && (
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] animate-fadeIn">
         <p className="text-xs font-semibold text-slate-600 dark:text-[#71717a] mb-3 text-center">{t('lab.m6factors_timeline_seconds')}</p>
         <div className="relative h-20">
          {/* Multiples of A */}
          <div className="absolute top-0 w-full h-6">
           <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold absolute -top-1 left-0">A</span>
           {lcmMultiplesA.current.slice(0, 8).map((m, i) => (
            <div key={`a-${i}`} className={`absolute top-0 w-3 h-3 rounded-full ${m === calcLcm(lh1, lh2) ? 'bg-yellow-400 ring-2 ring-yellow-500 z-10' : 'bg-blue-400'}`}
              style={{ left: `${(m / (Math.max(...lcmMultiplesA.current.slice(0, 8), ...lcmMultiplesB.current.slice(0, 8)))) * 100}%` }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-mono">{m}</span>
            </div>
           ))}
          </div>
          {/* Multiples of B */}
          <div className="absolute top-8 w-full h-6">
           <span className="text-[10px] text-red-600 dark:text-red-400 font-bold absolute -top-1 left-0">B</span>
           {lcmMultiplesB.current.slice(0, 8).map((m, i) => (
            <div key={`b-${i}`} className={`absolute top-0 w-3 h-3 rounded-full ${m === calcLcm(lh1, lh2) ? 'bg-yellow-400 ring-2 ring-yellow-500 z-10' : 'bg-red-400'}`}
              style={{ left: `${(m / (Math.max(...lcmMultiplesA.current.slice(0, 8), ...lcmMultiplesB.current.slice(0, 8)))) * 100}%` }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-mono">{m}</span>
            </div>
           ))}
          </div>
          {/* Sync marker */}
          <div className="absolute top-0 bottom-0 w-0.5 bg-yellow-500 z-20"
            style={{ left: `${(calcLcm(lh1, lh2) / (Math.max(...lcmMultiplesA.current.slice(0, 8), ...lcmMultiplesB.current.slice(0, 8)))) * 100}%` }}>
          </div>
         </div>
        </div>
       )}
       
       <p className="text-xs text-center text-slate-400 dark:text-[#71717a] mt-2">
        
                                                 {t('lab.m6factors_demo_auto_advances_click_anywh')}
                                                </p>
      </div>
     </div>
    )}

    {/* Controls */}
    <div className="flex justify-center gap-4 mb-8">
    <button 
     onClick={() => {if (!isPlaying) setLcmStartTime(Date.now()); setIsPlaying(!isPlaying);}}
     className="flex items-center gap-2 px-4 py-2 bg-[#121212] dark:bg-slate-200 text-white dark:text-slate-900 dark:text-white rounded-lg font-medium hover:bg-slate-700 dark:hover:bg-slate-300 transition-colors shadow-sm"
    >
     {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
     {isPlaying ? 'Pause' : 'Start Timeline'}
    </button>
    <button 
     onClick={() => {setTime(0); setIsPlaying(false);}}
     className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-[#ffffff] rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-[#1c1b1b] shadow-sm"
    >
     <RotateCcw className="w-5 h-5" />  {t('lab.m6factors_reset')}
                                     </button>
    </div>

    {/* Timer */}
    <div className="text-center mb-12">
    <div className="inline-block bg-[#121212] dark:bg-[#121212] text-white font-mono text-3xl px-6 py-3 rounded-xl border-4 border-[#1c1b1b] shadow-inner">
     
                                      {t('lab.m6factors_t')} {time}s
    </div>
    </div>

    {/* Lighthouses SVG */}
    <div className="flex-1 min-w-0 relative flex justify-center items-end pb-12">
    {/* Ground */}
    <div className="absolute bottom-0 w-full h-12 bg-[#121212] dark:bg-slate-950 rounded-t-full opacity-50 blur-sm"></div>
    <div className="absolute bottom-0 w-full h-8 bg-slate-700 dark:bg-[#121212] border-t border-slate-600"></div>

    <div className="flex justify-around w-full max-w-lg relative z-10">
     {/* Lighthouse A */}
     <div className="flex flex-col items-center">
     <div className="relative w-16 h-48 bg-gradient-to-t from-slate-300 to-white dark:from-slate-600 dark:to-slate-400 rounded-t-full shadow-lg overflow-hidden border-2 border-slate-400 dark:border-[#1c1b1b]">
      {/* Stripes */}
      <div className="w-full h-8 bg-blue-500 dark:bg-blue-700 mt-8 shadow-sm"></div>
      <div className="w-full h-8 bg-blue-500 dark:bg-blue-700 mt-8 shadow-sm"></div>
      <div className="w-full h-8 bg-blue-500 dark:bg-blue-700 mt-8 shadow-sm"></div>
     </div>
     {/* Light Bulb */}
     <div className={`absolute top-[-24px] w-24 h-24 rounded-full blur-xl transition-opacity duration-300 ${ time > 0 && time % lh1 === 0 ? 'bg-yellow-300 opacity-100' : 'bg-transparent opacity-0' }`}></div>
     <div className={`absolute top-[-16px] w-12 h-12 rounded-full z-10 border-2 border-slate-300 transition-colors duration-100 flex items-center justify-center ${ time > 0 && time % lh1 === 0 ? 'bg-yellow-100 shadow-[0_0_50px_rgba(253,224,71,1)]' : 'bg-slate-200 dark:bg-slate-700' }`}>
      <div className={`w-4 h-4 rounded-full ${time > 0 && time % lh1 === 0 ? 'bg-yellow-400' : 'bg-slate-400'}`}></div>
     </div>
     <span className="mt-4 font-bold text-blue-700 dark:text-blue-400 bg-blue-100/50 dark:bg-[#121212] px-3 py-1 rounded-full shadow-sm">{t('lab.m6factors_every')} {lh1}s</span>
     </div>

     {/* Lighthouse B */}
     <div className="flex flex-col items-center">
     <div className="relative w-16 h-48 bg-gradient-to-t from-slate-300 to-white dark:from-slate-600 dark:to-slate-400 rounded-t-full shadow-lg overflow-hidden border-2 border-slate-400 dark:border-[#1c1b1b]">
      {/* Stripes */}
      <div className="w-full h-8 bg-red-500 dark:bg-red-700 mt-8 shadow-sm"></div>
      <div className="w-full h-8 bg-red-500 dark:bg-red-700 mt-8 shadow-sm"></div>
      <div className="w-full h-8 bg-red-500 dark:bg-red-700 mt-8 shadow-sm"></div>
     </div>
     {/* Light Bulb */}
     <div className={`absolute top-[-24px] w-24 h-24 rounded-full blur-xl transition-opacity duration-300 ${ time > 0 && time % lh2 === 0 ? 'bg-yellow-300 opacity-100' : 'bg-transparent opacity-0' }`}></div>
     <div className={`absolute top-[-16px] w-12 h-12 rounded-full z-10 border-2 border-slate-300 transition-colors duration-100 flex items-center justify-center ${ time > 0 && time % lh2 === 0 ? 'bg-yellow-100 shadow-[0_0_50px_rgba(253,224,71,1)]' : 'bg-slate-200 dark:bg-slate-700' }`}>
      <div className={`w-4 h-4 rounded-full ${time > 0 && time % lh2 === 0 ? 'bg-yellow-400' : 'bg-slate-400'}`}></div>
     </div>
     <span className="mt-4 font-bold text-red-700 dark:text-red-400 bg-red-100/50 dark:bg-[#121212] px-3 py-1 rounded-full shadow-sm">{t('lab.m6factors_every')} {lh2}s</span>
     </div>
    </div>
    </div>

    {/* Timeline Ticks */}
    <div className="h-16 w-full flex items-end">
    <div className="w-full flex justify-between px-8 border-t-2 border-slate-300 dark:border-[#1c1b1b] pt-2 relative">
     {[...Array(11)].map((_, i) => (
     <div key={i} className="flex flex-col items-center">
      <div className="w-0.5 h-3 bg-slate-400 dark:bg-slate-50 dark:bg-[#000000]0 mb-1"></div>
      <span className="text-xs font-medium text-slate-500 dark:text-[#71717a]">{i * 6}</span>
     </div>
     ))}
     {/* Progress marker */}
     <div 
     className="absolute top-0 w-4 h-4 bg-indigo-500 border-2 border-white rounded-full -translate-y-2 shadow-md transition-all duration-300 ease-linear dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
     style={{ left: `calc(2rem + ((100% - 4rem) * ${Math.min(time, 60) / 60}))` }}
     />
    </div>
    </div>
   </div>
   ) : (
   <div className="flex flex-col h-full justify-center">
    {/* HCF Step-by-Step Demo Overlay */}
    {showHcfDemo && (
     <div className="absolute inset-0 z-20 bg-white dark:bg-[#121212] dark:border-[#1c1b1b]/95 dark:bg-[#121212]/95 p-6 flex flex-col overflow-y-auto" onClick={() => setShowHcfDemo(false)}>
      <div className="flex items-center justify-between mb-4" onClick={e => e.stopPropagation()}>
       <h3 className="text-lg font-bold flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
        <Lightbulb className="w-5 h-5" />  {t('lab.m6factors_how_pipe_cutting_works')}
                                                    </h3>
       <button onClick={() => setShowHcfDemo(false)} className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 px-2 py-1 rounded bg-slate-100 dark:bg-slate-700">{t('lab.m6factors_close')}</button>
      </div>
      
      <div className="flex-1 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
       {/* Step 1: Show pipe lengths */}
       {hcfDemoStep >= 1 && (
        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 animate-fadeIn">
         <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">
          
                                                               {t('lab.m6factors_1_we_have_two_pipes')} {pipe1}{t('lab.m6factors_m_and')} {pipe2}m
         </p>
         <div className="flex gap-4 items-center justify-center">
          <div className="h-6 bg-green-400 rounded" style={{ width: `${(pipe1/36)*200}px` }}></div>
          <span className="text-sm font-mono font-bold">{pipe1}m</span>
         </div>
         <div className="flex gap-4 items-center justify-center mt-2">
          <div className="h-6 bg-emerald-400 rounded" style={{ width: `${(pipe2/36)*200}px` }}></div>
          <span className="text-sm font-mono font-bold">{pipe2}m</span>
         </div>
        </div>
       )}

       {/* Step 2: List factors of each */}
       {hcfDemoStep >= 2 && (
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 animate-fadeIn">
         <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
          
                                                               {t('lab.m6factors_2_find_all_factors_of_each_pip')}
                                                              </p>
         <div className="space-y-2">
          <div>
           <span className="text-xs font-medium text-blue-700 dark:text-blue-400">{t('lab.m6factors_factors_of')} {pipe1}: </span>
           <span className="text-xs font-mono">{[...Array(pipe1)].map((_, i) => i + 1).filter(f => pipe1 % f === 0).join(', ')}</span>
          </div>
          <div>
           <span className="text-xs font-medium text-blue-700 dark:text-blue-400">{t('lab.m6factors_factors_of')} {pipe2}: </span>
           <span className="text-xs font-mono">{[...Array(pipe2)].map((_, i) => i + 1).filter(f => pipe2 % f === 0).join(', ')}</span>
          </div>
         </div>
        </div>
       )}

       {/* Step 3: Show common factors */}
       {hcfDemoStep >= 3 && (
        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 animate-fadeIn">
         <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">
          
                                                               {t('lab.m6factors_3_common_factors_divides_both_')}
                                                              </p>
         <div className="flex flex-wrap gap-2">
          {[...Array(Math.min(pipe1, pipe2))].map((_, i) => {
           const f = i + 1;
           const isCommon = pipe1 % f === 0 && pipe2 % f === 0;
           return isCommon ? (
            <span key={f} className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${f === gcd(pipe1, pipe2) ? 'bg-yellow-300 text-yellow-900 ring-2 ring-yellow-500 scale-110' : 'bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200'}`}>
             {f}
            </span>
           ) : null;
          })}
         </div>
        </div>
       )}

       {/* Step 4: Highlight HCF */}
       {hcfDemoStep >= 4 && (
        <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 animate-bounce-in text-center">
         <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
         <p className="text-sm font-bold text-yellow-800 dark:text-yellow-300">
          
                                                               {t('lab.m6factors_hcf')} {gcd(pipe1, pipe2)}m
         </p>
         <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
          
                                                               {t('lab.m6factors_cut_both_pipes_into')} {gcd(pipe1, pipe2)}{t('lab.m6factors_m_pieces_no_leftovers')}
                                                              </p>
         <p className="text-xs text-yellow-500 mt-1">
          
                                                               {t('lab.m6factors_pipe_a')} {pipe1 / gcd(pipe1, pipe2)}  {t('lab.m6factors_pieces_nbsp_nbsp_pipe_b')} {pipe2 / gcd(pipe1, pipe2)}  {t('lab.m6factors_pieces')}
                                                              </p>
        </div>
       )}
       
       <p className="text-xs text-center text-slate-400 dark:text-[#71717a] mt-2">
        
                                                     {t('lab.m6factors_demo_auto_advances_click_anywh')}
                                                    </p>
      </div>
     </div>
    )}

    <div className="flex-1 min-w-0 flex flex-col justify-center items-center gap-12 w-full max-w-2xl mx-auto">
    
    {/* Pipe 1 */}
    <div className="w-full">
     <div className="flex justify-between text-sm mb-2 font-bold text-green-700 dark:text-green-400">
     <span>{t('lab.m6factors_pipe_a_1')}</span>
     <span>{pipe1} m</span>
     </div>
     <div className="relative h-14 bg-green-500/10 dark:bg-green-500/5 rounded-r-xl border-2 border-l-0 border-green-500 rounded-l-md overflow-hidden shadow-inner">
     <div 
      className="absolute top-0 left-0 h-full bg-gradient-to-b from-green-400 to-green-600 transition-all duration-500 shadow-md border-y border-green-300"
      style={{ width: `${(pipe1 / 36) * 100}%` }}
     >
      {/* Sub-divisions if hcf is solved correctly */}
      {hcfFeedback.status === 'correct' && hcfInput && (
      <div className="w-full h-full flex">
       {[...Array(pipe1 / parseInt(hcfInput))].map((_, i) => (
       <div key={i} className="h-full border-r-2 border-green-800/40 dark:border-green-900/60 flex-1 flex items-center justify-center bg-white dark:bg-[#121212] dark:border-[#1c1b1b]/10 dark:bg-[#121212]">
        <span className="text-sm font-bold text-white drop-shadow-md">{hcfInput}</span>
       </div>
       ))}
      </div>
      )}
     </div>
     </div>
    </div>

    {/* Pipe 2 */}
    <div className="w-full">
     <div className="flex justify-between text-sm mb-2 font-bold text-emerald-700 dark:text-emerald-400">
     <span>{t('lab.m6factors_pipe_b')}</span>
     <span>{pipe2} m</span>
     </div>
     <div className="relative h-14 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-r-xl border-2 border-l-0 border-emerald-500 rounded-l-md overflow-hidden shadow-inner">
     <div 
      className="absolute top-0 left-0 h-full bg-gradient-to-b from-emerald-400 to-emerald-600 transition-all duration-500 shadow-md border-y border-emerald-300"
      style={{ width: `${(pipe2 / 36) * 100}%` }}
     >
      {/* Sub-divisions if hcf is solved correctly */}
      {hcfFeedback.status === 'correct' && hcfInput && (
      <div className="w-full h-full flex">
       {[...Array(pipe2 / parseInt(hcfInput))].map((_, i) => (
       <div key={i} className="h-full border-r-2 border-emerald-800/40 dark:border-emerald-900/60 flex-1 flex items-center justify-center bg-white dark:bg-[#121212] dark:border-[#1c1b1b]/10 dark:bg-[#121212]">
        <span className="text-sm font-bold text-white drop-shadow-md">{hcfInput}</span>
       </div>
       ))}
      </div>
      )}
     </div>
     </div>
    </div>

    {/* Ruler for reference */}
    <div className="w-full mt-8 bg-white dark:!bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
     <div className="flex justify-between w-full relative pt-2">
     <div className="absolute top-0 w-full border-t-2 border-slate-300 dark:border-[#1c1b1b]"></div>
     {[...Array(10)].map((_, i) => (
      <div key={i} className="flex flex-col items-center -mt-2">
      <div className="w-0.5 h-3 bg-slate-400 dark:bg-slate-50 dark:bg-[#000000]0 mb-2"></div>
      <span className="text-xs font-bold text-slate-500 dark:text-[#71717a]">{i * 4}</span>
      </div>
     ))}
     </div>
    </div>

    </div>
   </div>
   )}
  </div>

  </div>
 </div>
 );
}
