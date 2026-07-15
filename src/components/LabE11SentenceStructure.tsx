import { useState } from 'react';
import LabHeader from './LabHeader';
import { CheckCircle, XCircle, Info, BookOpen, RefreshCcw } from 'lucide-react';
import { useTranslate } from "../i18n";

type SentenceTopic = 'types' | 'modifiers';

export default function LabE11SentenceStructure({ onExit }: { onExit?: () => void }) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [topic, setTopic] = useState<SentenceTopic>('types');
 const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
 const [userAnswer, setUserAnswer] = useState('');
 const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

 const sentenceTypesQuestions = [
 { text: "May you live long and prosper.", type: "Optative" },
 { text: "Please close the door behind you.", type: "Imperative" },
 { text: "What an incredible performance that was!", type: "Exclamatory" },
 { text: "The sun rises in the east.", type: "Declarative" },
 { text: "Have you finished reading the chapter?", type: "Interrogative" },
 { text: "Would that I were young again.", type: "Optative" },
 { text: "Do not touch the exhibits in the museum.", type: "Imperative" }
 ];

 const modifierQuestions = [
 { 
  wrong: "Oozing slowly across the floor, I watched the salad dressing.", 
  validAnswers: ["I watched the salad dressing oozing slowly across the floor.", "I watched the salad dressing oozing across the floor slowly."],
  hint: "Who or what is oozing? Put the modifier next to the word it modifies."
 },
 {
  wrong: "She served sandwiches to the children on paper plates.",
  validAnswers: ["She served sandwiches on paper plates to the children.", "On paper plates, she served sandwiches to the children.", "She served the children sandwiches on paper plates."],
  hint: "Are the children on paper plates? Move the prepositional phrase."
 },
 {
  wrong: "He almost drove his kids to school every day.",
  validAnswers: ["He drove his kids to school almost every day.", "He drove his kids to school every day almost."],
  hint: "Does he 'almost drive' or drive 'almost every day'?"
 },
 {
  wrong: "Covered in mud, my mom told me to take off my shoes.",
  validAnswers: ["My mom told me to take off my shoes covered in mud.", "My mom told me to take off my mud-covered shoes."],
  hint: "Was your mom covered in mud, or were your shoes?"
 }
 ];

 const handleTopicChange = (newTopic: SentenceTopic) => {
 setTopic(newTopic);
 setCurrentSentenceIndex(0);
 setUserAnswer('');
 setFeedback(null);
 };

 const handleNext = () => {
 if (topic === 'types') {
  setCurrentSentenceIndex((prev) => (prev + 1) % sentenceTypesQuestions.length);
 } else {
  setCurrentSentenceIndex((prev) => (prev + 1) % modifierQuestions.length);
 }
 setUserAnswer('');
 setFeedback(null);
 };

 const checkSentenceType = (selectedType: string) => {
 const isCorrect = sentenceTypesQuestions[currentSentenceIndex].type === selectedType;
 if (isCorrect) {
  setFeedback({ isCorrect: true, message: "Correct! You successfully identified the sentence type." });
 } else {
  setFeedback({ isCorrect: false, message: `Incorrect. The correct type is ${sentenceTypesQuestions[currentSentenceIndex].type}.` });
 }
 };

 const checkModifierAnswer = () => {
 const currentQ = modifierQuestions[currentSentenceIndex];
 const normalizedUserAnswer = userAnswer.trim().replace(/\.$/, "").toLowerCase();
 
 const isCorrect = currentQ.validAnswers.some(ans => 
  ans.toLowerCase().replace(/\.$/, "") === normalizedUserAnswer
 );

 if (isCorrect) {
  setFeedback({ isCorrect: true, message: "Great job! The modifier is now placed correctly, making the sentence logical." });
 } else {
  setFeedback({ isCorrect: false, message: "Not quite right. " + currentQ.hint });
 }
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#ffffff] overflow-hidden min-h-screen lg:h-screen overflow-x-hidden w-full">
  {/* Header */}
  <LabHeader onExit={onExit} title={t('lab.e11sentencestructure_lab_e11_sentence_structure_mod')} />

  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.e11sentencestructure_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.e11sentencestructure_lab')}</button>
  </div>

  {/* Main Content Area */}
  <main className="flex-grow p-4 md:p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg: lg:overflow-visible">
  
  {/* Window 1: Theory */}
  <section className={`w-full rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col overflow- ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
   <BookOpen className="w-5 h-5 text-indigo-500" />  {t('lab.e11sentencestructure_theory')}
                        </h2>
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto pr-2">
   <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">{t('lab.e11sentencestructure_sentence_types')}</h3>
   <p className="mb-4">{t('lab.e11sentencestructure_sentences_are_categorized_by_t')}</p>
   
   <ul className="list-disc pl-5 mb-6 space-y-2">
    <li><strong>{t('lab.e11sentencestructure_declarative')}</strong>  {t('lab.e11sentencestructure_makes_a_statement_or_states_a_')} <br/><em className="text-indigo-600 dark:text-indigo-400">{t('lab.e11sentencestructure_example_the_sun_rises_in_the_e')}</em></li>
    <li><strong>{t('lab.e11sentencestructure_interrogative')}</strong>  {t('lab.e11sentencestructure_asks_a_question_ends_with_a_qu')} <br/><em className="text-indigo-600 dark:text-indigo-400">{t('lab.e11sentencestructure_example_have_you_finished_read')}</em></li>
    <li><strong>{t('lab.e11sentencestructure_exclamatory')}</strong>  {t('lab.e11sentencestructure_expresses_strong_emotion_or_su')} <br/><em className="text-indigo-600 dark:text-indigo-400">{t('lab.e11sentencestructure_example_what_a_beautiful_day')}</em></li>
    <li><strong>{t('lab.e11sentencestructure_imperative')}</strong>  {t('lab.e11sentencestructure_gives_a_command_or_makes_a_req')} <br/><em className="text-indigo-600 dark:text-indigo-400">{t('lab.e11sentencestructure_example_please_close_the_door')}</em></li>
    <li><strong>{t('lab.e11sentencestructure_optative')}</strong>  {t('lab.e11sentencestructure_expresses_a_wish_prayer_curse_')} <br/><em className="text-indigo-600 dark:text-indigo-400">{t('lab.e11sentencestructure_example_may_you_live_long')}</em></li>
   </ul>

   <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">{t('lab.e11sentencestructure_misplaced_and_dangling_modifie')}</h3>
   <p className="mb-2">A <strong>{t('lab.e11sentencestructure_modifier')}</strong>  {t('lab.e11sentencestructure_is_a_word_phrase_or_clause_tha')}</p>
   
   <h4 className="font-semibold text-slate-800 dark:text-white mt-4 mb-2">{t('lab.e11sentencestructure_misplaced_modifiers')}</h4>
   <p className="mb-3">{t('lab.e11sentencestructure_occurs_when_the_modifier_is_se')}</p>
   <div className={`bg-slate-100 dark:bg-[#1c1b1b] p-3 rounded-lg mb-4 flex-col `}>
    <p className="text-rose-600 dark:text-rose-400 line-through text-sm">{t('lab.e11sentencestructure_wrong_he_served_sandwiches_to_')}</p>
    <p className="text-emerald-600 dark:text-emerald-400 text-sm">{t('lab.e11sentencestructure_correct_he_served_sandwiches_o')}</p>
   </div>

   <h4 className="font-semibold text-slate-800 dark:text-white mt-4 mb-2">{t('lab.e11sentencestructure_dangling_modifiers')}</h4>
   <p className="mb-3">{t('lab.e11sentencestructure_occurs_when_the_word_the_modif')}</p>
   <div className={`bg-slate-100 dark:bg-[#1c1b1b] p-3 rounded-lg mb-4 flex-col `}>
    <p className="text-rose-600 dark:text-rose-400 line-through text-sm">{t('lab.e11sentencestructure_wrong_hoping_to_excuse_the_abs')}</p>
    <p className="text-emerald-600 dark:text-emerald-400 text-sm">{t('lab.e11sentencestructure_correct_hoping_to_excuse_the_a')}</p>
   </div>
   
   <p><strong>{t('lab.e11sentencestructure_pro_tip')}</strong>  {t('lab.e11sentencestructure_to_fix_a_dangling_modifier_you')}</p>
   </div>
  </section>

  {/* Window 2: Controls */}
  <section className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex-col '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4">
   
                        {t('lab.e11sentencestructure_controls')}
                        </h2>
   <div className="flex-grow flex flex-col gap-4">
   <div className="flex flex-col gap-3">
    <button
    onClick={() => handleTopicChange('types')}
    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${ topic === 'types' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/40 shadow-sm' : 'border-slate-200 dark:border-[#2a2a2a] hover:border-indigo-300 hover:bg-white dark:hover:bg-[#2a2a2a]' }`}
    >
    <div className="font-semibold text-slate-800 dark:text-[#ffffff] mb-1">{t('lab.e11sentencestructure_sentence_types')}</div>
    <div className="text-xs text-slate-500 dark:text-[#a1a1aa]">{t('lab.e11sentencestructure_identify_declarative_interroga')}</div>
    </button>
    
    <button
    onClick={() => handleTopicChange('modifiers')}
    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${ topic === 'modifiers' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/40 shadow-sm' : 'border-slate-200 dark:border-[#2a2a2a] hover:border-indigo-300 hover:bg-white dark:hover:bg-[#2a2a2a]' }`}
    >
    <div className="font-semibold text-slate-800 dark:text-[#ffffff] mb-1">{t('lab.e11sentencestructure_misplaced_modifiers')}</div>
    <div className="text-xs text-slate-500 dark:text-[#a1a1aa]">{t('lab.e11sentencestructure_rewrite_sentences_to_fix_dangl')}</div>
    </button>
   </div>
   </div>

   <div className={`bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 p-5 rounded-xl mt-4 flex-col `}>
   <h3 className="font-semibold flex items-center gap-2 mb-3 text-indigo-700 dark:text-indigo-300">
    <Info className="w-4 h-4" />  {t('lab.e11sentencestructure_instructions')}
                            </h3>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa] leading-relaxed">
    {topic === 'types' 
    ? "Examine the sentence presented on the simulation stage. Analyze its tone, punctuation, and structure to determine its primary function. Click the corresponding button to lock in your answer."
    : "The sentence shown contains a misplaced or dangling modifier, causing it to mean something illogical or humorous. Analyze the intended meaning and rewrite the sentence in the text box below so the modifier is clearly attached to the correct word."
    }
   </p>
   </div>
  </section>

  {/* Window 3: Simulation */}
  <section className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] relative items-center justify-center p-4 sm:p-8 lg:min-h-[35vh] lg:min-h-[500px] '' : ''} flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="w-full max-w-2xl rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-100 dark:border-[#1c1b1b] transition-all my-auto">
    
    {topic === 'types' && (
    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
     <div className="flex w-full justify-between items-center mb-8">
     <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-full text-xs font-semibold uppercase tracking-wider">
      
                                           {t('lab.e11sentencestructure_module_1_analysis')}
                                          </span>
     <span className="text-sm font-medium text-slate-500 dark:text-[#a1a1aa]">
      
                                           {t('lab.e11sentencestructure_sentence')} {currentSentenceIndex + 1} of {sentenceTypesQuestions.length}
     </span>
     </div>
     
     <div className="text-xl sm:text-2xl font-serif text-center mb-10 text-slate-800 dark:text-[#ffffff] leading-relaxed min-h-[80px] flex items-center justify-center w-full px-2">
     "{sentenceTypesQuestions[currentSentenceIndex].text}"
     </div>

     <div className="flex flex-wrap justify-center gap-3 w-full">
     {['Declarative', 'Interrogative', 'Exclamatory', 'Imperative', 'Optative'].map(type => (
      <button
       key={type}
       onClick={() => checkSentenceType(type)}
       disabled={feedback !== null}
       className="px-4 py-3 rounded-xl border border-slate-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1c1b1b] hover:bg-indigo-50 hover:border-indigo-300 dark:hover:bg-[#2a2a2a] dark:hover:border-slate-500 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-[#ffffff] shadow-sm flex-1 min-w-[120px] max-w-[180px] text-sm"
      >
       {type}
      </button>
     ))}
     </div>
    </div>
    )}

    {topic === 'modifiers' && (
    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
     <div className="flex w-full justify-between items-center mb-8">
     <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 rounded-full text-xs font-semibold uppercase tracking-wider">
      
                                           {t('lab.e11sentencestructure_module_2_correction')}
                                          </span>
     <span className="text-sm font-medium text-slate-500 dark:text-[#a1a1aa]">
      
                                           {t('lab.e11sentencestructure_sentence')} {currentSentenceIndex + 1} of {modifierQuestions.length}
     </span>
     </div>
     
     <div className="w-full bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 rounded-xl p-6 mb-8 relative shadow-inner">
     <div className="absolute -top-3 left-6 bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 text-xs px-2 py-1 rounded font-bold tracking-wide">
      
                                           {t('lab.e11sentencestructure_flawed_sentence')}
                                          </div>
     <div className="text-lg sm:text-xl font-serif text-center text-slate-800 dark:text-[#ffffff] min-h-[60px] flex items-center justify-center">
      "{modifierQuestions[currentSentenceIndex].wrong}"
     </div>
     </div>

     <div className="w-full">
     <label className="block text-sm font-medium text-slate-700 dark:text-[#a1a1aa] mb-2">
      
                                           {t('lab.e11sentencestructure_rewrite_correctly')}
                                          </label>
     <div className="flex flex-col sm:flex-row gap-3">
      <input 
      type="text" 
      value={userAnswer}
      onChange={(e) => setUserAnswer(e.target.value)}
      disabled={feedback !== null && feedback.isCorrect}
      className="flex-1 rounded-xl border border-slate-300 dark:border-[#2a2a2a] bg-white dark:bg-[#1c1b1b] px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all text-sm"
      placeholder={t('lab.e11sentencestructure_type_your_corrected_sentence_h')}
      onKeyDown={(e) => { if(e.key === 'Enter') checkModifierAnswer() }}
      />
      <button
      onClick={checkModifierAnswer}
      disabled={!userAnswer || (feedback !== null && feedback.isCorrect)}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 shadow-sm dark:bg-indigo-500 dark:hover:bg-indigo-400 text-sm whitespace-nowrap"
      >
      
                                               {t('lab.e11sentencestructure_check')}
                                               </button>
     </div>
     </div>
    </div>
    )}

    {/* Feedback Alert */}
    {feedback && (
    <div className={`mt-8 p-4 sm:p-5 rounded-xl flex items-start gap-4 shadow-sm ${feedback.isCorrect ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-300' : 'bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-300'} animate-in slide-in-from-bottom-4 duration-300`}>
     {feedback.isCorrect ? <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" />}
     <div className="flex-1">
     <p className="font-medium text-base sm:text-lg mb-1">{feedback.isCorrect ? 'Excellent Work!' : 'Not Quite Right'}</p>
     <p className="opacity-90 text-sm sm:text-base">{feedback.message}</p>
     
     <button
      onClick={handleNext}
      className="mt-4 flex items-center gap-2 text-sm font-bold bg-white dark:bg-[#121212] dark:border-[#1c1b1b]/50 dark:bg-[#121212]/40 px-4 py-2 rounded-lg hover:bg-white dark:bg-[#121212] dark:border-[#1c1b1b]/80 dark:hover:bg-black/40 transition-colors whitespace-nowrap"
     >
      {feedback.isCorrect ? 'Continue to Next' : (topic === 'types' ? 'Skip to Next' : 'Try Another')} <RefreshCcw className="w-4 h-4" />
     </button>
     </div>
    </div>
    )}

   </div>
  </section>
  </main>
 </div>
 );
}
