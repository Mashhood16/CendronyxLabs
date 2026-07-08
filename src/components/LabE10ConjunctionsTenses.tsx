import { useState } from 'react';
import { BookOpen, Target, Clock, Settings, Activity } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

interface LabE10ConjunctionsTensesProps {
 onExit?: () => void;
}

const TENSES_TIMELINE = [
 { tense: 'Past Perfect', sentence: 'He had finished the report.' },
 { tense: 'Past Continuous', sentence: 'He was finishing the report.' },
 { tense: 'Past Indefinite', sentence: 'He finished the report.' },
 { tense: 'Present Perfect', sentence: 'He has finished the report.' },
 { tense: 'Present Continuous', sentence: 'He is finishing the report.' },
 { tense: 'Present Indefinite', sentence: 'He finishes the report.' },
 { tense: 'Future Indefinite', sentence: 'He will finish the report.' }
];

export default function LabE10ConjunctionsTenses({ onExit = () => {} }: LabE10ConjunctionsTensesProps) {
    const { t } = useTranslate();
 const [timelineIndex, setTimelineIndex] = useState(5); // Default to Present Indefinite
 
 const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
 const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const questions = [
 {
  q: "Which pair is a Correlative Conjunction?",
  options: ["Although / Yet", "Either / Or", "Because / So", "If / Then"],
  correct: 1
 },
 {
  q: "Identify the tense: 'They have been playing for two hours.'",
  options: [
  "Present Perfect",
  "Present Continuous",
  "Present Perfect Continuous",
  "Past Continuous"
  ],
  correct: 2
 },
 {
  q: "Which conjunction shows Concession?",
  options: ["Because", "Although", "When", "If"],
  correct: 1
 }
 ];

 const calculateScore = () => {
 let score = 0;
 questions.forEach((q, idx) => {
  if (assessmentAnswers[idx] === q.correct) score++;
 });
 return score;
 };

 return (
 <div className="min-min- lg: flex flex-col bg-slate-50 dark:!bg-[#000000] font-sans text-slate-900 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader title={t('lab.e10conjunctionstenses_unit_4_chronology_connections')} variant="dark" onExit={onExit} />

  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
   onClick={() => setActiveMobileTab('theory')}
   className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
  >
   
                    {t('lab.e10conjunctionstenses_theory')}
                   </button>
   <button 
   onClick={() => setActiveMobileTab('lab')}
   className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
  >{t('lab.e10conjunctionstenses_lab')}</button>
  </div>

  <main className="flex-grow p-4 md:p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg:overflow-visible">
  
  {/* Window 1: Theory */}
  <section className={`w-full rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200 dark:border-[#2a2a2a]">
   <BookOpen className="w-5 h-5 text-[#4158D1]" />
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.e10conjunctionstenses_grammar_theory')}</h2>
   </div>
   
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-[500px] pr-2">
   <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mt-2 mb-2">{t('lab.e10conjunctionstenses_1_conjunctions')}</h3>
   <p>{t('lab.e10conjunctionstenses_conjunctions_are_words_that_co')}</p>
   
   <h4 className="font-semibold text-slate-800 dark:text-[#ffffff] mt-4">{t('lab.e10conjunctionstenses_coordinating_conjunctions')}</h4>
   <p>{t('lab.e10conjunctionstenses_these_join_elements_of_equal_g')} <strong>{t('lab.e10conjunctionstenses_fanboys')}</strong>{t('lab.e10conjunctionstenses_for_and_nor_but_or_yet_so')}</p>
   <ul className="list-disc pl-5 space-y-1 mb-4">
    <li><strong>{t('lab.e10conjunctionstenses_and')}</strong>  {t('lab.e10conjunctionstenses_adds_information_e_g_i_like_ap')} <em>{t('lab.e10conjunctionstenses_and_1')}</em>  {t('lab.e10conjunctionstenses_oranges')}</li>
    <li><strong>{t('lab.e10conjunctionstenses_but')}</strong>  {t('lab.e10conjunctionstenses_shows_contrast_e_g_it_is_raini')} <em>{t('lab.e10conjunctionstenses_but_1')}</em>  {t('lab.e10conjunctionstenses_we_will_go')}</li>
   </ul>

   <h4 className="font-semibold text-slate-800 dark:text-[#ffffff] mt-4">{t('lab.e10conjunctionstenses_correlative_conjunctions')}</h4>
   <p>{t('lab.e10conjunctionstenses_these_work_in_pairs_to_join_eq')}</p>
   <ul className="list-disc pl-5 space-y-1 mb-4">
    <li><em>{t('lab.e10conjunctionstenses_either_or')}</em>  {t('lab.e10conjunctionstenses_offers_a_choice_between_two_op')}</li>
    <li><em>{t('lab.e10conjunctionstenses_neither_nor')}</em>  {t('lab.e10conjunctionstenses_negates_both_options')}</li>
    <li><em>{t('lab.e10conjunctionstenses_not_only_but_also')}</em>  {t('lab.e10conjunctionstenses_emphasizes_addition')}</li>
   </ul>
   
   <h4 className="font-semibold text-slate-800 dark:text-[#ffffff] mt-4">{t('lab.e10conjunctionstenses_subordinating_conjunctions')}</h4>
   <p>{t('lab.e10conjunctionstenses_these_introduce_dependent_clau')}</p>
   <ul className="list-disc pl-5 space-y-1 mb-4">
    <li><strong>{t('lab.e10conjunctionstenses_reason')}</strong>  {t('lab.e10conjunctionstenses_because_since_as_e_g_we_stayed')} <em>{t('lab.e10conjunctionstenses_because')}</em>  {t('lab.e10conjunctionstenses_it_was_raining')}</li>
    <li><strong>{t('lab.e10conjunctionstenses_concession')}</strong>  {t('lab.e10conjunctionstenses_although_though_even_though_e_')}<em>{t('lab.e10conjunctionstenses_although')}</em>  {t('lab.e10conjunctionstenses_it_was_late_he_kept_working')}</li>
    <li><strong>{t('lab.e10conjunctionstenses_condition')}</strong>  {t('lab.e10conjunctionstenses_if_unless_provided_that_e_g_yo')} <em>{t('lab.e10conjunctionstenses_unless')}</em>  {t('lab.e10conjunctionstenses_you_study')}</li>
    <li><strong>{t('lab.e10conjunctionstenses_time')}</strong>  {t('lab.e10conjunctionstenses_when_while_before_after_e_g_ca')} <em>{t('lab.e10conjunctionstenses_when')}</em>  {t('lab.e10conjunctionstenses_you_arrive')}</li>
   </ul>

   <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mt-8 mb-2">{t('lab.e10conjunctionstenses_2_tenses')}</h3>
   <p>{t('lab.e10conjunctionstenses_tenses_indicate_the_time_of_an')}</p>

   <h4 className="font-semibold text-slate-800 dark:text-[#ffffff] mt-4">{t('lab.e10conjunctionstenses_present_tense')}</h4>
   <ul className="list-disc pl-5 space-y-1 mb-4">
    <li><strong>{t('lab.e10conjunctionstenses_indefinite_simple')}</strong>  {t('lab.e10conjunctionstenses_habitual_actions_or_general_tr')} <em>{t('lab.e10conjunctionstenses_finishes')}</em>  {t('lab.e10conjunctionstenses_the_report')}</li>
    <li><strong>{t('lab.e10conjunctionstenses_continuous')}</strong>  {t('lab.e10conjunctionstenses_actions_happening_right_now_e_')} <em>{t('lab.e10conjunctionstenses_is_finishing')}</em>  {t('lab.e10conjunctionstenses_the_report')}</li>
    <li><strong>{t('lab.e10conjunctionstenses_perfect')}</strong>  {t('lab.e10conjunctionstenses_actions_completed_in_the_past_')} <em>{t('lab.e10conjunctionstenses_has_finished')}</em>  {t('lab.e10conjunctionstenses_the_report')}</li>
    <li><strong>{t('lab.e10conjunctionstenses_perfect_continuous')}</strong>  {t('lab.e10conjunctionstenses_actions_that_started_in_the_pa')} <em>{t('lab.e10conjunctionstenses_has_been_finishing')}</em>  {t('lab.e10conjunctionstenses_the_report')}</li>
   </ul>

   <h4 className="font-semibold text-slate-800 dark:text-[#ffffff] mt-4">{t('lab.e10conjunctionstenses_past_tense')}</h4>
   <ul className="list-disc pl-5 space-y-1 mb-4">
    <li><strong>{t('lab.e10conjunctionstenses_indefinite_simple')}</strong>  {t('lab.e10conjunctionstenses_completed_actions_in_the_past_')} <em>{t('lab.e10conjunctionstenses_finished')}</em>  {t('lab.e10conjunctionstenses_the_report')}</li>
    <li><strong>{t('lab.e10conjunctionstenses_continuous')}</strong>  {t('lab.e10conjunctionstenses_actions_ongoing_at_a_specific_')} <em>{t('lab.e10conjunctionstenses_was_finishing')}</em>  {t('lab.e10conjunctionstenses_the_report')}</li>
    <li><strong>{t('lab.e10conjunctionstenses_perfect')}</strong>  {t('lab.e10conjunctionstenses_actions_completed_before_anoth')} <em>{t('lab.e10conjunctionstenses_had_finished')}</em>  {t('lab.e10conjunctionstenses_the_report')}</li>
   </ul>

   <h4 className="font-semibold text-slate-800 dark:text-[#ffffff] mt-4">{t('lab.e10conjunctionstenses_future_tense')}</h4>
   <ul className="list-disc pl-5 space-y-1 mb-4">
    <li><strong>{t('lab.e10conjunctionstenses_indefinite_simple')}</strong>  {t('lab.e10conjunctionstenses_actions_that_will_happen_e_g_h')} <em>{t('lab.e10conjunctionstenses_will_finish')}</em>  {t('lab.e10conjunctionstenses_the_report')}</li>
    <li><strong>{t('lab.e10conjunctionstenses_continuous')}</strong>  {t('lab.e10conjunctionstenses_actions_that_will_be_ongoing_i')}</li>
    <li><strong>{t('lab.e10conjunctionstenses_perfect')}</strong>  {t('lab.e10conjunctionstenses_actions_that_will_be_completed')}</li>
   </ul>
   </div>
  </section>

  {/* Window 2: Controls */}
  <section className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex-col '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200 dark:border-[#2a2a2a]">
   <Settings className="w-5 h-5 text-[#4158D1]" />
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.e10conjunctionstenses_interactive_controls')}</h2>
   </div>
   
   <div className="flex-1 overflow-y-auto pr-2 space-y-6">
   {/* Tense Slider */}
   <div className={`w-full p-5 rounded-xl border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] shadow-sm flex-col '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <div className="flex items-center gap-2 mb-2">
    <Clock className="w-4 h-4 text-slate-500" />
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff]">{t('lab.e10conjunctionstenses_chronology_slider')}</h3>
    </div>
    <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">{t('lab.e10conjunctionstenses_move_the_slider_to_shift_the_s')}</p>
    
    <div className="relative px-2">
    <input 
     type="range" 
     min="0" 
     max={TENSES_TIMELINE.length - 1} 
     value={timelineIndex}
     onChange={(e) => setTimelineIndex(parseInt(e.target.value))}
     className={`w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#4158D1] flex-col `}
    />
    <div className="flex justify-between mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
     <span>{t('lab.e10conjunctionstenses_past')}</span>
     <span>{t('lab.e10conjunctionstenses_present')}</span>
     <span>{t('lab.e10conjunctionstenses_future')}</span>
    </div>
    </div>
   </div>

   {/* Knowledge Check */}
   <div className={`p-5 rounded-xl border border-slate-200 dark:border-[#2a2a2a] shadow-sm flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <div className="flex items-center gap-2 mb-4">
    <Target className="w-4 h-4 text-slate-500" />
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff]">{t('lab.e10conjunctionstenses_knowledge_check')}</h3>
    </div>
    
    {!assessmentSubmitted ? (
    <div className="space-y-6">
     {questions.map((q, qIdx) => (
     <div key={qIdx} className="space-y-3">
      <p className="text-sm font-medium text-slate-800 dark:text-[#ffffff]">
      {qIdx + 1}. {q.q}
      </p>
      <div className="space-y-2">
      {q.options.map((opt, oIdx) => (
       <label key={oIdx} className="flex items-start gap-3 cursor-pointer group">
       <input
        type="radio"
        name={`question-${qIdx}`}
        className="mt-1 w-4 h-4 text-[#4158D1] bg-slate-100 dark:bg-[#1c1b1b] border-slate-300 dark:border-[#2a2a2a] accent-[#4158D1]"
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
     disabled={Object.keys(assessmentAnswers).length < questions.length}
     className="w-full mt-4 py-2.5 px-4 bg-[#4158D1] hover:bg-[#3144a5] disabled:bg-slate-200 disabled:text-slate-400 text-[#ffffff] rounded-lg font-medium transition-colors dark:disabled:bg-[#1c1b1b] dark:disabled:text-slate-600 shadow-sm"
     >
     
                                          {t('lab.e10conjunctionstenses_submit_evaluation')}
                                          </button>
    </div>
    ) : (
    <div className="text-center py-4">
     <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 text-[#4158D1] dark:text-blue-400 mb-3 border border-blue-100 dark:border-blue-800/30">
     <span className="text-2xl font-bold">{calculateScore()}/{questions.length}</span>
     </div>
     <h3 className="text-base font-bold text-slate-900 dark:text-[#ffffff] mb-2">{t('lab.e10conjunctionstenses_assessment_complete')}</h3>
     <p className="text-sm text-slate-600 dark:text-[#71717a] mb-6 px-2">
     {calculateScore() === questions.length 
      ? "Perfect score! You've mastered conjunctions and tenses." 
      : "Good effort! Review the rules of tenses and correlative conjunctions to improve."}
     </p>
     <button
     onClick={() => {
      setAssessmentSubmitted(false);
      setAssessmentAnswers({});
     }}
     className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-slate-100 dark:bg-[#1c1b1b] hover:bg-slate-200 dark:hover:bg-[#2a2a2a] text-slate-700 dark:text-[#a1a1aa] rounded-lg font-medium transition-colors border border-slate-200 dark:border-[#2a2a2a]"
     >
     
                                              {t('lab.e10conjunctionstenses_retry_lab')}
                                              </button>
    </div>
    )}
   </div>
   </div>
  </section>

  {/* Window 3: Simulation */}
  <section className={`bg-slate-100 dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] relative items-center justify-center p-8 overflow- min-h-[500px] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="absolute top-4 left-4 flex items-center gap-2">
   <Activity className="w-5 h-5 text-[#4158D1]" />
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.e10conjunctionstenses_tense_visualization')}</h2>
   </div>

   <div className="w-full max-w-xl text-center">
   <div className={`p-8 md:p-12 rounded-2xl shadow-lg border border-slate-200 dark:border-[#2a2a2a] relative flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#4158D1] text-[#ffffff] px-6 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest shadow-md whitespace-nowrap">
     {TENSES_TIMELINE[timelineIndex].tense}
    </div>
    
    <Clock className="w-12 h-12 text-[#4158D1] mx-auto mb-6 opacity-80" />
    
    <p className="text-2xl md:text-3xl font-medium text-slate-800 dark:text-[#ffffff] leading-tight min-h-[80px] flex items-center justify-center">
     "{TENSES_TIMELINE[timelineIndex].sentence}"
    </p>
    
    {/* Visual Timeline Marker */}
    <div className="mt-12 flex justify-between items-center relative">
     <div className="absolute left-0 right-0 h-1.5 bg-slate-100 dark:bg-[#1c1b1b] top-1/2 -translate-y-1/2 rounded-full overflow-hidden">
      <div 
      className="h-full bg-[#4158D1] transition-all duration-300"
      style={{ width: `${(timelineIndex / (TENSES_TIMELINE.length - 1)) * 100}%` }}
      />
     </div>
     
     {['Past', 'Present', 'Future'].map((label, idx) => {
      const isActive = 
      (idx === 0 && timelineIndex <= 2) || 
      (idx === 1 && timelineIndex >= 3 && timelineIndex <= 5) || 
      (idx === 2 && timelineIndex === 6);
      
      const isPassed = 
      (idx === 0 && timelineIndex > 2) ||
      (idx === 1 && timelineIndex > 5);

      return (
      <div key={label} className={`relative z-10 px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${ isActive ? 'bg-[#4158D1] text-[#ffffff] shadow-md' : isPassed ? 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300' : 'bg-white dark:bg-[#1c1b1b] text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-[#2a2a2a]' }`}>
       {label}
      </div>
      );
     })}
    </div>
   </div>
   
   <div className="mt-8 flex justify-center space-x-2">
    {TENSES_TIMELINE.map((_, idx) => (
    <div 
     key={idx} 
     className={`w-2 h-2 rounded-full transition-all duration-300 ${ idx === timelineIndex ? 'bg-[#4158D1] w-6' : 'bg-slate-300 dark:bg-slate-700' }`}
    />
    ))}
   </div>
   </div>
  </section>
  
  </main>
 </div>
 );
}
