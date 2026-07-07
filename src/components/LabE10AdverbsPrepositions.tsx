import { useState } from 'react';
import { BookOpen, Target, Navigation, ChevronRight } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabE10AdverbsPrepositionsProps {
 onExit?: () => void;
}

const ADVERB_PUZZLES = [
 {
 sentence: "She completed the challenging assignment ____.",
 options: ["yesterday (Time)", "quickly (Manner)", "there (Place)", "very (Degree)"],
 correctOptionIndex: 1,
 type: "Manner"
 },
 {
 sentence: "They search for the missing keys ____.",
 options: ["always (Frequency)", "everywhere (Place)", "yesterday (Time)", "extremely (Degree)"],
 correctOptionIndex: 1,
 type: "Place"
 },
 {
 sentence: "He has been working on the project ____ 8:00 AM.",
 options: ["for", "since", "in", "on"],
 correctOptionIndex: 1,
 type: "Preposition (Time)"
 }
];

const QUESTIONS = [
 {
 q: "Which word is an Adverb of Frequency?",
 options: ["Often", "Here", "Beautifully", "Soon"],
 correct: 0
 },
 {
 q: "Fill in the blank: I have lived in this city ____ five years.",
 options: ["since", "for", "from", "during"],
 correct: 1
 },
 {
 q: "Which sentence contains a Compound Preposition?",
 options: [
  "He hid under the bed.",
  "She sat next to her friend.",
  "They walked across the bridge.",
  "The cat jumped off the counter."
 ],
 correct: 1
 }
];

export default function LabE10AdverbsPrepositions({ onExit = () => {} }: LabE10AdverbsPrepositionsProps) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [currentPuzzle, setCurrentPuzzle] = useState(0);
 const [selectedOption, setSelectedOption] = useState<number | null>(null);
 const [puzzleAnswered, setPuzzleAnswered] = useState(false);

 const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
 const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

 const handlePuzzleSelect = (idx: number) => {
 if (puzzleAnswered) return;
 setSelectedOption(idx);
 setPuzzleAnswered(true);
 };

 const nextPuzzle = () => {
 setCurrentPuzzle((prev) => (prev + 1) % ADVERB_PUZZLES.length);
 setSelectedOption(null);
 setPuzzleAnswered(false);
 };

 const calculateScore = () => {
 let score = 0;
 QUESTIONS.forEach((q, idx) => {
  if (assessmentAnswers[idx] === q.correct) score++;
 });
 return score;
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans text-slate-900 dark:text-[#ffffff] overflow-hidden min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader title={t('lab.e10adverbsprepositions_unit_3_contextual_vectors_adve')} variant="dark" onExit={onExit} />
  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.e10adverbsprepositions_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.e10adverbsprepositions_lab')}</button>
  </div>

  <main className="flex-grow p-4 md:p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg: lg:overflow-visible">
  {/* Window 1: Theory */}
  <section className={`w-full rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col lg:h-full overflow- ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-3 mb-6 shrink-0">
   <div className={`p-2 bg-[#4158D1]/10 dark:bg-[#4158D1]/20 text-[#4158D1] dark:text-[#a1a1aa] rounded-lg flex-col `}>
    <BookOpen className="w-6 h-6" />
   </div>
   <h2 className="text-xl font-bold text-slate-900 dark:text-[#ffffff]">{t('lab.e10adverbsprepositions_contextual_vectors')}</h2>
   </div>
   
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-[500px] pr-2 custom-scrollbar">
   <h3 className="text-lg font-bold text-slate-900 dark:text-[#ffffff] mb-3">{t('lab.e10adverbsprepositions_adverbs_prepositions')}</h3>
   <p className="mb-4">{t('lab.e10adverbsprepositions_in_english_grammar_adverbs_and')} <strong>{t('lab.e10adverbsprepositions_contextual_vectors_1')}</strong>{t('lab.e10adverbsprepositions_they_provide_essential_directi')}</p>
   
   <h4 className="text-md font-bold text-slate-900 dark:text-[#ffffff] mt-6 mb-2">{t('lab.e10adverbsprepositions_1_the_role_of_adverbs')}</h4>
   <p className="mb-2">{t('lab.e10adverbsprepositions_adverbs_modify_verbs_adjective')} <em>{t('lab.e10adverbsprepositions_how')}</em>, <em>{t('lab.e10adverbsprepositions_when')}</em>, <em>{t('lab.e10adverbsprepositions_where')}</em>{t('lab.e10adverbsprepositions_and')} <em>{t('lab.e10adverbsprepositions_to_what_extent')}</em>.</p>
   <ul className="list-disc pl-5 space-y-2 mb-6">
    <li><strong>{t('lab.e10adverbsprepositions_adverbs_of_manner')}</strong>  {t('lab.e10adverbsprepositions_describe_how_something_is_done')} <em>{t('lab.e10adverbsprepositions_ly')}</em>{t('lab.e10adverbsprepositions_e_g')} <em>{t('lab.e10adverbsprepositions_the_algorithm_processed_the_da')} <strong>{t('lab.e10adverbsprepositions_quickly')}</strong>.</em>)</li>
    <li><strong>{t('lab.e10adverbsprepositions_adverbs_of_time')}</strong>  {t('lab.e10adverbsprepositions_specify_when_an_action_occurs_')} <em>{t('lab.e10adverbsprepositions_the_system_will_update')} <strong>{t('lab.e10adverbsprepositions_tomorrow')}</strong>.</em>)</li>
    <li><strong>{t('lab.e10adverbsprepositions_adverbs_of_place')}</strong>  {t('lab.e10adverbsprepositions_indicate_where_an_action_takes')} <em>{t('lab.e10adverbsprepositions_the_errors_were_found')} <strong>{t('lab.e10adverbsprepositions_everywhere')}</strong>.</em>)</li>
    <li><strong>{t('lab.e10adverbsprepositions_adverbs_of_frequency')}</strong>  {t('lab.e10adverbsprepositions_explain_how_often_an_event_hap')} <em>{t('lab.e10adverbsprepositions_the_cron_job')} <strong>{t('lab.e10adverbsprepositions_always')}</strong>  {t('lab.e10adverbsprepositions_runs_at_midnight')}</em>)</li>
    <li><strong>{t('lab.e10adverbsprepositions_adverbs_of_degree')}</strong>  {t('lab.e10adverbsprepositions_express_the_intensity_or_magni')} <em>{t('lab.e10adverbsprepositions_the_latency_was')} <strong>{t('lab.e10adverbsprepositions_extremely')}</strong>  {t('lab.e10adverbsprepositions_high')}</em>)</li>
   </ul>

   <h4 className="text-md font-bold text-slate-900 dark:text-[#ffffff] mt-6 mb-2">{t('lab.e10adverbsprepositions_2_prepositions_of_time_movemen')}</h4>
   <p className="mb-2">{t('lab.e10adverbsprepositions_prepositions_establish_relatio')}</p>
   <ul className="list-disc pl-5 space-y-2 mb-4">
    <li><strong>{t('lab.e10adverbsprepositions_since_vs_for_time_vectors')}</strong>
    <ul className="list-circle pl-5 mt-2 space-y-2">
     <li>{t('lab.e10adverbsprepositions_use')} <strong>{t('lab.e10adverbsprepositions_since')}</strong>  {t('lab.e10adverbsprepositions_to_point_to_a_specific_startin')} <em>{t('lab.e10adverbsprepositions_example_we_have_been_tracking_')} <strong>2023</strong>.</em></li>
     <li>{t('lab.e10adverbsprepositions_use')} <strong>{t('lab.e10adverbsprepositions_for')}</strong>  {t('lab.e10adverbsprepositions_to_measure_the_duration_or_ext')} <em>{t('lab.e10adverbsprepositions_example_the_server_was_down_fo')} <strong>{t('lab.e10adverbsprepositions_five_hours')}</strong>.</em></li>
    </ul>
    </li>
    <li><strong>{t('lab.e10adverbsprepositions_directional_movement')}</strong>  {t('lab.e10adverbsprepositions_prepositions_like')} <em>{t('lab.e10adverbsprepositions_towards_through_across')}</em>  {t('lab.e10adverbsprepositions_and_1')} <em>{t('lab.e10adverbsprepositions_into')}</em>  {t('lab.e10adverbsprepositions_represent_literal_movement_alo')}</li>
    <li><strong>{t('lab.e10adverbsprepositions_compound_prepositions')}</strong>  {t('lab.e10adverbsprepositions_multi_word_phrases_that_functi')} <em>{t('lab.e10adverbsprepositions_in_front_of')}</em>, <em>{t('lab.e10adverbsprepositions_next_to')}</em>, <em>{t('lab.e10adverbsprepositions_because_of')}</em>{t('lab.e10adverbsprepositions_they_offer_precise_locational_')}</li>
   </ul>
   </div>
  </section>

  {/* Window 2: Controls */}
  <section className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex-col lg:h-full '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-3 mb-6 shrink-0">
   <div className={`p-2 bg-[#4158D1]/10 dark:bg-[#4158D1]/20 text-[#4158D1] dark:text-[#a1a1aa] rounded-lg flex-col `}>
    <Navigation className="w-6 h-6" />
   </div>
   <h2 className="text-xl font-bold text-slate-900 dark:text-[#ffffff]">{t('lab.e10adverbsprepositions_vector_simulator')}</h2>
   </div>
   
   <div className="flex-1 flex flex-col space-y-6 overflow-y-auto pr-2 custom-scrollbar">
   <div className={`/50 p-6 rounded-xl border border-slate-200 dark:border-[#2a2a2a] shadow-sm flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <div className="flex justify-between items-center mb-6">
    <span className="text-sm font-bold uppercase tracking-wider text-[#4158D1] dark:text-[#a1a1aa]">
     
                                      {t('lab.e10adverbsprepositions_puzzle')} {currentPuzzle + 1} of {ADVERB_PUZZLES.length}
    </span>
    <span className="text-xs font-bold text-slate-600 dark:text-[#71717a] bg-slate-100 dark:bg-[#2a2a2a] px-3 py-1.5 rounded-full">
     {ADVERB_PUZZLES[currentPuzzle].type}
    </span>
    </div>
    
    <p className="text-xl font-medium text-slate-900 dark:text-[#ffffff] text-center py-8 leading-relaxed">
    {ADVERB_PUZZLES[currentPuzzle].sentence.split('____').map((part, i, arr) => (
     <span key={i}>
     {part}
     {i < arr.length - 1 && (
      <span className={`inline-block min-w-[140px] border-b-2 px-4 mx-2 text-center transition-colors ${ puzzleAnswered ? selectedOption === ADVERB_PUZZLES[currentPuzzle].correctOptionIndex ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-rose-500 text-rose-600 dark:text-rose-400' : 'border-[#4158D1] text-slate-400 border-dashed' }`}>
      {puzzleAnswered ? ADVERB_PUZZLES[currentPuzzle].options[selectedOption!] : '?'}
      </span>
     )}
     </span>
    ))}
    </p>
   </div>

   <div className="grid grid-cols-1 gap-3 mt-auto">
    {ADVERB_PUZZLES[currentPuzzle].options.map((opt, idx) => (
    <button
     key={idx}
     onClick={() => handlePuzzleSelect(idx)}
     disabled={puzzleAnswered}
     className={`p-4 rounded-xl text-left text-sm font-bold transition-all border-2 ${ !puzzleAnswered ? 'border-slate-200 dark:border-[#2a2a2a] hover:border-[#4158D1] hover:bg-[#4158D1]/5 dark:hover:bg-[#4158D1]/20 text-slate-700 dark:text-[#a1a1aa]' : idx === ADVERB_PUZZLES[currentPuzzle].correctOptionIndex ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : idx === selectedOption ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400' : 'border-slate-200 dark:border-[#2a2a2a] opacity-50 text-slate-500 dark:text-[#71717a]' }`}
    >
     <span className="flex items-center justify-between">
     {opt}
     {puzzleAnswered && idx === ADVERB_PUZZLES[currentPuzzle].correctOptionIndex && (
      <span className="text-emerald-500">{t('lab.e10adverbsprepositions_correct')}</span>
     )}
     </span>
    </button>
    ))}
   </div>

   {puzzleAnswered && (
    <div className="flex justify-end pt-2">
    <button
     onClick={nextPuzzle}
     className="flex items-center gap-2 px-6 py-3 bg-[#4158D1] hover:bg-[#3142a3] text-white rounded-lg font-bold transition-colors shadow-md w-full justify-center"
    >
     
                                      {t('lab.e10adverbsprepositions_next_puzzle')} <ChevronRight className="w-5 h-5" />
    </button>
    </div>
   )}
   </div>
  </section>

  {/* Window 3: Simulation */}
  <section className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] relative items-center justify-center p-8 lg:min-h-[35vh] lg:min-h-[500px] lg:h-full flex-col '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   {/* Subtle background pattern */}
   <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4158D1_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

   <div className={`w-full max-w-md rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] p-6 flex-col max-h-[100%] overflow-y-auto custom-scrollbar relative z-10 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-[#2a2a2a] shrink-0">
    <div className="p-2 bg-[#4158D1]/10 dark:bg-[#4158D1]/20 text-[#4158D1] dark:text-[#a1a1aa] rounded-lg">
    <Target className="w-6 h-6" />
    </div>
    <h2 className="text-xl font-bold text-slate-900 dark:text-[#ffffff]">{t('lab.e10adverbsprepositions_knowledge_check')}</h2>
   </div>

   <div className="flex-1">
    {!assessmentSubmitted ? (
    <div className="space-y-6">
     {QUESTIONS.map((q, qIdx) => (
     <div key={qIdx} className="space-y-3 bg-slate-50 dark:bg-[#1c1b1b] p-4 rounded-lg border border-slate-100 dark:border-[#2a2a2a]">
      <p className="text-sm font-medium text-slate-800 dark:text-[#ffffff]">
      {qIdx + 1}. {q.q}
      </p>
      <div className="space-y-2 mt-3">
      {q.options.map((opt, oIdx) => (
       <label key={oIdx} className="flex items-start gap-3 cursor-pointer group p-2 hover:bg-white dark:hover:bg-[#2a2a2a] rounded transition-colors">
       <input
        type="radio"
        name={`question-${qIdx}`}
        className="mt-1 w-4 h-4 text-[#4158D1] focus:ring-[#4158D1] bg-slate-100 dark:bg-[#0a0a0a] border-slate-300 dark:border-[#2a2a2a]"
        checked={assessmentAnswers[qIdx] === oIdx}
        onChange={() => setAssessmentAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
       />
       <span className="text-sm text-slate-700 dark:text-[#a1a1aa] group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
        {opt}
       </span>
       </label>
      ))}
      </div>
     </div>
     ))}
     <button
     onClick={() => setAssessmentSubmitted(true)}
     disabled={Object.keys(assessmentAnswers).length < QUESTIONS.length}
     className="w-full mt-6 py-3 px-4 bg-[#4158D1] hover:bg-[#3142a3] disabled:bg-slate-300 disabled:dark:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-lg font-bold transition-all shadow-md"
     >
     
                                          {t('lab.e10adverbsprepositions_submit_evaluation')}
                                          </button>
    </div>
    ) : (
    <div className="text-center py-8">
     <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#4158D1]/10 dark:bg-[#4158D1]/20 text-[#4158D1] dark:text-emerald-400 mb-6 shadow-inner">
     <span className="text-4xl font-bold">{calculateScore()}/{QUESTIONS.length}</span>
     </div>
     <h3 className="text-xl font-bold text-slate-900 dark:text-[#ffffff] mb-3">{t('lab.e10adverbsprepositions_assessment_complete')}</h3>
     <p className="text-slate-600 dark:text-[#a1a1aa] mb-8 leading-relaxed">
     {calculateScore() === QUESTIONS.length 
      ? "Perfect score! You've mastered contextual vectors (adverbs and prepositions)." 
      : "Good effort! Review the theory on since/for and adverb types to improve."}
     </p>
     <button
     onClick={() => {
      setAssessmentSubmitted(false);
      setAssessmentAnswers({});
     }}
     className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-100 dark:bg-[#1c1b1b] hover:bg-slate-200 dark:hover:bg-[#2a2a2a] text-slate-700 dark:text-[#ffffff] rounded-lg font-bold transition-colors border border-slate-200 dark:border-[#2a2a2a]"
     >
     
                                              {t('lab.e10adverbsprepositions_retry_lab')}
                                              </button>
    </div>
    )}
   </div>
   </div>
  </section>
  </main>
 </div>
 );
}
