import { useState, useEffect } from 'react';
import { RefreshCw, Calculator, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import MathText from './MathText';
import { useTranslate } from "../i18n";

export default function LabM11Permutations({ onExit }: { onExit?: () => void }) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 // State
 const [scenario, setScenario] = useState<'plates' | 'passwords' | 'circular'>('plates');
 
 // Scenario 1: Plates
 const [numLetters, setNumLetters] = useState(3);
 const [numDigits, setNumDigits] = useState(3);
 
 // Scenario 2: Passwords
 const [passLength, setPassLength] = useState(4);
 const [allowRepeats, setAllowRepeats] = useState(true);
 const [poolSize, setPoolSize] = useState(10); // e.g. digits 0-9
 
 // Scenario 3: Circular
 const [numPeople, setNumPeople] = useState(5);

 // Assessment
 const [q1Ans, setQ1Ans] = useState('');
 const [q2Ans, setQ2Ans] = useState('');
 const [feedback, setFeedback] = useState<{q1?: boolean, q2?: boolean}>({});

 const factorial = (n: number): number => {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
 };

 const nPr = (n: number, r: number): number => {
  if (r > n) return 0;
  return factorial(n) / factorial(n - r);
 };

 const platePermutations = Math.pow(26, numLetters) * Math.pow(10, numDigits);
 const passPermutations = allowRepeats ? Math.pow(poolSize, passLength) : nPr(poolSize, passLength);
 const circularPermutations = factorial(numPeople - 1);

 const checkAnswers = () => {
  const f = { ...feedback };
  if (scenario === 'plates') {
   f.q1 = q1Ans.trim() === '6760000';
   f.q2 = q2Ans.trim() === '3276000';
  } else if (scenario === 'passwords') {
   f.q1 = q1Ans.trim() === '1000';
   f.q2 = q2Ans.trim() === '720';
  } else {
   f.q1 = q1Ans.trim() === '120';
   f.q2 = q2Ans.trim() === '48';
  }
  setFeedback(f);
 };

 // Random plate generation
 const generatePlate = () => {
  let l = '';
  for (let i=0; i<numLetters; i++) l += String.fromCharCode(65 + Math.floor(Math.random() * 26));
  let d = '';
  for (let i=0; i<numDigits; i++) d += Math.floor(Math.random() * 10).toString();
  return `${l}-${d}`;
 };

 const [samplePlate, setSamplePlate] = useState(generatePlate());
 useEffect(() => {
  setSamplePlate(generatePlate());
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [numLetters, numDigits, scenario]);

 // Random pass generation
 const generatePass = () => {
  let p = '';
  let pool = Array.from({length: poolSize}, (_, i) => i.toString());
  for (let i=0; i<passLength; i++) {
   if (allowRepeats) {
    p += Math.floor(Math.random() * poolSize).toString();
   } else {
    if (pool.length === 0) break;
    const idx = Math.floor(Math.random() * pool.length);
    p += pool[idx];
    pool.splice(idx, 1);
   }
  }
  return p;
 };
 
 const [samplePass, setSamplePass] = useState(generatePass());
 useEffect(() => {
  setSamplePass(generatePass());
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [passLength, allowRepeats, poolSize, scenario]);


 return (
  <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
   <LabHeader onExit={onExit} title={t('lab.m11permutations_grade_11_permutations_lab')} />
   <div className="bg-[#121212] dark:bg-[#121212] text-white p-2 flex justify-end shrink-0">
    <div className="flex bg-slate-700 dark:bg-[#121212] rounded-lg p-1">
     <button onClick={() => { setScenario('plates'); setFeedback({}); setQ1Ans(''); setQ2Ans(''); }} className={`px-4 py-2 rounded-md ${scenario === 'plates' ? 'bg-blue-600 text-white' : 'text-slate-300'}`}>{t('lab.m11permutations_plates')}</button>
     <button onClick={() => { setScenario('passwords'); setFeedback({}); setQ1Ans(''); setQ2Ans(''); }} className={`px-4 py-2 rounded-md ${scenario === 'passwords' ? 'bg-blue-600 text-white' : 'text-slate-300'}`}>{t('lab.m11permutations_passwords')}</button>
     <button onClick={() => { setScenario('circular'); setFeedback({}); setQ1Ans(''); setQ2Ans(''); }} className={`px-4 py-2 rounded-md ${scenario === 'circular' ? 'bg-blue-600 text-white' : 'text-slate-300'}`}>{t('lab.m11permutations_circular')}</button>
    </div>
   </div>

   
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.m11permutations_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.m11permutations_lab')}</button>
  </div>
  <div className="flex flex-col lg:grid lg:grid-cols-3 lg:flex-1 lg: lg:overflow-visible">
    {/* Left Column: Theory */}
    <div className={`w-full p-6 bg-slate-50 dark:bg-[#121212] border-r border-slate-200 dark:border-[#1c1b1b] lg:overflow-y-auto flex-col gap-6 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
     <div>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.m11permutations_permutations')}</h2>
      <p className="text-slate-600 dark:text-[#a1a1aa] mb-4">{t('lab.m11permutations_a_permutation_is_an_arrangemen')}</p>
      
      <div className={`bg-blue-50 p-4 rounded-xl border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900 flex-col `}>
       <h3 className="font-semibold text-blue-900 mb-2 dark:text-[#ffffff]">{t('lab.m11permutations_fundamental_counting_principle')}</h3>
       <p className="text-sm text-blue-800 mb-2 dark:text-[#ffffff]"><MathText>{t('lab.m11permutations_if_one_event_can_occur_in_m_wa')}</MathText></p>
      </div>
     </div>

     {scenario === 'plates' && (
      <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
       <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.m11permutations_vehicle_number_plates')}</h3>
       <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-2">{t('lab.m11permutations_usually_formed_by_selecting_le')}</p>
       <p className="text-sm text-slate-600 dark:text-[#a1a1aa] font-mono bg-slate-50 dark:bg-[#121212] p-2 rounded border mt-2">
        <MathText>{"$$ Total = 26^L \\times 10^D $$"}</MathText>
       </p>
      </div>
     )}

     {scenario === 'passwords' && (
      <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
       <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.m11permutations_passwords_pins')}</h3>
       <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-2"><MathText>{t('lab.m11permutations_when_repetition_is_allowed')} {"$$ n^r $$"}</MathText></p>
       <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-2"><MathText>{t('lab.m11permutations_when_repetition_is_not_allowed')} {"$$ ^nP_r = \\frac{n!}{(n-r)!} $$"}</MathText></p>
      </div>
     )}

     {scenario === 'circular' && (
      <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
       <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.m11permutations_circular_permutations')}</h3>
       <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-2">{t('lab.m11permutations_arranging_objects_in_a_circle_')}</p>
       <p className="text-sm text-slate-600 dark:text-[#a1a1aa] font-mono bg-slate-50 dark:bg-[#121212] p-2 rounded border mt-2">
        
                                     {t('lab.m11permutations_formula')} <MathText>{"$$ (n-1)! $$"}</MathText>
       </p>
       <p className="text-xs text-slate-500 dark:text-[#71717a] mt-2"><MathText>{t('lab.m11permutations_this_is_because_fixing_one_per')}</MathText></p>
      </div>
     )}
    </div>

    {/* Middle Column: Interactive Simulator */}
    <div className="bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#121212] relative flex flex-col p-6 lg: ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b">
     <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-6 text-center">{t('lab.m11permutations_interactive_visualizer')}</h2>
     
     <div className="flex-1 min-w-0 flex flex-col items-center justify-center gap-8">
      {scenario === 'plates' && (
       <div className="w-full max-w-md flex flex-col items-center gap-6">
        <div className="bg-yellow-400 p-4 rounded-lg shadow-lg border-4 border-yellow-500 w-full text-center relative overflow-hidden dark:bg-yellow-500 dark:hover:bg-yellow-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-yellow-500/40">
         <div className="text-xs font-bold text-yellow-800 mb-1">{t('lab.m11permutations_virtual_state')}</div>
         <div className="text-4xl font-mono font-bold tracking-widest text-slate-900 dark:text-[#ffffff]">
          {samplePlate}
         </div>
         <div className="text-[10px] text-yellow-800 mt-1">{t('lab.m11permutations_the_permutation_state')}</div>
        </div>
        <button onClick={() => setSamplePlate(generatePlate())} className="flex items-center gap-2 bg-[#121212] dark:bg-[#121212] text-white px-4 py-2 rounded-lg hover:bg-slate-700 dark:bg-[#121212] transition-colors">
         <RefreshCw size={16} />  {t('lab.m11permutations_generate_random_plate')}
                                         </button>
        
        <div className={`w-full bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] mt-4 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
         <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-2">{t('lab.m11permutations_letters_a_z')} {numLetters}</label>
          <input type="range" min="1" max="4" value={numLetters} onChange={e => setNumLetters(parseInt(e.target.value))} className="w-full" />
         </div>
         <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-2">{t('lab.m11permutations_digits_0_9')} {numDigits}</label>
          <input type="range" min="1" max="6" value={numDigits} onChange={e => setNumDigits(parseInt(e.target.value))} className="w-full" />
         </div>
         <div className="bg-blue-50 p-3 rounded-lg flex items-center justify-between border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900">
          <span className="font-semibold text-blue-900 dark:text-[#ffffff]">{t('lab.m11permutations_total_possibilities')}</span>
          <span className="font-mono text-lg text-blue-800 dark:text-[#ffffff]">{platePermutations.toLocaleString()}</span>
         </div>
        </div>
       </div>
      )}

      {scenario === 'passwords' && (
       <div className="w-full max-w-md flex flex-col items-center gap-6">
        <div className="bg-[#000000] dark:!bg-[#121212] p-6 rounded-xl shadow-xl w-full text-center border-t-4 border-blue-500 relative">
         <ShieldCheck className="absolute top-4 right-4 text-slate-600 dark:text-[#a1a1aa]" size={24} />
         <div className="text-sm font-medium text-slate-400 mb-4">{t('lab.m11permutations_enter_password')}</div>
         <div className="flex justify-center gap-2 mb-4">
          {samplePass.split('').map((char, i) => (
           <div key={i} className="w-12 h-16 bg-[#121212] dark:bg-[#121212] border border-[#1c1b1b] dark:border-[#1c1b1b] rounded-lg flex items-center justify-center text-3xl font-mono text-white shadow-inner">
            {char}
           </div>
          ))}
         </div>
         <button onClick={() => setSamplePass(generatePass())} className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1 mx-auto">
          <RefreshCw size={14} />  {t('lab.m11permutations_generate_example')}
                                              </button>
        </div>

        <div className={`w-full bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] mt-4 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
         <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-2">{t('lab.m11permutations_character_pool_size')} {poolSize}</label>
          <input type="range" min="5" max="10" value={poolSize} onChange={e => setPoolSize(parseInt(e.target.value))} className="w-full" />
          <div className="flex justify-between text-xs text-slate-500 dark:text-[#71717a] px-1 mt-1"><span>{t('lab.m11permutations_5_digits')}</span><span>{t('lab.m11permutations_10_digits')}</span></div>
         </div>
         <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-2">{t('lab.m11permutations_password_length')} {passLength}</label>
          <input type="range" min="2" max={allowRepeats ? 8 : poolSize} value={passLength} onChange={e => setPassLength(parseInt(e.target.value))} className="w-full" />
         </div>
         <div className="mb-6 flex items-center gap-3">
          <input type="checkbox" id="allowRepeats" checked={allowRepeats} onChange={e => setAllowRepeats(e.target.checked)} className="w-5 h-5 text-blue-600 rounded" />
          <label htmlFor="allowRepeats" className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.m11permutations_allow_repetition')}</label>
         </div>
         <div className={`bg-indigo-50 p-3 rounded-lg flex flex-col gap-2 border border-indigo-100 dark:bg-[#121212] dark:border-[#1c1b1b] `}>
          <div className="flex items-center justify-between">
           <span className="font-semibold text-indigo-900 dark:text-[#ffffff]">{t('lab.m11permutations_total_permutations')}</span>
           <span className="font-mono text-lg text-indigo-800 dark:text-[#ffffff]">{passPermutations.toLocaleString()}</span>
          </div>
         </div>
        </div>
       </div>
      )}

      {scenario === 'circular' && (
       <div className="w-full max-w-md flex flex-col items-center gap-6">
        <div className="relative w-64 h-64 bg-amber-100 rounded-full border-8 border-amber-800 shadow-xl flex items-center justify-center">
         <div className="text-amber-900 font-bold opacity-30 text-2xl dark:text-[#ffffff]">{t('lab.m11permutations_table')}</div>
         {Array.from({length: numPeople}).map((_, i) => {
          const angle = (i * 360) / numPeople;
          const rad = angle * Math.PI / 180;
          const x = Math.cos(rad) * 110;
          const y = Math.sin(rad) * 110;
          return (
           <div key={i} 
             className="absolute w-10 h-10 bg-indigo-500 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white font-bold dark:bg-[#121212] dark:border-[#1c1b1b]"
             style={{ transform: `translate(${x}px, ${y}px)` }}>
            P{i+1}
           </div>
          );
         })}
        </div>

        <div className={`w-full bg-slate-50 dark:!bg-[#121212] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] mt-8 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
         <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 dark:text-[#ffffff] mb-2">{t('lab.m11permutations_number_of_people')} {numPeople}</label>
          <input type="range" min="3" max="10" value={numPeople} onChange={e => setNumPeople(parseInt(e.target.value))} className="w-full" />
         </div>
         <div className={`bg-emerald-50 p-3 rounded-lg flex flex-col gap-2 border border-emerald-100 `}>
          <div className="flex items-center justify-between">
           <span className="font-semibold text-emerald-900">{t('lab.m11permutations_unique_arrangements')}</span>
           <span className="font-mono text-lg text-emerald-800">{circularPermutations.toLocaleString()}</span>
          </div>
          <div className="text-xs text-emerald-700 font-mono">
           
                                                    {t('lab.m11permutations_calculation')}{numPeople} - 1)! = {numPeople - 1}!
          </div>
         </div>
        </div>
       </div>
      )}
     </div>
    </div>

    {/* Right Column: Assessment */}
    <div className={`p-6 bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] border-l border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
     <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-6 flex items-center gap-2">
      <Calculator className="text-blue-600" />  {t('lab.m11permutations_let_s_solve')}
                          </h2>

     <div className="space-y-6">
      {scenario === 'plates' && (
       <>
        <div className={`bg-slate-50 dark:bg-[#121212] p-5 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
         <p className="text-sm text-slate-700 dark:text-[#ffffff] mb-4 font-medium">{t('lab.m11permutations_q1_a_state_issues_plates_with_')}</p>
         <div className="flex items-center gap-3">
          <input type="text" value={q1Ans} onChange={e => setQ1Ans(e.target.value)} placeholder={t('lab.m11permutations_e_g_1000')} className={`flex-1 min-w-0 border border-slate-300 dark:border-[#1c1b1b] rounded-lg p-2 text-sm `} />
          {feedback.q1 === true && <CheckCircle2 className="text-green-500" size={24} />}
          {feedback.q1 === false && <XCircle className="text-red-500" size={24} />}
         </div>
        </div>
        <div className={`bg-slate-50 dark:bg-[#121212] p-5 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
         <p className="text-sm text-slate-700 dark:text-[#ffffff] mb-4 font-medium">{t('lab.m11permutations_q2_what_if_the_same_format_is_')}</p>
         <div className="flex items-center gap-3">
          <input type="text" value={q2Ans} onChange={e => setQ2Ans(e.target.value)} placeholder={t('lab.m11permutations_answer')} className="flex-1 min-w-0 border border-slate-300 dark:border-[#1c1b1b] rounded-lg p-2 text-sm" />
          {feedback.q2 === true && <CheckCircle2 className="text-green-500" size={24} />}
          {feedback.q2 === false && <XCircle className="text-red-500" size={24} />}
         </div>
         <p className="text-xs text-slate-500 dark:text-[#71717a] mt-2">{t('lab.m11permutations_hint_use_npr_for_both_letters_')}</p>
        </div>
       </>
      )}

      {scenario === 'passwords' && (
       <>
        <div className={`bg-slate-50 dark:bg-[#121212] p-5 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
         <p className="text-sm text-slate-700 dark:text-[#ffffff] mb-4 font-medium">{t('lab.m11permutations_q1_a_3_digit_lock_uses_numbers')}</p>
         <div className="flex items-center gap-3">
          <input type="text" value={q1Ans} onChange={e => setQ1Ans(e.target.value)} placeholder={t('lab.m11permutations_answer')} className="flex-1 min-w-0 border border-slate-300 dark:border-[#1c1b1b] rounded-lg p-2 text-sm" />
          {feedback.q1 === true && <CheckCircle2 className="text-green-500" size={24} />}
          {feedback.q1 === false && <XCircle className="text-red-500" size={24} />}
         </div>
        </div>
        <div className={`bg-slate-50 dark:bg-[#121212] p-5 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
         <p className="text-sm text-slate-700 dark:text-[#ffffff] mb-4 font-medium">{t('lab.m11permutations_q2_what_if_the_same_3_digit_lo')}</p>
         <div className="flex items-center gap-3">
          <input type="text" value={q2Ans} onChange={e => setQ2Ans(e.target.value)} placeholder={t('lab.m11permutations_answer')} className="flex-1 min-w-0 border border-slate-300 dark:border-[#1c1b1b] rounded-lg p-2 text-sm" />
          {feedback.q2 === true && <CheckCircle2 className="text-green-500" size={24} />}
          {feedback.q2 === false && <XCircle className="text-red-500" size={24} />}
         </div>
        </div>
       </>
      )}

      {scenario === 'circular' && (
       <>
        <div className={`bg-slate-50 dark:bg-[#121212] p-5 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
         <p className="text-sm text-slate-700 dark:text-[#ffffff] mb-4 font-medium">{t('lab.m11permutations_q1_in_how_many_ways_can_6_peop')}</p>
         <div className="flex items-center gap-3">
          <input type="text" value={q1Ans} onChange={e => setQ1Ans(e.target.value)} placeholder={t('lab.m11permutations_answer')} className="flex-1 min-w-0 border border-slate-300 dark:border-[#1c1b1b] rounded-lg p-2 text-sm" />
          {feedback.q1 === true && <CheckCircle2 className="text-green-500" size={24} />}
          {feedback.q1 === false && <XCircle className="text-red-500" size={24} />}
         </div>
        </div>
        <div className={`bg-slate-50 dark:bg-[#121212] p-5 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
         <p className="text-sm text-slate-700 dark:text-[#ffffff] mb-4 font-medium">{t('lab.m11permutations_q2_in_how_many_ways_can_6_peop')}</p>
         <div className="flex items-center gap-3">
          <input type="text" value={q2Ans} onChange={e => setQ2Ans(e.target.value)} placeholder={t('lab.m11permutations_answer')} className="flex-1 min-w-0 border border-slate-300 dark:border-[#1c1b1b] rounded-lg p-2 text-sm" />
          {feedback.q2 === true && <CheckCircle2 className="text-green-500" size={24} />}
          {feedback.q2 === false && <XCircle className="text-red-500" size={24} />}
         </div>
         <p className="text-xs text-slate-500 dark:text-[#71717a] mt-2">{t('lab.m11permutations_hint_treat_the_two_people_as_o')}</p>
        </div>
       </>
      )}

      <button onClick={checkAnswers} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md mt-4 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">
       
                                {t('lab.m11permutations_check_answers')}
                               </button>
     </div>
    </div>
   </div>
  </div>
 );
}
