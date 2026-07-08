import { useState, useEffect } from 'react';
import { Layers, ArrowLeft, ShieldAlert, CheckCircle, Target, Shield, AlertTriangle, Zap, BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

interface NounWord {
 id: number;
 word: string;
 type: 'Abstract' | 'Collective' | 'Proper' | 'Concrete' | 'Compound';
}

export default function LabE12NounsPronouns({ onExit }: { onExit?: () => void }) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [activeMode, setActiveMode] = useState<'sorter' | 'resolver'>('sorter');

 // CONVEYOR BELT SORTER STATE
 const [score, setScore] = useState(0);
 const [combo, setCombo] = useState(0);
 const [fallingWords, setFallingWords] = useState<(NounWord & { position: number })[]>([]);
 const [gameOver, setGameOver] = useState(false);
 
 const wordPool: NounWord[] = [
  { id: 1, word: 'Justice', type: 'Abstract' },
  { id: 2, word: 'Flock', type: 'Collective' },
  { id: 3, word: 'London', type: 'Proper' },
  { id: 4, word: 'Toothbrush', type: 'Compound' },
  { id: 5, word: 'Apple', type: 'Concrete' },
  { id: 6, word: 'Wisdom', type: 'Abstract' },
  { id: 7, word: 'Jury', type: 'Collective' },
  { id: 8, word: 'Einstein', type: 'Proper' },
  { id: 9, word: 'Keyboard', type: 'Compound' },
  { id: 10, word: 'Brick', type: 'Concrete' },
 ];

 const bins = ['Abstract', 'Collective', 'Proper', 'Concrete', 'Compound'];

 useEffect(() => {
  if (activeMode !== 'sorter' || gameOver) return;
  
  const spawnInterval = setInterval(() => {
   setFallingWords(prev => {
    if (prev.length > 5) return prev; // max 5 words at a time
    const randomWord = wordPool[Math.floor(Math.random() * wordPool.length)];
    return [...prev, { ...randomWord, position: 0, id: Date.now() + Math.random() }];
   });
  }, 2000);

  const dropInterval = setInterval(() => {
   setFallingWords(prev => {
    const newWords = prev.map(w => ({ ...w, position: w.position + 5 }));
    const dropped = newWords.find(w => w.position >= 100);
    if (dropped) {
     setCombo(0); // Reset combo if missed
    }
    return newWords.filter(w => w.position < 100);
   });
  }, 200);

  return () => {
   clearInterval(spawnInterval);
   clearInterval(dropInterval);
  };
 }, [activeMode, gameOver]);

 const handleSort = (binType: string) => {
  if (fallingWords.length === 0) return;
  
  const targetWord = fallingWords[0]; // sort the lowest word
  if (targetWord.type === binType) {
   setScore(s => s + 10 + (combo * 2));
   setCombo(c => c + 1);
  } else {
   setCombo(0);
  }
  setFallingWords(prev => prev.slice(1));
 };

 // ANTECEDENT RESOLVER STATE
 const resolverScenarios = [
  { sentence: "The committee reached ______ decision.", target: "its", incorrect: "their", reason: "Collective noun acting as a single unit takes singular pronoun." },
  { sentence: "Each of the students must bring ______ own lunch.", target: "his or her", incorrect: "their", reason: "'Each' is singular and requires a singular pronoun." },
  { sentence: "The director ______ approved the budget.", target: "himself", incorrect: "itself", reason: "Intensive pronoun used to emphasize the person." }
 ];
 const [resIndex, setResIndex] = useState(0);
 const [systemState, setSystemState] = useState<'stable' | 'shorted' | 'fixed'>('stable');

 const handleResolve = (choice: string) => {
  if (choice === resolverScenarios[resIndex].target) {
   setSystemState('fixed');
  } else {
   setSystemState('shorted');
  }
 };

 return (
  <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
   <LabHeader onExit={onExit} title={t('lab.e12nounspronouns_identity_matrix_lab')} />

   
   {/* Mobile Tab Navigation */}
   <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
     onClick={() => setActiveMobileTab('theory')}
     className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
    >
     
                      {t('lab.e12nounspronouns_theory')}
                     </button>
   <button 
     onClick={() => setActiveMobileTab('lab')}
     className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
    >{t('lab.e12nounspronouns_lab')}</button>
  </div>
   
   <main className="flex-grow p-4 md:p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg:overflow-visible">
    {/* Window 1: Theory */}
    <section className={`w-full rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
     <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center">
      <BookOpen className="mr-2 text-indigo-500" />  {t('lab.e12nounspronouns_grammar_theory')}
                          </h2>
     <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-[500px] pr-2">
      <p>
       <strong>{t('lab.e12nounspronouns_nouns')}</strong>  {t('lab.e12nounspronouns_are_the_structural_anchors_of_')}
                               </p>
      <h4 className="font-bold text-slate-800 dark:text-gray-200 mt-4">{t('lab.e12nounspronouns_noun_taxonomies')}</h4>
      <ul className="list-disc pl-5 space-y-2 mt-2">
       <li><strong>{t('lab.e12nounspronouns_abstract')}</strong>  {t('lab.e12nounspronouns_concepts_or_ideas_you_cannot_p')}</li>
       <li><strong>{t('lab.e12nounspronouns_collective')}</strong>  {t('lab.e12nounspronouns_a_word_referring_to_a_group_as')}</li>
       <li><strong>{t('lab.e12nounspronouns_proper')}</strong>  {t('lab.e12nounspronouns_specific_names_of_entities_alw')}</li>
       <li><strong>{t('lab.e12nounspronouns_concrete')}</strong>  {t('lab.e12nounspronouns_physical_objects_you_can_perce')}</li>
       <li><strong>{t('lab.e12nounspronouns_compound')}</strong>  {t('lab.e12nounspronouns_two_words_joined_to_create_a_n')}</li>
      </ul>

      <hr className="my-6 border-slate-200 dark:border-gray-800" />

      <h4 className="font-bold text-slate-800 dark:text-gray-200 mt-4">{t('lab.e12nounspronouns_pronoun_antecedents')}</h4>
      <p className="mt-2">
       
                                {t('lab.e12nounspronouns_pronouns_must_agree_with_their')}
                               </p>
      <ul className="list-disc pl-5 space-y-2 mt-2">
       <li><strong>{t('lab.e12nounspronouns_collective_agreement')}</strong>  {t('lab.e12nounspronouns_when_a_collective_noun_acts_as')} <em>{t('lab.e12nounspronouns_the_jury_reached')} <strong>{t('lab.e12nounspronouns_its')}</strong>  {t('lab.e12nounspronouns_verdict')}</em></li>
       <li><strong>{t('lab.e12nounspronouns_indefinite_pronouns')}</strong>  {t('lab.e12nounspronouns_words_like_each_everyone_and_s')}</li>
       <li><strong>{t('lab.e12nounspronouns_intensive_vs_reflexive')}</strong>  {t('lab.e12nounspronouns_intensive_pronouns_himself_its')}<em>{t('lab.e12nounspronouns_i_did_it_myself')}</em>{t('lab.e12nounspronouns_while_reflexive_pronouns_recei')}<em>{t('lab.e12nounspronouns_she_hurt_herself')}</em>).</li>
      </ul>
     </div>
    </section>

    {/* Window 2: Controls */}
    <section className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex-col '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
     <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-6">
      <Layers className="text-[#4158D1]" />  {t('lab.e12nounspronouns_system_controls')}
                          </h2>
     
     <div className="flex gap-2 mb-6">
      <button 
       onClick={() => setActiveMode('sorter')}
       className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeMode === 'sorter' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#2a2a2a] text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
      >
       
                                {t('lab.e12nounspronouns_noun_sorter')}
                               </button>
      <button 
       onClick={() => setActiveMode('resolver')}
       className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeMode === 'resolver' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#2a2a2a] text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
      >
       
                                {t('lab.e12nounspronouns_resolver')}
                               </button>
     </div>

     <div className="flex-1 overflow-y-auto">
      {activeMode === 'sorter' && (
       <div className="space-y-4">
        <div className={`p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 flex-col `}>
         <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
          <Target className="w-4 h-4" />  {t('lab.e12nounspronouns_telemetry')}
                                              </h3>
         <div className="grid grid-cols-2 gap-4">
          <div>
           <p className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider font-bold">{t('lab.e12nounspronouns_score')}</p>
           <p className="text-2xl font-black text-blue-900 dark:text-blue-200">{score}</p>
          </div>
          <div>
           <p className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider font-bold">{t('lab.e12nounspronouns_combo')}</p>
           <p className="text-2xl font-black text-orange-500">x{combo}</p>
          </div>
         </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-gray-400 italic">
         
                                          {t('lab.e12nounspronouns_watch_the_conveyor_belt_in_the')}
                                         </p>
        <div className="grid grid-cols-2 gap-3 mt-4">
         {bins.map(bin => (
          <button 
           key={bin}
           onClick={() => handleSort(bin)}
           className={`p-3 border-2 border-slate-300 dark:border-gray-700 hover:border-[#4158D1] dark:hover:border-[#4158D1] rounded-xl font-bold text-slate-700 dark:text-gray-300 transition-colors flex-col `}
          >
           {bin}
          </button>
         ))}
        </div>
       </div>
      )}

      {activeMode === 'resolver' && (
       <div className="space-y-6">
        <div className={`p-4 rounded-xl border ${systemState === 'shorted' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : systemState === 'fixed' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : ' border-slate-200 dark:border-[#2a2a2a]'} flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
         <h3 className={`font-bold flex items-center gap-2 mb-4 ${systemState === 'shorted' ? 'text-red-700 dark:text-red-400' : systemState === 'fixed' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-800 dark:text-white'}`}>
          {systemState === 'stable' && <Shield className="w-5 h-5 text-blue-500" />}
          {systemState === 'shorted' && <Zap className="w-5 h-5 text-red-500 animate-pulse" />}
          {systemState === 'fixed' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
          
                                               {t('lab.e12nounspronouns_system_status')} {systemState.toUpperCase()}
         </h3>
         
         <div className="text-lg font-medium leading-relaxed mb-6 dark:text-white">
          {resolverScenarios[resIndex].sentence.split('______').map((part, i, arr) => (
           <span key={i}>
            {part}
            {i < arr.length - 1 && (
             <span className={`inline-block border-b-4 px-4 font-bold mx-1 ${systemState === 'fixed' ? 'border-emerald-500 text-emerald-500' : systemState === 'shorted' ? 'border-red-500 text-red-500' : 'border-[#4158D1] text-[#4158D1] animate-pulse'}`}>
              {systemState === 'fixed' ? resolverScenarios[resIndex].target : systemState === 'shorted' ? resolverScenarios[resIndex].incorrect : '???'}
             </span>
            )}
           </span>
          ))}
         </div>

         {systemState === 'stable' && (
          <div className="flex gap-3">
           <button onClick={() => handleResolve(resolverScenarios[resIndex].incorrect)} className={`flex-1 p-3 bg-slate-50 dark:bg-[#2a2a2a] border border-slate-300 dark:border-gray-600 rounded-xl hover:bg-slate-200 dark:hover:bg-[#333] font-bold dark:text-white flex-col `}>
            {resolverScenarios[resIndex].incorrect}
           </button>
           <button onClick={() => handleResolve(resolverScenarios[resIndex].target)} className="flex-1 p-3 bg-slate-50 dark:bg-[#2a2a2a] border border-slate-300 dark:border-gray-600 rounded-xl hover:bg-slate-200 dark:hover:bg-[#333] font-bold dark:text-white">
            {resolverScenarios[resIndex].target}
           </button>
          </div>
         )}

         {systemState !== 'stable' && (
          <div className="mt-4">
           <p className={`text-sm mb-4 ${systemState === 'fixed' ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
            {resolverScenarios[resIndex].reason}
           </p>
           <button 
            onClick={() => { setResIndex(p => (p + 1) % resolverScenarios.length); setSystemState('stable'); }}
            className="w-full py-3 bg-[#4158D1] text-white font-bold rounded-xl hover:bg-[#5560F1]"
           >
            
                                                         {t('lab.e12nounspronouns_next_sequence')}
                                                        </button>
          </div>
         )}
        </div>
       </div>
      )}
     </div>
    </section>

    {/* Window 3: Simulation */}
    <section className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] relative items-center justify-center p-8 lg:min-h-[35vh] lg:min-h-[500px] flex-col '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
     {/* Background Grid */}
     <div className="absolute inset-0 opacity-10 dark:opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#4158D1 1px, transparent 1px), linear-gradient(90deg, #4158D1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
     
     {activeMode === 'sorter' && (
      <div className="relative w-full max-w-sm h-full max-h-[600px] border-4 border-slate-300 dark:border-[#1c1b1b] rounded-2xl overflow-hidden shadow-2xl">
       {/* Belt visual */}
       <div className="absolute inset-y-0 left-1/2 w-32 -ml-16 bg-slate-100 dark:bg-[#1a1a1a] border-l border-r border-slate-200 dark:border-[#222]" />
       
       {/* Falling Words */}
       {fallingWords.map(fw => (
        <div 
         key={fw.id}
         className="absolute left-1/2 -ml-14 w-28 text-center bg-[#4158D1] text-white py-2 rounded-lg font-bold text-sm shadow-md transition-all duration-200 ease-linear"
         style={{ top: `${fw.position}%` }}
        >
         {fw.word}
        </div>
       ))}

       {/* Scanner Zone */}
       <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#4158D1]/20 to-transparent pointer-events-none border-t border-[#4158D1]/30">
        <p className="text-center absolute bottom-2 w-full text-xs font-bold text-[#4158D1] uppercase tracking-widest">{t('lab.e12nounspronouns_scanner_active')}</p>
       </div>
      </div>
     )}

     {activeMode === 'resolver' && (
      <div className="relative text-center">
       {systemState === 'stable' && (
        <div className="w-48 h-48 mx-auto rounded-full border-4 border-blue-500/30 flex items-center justify-center relative animate-pulse">
         <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping" />
         <Layers className="w-20 h-20 text-blue-500" />
        </div>
       )}
       {systemState === 'shorted' && (
        <div className="w-48 h-48 mx-auto rounded-full border-4 border-red-500/30 flex items-center justify-center relative">
         <Zap className="w-20 h-20 text-red-500 animate-bounce" />
        </div>
       )}
       {systemState === 'fixed' && (
        <div className="w-48 h-48 mx-auto rounded-full border-4 border-emerald-500/30 flex items-center justify-center relative">
         <CheckCircle className="w-20 h-20 text-emerald-500" />
        </div>
       )}
       <h2 className={`mt-8 text-3xl font-black tracking-widest uppercase ${systemState === 'stable' ? 'text-slate-800 dark:text-white' : systemState === 'shorted' ? 'text-red-500' : 'text-emerald-500'}`}>
        {systemState === 'stable' ? 'Awaiting Input' : systemState === 'shorted' ? 'Syntax Error' : 'Structure Intact'}
       </h2>
      </div>
     )}
    </section>
   </main>
  </div>
 );
}
