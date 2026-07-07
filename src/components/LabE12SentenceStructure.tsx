import { useState } from 'react';
import { Terminal, Code, CheckCircle, Bug, Scissors, Link, BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

export default function LabE12SentenceStructure({ onExit }: { onExit?: () => void }) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [activeMode, setActiveMode] = useState<'debugger' | 'analysis'>('debugger');

 // Debugger State
 const debuggingScenarios = [
  {
   buggy: "Running for the bus, [my book] fell in the mud.",
   modifier: "Running for the bus",
   targets: ["my book", "I"],
   correctTarget: "I",
   fixed: "Running for the bus, [I] dropped my book in the mud.",
   errorType: "Dangling Modifier"
  },
  {
   buggy: "She served sandwiches to the children [on paper plates].",
   modifier: "on paper plates",
   targets: ["the children", "sandwiches"],
   correctTarget: "sandwiches",
   fixed: "She served [sandwiches on paper plates] to the children.",
   errorType: "Misplaced Modifier"
  }
 ];
 
 const [debugIndex, setDebugIndex] = useState(0);
 const [spliced, setSpliced] = useState(false);
 const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

 const isFixed = selectedTarget === debuggingScenarios[debugIndex].correctTarget;

 const handleSplice = () => setSpliced(true);
 const handleAttach = (target: string) => {
  if (!spliced) return;
  setSelectedTarget(target);
 };

 const nextBug = () => {
  setDebugIndex(p => (p + 1) % debuggingScenarios.length);
  setSpliced(false);
  setSelectedTarget(null);
 };

 return (
  <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
   <LabHeader onExit={onExit} title={t('lab.e12sentencestructure_structural_architect_lab')} />

   
   {/* Mobile Tab Navigation */}
   <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
     onClick={() => setActiveMobileTab('theory')}
     className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
    >
     
                      {t('lab.e12sentencestructure_theory')}
                     </button>
   <button 
     onClick={() => setActiveMobileTab('lab')}
     className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
    >{t('lab.e12sentencestructure_lab')}</button>
  </div>
   
   <main className="flex-grow p-4 md:p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg:overflow-visible">
    {/* Window 1: Theory */}
    <section className={`w-full rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
     <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center">
      <BookOpen className="mr-2 text-indigo-500" />  {t('lab.e12sentencestructure_grammar_theory')}
                          </h2>
     <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-[500px] pr-2">
      <p>
       <strong>{t('lab.e12sentencestructure_modifiers')}</strong>  {t('lab.e12sentencestructure_must_be_placed_as_close_as_pos')}
                               </p>
      
      <h4 className="font-bold text-slate-800 dark:text-gray-200 mt-4">{t('lab.e12sentencestructure_misplaced_modifiers')}</h4>
      <p className="mt-2">{t('lab.e12sentencestructure_a_misplaced_modifier_is_placed')}</p>
      <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 p-3 rounded mt-2 flex-col `}>
       <span className="text-red-700 dark:text-red-400 font-bold block">{t('lab.e12sentencestructure_bug')}</span>
       
                                {t('lab.e12sentencestructure_she_served_sandwiches_to_the_c')} <em>{t('lab.e12sentencestructure_on_paper_plates')}</em>{t('lab.e12sentencestructure_are_the_children_on_paper_plat')}
                               </div>
      <div className={`bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 p-3 rounded mt-2 mb-4 flex-col `}>
       <span className="text-emerald-700 dark:text-emerald-400 font-bold block">{t('lab.e12sentencestructure_fix')}</span>
       
                                {t('lab.e12sentencestructure_she_served')} <em>{t('lab.e12sentencestructure_sandwiches_on_paper_plates')}</em>  {t('lab.e12sentencestructure_to_the_children')}
                               </div>

      <hr className="my-6 border-slate-200 dark:border-gray-800" />

      <h4 className="font-bold text-slate-800 dark:text-gray-200 mt-4">{t('lab.e12sentencestructure_dangling_modifiers')}</h4>
      <p className="mt-2">
       
                                {t('lab.e12sentencestructure_a_dangling_modifier_is_a_phras')}
                               </p>
      <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 p-3 rounded mt-2 flex-col `}>
       <span className="text-red-700 dark:text-red-400 font-bold block">{t('lab.e12sentencestructure_bug')}</span>
       "<em>{t('lab.e12sentencestructure_running_for_the_bus')}</em>{t('lab.e12sentencestructure_my_book_fell_was_the_book_runn')}
                               </div>
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 p-3 rounded mt-2">
       <span className="text-emerald-700 dark:text-emerald-400 font-bold block">{t('lab.e12sentencestructure_fix')}</span>
       "<em>{t('lab.e12sentencestructure_running_for_the_bus')}</em>, <strong>I</strong>  {t('lab.e12sentencestructure_dropped_my_book')}
                               </div>
     </div>
    </section>

    {/* Window 2: Controls */}
    <section className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex-col '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
     <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-6">
      <Terminal className="text-[#4158D1]" />  {t('lab.e12sentencestructure_syntax_debugger')}
                          </h2>

     <div className="flex-1 overflow-y-auto">
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 text-white shadow-xl">
       <h3 className="font-bold flex items-center gap-2 mb-4 text-red-400">
        <Bug className="w-5 h-5" />  {t('lab.e12sentencestructure_active_bug')} {debuggingScenarios[debugIndex].errorType}
       </h3>
       
       <div className="mb-6 p-4 bg-black rounded-lg font-mono text-sm border border-red-900/50">
        <span className="text-red-500">{t('lab.e12sentencestructure_error_line_42')} </span>
        <span className="text-gray-300">{debuggingScenarios[debugIndex].buggy}</span>
       </div>

       <div className="space-y-4">
        <div className="border border-slate-700 rounded-lg p-4 bg-slate-800">
         <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-3">{t('lab.e12sentencestructure_step_1_splice_modifier')}</p>
         <button 
          onClick={handleSplice}
          disabled={spliced}
          className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${spliced ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white shadow-lg'}`}
         >
          <Scissors className="w-5 h-5" /> {spliced ? 'Spliced' : `Splice: "${debuggingScenarios[debugIndex].modifier}"`}
         </button>
        </div>

        <div className={`border border-slate-700 rounded-lg p-4 transition-all duration-500 ${spliced ? 'bg-slate-800 opacity-100' : 'bg-slate-800/50 opacity-50 pointer-events-none'}`}>
         <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-3">{t('lab.e12sentencestructure_step_2_link_to_logical_target')}</p>
         <div className="grid grid-cols-2 gap-2">
          {debuggingScenarios[debugIndex].targets.map(target => (
           <button 
            key={target}
            onClick={() => handleAttach(target)}
            className={`p-3 rounded-lg font-bold flex items-center justify-center gap-2 border-2 transition-all ${selectedTarget === target ? (isFixed ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-red-500 bg-red-500/20 text-red-400') : 'border-slate-600 bg-slate-700 text-slate-300 hover:border-[#4158D1]'}`}
           >
            <Link className="w-4 h-4" /> {target}
           </button>
          ))}
         </div>
        </div>
       </div>

       {selectedTarget && (
        <div className={`mt-6 p-4 rounded-lg border flex flex-col items-center text-center ${isFixed ? 'bg-emerald-900/30 border-emerald-500' : 'bg-red-900/30 border-red-500'}`}>
         {isFixed ? (
          <>
           <CheckCircle className="w-8 h-8 text-emerald-500 mb-2" />
           <p className="text-emerald-400 font-bold">{t('lab.e12sentencestructure_compilation_successful')}</p>
           <p className="text-sm text-emerald-200 mt-2 font-mono">{t('lab.e12sentencestructure_output')} {debuggingScenarios[debugIndex].fixed}</p>
           <button 
            onClick={nextBug}
            className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
           >
            
                                                         {t('lab.e12sentencestructure_next_bug')}
                                                        </button>
          </>
         ) : (
          <>
           <Bug className="w-8 h-8 text-red-500 mb-2" />
           <p className="text-red-400 font-bold">{t('lab.e12sentencestructure_compilation_failed')}</p>
           <p className="text-sm text-red-300 mt-1">{t('lab.e12sentencestructure_illogical_target_selected')}</p>
          </>
         )}
        </div>
       )}
      </div>
     </div>
    </section>

    {/* Window 3: Simulation */}
    <section className={`w-full bg-[#0d1117] rounded-xl shadow-sm border border-[#30363d] relative flex items-center justify-center p-8 font-mono lg:min-h-[35vh] lg:min-h-[500px] flex-col  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
     <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

     <div className="w-full bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl overflow-hidden relative z-10">
      {/* IDE Header */}
      <div className="bg-[#0d1117] border-b border-[#30363d] p-3 flex items-center gap-2">
       <div className="w-3 h-3 rounded-full bg-red-500"></div>
       <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
       <div className="w-3 h-3 rounded-full bg-green-500"></div>
       <span className="ml-4 text-[#8b949e] text-xs">{t('lab.e12sentencestructure_syntax_debugger_js')}</span>
      </div>

      {/* IDE Content */}
      <div className="p-6 text-xs md:text-sm leading-relaxed overflow-x-auto">
       <div className="flex">
        <div className="text-[#484f58] pr-4 select-none text-right w-8 border-r border-[#30363d] mr-4">
         1<br/>2<br/>3<br/>4<br/>5<br/>6
        </div>
        <div className="text-[#c9d1d9] flex-1 min-w-max">
         <div><span className="text-[#ff7b72]">{t('lab.e12sentencestructure_function')}</span> <span className="text-[#d2a8ff]">{t('lab.e12sentencestructure_compilesentence')}</span>() {'{'}</div>
         <div className="pl-4 text-[#8b949e]">{t('lab.e12sentencestructure_validate_structural_integrity')}</div>
         <div className="pl-4">
          <span className="text-[#ff7b72]">{t('lab.e12sentencestructure_const')}</span>  {t('lab.e12sentencestructure_sentence')} 
                                               {isFixed ? (
           <span className="text-[#a5d6ff]"> "{debuggingScenarios[debugIndex].fixed}"</span>
          ) : (
           <span className={`transition-all duration-300 ${spliced ? 'text-[#ff7b72] line-through opacity-50' : 'text-[#a5d6ff]'}`}> "{debuggingScenarios[debugIndex].buggy}"</span>
          )};
         </div>
         
         {spliced && !isFixed && (
          <div className="pl-4 mt-2 animate-pulse">
           <span className="text-[#ff7b72]">{t('lab.e12sentencestructure_let')}</span> <span className="text-[#79c0ff]">{t('lab.e12sentencestructure_modifierblock')}</span> = <span className="bg-red-500/20 text-red-300 border border-red-500 rounded px-1">"{debuggingScenarios[debugIndex].modifier}"</span>;
           <span className="text-[#8b949e] ml-2">{t('lab.e12sentencestructure_awaiting_attachment')}</span>
          </div>
         )}

         <div className="pl-4 mt-2"><span className="text-[#ff7b72]">{t('lab.e12sentencestructure_return')}</span>  {t('lab.e12sentencestructure_sentence_1')}</div>
         <div>{'}'}</div>
        </div>
       </div>
      </div>

      {/* Console Output */}
      <div className="bg-[#0d1117] border-t border-[#30363d] p-4">
       <div className="flex items-center gap-2 mb-2 text-[#8b949e] text-xs">
        <Terminal className="w-4 h-4" />  {t('lab.e12sentencestructure_console')}
                                    </div>
       {isFixed ? (
        <p className="text-[#3fb950] font-bold">{t('lab.e12sentencestructure_gt_process_exited_with_code_0_')}</p>
       ) : selectedTarget && !isFixed ? (
        <p className="text-[#f85149] font-bold">{t('lab.e12sentencestructure_gt_uncaught_typeerror_dangling')}</p>
       ) : spliced ? (
        <p className="text-[#d2a8ff]">{t('lab.e12sentencestructure_gt_modifer_detached_in_memory_')}</p>
       ) : (
        <p className="text-[#f85149]">{t('lab.e12sentencestructure_gt_warning_linting_error_on_li')}</p>
       )}
      </div>
     </div>
    </section>
   </main>
  </div>
 );
}
