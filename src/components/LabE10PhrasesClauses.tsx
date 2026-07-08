import { useState } from 'react';
import { BookOpen, Target, Scissors, CheckCircle2, ChevronRight, XCircle, FileText, CheckSquare, Layers } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

interface LabE10PhrasesClausesProps {
 onExit?: () => void;
}

const DISSECTION_SENTENCES = [
 {
 text: "The student who studied hard passed the exam.",
 segments: [
  { text: "The student", type: "Noun Phrase", isClause: false },
  { text: "who studied hard", type: "Adjective Clause", isClause: true },
  { text: "passed the exam", type: "Verb Phrase", isClause: false }
 ],
 targetType: "Clause",
 correctIndex: 1
 },
 {
 text: "Running in the park is my favorite hobby.",
 segments: [
  { text: "Running in the park", type: "Gerund Phrase", isClause: false },
  { text: "is", type: "Verb", isClause: false },
  { text: "my favorite hobby", type: "Noun Phrase", isClause: false }
 ],
 targetType: "Gerund Phrase",
 correctIndex: 0
 },
 {
 text: "I believe that she will succeed.",
 segments: [
  { text: "I believe", type: "Independent Clause", isClause: true },
  { text: "that she will succeed", type: "Noun Clause", isClause: true }
 ],
 targetType: "Noun Clause",
 correctIndex: 1
 }
];

export default function LabE10PhrasesClauses({ onExit = () => {} }: LabE10PhrasesClausesProps) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [currentSentence, setCurrentSentence] = useState(0);
 const [selectedSegment, setSelectedSegment] = useState<number | null>(null);
 const [hasAnswered, setHasAnswered] = useState(false);
 
 const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
 const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

 const questions = [
 {
  q: "What is the main difference between a phrase and a clause?",
  options: [
  "A phrase has a subject and a verb; a clause does not.",
  "A clause has a subject and a verb; a phrase does not.",
  "Phrases are always longer than clauses.",
  "Clauses cannot stand alone."
  ],
  correct: 1
 },
 {
  q: "Identify the Adverb Clause: 'She left the party because she was tired.'",
  options: [
  "She left",
  "left the party",
  "because she was tired",
  "was tired"
  ],
  correct: 2
 },
 {
  q: "Which of the following is a Prepositional Phrase?",
  options: ["Walking fast", "To the store", "She said", "Is going"],
  correct: 1
 }
 ];

 const handleSegmentSelect = (idx: number) => {
 if (hasAnswered) return;
 setSelectedSegment(idx);
 setHasAnswered(true);
 };

 const nextSentence = () => {
 setCurrentSentence((prev) => (prev + 1) % DISSECTION_SENTENCES.length);
 setSelectedSegment(null);
 setHasAnswered(false);
 };

 const calculateScore = () => {
 let score = 0;
 questions.forEach((q, idx) => {
  if (assessmentAnswers[idx] === q.correct) score++;
 });
 return score;
 };

 const currentData = DISSECTION_SENTENCES[currentSentence];

 return (
 <div className="flex flex-col min-min- lg: bg-slate-50 dark:bg-[#121212] font-sans text-slate-900 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader title={t('lab.e10phrasesclauses_unit_6_syntactic_blueprints_ph')} variant="dark" onExit={onExit} />
  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
   onClick={() => setActiveMobileTab('theory')}
   className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
  >
   
                    {t('lab.e10phrasesclauses_theory')}
                   </button>
   <button 
   onClick={() => setActiveMobileTab('lab')}
   className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
  >{t('lab.e10phrasesclauses_lab')}</button>
  </div>

  <main className="flex-grow p-4 md:p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg:overflow-visible">
  
  {/* Window 1: Theory */}
  <section className={`w-full rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-3 mb-4">
   <BookOpen className="w-6 h-6 text-[#4158D1]" />
   <h2 className="text-xl font-bold text-slate-900 dark:text-[#ffffff]">{t('lab.e10phrasesclauses_theory_phrases_clauses')}</h2>
   </div>
   
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-[500px] pr-2">
   <h3 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mt-0 mb-2">{t('lab.e10phrasesclauses_the_building_blocks_of_sentenc')}</h3>
   <p>
    
                             {t('lab.e10phrasesclauses_in_english_grammar_both_phrase')}
                            </p>

   <div className={`bg-slate-50 dark:bg-[#1c1b1b] p-4 rounded-lg border border-slate-200 dark:border-[#2a2a2a] my-4 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <h4 className="font-bold text-[#4158D1] dark:text-[#4158D1] mb-2 mt-0">{t('lab.e10phrasesclauses_the_golden_rule')}</h4>
    <p className="mb-0">
    A <strong>{t('lab.e10phrasesclauses_clause')}</strong>  {t('lab.e10phrasesclauses_must_contain_both_a_subject_an')} <strong>{t('lab.e10phrasesclauses_phrase')}</strong>  {t('lab.e10phrasesclauses_does_not_contain_both_a_subjec')}
                                 </p>
   </div>

   <h3 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mt-6 mb-2">{t('lab.e10phrasesclauses_types_of_phrases')}</h3>
   <p>{t('lab.e10phrasesclauses_a_phrase_functions_as_a_single')}</p>
   <ul className="list-disc pl-5 space-y-2">
    <li>
    <strong>{t('lab.e10phrasesclauses_noun_phrase')}</strong>  {t('lab.e10phrasesclauses_functions_as_a_noun_in_the_sen')}
                                 <br /><em>{t('lab.e10phrasesclauses_example_the_remarkably_intelli')}</em>
    </li>
    <li>
    <strong>{t('lab.e10phrasesclauses_verb_phrase')}</strong>  {t('lab.e10phrasesclauses_consists_of_a_main_verb_and_it')}
                                 <br /><em>{t('lab.e10phrasesclauses_example_she')} <strong>{t('lab.e10phrasesclauses_has_been_reading')}</strong>  {t('lab.e10phrasesclauses_for_hours')}</em>
    </li>
    <li>
    <strong>{t('lab.e10phrasesclauses_prepositional_phrase')}</strong>  {t('lab.e10phrasesclauses_begins_with_a_preposition_and_')}
                                 <br /><em>{t('lab.e10phrasesclauses_example_the_keys_are')} <strong>{t('lab.e10phrasesclauses_on_the_kitchen_table')}</strong>.</em>
    </li>
    <li>
    <strong>{t('lab.e10phrasesclauses_gerund_phrase')}</strong>  {t('lab.e10phrasesclauses_begins_with_an_ing_verb_and_fu')}
                                 <br /><em>{t('lab.e10phrasesclauses_example')} <strong>{t('lab.e10phrasesclauses_running_in_the_park')}</strong>  {t('lab.e10phrasesclauses_is_relaxing')}</em>
    </li>
   </ul>

   <h3 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mt-6 mb-2">{t('lab.e10phrasesclauses_types_of_clauses')}</h3>
   <p>{t('lab.e10phrasesclauses_clauses_contain_both_a_subject')}</p>
   <ul className="list-disc pl-5 space-y-2">
    <li>
    <strong>{t('lab.e10phrasesclauses_independent_clause')}</strong>  {t('lab.e10phrasesclauses_expresses_a_complete_thought_a')}
                                 <br /><em>{t('lab.e10phrasesclauses_example_the_sun_set_behind_the')}</em>
    </li>
    <li>
    <strong>{t('lab.e10phrasesclauses_dependent_subordinate_clause')}</strong>  {t('lab.e10phrasesclauses_contains_a_subject_and_a_verb_')}
                                 <ul className="list-circle pl-5 mt-2 space-y-1">
     <li><strong>{t('lab.e10phrasesclauses_noun_clause')}</strong>  {t('lab.e10phrasesclauses_acts_as_a_noun')} <br /><em>{t('lab.e10phrasesclauses_example_i_wonder')} <strong>{t('lab.e10phrasesclauses_what_she_is_thinking')}</strong>.</em></li>
     <li><strong>{t('lab.e10phrasesclauses_adjective_clause')}</strong>  {t('lab.e10phrasesclauses_acts_as_an_adjective_to_modify')} <br /><em>{t('lab.e10phrasesclauses_example_the_book')} <strong>{t('lab.e10phrasesclauses_that_i_borrowed')}</strong>  {t('lab.e10phrasesclauses_is_fascinating')}</em></li>
     <li><strong>{t('lab.e10phrasesclauses_adverb_clause')}</strong>  {t('lab.e10phrasesclauses_acts_as_an_adverb_to_modify_a_')} <br /><em>{t('lab.e10phrasesclauses_example_we_stayed_inside')} <strong>{t('lab.e10phrasesclauses_because_it_was_raining')}</strong>.</em></li>
    </ul>
    </li>
   </ul>

   <h3 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mt-6 mb-2">{t('lab.e10phrasesclauses_dissection_strategy')}</h3>
   <p>
    
                             {t('lab.e10phrasesclauses_when_analyzing_a_sentence_look')}
                            </p>
   </div>
  </section>

  {/* Window 2: Controls */}
  <section className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex-col '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-3 mb-6">
   <CheckSquare className="w-6 h-6 text-[#4158D1]" />
   <h2 className="text-xl font-bold text-slate-900 dark:text-[#ffffff]">{t('lab.e10phrasesclauses_controls_assessment')}</h2>
   </div>

   <div className="flex-1 overflow-y-auto pr-2 space-y-6">
   
   {/* Sentence Navigator */}
   <div className={`w-full p-5 rounded-xl border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex-col '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <h3 className="text-md font-bold text-slate-800 dark:text-[#ffffff] mb-3 flex items-center gap-2">
    <FileText className="w-4 h-4" />  {t('lab.e10phrasesclauses_dissection_engine_controls')}
                                 </h3>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">
    
                                 {t('lab.e10phrasesclauses_use_the_engine_in_the_simulati')}
                                 </p>
    <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-slate-700 dark:text-[#a1a1aa]">
     
                                      {t('lab.e10phrasesclauses_current_sentence')} {currentSentence + 1} of {DISSECTION_SENTENCES.length}
    </span>
    <button
     onClick={nextSentence}
     className={`flex items-center gap-2 px-4 py-2 bg-[#4158D1] hover:bg-[#3144a5] text-white rounded-lg font-bold transition-colors shadow-sm text-sm flex-col `}
    >
     
                                      {t('lab.e10phrasesclauses_skip_next')} <ChevronRight className="w-4 h-4" />
    </button>
    </div>
   </div>

   {/* Assessment Section */}
   <div className={`p-5 rounded-xl border border-slate-200 dark:border-[#2a2a2a] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <h3 className="text-md font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
    <Target className="w-4 h-4" />  {t('lab.e10phrasesclauses_knowledge_check')}
                                 </h3>
    
    {!assessmentSubmitted ? (
    <div className="space-y-6">
     {questions.map((q, qIdx) => (
     <div key={qIdx} className="space-y-3">
      <p className="text-sm font-semibold text-slate-800 dark:text-[#ffffff]">
      {qIdx + 1}. {q.q}
      </p>
      <div className="space-y-2">
      {q.options.map((opt, oIdx) => (
       <label key={oIdx} className="flex items-start gap-3 cursor-pointer group">
       <input
        type="radio"
        name={`question-${qIdx}`}
        className="mt-1 w-4 h-4 text-[#4158D1] bg-slate-100 dark:bg-[#1c1b1b] border-slate-300 dark:border-[#2a2a2a] focus:ring-[#4158D1]"
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
     className="w-full mt-4 py-2.5 px-4 bg-[#4158D1] hover:bg-[#3144a5] disabled:bg-slate-300 disabled:dark:bg-slate-700 text-white rounded-lg font-medium transition-colors shadow-sm"
     >
     
                                          {t('lab.e10phrasesclauses_submit_evaluation')}
                                          </button>
    </div>
    ) : (
    <div className="text-center py-6">
     <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[#4158D1] dark:text-blue-400 mb-4 shadow-sm border border-blue-200 dark:border-blue-800/50">
     <span className="text-2xl font-bold">{calculateScore()}/{questions.length}</span>
     </div>
     <h4 className="text-md font-bold text-slate-900 dark:text-[#ffffff] mb-2">{t('lab.e10phrasesclauses_assessment_complete')}</h4>
     <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-6">
     {calculateScore() === questions.length 
      ? "Perfect score! You have mastered identifying phrases and clauses." 
      : "Good effort! Remember the golden rule: clauses have a subject and a verb."}
     </p>
     <button
     onClick={() => {
      setAssessmentSubmitted(false);
      setAssessmentAnswers({});
     }}
     className="w-full py-2 px-4 bg-slate-100 dark:bg-[#1c1b1b] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-[#ffffff] border border-slate-200 dark:border-[#2a2a2a] rounded-lg font-medium transition-colors"
     >
     
                                              {t('lab.e10phrasesclauses_retry_assessment')}
                                              </button>
    </div>
    )}
   </div>
   
   </div>
  </section>

  {/* Window 3: Simulation */}
  <section className={`bg-slate-100 dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] relative flex-col p-6 overflow- min-h-[500px] ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-3 mb-6">
   <Layers className="w-6 h-6 text-[#4158D1]" />
   <h2 className="text-xl font-bold text-slate-900 dark:text-[#ffffff]">{t('lab.e10phrasesclauses_dissection_engine')}</h2>
   </div>

   <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
   <div className={`p-8 rounded-2xl border border-slate-200 dark:border-[#1c1b1b] w-full shadow-sm flex-col items-center ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    
    <div className="text-center mb-8">
    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[#4158D1] dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
     
                                      {t('lab.e10phrasesclauses_target')} {currentData.targetType}
    </span>
    <p className="text-md font-medium text-slate-600 dark:text-[#a1a1aa]">
     
                                      {t('lab.e10phrasesclauses_analyze_the_sentence_below_cli')} <strong className="text-slate-900 dark:text-[#ffffff]">{currentData.targetType}</strong>:
    </p>
    </div>
    
    <div className={`bg-slate-50 dark:bg-[#1c1b1b] p-6 rounded-xl border border-slate-200 dark:border-[#2a2a2a] text-center w-full flex-wrap justify-center gap-3 shadow-inner flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    {currentData.segments.map((seg, idx) => {
     
     let bgClass = " hover:bg-blue-50 dark:hover:bg-blue-900/20 border-slate-200 dark:border-[#2a2a2a] text-slate-800 dark:text-[#ffffff] shadow-sm";
     
     if (hasAnswered) {
     if (idx === currentData.correctIndex) {
      bgClass = "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-sm";
     } else if (idx === selectedSegment) {
      bgClass = "bg-rose-100 dark:bg-rose-900/40 border-rose-500 text-rose-800 dark:text-rose-300 shadow-sm";
     } else {
      bgClass = "bg-slate-100 dark:bg-[#121212] border-slate-200 dark:border-[#1c1b1b] text-slate-500 dark:text-slate-600 opacity-50";
     }
     }

     return (
     <button
      key={idx}
      onClick={() => handleSegmentSelect(idx)}
      disabled={hasAnswered}
      className={`px-5 py-3 border-2 rounded-lg font-medium text-lg transition-all ${bgClass} transform ${!hasAnswered && 'hover:-translate-y-0.5'}`}
     >
      {seg.text}
     </button>
     );
    })}
    </div>

    {hasAnswered && (
    <div className={`mt-8 p-5 w-full rounded-xl border-2 flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 ${ selectedSegment === currentData.correctIndex ? 'border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-200' : 'border-rose-200 dark:border-rose-800/50 bg-rose-50 dark:bg-rose-900/20 text-rose-900 dark:text-rose-200' }`}>
     {selectedSegment === currentData.correctIndex ? (
     <CheckCircle2 className="w-6 h-6 flex-shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
     ) : (
     <XCircle className="w-6 h-6 flex-shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
     )}
     <div>
     <h4 className="font-bold mb-1 text-lg">
      {selectedSegment === currentData.correctIndex ? "Correct Identification!" : "Incorrect Identification"}
     </h4>
     <p className="text-sm opacity-90 leading-relaxed">
      "<strong className="font-semibold">{currentData.segments[currentData.correctIndex].text}</strong>{t('lab.e10phrasesclauses_is_a')} {currentData.segments[currentData.correctIndex].type}.
      {currentData.segments[currentData.correctIndex].isClause 
      ? " It forms a clause because it contains both a subject and a verb." 
      : " It is a phrase because it lacks a subject-verb pairing."}
     </p>
     </div>
    </div>
    )}

    {hasAnswered && (
    <div className="mt-8">
     <button
     onClick={nextSentence}
     className="flex items-center gap-2 px-6 py-3 bg-[#4158D1] hover:bg-[#3144a5] text-white rounded-lg font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
     >
     
                                          {t('lab.e10phrasesclauses_analyze_next_sentence')} <ChevronRight className="w-5 h-5" />
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
