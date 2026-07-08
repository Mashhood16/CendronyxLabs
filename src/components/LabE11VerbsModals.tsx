import { useState } from 'react';
import { ArrowLeft, Check, BookOpen, List, Activity, HelpCircle, AlertCircle } from 'lucide-react';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

const SCENARIOS = [
 {
 id: 1,
 type: "Modal Verbs",
 situation: "You see very dark clouds in the sky and hear loud thunder.",
 question: "Which modal verb best completes the deduction: 'It ___ rain soon.'?",
 options: ["must", "can't", "ought to", "would"],
 answer: "must",
 feedback: "'Must' is used for strong deductions based on clear present evidence."
 },
 {
 id: 2,
 type: "Linking Verbs",
 situation: "Sentence: 'The chef's special soup tastes incredible.'",
 question: "What role does the verb 'tastes' play in this sentence?",
 options: ["Transitive", "Intransitive", "Linking", "Helping"],
 answer: "Linking",
 feedback: "'Tastes' connects the subject (soup) to an adjective describing it (incredible), making it a linking verb."
 },
 {
 id: 3,
 type: "Transitive vs. Intransitive",
 situation: "Sentence: 'The alarm clock rang loudly at 6 AM.'",
 question: "Is the action verb 'rang' transitive or intransitive?",
 options: ["Transitive", "Intransitive", "Linking", "Modal"],
 answer: "Intransitive",
 feedback: "The verb 'rang' is intransitive because it does not take a direct object; 'loudly' is an adverb."
 },
 {
 id: 4,
 type: "Finite vs. Non-finite Verbs",
 situation: "Sentence: 'They plan to travel to Japan next year.'",
 question: "Identify the non-finite verb (infinitive) in the sentence.",
 options: ["plan", "to travel", "travel", "to Japan"],
 answer: "to travel",
 feedback: "'To travel' is an infinitive, which is a non-finite verb form that doesn't change with subject or tense."
 },
 {
 id: 5,
 type: "Regular vs. Irregular Verbs",
 situation: "Consider the past tense of the verb 'catch'.",
 question: "Is 'catch' a regular or irregular verb, and what is its past tense form?",
 options: ["Regular: catched", "Irregular: caught", "Regular: caught", "Irregular: catch"],
 answer: "Irregular: caught",
 feedback: "Irregular verbs don't form their past tense by adding '-ed'. The past of 'catch' is 'caught'."
 },
 {
 id: 6,
 type: "Modal Verbs",
 situation: "You want to politely ask a stranger for the time.",
 question: "Which modal verb makes the request most polite: '___ you tell me the time, please?'",
 options: ["Must", "Should", "Could", "May"],
 answer: "Could",
 feedback: "'Could' is used to make polite requests."
 }
];

export default function LabE11VerbsModals({ onExit }: { onExit?: () => void }) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
 const [selectedOption, setSelectedOption] = useState<string | null>(null);
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 const scenario = SCENARIOS[currentScenarioIndex];

 const handleCheck = () => {
 if (selectedOption === scenario.answer) {
  setIsCorrect(true);
 } else {
  setIsCorrect(false);
 }
 };

 const handleNext = () => {
 setSelectedOption(null);
 setIsCorrect(null);
 setCurrentScenarioIndex((prev) => (prev + 1) % SCENARIOS.length);
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:bg-[#121212] font-sans text-slate-900 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
  <header className="flex items-center p-4 bg-white dark:bg-[#1c1b1b] shadow-sm z-10 border-b border-slate-200 dark:border-[#2a2a2a]">
  <button 
   onClick={onExit} 
   className="mr-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-[#2a2a2a] transition-colors whitespace-nowrap flex-shrink-0"
  >
   <ArrowLeft size={24} />
  </button>
  <h1 className="text-2xl font-bold flex-1 flex items-center gap-2">
   <Activity className="text-indigo-500" />
   
                    {t('lab.e11verbsmodals_verbs_modals')}
                   </h1>
  </header>

  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
   onClick={() => setActiveMobileTab('theory')}
   className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
  >
   
                    {t('lab.e11verbsmodals_theory')}
                   </button>
   <button 
   onClick={() => setActiveMobileTab('lab')}
   className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
  >{t('lab.e11verbsmodals_lab')}</button>
  </div>

  <main className="flex-grow p-4 md:p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg: lg:overflow-visible">
  {/* Window 1: Theory */}
  <section className={`w-full rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col lg:h-full ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
   <BookOpen size={20} className="text-[#4158D1]" />
   
                        {t('lab.e11verbsmodals_study_notes')}
                        </h2>
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-[500px] pr-2">
   <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{t('lab.e11verbsmodals_introduction_to_verbs')}</h3>
   <p className="mb-4">{t('lab.e11verbsmodals_verbs_describe_an_action_state')}</p>

   <h4 className="text-md font-bold text-slate-800 dark:text-white mb-2 mt-4">{t('lab.e11verbsmodals_action_vs_linking_verbs')}</h4>
   <ul className="list-disc pl-5 mb-4 space-y-2">
    <li><strong>{t('lab.e11verbsmodals_action_verbs')}</strong>  {t('lab.e11verbsmodals_express_physical_or_mental_act')} <em>{t('lab.e11verbsmodals_example_she_runs_every_morning')}</em></li>
    <li><strong>{t('lab.e11verbsmodals_linking_verbs')}</strong>  {t('lab.e11verbsmodals_connect_the_subject_to_a_compl')} <em>{t('lab.e11verbsmodals_example_the_soup_tastes_delici')}</em></li>
   </ul>

   <h4 className="text-md font-bold text-slate-800 dark:text-white mb-2 mt-4">{t('lab.e11verbsmodals_transitive_vs_intransitive_ver')}</h4>
   <ul className="list-disc pl-5 mb-4 space-y-2">
    <li><strong>{t('lab.e11verbsmodals_transitive_verbs')}</strong>  {t('lab.e11verbsmodals_require_a_direct_object_to_com')} <em>{t('lab.e11verbsmodals_example_she_wrote_a_letter_obj')}</em></li>
    <li><strong>{t('lab.e11verbsmodals_intransitive_verbs')}</strong>  {t('lab.e11verbsmodals_do_not_take_an_object')} <em>{t('lab.e11verbsmodals_example_he_slept_peacefully')}</em></li>
   </ul>

   <h4 className="text-md font-bold text-slate-800 dark:text-white mb-2 mt-4">{t('lab.e11verbsmodals_finite_vs_non_finite_verbs')}</h4>
   <ul className="list-disc pl-5 mb-4 space-y-2">
    <li><strong>{t('lab.e11verbsmodals_finite_verbs')}</strong>  {t('lab.e11verbsmodals_change_their_form_according_to')} <em>{t('lab.e11verbsmodals_example_i_walk_he_walks')}</em></li>
    <li><strong>{t('lab.e11verbsmodals_non_finite_verbs')}</strong>  {t('lab.e11verbsmodals_infinitives_participles_gerund')} <em>{t('lab.e11verbsmodals_example_i_want_to_walk_he_want')}</em></li>
   </ul>

   <h4 className="text-md font-bold text-slate-800 dark:text-white mb-2 mt-4">{t('lab.e11verbsmodals_regular_vs_irregular_verbs')}</h4>
   <ul className="list-disc pl-5 mb-4 space-y-2">
    <li><strong>{t('lab.e11verbsmodals_regular_verbs')}</strong>  {t('lab.e11verbsmodals_form_their_past_tense_by_addin')} <em>{t('lab.e11verbsmodals_example_play_played')}</em></li>
    <li><strong>{t('lab.e11verbsmodals_irregular_verbs')}</strong>  {t('lab.e11verbsmodals_have_unique_past_tense_forms_t')} <em>{t('lab.e11verbsmodals_example_catch_caught_go_went')}</em></li>
   </ul>

   <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 mt-6">{t('lab.e11verbsmodals_modal_verbs')}</h3>
   <p className="mb-4">{t('lab.e11verbsmodals_modal_verbs_are_helping_verbs_')}</p>
   <ul className="list-disc pl-5 space-y-3">
    <li><strong>{t('lab.e11verbsmodals_must')}</strong>  {t('lab.e11verbsmodals_expresses_strong_obligation_or')} <em>{t('lab.e11verbsmodals_example_it_must_be_raining')}</em></li>
    <li><strong>{t('lab.e11verbsmodals_might_may')}</strong>  {t('lab.e11verbsmodals_expresses_possibility_or_is_us')} <em>{t('lab.e11verbsmodals_example_it_might_rain_later')}</em></li>
    <li><strong>{t('lab.e11verbsmodals_should_ought_to')}</strong>  {t('lab.e11verbsmodals_used_for_giving_advice_recomme')} <em>{t('lab.e11verbsmodals_example_you_should_study_more')}</em></li>
    <li><strong>{t('lab.e11verbsmodals_can_could')}</strong>  {t('lab.e11verbsmodals_expresses_ability_possibility_')} <em>{t('lab.e11verbsmodals_example_could_you_help_me')}</em></li>
    <li><strong>{t('lab.e11verbsmodals_will_would')}</strong>  {t('lab.e11verbsmodals_used_for_future_intentions_con')} <em>{t('lab.e11verbsmodals_example_i_will_go_to_the_store')}</em></li>
   </ul>
   </div>
  </section>

  {/* Window 2: Controls */}
  <section className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex-col lg:h-full '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
   <List size={20} className="text-[#4158D1]" />
   
                        {t('lab.e11verbsmodals_scenario_simulator')}
                        </h2>
   
   <div className="flex-grow flex flex-col justify-between overflow-y-auto pr-2">
   <div>
    <div className="mb-6">
    <p className="text-sm font-semibold text-slate-500 dark:text-[#a1a1aa] mb-1">{t('lab.e11verbsmodals_scenario')} {currentScenarioIndex + 1} of {SCENARIOS.length}</p>
    <p className="text-lg font-medium text-slate-800 dark:text-white">{scenario.type}</p>
    </div>
    
    <p className="text-sm font-bold text-slate-700 dark:text-[#a1a1aa] mb-3 uppercase tracking-wider">{t('lab.e11verbsmodals_select_the_best_answer')}</p>
    <div className="space-y-3 mb-6">
    {scenario.options.map(opt => (
     <button
     key={opt}
     disabled={isCorrect === true}
     onClick={() => {
      if (isCorrect !== true) {
      setSelectedOption(opt);
      setIsCorrect(null);
      }
     }}
     className={`w-full p-4 rounded-xl font-semibold text-base text-left transition-all border-2 flex items-center justify-between group ${ selectedOption === opt ? 'bg-indigo-50 border-[#4158D1] text-[#4158D1] dark:bg-[#4158D1]/20 dark:border-[#4158D1] dark:text-indigo-300' : 'bg-white dark:bg-[#121212] dark:border-[#1c1b1b] border-slate-200 dark:border-[#1c1b1b] text-slate-700 dark:text-slate-300 hover:border-[#4158D1]/50 hover:bg-slate-50 dark:bg-[#121212] dark:border-[#2a2a2a] dark:text-[#ffffff] dark:hover:bg-[#2a2a2a]' } ${isCorrect === true ? 'opacity-60 cursor-not-allowed' : ''}`}
     >
     <span>{opt}</span>
     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedOption === opt ? 'border-[#4158D1]' : 'border-slate-300 dark:border-slate-600 group-hover:border-[#4158D1]/50'}`}>
      {selectedOption === opt && <div className={`w-2.5 h-2.5 bg-[#4158D1] rounded-full flex-col `} />}
     </div>
     </button>
    ))}
    </div>
   </div>

   <div className="mt-4 pt-4 border-t border-slate-200 dark:border-[#2a2a2a]">
    {isCorrect === false && (
    <div className="mb-4 text-rose-500 font-medium flex items-center gap-2">
     <AlertCircle size={20} />
     
                                      {t('lab.e11verbsmodals_incorrect_review_the_options')}
                                     </div>
    )}
    
    {isCorrect === null || isCorrect === false ? (
    <button 
     onClick={handleCheck}
     disabled={!selectedOption}
     className={`w-full py-3 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 ${ selectedOption ? 'bg-[#4158D1] hover:bg-indigo-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-[#71717a]' }`}
    >
     
                                      {t('lab.e11verbsmodals_verify_answer')} <Check size={20} />
    </button>
    ) : (
    <button 
     onClick={handleNext}
     className={`w-full py-3 bg-[#4158D1] hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 flex-col `}
    >
     
                                          {t('lab.e11verbsmodals_next_scenario')}
                                         </button>
    )}
   </div>
   </div>
  </section>

  {/* Window 3: Simulation */}
  <section className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] relative items-center justify-center p-8 lg:min-h-[35vh] lg:min-h-[500px] lg:h-full flex-col '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   
   <div className={`p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-slate-200 dark:border-[#1c1b1b] flex-col relative ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   
   <div className="mb-8">
    <p className="text-lg text-slate-600 dark:text-[#71717a] mb-2 font-medium">{t('lab.e11verbsmodals_situation')}</p>
    <p className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-[#ffffff] mb-6 italic border-l-4 border-[#4158D1] pl-4">"{scenario.situation}"</p>
    
    <div className="flex items-start gap-3 mt-6 bg-slate-50 dark:bg-[#1c1b1b] p-6 rounded-xl border border-slate-100 dark:border-[#2a2a2a]">
    <HelpCircle className="text-[#4158D1] mt-1 flex-shrink-0" size={24} />
    <p className="text-xl font-medium text-slate-800 dark:text-[#ffffff]">{scenario.question}</p>
    </div>
   </div>

   {isCorrect === true && (
    <div className="mt-4 p-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl animate-in fade-in slide-in-from-bottom-4">
    <div className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2 mb-2">
     <Check size={20} />  {t('lab.e11verbsmodals_correct')}
                                     </div>
    <p className="text-slate-700 dark:text-[#a1a1aa] leading-relaxed">
     {scenario.feedback}
    </p>
    </div>
   )}
   
   </div>
   
  </section>
  </main>
 </div>
 );
}
