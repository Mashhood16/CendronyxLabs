import { useState, useEffect } from 'react';
import LabHeader from './LabHeader';
import { Clock, Search, Check, AlertCircle, FastForward } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { useTheme } from '../store';
import { useTranslate } from "../i18n";

// Data
const TENSES = [
 { id: 'past_perfect', name: 'Past Perfect', key: 'pastPerf', desc: 'Completed before another past action.', color: 'text-indigo-500', bg: 'bg-indigo-500', border: 'border-indigo-500' },
 { id: 'simple_past', name: 'Simple Past', key: 'past', desc: 'Completed in the past.', color: 'text-blue-500', bg: 'bg-blue-500', border: 'border-blue-500' },
 { id: 'past_continuous', name: 'Past Continuous', key: 'pastCont', desc: 'Ongoing in the past.', color: 'text-cyan-500', bg: 'bg-cyan-500', border: 'border-cyan-500' },
 { id: 'present_perfect', name: 'Present Perfect', key: 'presPerf', desc: 'Started in past, relevant now.', color: 'text-teal-500', bg: 'bg-teal-500', border: 'border-teal-500' }
] as const;

const VERBS = [
 { base: 'eat', past: 'ate', pastCont: ['was eating', 'were eating'], presPerf: ['has eaten', 'have eaten'], pastPerf: 'had eaten' },
 { base: 'travel', past: 'travelled', pastCont: ['was travelling', 'were travelling'], presPerf: ['has travelled', 'have travelled'], pastPerf: 'had travelled' },
 { base: 'write', past: 'wrote', pastCont: ['was writing', 'were writing'], presPerf: ['has written', 'have written'], pastPerf: 'had written' },
 { base: 'begin', past: 'began', pastCont: ['was beginning', 'were beginning'], presPerf: ['has begun', 'have begun'], pastPerf: 'had begun' }
];

const GERUND_TASKS = [
 {
 id: 1,
 sentence: "Reading books improves your vocabulary.",
 words: [
  { text: "Reading", isGerund: true },
  { text: "books", isGerund: false },
  { text: "improves", isGerund: false },
  { text: "your", isGerund: false },
  { text: "vocabulary.", isGerund: false },
 ]
 },
 {
 id: 2,
 sentence: "She was swimming in the pool.",
 words: [
  { text: "She", isGerund: false },
  { text: "was", isGerund: false },
  { text: "swimming", isGerund: false }, // Participle
  { text: "in", isGerund: false },
  { text: "the", isGerund: false },
  { text: "pool.", isGerund: false },
 ]
 },
 {
 id: 3,
 sentence: "His favorite hobby is painting.",
 words: [
  { text: "His", isGerund: false },
  { text: "favorite", isGerund: false },
  { text: "hobby", isGerund: false },
  { text: "is", isGerund: false },
  { text: "painting.", isGerund: true },
 ]
 }
];

export default function LabE6TensesPunctuation({ onExit }: { onExit?: () => void }) {
    const { t } = useTranslate();
 const { theme } = useTheme();
 const [activeTab, setActiveTab] = useState<'tenses' | 'gerunds'>('tenses');

 // Tenses State
 const [timelineIndex, setTimelineIndex] = useState(1);
 const [selectedVerbIdx, setSelectedVerbIdx] = useState(0);
 const [userConjugation, setUserConjugation] = useState("");
 const [conjFeedback, setConjFeedback] = useState<'success' | 'error' | null>(null);

 // Gerunds State
 const [activeSentenceIdx, setActiveSentenceIdx] = useState(0);
 const [selectedWords, setSelectedWords] = useState<number[]>([]);
 const [gerundFeedback, setGerundFeedback] = useState<'success' | 'error' | null>(null);

 // Reset feedback on changes
 useEffect(() => {
 setConjFeedback(null);
 setUserConjugation("");
 }, [timelineIndex, selectedVerbIdx]);

 useEffect(() => {
 setGerundFeedback(null);
 setSelectedWords([]);
 }, [activeSentenceIdx]);

 const handleCheckConjugation = () => {
 const targetTenseKey = TENSES[timelineIndex].key;
 const correctForms = VERBS[selectedVerbIdx][targetTenseKey];
 
 let isCorrect = false;
 const answer = userConjugation.trim().toLowerCase();
 
 if (Array.isArray(correctForms)) {
  isCorrect = correctForms.includes(answer);
 } else {
  isCorrect = correctForms === answer;
 }
 
 setConjFeedback(isCorrect ? 'success' : 'error');
 };

 const toggleWord = (idx: number) => {
 if (gerundFeedback === 'success') return;
 setSelectedWords(prev => 
  prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
 );
 };

 const handleCheckGerunds = () => {
 const task = GERUND_TASKS[activeSentenceIdx];
 const correctIndices = task.words.map((w, i) => w.isGerund ? i : -1).filter(i => i !== -1);
 
 // Check if arrays have same elements
 const isCorrect = selectedWords.length === correctIndices.length && 
      selectedWords.every(w => correctIndices.includes(w));
      
 setGerundFeedback(isCorrect ? 'success' : 'error');
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-900 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.e6tensespunctuation_tenses_punctuation_lab')} />

  <main className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden lg:overflow-y-auto">
  {/* Left Column: Interactive Controls */}
  <section className="w-full lg:w-1/3 flex flex-col border-r border-slate-200 dark:border-[#1c1b1b] lg:overflow-y-auto p-6">
   
   <div className="flex bg-slate-200 dark:bg-slate-700 p-1 rounded-lg mb-8 shrink-0">
   <button 
    onClick={() => setActiveTab('tenses')}
    className={`w-full py-2 text-sm font-bold rounded-md transition-all whitespace-nowrap flex-shrink-0 ${activeTab === 'tenses' ? ' shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-[#ffffff] hover:bg-slate-300 dark:hover:bg-slate-600'}`}
   >
    
                             {t('lab.e6tensespunctuation_time_machine_tenses')}
                            </button>
   <button 
    onClick={() => setActiveTab('gerunds')}
    className={`w-full py-2 text-sm font-bold rounded-md transition-all whitespace-nowrap flex-shrink-0 ${activeTab === 'gerunds' ? ' shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-[#ffffff] hover:bg-slate-300 dark:hover:bg-slate-600'}`}
   >
    
                             {t('lab.e6tensespunctuation_gerund_scanner')}
                            </button>
   </div>

   {activeTab === 'tenses' && (
   <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
    <div>
    <h2 className="text-lg font-semibold mb-2">{t('lab.e6tensespunctuation_configure_time_machine')}</h2>
    <p className="text-sm text-slate-600 dark:text-[#71717a]">
     
                                      {t('lab.e6tensespunctuation_select_a_base_verb_and_a_desti')}
                                     </p>
    </div>

    <div className="space-y-4">
    <label className="block text-sm font-bold text-slate-700 dark:text-[#a1a1aa]">{t('lab.e6tensespunctuation_1_base_verb')}</label>
    <div className="grid grid-cols-2 gap-2">
     {VERBS.map((v, i) => (
     <button
      key={v.base}
      onClick={() => setSelectedVerbIdx(i)}
      className={`py-2 px-3 rounded-lg border font-mono text-center transition-colors whitespace-nowrap flex-shrink-0 ${ selectedVerbIdx === i ? 'bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-400' : 'bg-slate-50 dark:bg-[#000000] border-slate-200 dark:border-[#1c1b1b] hover:bg-slate-100 dark:bg-[#121212] dark:border-[#1c1b1b] dark:hover:bg-slate-700' }`}
     >
      to {v.base}
     </button>
     ))}
    </div>
    </div>

    <div className="space-y-4">
    <label className="block text-sm font-bold text-slate-700 dark:text-[#a1a1aa] flex items-center justify-between">
     <span>{t('lab.e6tensespunctuation_2_target_timeline_tense')}</span>
     <span className={`text-xs px-2 py-1 rounded-full text-white ${TENSES[timelineIndex].bg}`}>
     {TENSES[timelineIndex].name}
     </span>
    </label>
    <input 
     type="range" 
     min="0" 
     max="3" 
     value={timelineIndex} 
     onChange={(e) => setTimelineIndex(parseInt(e.target.value))}
     className="w-full accent-blue-600"
    />
    <div className="flex justify-between text-xs text-slate-400">
     <span>{t('lab.e6tensespunctuation_distant_past')}</span>
     <span>{t('lab.e6tensespunctuation_recent')}</span>
    </div>
    </div>

    <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-[#1c1b1b]">
    <label className="block text-sm font-bold text-slate-700 dark:text-[#a1a1aa]">
     
                                      {t('lab.e6tensespunctuation_3_input_conjugation')}
                                     </label>
    <div className="flex gap-2">
     <input
     type="text"
     value={userConjugation}
     onChange={(e: ChangeEvent<HTMLInputElement>) => setUserConjugation(e.target.value)}
     placeholder={`e.g. ${VERBS[selectedVerbIdx].past}`}
     className="flex-1 min-w-0 border border-slate-300 dark:border-[#1c1b1b] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
     />
     <button
     onClick={handleCheckConjugation}
     className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 whitespace-nowrap flex-shrink-0 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
     >
     <Check className="w-4 h-4" />
     
                                          {t('lab.e6tensespunctuation_verify')}
                                          </button>
    </div>
    
    {conjFeedback === 'success' && (
     <div className="p-3 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-lg flex items-start gap-2">
     <Check className="w-5 h-5 shrink-0 mt-0.5" />
     <p className="text-sm">{t('lab.e6tensespunctuation_time_machine_charged_the_conju')}</p>
     </div>
    )}
    {conjFeedback === 'error' && (
     <div className="p-3 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-lg flex items-start gap-2">
     <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
     <p className="text-sm">{t('lab.e6tensespunctuation_incorrect_conjugation_check_yo')}</p>
     </div>
    )}
    </div>
   </div>
   )}

   {activeTab === 'gerunds' && (
   <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
    <div>
    <h2 className="text-lg font-semibold mb-2">{t('lab.e6tensespunctuation_gerund_scanner')}</h2>
    <p className="text-sm text-slate-600 dark:text-[#71717a]">
     A <strong>{t('lab.e6tensespunctuation_gerund')}</strong>  {t('lab.e6tensespunctuation_is_a_verb_ending_in')} <em>{t('lab.e6tensespunctuation_ing')}</em>  {t('lab.e6tensespunctuation_that_acts_as_a')} <strong>{t('lab.e6tensespunctuation_noun')}</strong>{t('lab.e6tensespunctuation_don_t_confuse_it_with_a_presen')}
                                     </p>
    </div>

    <div className="space-y-4">
    <div className="flex items-center justify-between">
     <h3 className="font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.e6tensespunctuation_task')} {activeSentenceIdx + 1} of {GERUND_TASKS.length}</h3>
     <button 
     onClick={() => setActiveSentenceIdx((prev) => (prev + 1) % GERUND_TASKS.length)}
     className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline whitespace-nowrap flex-shrink-0"
     >
     
                                          {t('lab.e6tensespunctuation_next_sentence')} <FastForward className="w-4 h-4" />
     </button>
    </div>
    
    <div className="p-4 bg-slate-100 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-xl">
     <p className="text-sm text-slate-500 mb-3">{t('lab.e6tensespunctuation_click_on_the_gerund_s_in_the_s')}</p>
     <div className="flex flex-wrap gap-2 text-lg">
     {GERUND_TASKS[activeSentenceIdx].words.map((w, idx) => (
      <button
      key={idx}
      onClick={() => toggleWord(idx)}
      className={`px-2 py-1 rounded transition-all whitespace-nowrap flex-shrink-0 ${ selectedWords.includes(idx) ? 'bg-emerald-500 text-white shadow-md' : ' hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-[#ffffff] border border-slate-300 dark:border-slate-600' }`}
      >
      {w.text}
      </button>
     ))}
     </div>
    </div>

    <button
     onClick={handleCheckGerunds}
     className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0 dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
    >
     <Search className="w-5 h-5" />
     
                                      {t('lab.e6tensespunctuation_scan_selection')}
                                     </button>

    {gerundFeedback === 'success' && (
     <div className="p-3 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-lg flex items-start gap-2">
     <Check className="w-5 h-5 shrink-0 mt-0.5" />
     <p className="text-sm">{t('lab.e6tensespunctuation_correct_you_identified_the_ger')}</p>
     </div>
    )}
    {gerundFeedback === 'error' && (
     <div className="p-3 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-lg flex items-start gap-2">
     <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
     <p className="text-sm">{t('lab.e6tensespunctuation_scan_failed_remember_a_gerund_')}</p>
     </div>
    )}
    </div>
   </div>
   )}
  </section>

  {/* Right Column: Simulation Canvas */}
  <section className="w-full lg:w-2/3 bg-slate-100 dark:bg-[#121212] p-6 flex flex-col items-center justify-center relative lg:overflow-y-auto">
   
   {activeTab === 'tenses' ? (
   <div className="relative w-full max-w-2xl aspect-square sm:aspect-video bg-slate-950 rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center border-4 border-[#1c1b1b]">
    
    {/* Dynamic Background based on Tense */}
    <div className={`absolute inset-0 opacity-30 transition-colors duration-1000 bg-gradient-to-br from-slate-900 ${TENSES[timelineIndex].bg}`}></div>
    
    {/* Grid lines */}
    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#ffffff22 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

    {/* Time Portal */}
    <div className={`relative w-48 h-48 md:w-64 md:h-64 rounded-full border-8 shadow-[0_0_60px_rgba(0,0,0,0.8)] flex items-center justify-center transition-all duration-1000 ${TENSES[timelineIndex].border} ${conjFeedback === 'success' ? 'scale-110' : 'scale-100'}`}>
    
    {/* Spinning rings */}
    <div className={`absolute inset-0 rounded-full border-4 border-t-transparent animate-spin ${TENSES[timelineIndex].border}`} style={{ animationDuration: '3s' }}></div>
    <div className={`absolute inset-2 rounded-full border-4 border-b-transparent animate-spin ${TENSES[timelineIndex].border}`} style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
    
    <Clock className={`w-16 h-16 md:w-24 md:h-24 ${TENSES[timelineIndex].color} ${conjFeedback === 'success' ? 'animate-bounce' : 'animate-pulse'}`} />
    
    <div className="absolute -bottom-8 bg-[#000000] text-white px-4 py-1 rounded-full text-sm font-bold whitespace-nowrap border border-[#1c1b1b] z-10">
     {TENSES[timelineIndex].name}
    </div>
    </div>

    {/* Readout Display */}
    <div className="mt-16 bg-black/60 border border-white/10 rounded-xl p-4 w-3/4 max-w-md backdrop-blur-md text-center z-10">
    <div className="text-xs text-slate-400 uppercase tracking-widest mb-2 font-mono">{t('lab.e6tensespunctuation_system_status')}</div>
    {conjFeedback === 'success' ? (
     <div className="text-xl md:text-2xl font-mono text-emerald-400">
     <span className="opacity-50 mr-2">{"=>"}</span>
     {userConjugation}
     </div>
    ) : (
     <div className="text-xl md:text-2xl font-mono text-slate-500">
     <span className="opacity-50 mr-2">{"=>"}</span>
     
                                              {t('lab.e6tensespunctuation_awaiting_conjugation')}
                                              </div>
    )}
    </div>
   </div>
   ) : (
   <div className="relative w-full max-w-2xl min-h-[400px] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center border-4 border-[#1c1b1b] p-8">
    
    <div className="absolute top-4 left-4 flex items-center gap-2">
     <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
     <span className="text-emerald-500 font-mono text-xs uppercase tracking-widest">{t('lab.e6tensespunctuation_scanner_ui_online')}</span>
    </div>

    <div className="w-full bg-[#000000]/80 border border-emerald-500/30 rounded-xl p-8 relative font-mono shadow-[0_0_30px_rgba(16,185,129,0.05)] backdrop-blur-sm">
     {/* Decorative corner markers */}
     <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-500 rounded-tl-sm"></div>
     <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-500 rounded-tr-sm"></div>
     <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-500 rounded-bl-sm"></div>
     <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-500 rounded-br-sm"></div>

     <div className="flex flex-wrap gap-x-3 gap-y-6 text-xl md:text-2xl justify-center leading-loose text-center mt-4">
     {GERUND_TASKS[activeSentenceIdx].words.map((w, idx) => {
      const isSelected = selectedWords.includes(idx);
      const isCorrectlyGuessed = gerundFeedback === 'success' && w.isGerund;
      
      return (
      <span 
       key={idx} 
       className={`relative px-2 py-1 rounded transition-all duration-300 ${ isCorrectlyGuessed ? 'text-emerald-300 font-bold' : isSelected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'text-emerald-500/60' }`}
      >
       {w.text}
       {isCorrectlyGuessed && (
       <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-emerald-400 font-bold tracking-widest uppercase">
        
                              {t('lab.e6tensespunctuation_gerund_1')}
                             </span>
       )}
      </span>
      );
     })}
     </div>
     
     {gerundFeedback === 'success' && (
      <div className="mt-12 text-center text-emerald-400 animate-pulse flex flex-col items-center gap-2">
      <Check className="w-8 h-8" />
      <span className="uppercase tracking-widest text-sm">{t('lab.e6tensespunctuation_target_identified')}</span>
      </div>
     )}
    </div>

   </div>
   )}
   
  </section>
  </main>
 </div>
 );
}
