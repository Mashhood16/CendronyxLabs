import { useState } from 'react';
import { BookOpen, Target, PenTool, ChevronRight, Hash } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

interface LabE10VocabularyStylisticsProps {
 onExit?: () => void;
}

const STYLISTIC_CHALLENGES = [
 {
 type: "Figure of Speech",
 text: "The wind whispered through the dark and gloomy forest.",
 options: ["Simile", "Metaphor", "Personification", "Alliteration"],
 correct: 2,
 explanation: "Personification gives human qualities (whispering) to non-human things (the wind)."
 },
 {
 type: "Punctuation",
 text: "My favorite colors are blue, green, and red___",
 options: ["Comma (,)", "Semicolon (;)", "Colon (:)", "Period (.)"],
 correct: 3,
 explanation: "A period is required to end this declarative sentence."
 },
 {
 type: "Word Origins (Prefix)",
 text: "What does the prefix 'un-' mean in the word 'unbelievable'?",
 options: ["Again", "Not", "Before", "Too much"],
 correct: 1,
 explanation: "The prefix 'un-' means 'not' or the opposite of."
 },
 {
 type: "Connotation vs Denotation",
 text: "Which word has a more positive connotation?",
 options: ["Cheap", "Inexpensive", "Stingy", "Thrifty"],
 correct: 1,
 explanation: "'Inexpensive' implies good value without the negative aspect of low quality associated with 'cheap'."
 }
];

export default function LabE10VocabularyStylistics({ onExit = () => {} }: LabE10VocabularyStylisticsProps) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 
 const [currentChallenge, setCurrentChallenge] = useState(0);
 const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
 
 const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
 const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

 const questions = [
 {
  q: "Which figure of speech is: 'He is a shining star'?",
  options: ["Simile", "Metaphor", "Personification", "Oxymoron"],
  correct: 1
 },
 {
  q: "What punctuation is used to join two independent clauses without a conjunction?",
  options: ["Comma", "Semicolon", "Colon", "Hyphen"],
  correct: 1
 },
 {
  q: "Which of the following contains an Oxymoron?",
  options: [
  "As brave as a lion",
  "The stars danced playfully",
  "Deafening silence",
  "She sells seashells"
  ],
  correct: 2
 }
 ];

 const handleSelectAnswer = (idx: number) => {
 if (selectedAnswer === null) {
  setSelectedAnswer(idx);
 }
 };

 const nextChallenge = () => {
 setCurrentChallenge((prev) => (prev + 1) % STYLISTIC_CHALLENGES.length);
 setSelectedAnswer(null);
 };

 const calculateScore = () => {
 let score = 0;
 questions.forEach((q, idx) => {
  if (assessmentAnswers[idx] === q.correct) score++;
 });
 return score;
 };

 return (
 <div className="min-min- lg: flex flex-col bg-slate-50 dark:bg-[#000000] text-slate-900 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader title={t('lab.e10vocabularystylistics_unit_8_vocabulary_stylistics')} onExit={onExit} />
  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.e10vocabularystylistics_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.e10vocabularystylistics_lab')}</button>
  </div>

  <main className="flex-grow p-4 md:p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg:overflow-visible">
  
  {/* Window 1: Theory */}
  <section className={`w-full rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
    <BookOpen className="w-5 h-5 text-[#4158D1]" />
    
                         {t('lab.e10vocabularystylistics_vocabulary_stylistics')}
                        </h2>
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-[500px] pr-2">
    <p>{t('lab.e10vocabularystylistics_stylistics_is_a_branch_of_appl')}</p>
    
    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mt-4 mb-2">{t('lab.e10vocabularystylistics_1_figures_of_speech')}</h3>
    <p>{t('lab.e10vocabularystylistics_figures_of_speech_enhance_mean')}</p>
    <ul className="list-disc pl-5 space-y-1 mb-4">
     <li><strong>{t('lab.e10vocabularystylistics_simile')}</strong>  {t('lab.e10vocabularystylistics_a_comparison_between_two_unlik')} <em>{t('lab.e10vocabularystylistics_as_brave_as_a_lion')}</em>).</li>
     <li><strong>{t('lab.e10vocabularystylistics_metaphor')}</strong>  {t('lab.e10vocabularystylistics_a_direct_comparison_between_tw')} <em>{t('lab.e10vocabularystylistics_he_is_a_shining_star')}</em>).</li>
     <li><strong>{t('lab.e10vocabularystylistics_personification')}</strong>  {t('lab.e10vocabularystylistics_attributing_human_characterist')} <em>{t('lab.e10vocabularystylistics_the_wind_whispered')}</em>).</li>
     <li><strong>{t('lab.e10vocabularystylistics_alliteration')}</strong>  {t('lab.e10vocabularystylistics_the_repetition_of_initial_cons')} <em>{t('lab.e10vocabularystylistics_she_sells_seashells')}</em>).</li>
     <li><strong>{t('lab.e10vocabularystylistics_oxymoron')}</strong>  {t('lab.e10vocabularystylistics_a_figure_of_speech_that_combin')} <em>{t('lab.e10vocabularystylistics_deafening_silence')}</em>, <em>{t('lab.e10vocabularystylistics_jumbo_shrimp')}</em>).</li>
    </ul>

    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mt-4 mb-2">{t('lab.e10vocabularystylistics_2_vocabulary_choices')}</h3>
    <p>{t('lab.e10vocabularystylistics_words_carry_both_literal_meani')}</p>
    <ul className="list-disc pl-5 space-y-1 mb-4">
     <li><strong>{t('lab.e10vocabularystylistics_denotation')}</strong>  {t('lab.e10vocabularystylistics_the_literal_dictionary_definit')}</li>
     <li><strong>{t('lab.e10vocabularystylistics_connotation')}</strong>  {t('lab.e10vocabularystylistics_the_emotional_cultural_or_soci')}</li>
    </ul>

    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mt-4 mb-2">{t('lab.e10vocabularystylistics_3_morphology_word_origins')}</h3>
    <p>{t('lab.e10vocabularystylistics_understanding_word_parts_helps')}</p>
    <ul className="list-disc pl-5 space-y-1 mb-4">
     <li><strong>{t('lab.e10vocabularystylistics_prefixes')}</strong>  {t('lab.e10vocabularystylistics_added_to_the_beginning_of_a_ro')} <em>{t('lab.e10vocabularystylistics_un')}</em>  {t('lab.e10vocabularystylistics_meaning_not_as_in')} <em>{t('lab.e10vocabularystylistics_unbelievable')}</em>).</li>
     <li><strong>{t('lab.e10vocabularystylistics_suffixes')}</strong>  {t('lab.e10vocabularystylistics_added_to_the_end_of_a_word_to_')} <em>{t('lab.e10vocabularystylistics_able')}</em>  {t('lab.e10vocabularystylistics_meaning_capable_of')}</li>
     <li><strong>{t('lab.e10vocabularystylistics_root_words')}</strong>  {t('lab.e10vocabularystylistics_the_core_meaning_of_a_word_oft')}</li>
    </ul>

    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mt-4 mb-2">{t('lab.e10vocabularystylistics_4_punctuation_for_style')}</h3>
    <p>{t('lab.e10vocabularystylistics_punctuation_guides_the_reader_')}</p>
    <ul className="list-disc pl-5 space-y-1 mb-4">
     <li><strong>{t('lab.e10vocabularystylistics_period')}</strong>  {t('lab.e10vocabularystylistics_ends_a_declarative_sentence_es')}</li>
     <li><strong>{t('lab.e10vocabularystylistics_comma')}</strong>  {t('lab.e10vocabularystylistics_indicates_a_brief_pause_separa')}</li>
     <li><strong>{t('lab.e10vocabularystylistics_semicolon')}</strong>  {t('lab.e10vocabularystylistics_links_two_related_independent_')}</li>
     <li><strong>{t('lab.e10vocabularystylistics_colon')}</strong>  {t('lab.e10vocabularystylistics_introduces_a_list_a_quotation_')}</li>
    </ul>
   </div>
  </section>

  {/* Window 2: Controls */}
  <section className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex-col '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
    <PenTool className="w-5 h-5 text-[#4158D1]" />
    
                         {t('lab.e10vocabularystylistics_stylist_s_workbench')}
                        </h2>
   
   <div className="flex-1 flex flex-col">
   <div className="mb-4 flex justify-between items-center">
    <span className="text-sm font-medium text-slate-600 dark:text-[#a1a1aa]">
    
                                 {t('lab.e10vocabularystylistics_challenge')} {currentChallenge + 1} of {STYLISTIC_CHALLENGES.length}
    </span>
    <span className={`px-3 py-1 bg-[#4158D1]/10 text-[#4158D1] dark:text-[#889cf6] text-xs font-bold rounded-full flex-col `}>
    {STYLISTIC_CHALLENGES[currentChallenge].type}
    </span>
   </div>

   <div className={`p-6 rounded-xl border border-slate-200 dark:border-[#2a2a2a] text-center mb-6 shadow-sm flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <p className="text-lg font-medium text-slate-900 dark:text-white leading-relaxed italic">
    "{STYLISTIC_CHALLENGES[currentChallenge].text}"
    </p>
   </div>

   <div className="grid grid-cols-2 gap-3 flex-1 mb-6">
    {STYLISTIC_CHALLENGES[currentChallenge].options.map((opt, idx) => {
    const isSelected = selectedAnswer === idx;
    const isAnswered = selectedAnswer !== null;
    const isCorrect = idx === STYLISTIC_CHALLENGES[currentChallenge].correct;

    return (
     <button
     key={idx}
     onClick={() => handleSelectAnswer(idx)}
     disabled={isAnswered}
     className={`p-3 rounded-xl font-medium text-sm transition-all border-2 flex items-center justify-center ${ !isAnswered ? 'border-slate-200 dark:border-[#2a2a2a] hover:border-[#4158D1] hover:bg-[#4158D1]/5 dark:hover:bg-[#4158D1]/20 text-slate-700 dark:text-[#a1a1aa]' : isSelected ? isCorrect ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'border-rose-500 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300' : isCorrect ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-300 opacity-70' : 'border-slate-200 dark:border-[#2a2a2a] text-slate-400 dark:text-slate-600 opacity-40' }`}
     >
     {opt}
     </button>
    );
    })}
   </div>

   {selectedAnswer !== null && (
    <div className="mt-auto flex flex-col gap-4">
    <div className={`p-4 rounded-lg text-sm font-medium gap-3 ${ selectedAnswer === STYLISTIC_CHALLENGES[currentChallenge].correct ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200' : ' border border-slate-200 dark:border-[#2a2a2a] text-slate-800 dark:text-[#a1a1aa]' } flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
     <Hash className="w-5 h-5 flex-shrink-0 mt-0.5 opacity-70" />
     <p>{STYLISTIC_CHALLENGES[currentChallenge].explanation}</p>
    </div>
    <button
     onClick={nextChallenge}
     className={`flex items-center justify-center gap-2 w-full py-3 bg-[#4158D1] hover:bg-[#3144a5] text-white rounded-lg font-bold transition-colors shadow-sm flex-col `}
    >
     
                                      {t('lab.e10vocabularystylistics_next_challenge')} <ChevronRight className="w-5 h-5" />
    </button>
    </div>
   )}
   </div>
  </section>

  {/* Window 3: Simulation */}
  <section className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] relative items-center justify-center p-8 lg:min-h-[35vh] lg:min-h-[500px] flex-col '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="w-full max-w-md h-full flex flex-col">
   <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-300 dark:border-[#1c1b1b]">
    <Target className="w-6 h-6 text-[#4158D1]" />
    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('lab.e10vocabularystylistics_knowledge_check')}</h2>
   </div>

   <div className="flex-1 overflow-y-auto pr-2">
    {!assessmentSubmitted ? (
    <div className="space-y-6">
     {questions.map((q, qIdx) => (
     <div key={qIdx} className="space-y-3">
      <p className="text-sm font-medium text-slate-800 dark:text-white">
      {qIdx + 1}. {q.q}
      </p>
      <div className="space-y-2">
      {q.options.map((opt, oIdx) => (
       <label key={oIdx} className="flex items-start gap-3 cursor-pointer group">
       <input
        type="radio"
        name={`question-${qIdx}`}
        className="mt-1 w-4 h-4 text-[#4158D1] border-slate-300 dark:border-[#2a2a2a]"
        checked={assessmentAnswers[qIdx] === oIdx}
        onChange={() => setAssessmentAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
       />
       <span className="text-sm text-slate-700 dark:text-[#a1a1aa] group-hover:text-slate-900 dark:group-hover:text-white">
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
     className="w-full mt-6 py-3 px-4 bg-[#4158D1] hover:bg-[#3144a5] disabled:bg-slate-300 disabled:dark:bg-slate-800 disabled:text-slate-500 disabled:dark:text-slate-500 text-white rounded-lg font-bold transition-colors"
     >
     
                                          {t('lab.e10vocabularystylistics_submit_evaluation')}
                                          </button>
    </div>
    ) : (
    <div className="text-center py-8 h-full flex flex-col justify-center">
     <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#4158D1]/10 text-[#4158D1] mb-6 mx-auto">
     <span className="text-4xl font-bold">{calculateScore()}/{questions.length}</span>
     </div>
     <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('lab.e10vocabularystylistics_assessment_complete')}</h3>
     <p className="text-slate-600 dark:text-[#a1a1aa] mb-8">
     {calculateScore() === questions.length 
      ? "Perfect score! Your stylistic skills are top-notch." 
      : "Good effort! Review the figures of speech to improve."}
     </p>
     <button
     onClick={() => {
      setAssessmentSubmitted(false);
      setAssessmentAnswers({});
     }}
     className="flex items-center justify-center gap-2 w-full py-3 px-4 hover:bg-slate-50 dark:hover:bg-[#1c1b1b] text-slate-800 dark:text-white border border-slate-200 dark:border-[#2a2a2a] rounded-lg font-bold transition-colors"
     >
     
                                              {t('lab.e10vocabularystylistics_retry_assessment')}
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

