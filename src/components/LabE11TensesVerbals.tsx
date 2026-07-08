import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, RefreshCw, Clock, Check } from 'lucide-react';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

const STORY_PARTS = [
 {
 id: 1,
 text: "By the time the rescue team ",
 options: ["arrives", "arrived", "had arrived", "will arrive"],
 correct: "arrived",
 type: "tense",
 hint: "Simple Past (Action completed in the past)",
 timelinePos: "past",
 label: "Team Arrival"
 },
 {
 id: 2,
 text: ", the hikers ",
 options: ["already waited", "had already waited", "have already been waiting", "had already been waiting"],
 correct: "had already been waiting",
 type: "tense",
 hint: "Past Perfect Continuous (Action ongoing up to a point in the past)",
 timelinePos: "past-perfect",
 label: "Hikers Waiting"
 },
 {
 id: 3,
 text: " for hours. Right now, they ",
 options: ["rested", "rest", "are resting", "will rest"],
 correct: "are resting",
 type: "tense",
 hint: "Present Continuous (Happening currently)",
 timelinePos: "present",
 label: "Resting"
 },
 {
 id: 4,
 text: " safely at the base camp. ",
 options: ["To survive", "Surviving", "Survived", "Survive"],
 correct: "Surviving",
 type: "verbal",
 hint: "Gerund acting as the subject of the sentence",
 timelinePos: "general",
 label: "Surviving"
 },
 {
 id: 5,
 text: " such an ordeal requires resilience. By this time tomorrow, they ",
 options: ["will travel", "will have traveled", "will be traveling", "travel"],
 correct: "will be traveling",
 type: "tense",
 hint: "Future Continuous (Action that will be in progress at a specific future time)",
 timelinePos: "future",
 label: "Traveling Home"
 },
 {
 id: 6,
 text: " back to their homes, looking forward to ",
 options: ["settle down", "settling down", "settled down", "have settled down"],
 correct: "settling down",
 type: "phrasal",
 hint: "Gerund after the phrasal verb 'look forward to'",
 timelinePos: "general",
 label: "Settling Down"
 }
];

export default function LabE11TensesVerbals({ onExit }: { onExit?: () => void }) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [answers, setAnswers] = useState<Record<number, string>>({});
 const [feedback, setFeedback] = useState<Record<number, boolean | null>>({});
 const [score, setScore] = useState<number | null>(null);

 const handleSelect = (id: number, value: string) => {
 setAnswers(prev => ({ ...prev, [id]: value }));
 setFeedback(prev => ({ ...prev, [id]: null })); // Reset feedback for this part on change
 };

 const checkAnswers = () => {
 let currentScore = 0;
 const newFeedback: Record<number, boolean> = {};
 STORY_PARTS.forEach(part => {
  const isCorrect = answers[part.id] === part.correct;
  newFeedback[part.id] = isCorrect;
  if (isCorrect) currentScore++;
 });
 setFeedback(newFeedback);
 setScore(currentScore);
 };

 const reset = () => {
 setAnswers({});
 setFeedback({});
 setScore(null);
 };

 const renderTimelineEvent = (part: typeof STORY_PARTS[0]) => {
 const isCorrect = feedback[part.id];
 
 let positionClass = "";
 switch (part.timelinePos) {
  case "past-perfect": positionClass = "left-[10%]"; break;
  case "past": positionClass = "left-[30%]"; break;
  case "present": positionClass = "left-[50%]"; break;
  case "future": positionClass = "left-[80%]"; break;
  case "general": positionClass = "left-[50%] top-[70%]"; break;
 }

 return (
  <div 
  key={part.id} 
  className={`absolute flex flex-col items-center transition-all duration-500 ease-in-out ${positionClass} ${part.timelinePos === 'general' ? 'translate-y-8' : '-translate-y-1/2 top-1/2'}`}
  style={{ opacity: isCorrect ? 1 : 0.3 }}
  >
  <div className={`w-4 h-4 rounded-full border-2 ${isCorrect ? 'bg-green-500 border-green-600' : 'bg-slate-300 border-slate-400 dark:bg-slate-700 dark:border-slate-600'}`}></div>
  <div className="mt-2 text-xs font-medium text-slate-700 dark:text-[#a1a1aa] text-center w-24">
   {part.label}
   {isCorrect && <div className="text-[10px] text-green-600 dark:text-green-400 font-bold mt-1">{answers[part.id]}</div>}
  </div>
  </div>
 );
 };

 return (
 <div className="flex flex-col min-min- lg: bg-slate-50 dark:!bg-[#000000] font-sans text-slate-900 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
  {/* Header */}
  <header className="w-full shadow-sm p-4 flex items-center justify-between z-10 flex-shrink-0">
  <div className="flex items-center gap-4">
   <button
   onClick={onExit}
   className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
   title={t('lab.e11tensesverbals_go_back')}
   >
   <ArrowLeft className="w-6 h-6" />
   </button>
   <h1 className="text-lg md:text-xl font-bold">{t('lab.e11tensesverbals_lab_tenses_verbals')}</h1>
  </div>
  <div className="flex items-center gap-2">
   {score !== null && (
   <span className="font-semibold text-lg mr-4">
    
                             {t('lab.e11tensesverbals_score')} {score} / {STORY_PARTS.length}
   </span>
   )}
   <button
   onClick={reset}
   className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg font-medium transition-colors whitespace-nowrap flex-shrink-0"
   >
   <RefreshCw className="w-4 h-4" />  {t('lab.e11tensesverbals_reset')}
                        </button>
  </div>
  </header>

  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
   onClick={() => setActiveMobileTab('theory')}
   className={`w-full py-3 text-sm font-bold rounded-lg transition-all text-center  ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
  >
   
                    {t('lab.e11tensesverbals_theory')}
                   </button>
   <button 
   onClick={() => setActiveMobileTab('lab')}
   className={`w-full py-3 text-sm font-bold rounded-lg transition-all text-center  'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
  >{t('lab.e11tensesverbals_lab')}</button>
  </div>

  {/* Main Content Area */}
  <main className="flex-grow p-4 md:p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg:overflow-visible">
  
  {/* Window 1: Theory */}
  <section className={`w-full rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">{t('lab.e11tensesverbals_grammar_theory')}</h2>
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-[calc(100vh-16rem)] pr-2">
   <p>
    
                             {t('lab.e11tensesverbals_mastering_tenses_and_verbals_h')}
                            </p>

   <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-lg mt-6">{t('lab.e11tensesverbals_1_past_and_past_perfect')}</h3>
   <p>
    
                             {t('lab.e11tensesverbals_when_narrating_events_in_the_p')}
                            </p>
   <ul className="list-disc pl-5 mt-2 space-y-2">
    <li>
    <strong>{t('lab.e11tensesverbals_simple_past')}</strong>  {t('lab.e11tensesverbals_used_for_an_action_that_was_co')} <br/>
    <em>{t('lab.e11tensesverbals_example_the_rescue_team')} <strong>{t('lab.e11tensesverbals_arrived')}</strong>."</em>
    </li>
    <li>
    <strong>{t('lab.e11tensesverbals_past_perfect_continuous')}</strong>  {t('lab.e11tensesverbals_emphasizes_the_ongoing_nature_')} <em>{t('lab.e11tensesverbals_before')}</em>  {t('lab.e11tensesverbals_another_action_in_the_past')} <br/>
    <em>{t('lab.e11tensesverbals_example_the_hikers')} <strong>{t('lab.e11tensesverbals_had_been_waiting')}</strong>  {t('lab.e11tensesverbals_for_hours_by_the_time_the_team')}</em>
    </li>
   </ul>

   <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-lg mt-6">{t('lab.e11tensesverbals_2_present_tenses')}</h3>
   <p>
    
                             {t('lab.e11tensesverbals_the')} <strong>{t('lab.e11tensesverbals_present_continuous')}</strong>  {t('lab.e11tensesverbals_tense_describes_actions_happen')} <br/>
    <em>{t('lab.e11tensesverbals_example_right_now_they')} <strong>{t('lab.e11tensesverbals_are_resting')}</strong>."</em>
   </p>

   <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-lg mt-6">{t('lab.e11tensesverbals_3_verbals_gerunds')}</h3>
   <p>
    A <strong>{t('lab.e11tensesverbals_gerund')}</strong>  {t('lab.e11tensesverbals_is_a_verb_ending_in')} <em>{t('lab.e11tensesverbals_ing')}</em>  {t('lab.e11tensesverbals_that_functions_entirely_as_a_n')}
                            </p>
   <ul className="list-disc pl-5 mt-2 space-y-2">
    <li>
    <strong>{t('lab.e11tensesverbals_as_a_subject')}</strong>  {t('lab.e11tensesverbals_a_gerund_can_act_as_the_main_s')} <br/>
    <em>{t('lab.e11tensesverbals_example')}<strong>{t('lab.e11tensesverbals_surviving')}</strong>  {t('lab.e11tensesverbals_such_an_ordeal_requires_resili')}</em>
    </li>
    <li>
    <strong>{t('lab.e11tensesverbals_object_of_a_preposition')}</strong>  {t('lab.e11tensesverbals_gerunds_must_be_used_after_pre')} <br/>
    <em>{t('lab.e11tensesverbals_example_looking_forward_to')} <strong>{t('lab.e11tensesverbals_settling')}</strong>  {t('lab.e11tensesverbals_down')}</em>  {t('lab.e11tensesverbals_note_to_is_a_preposition_here_')}
                                 </li>
   </ul>

   <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-lg mt-6">{t('lab.e11tensesverbals_4_future_tenses')}</h3>
   <p>
    
                             {t('lab.e11tensesverbals_the')} <strong>{t('lab.e11tensesverbals_future_continuous')}</strong>  {t('lab.e11tensesverbals_tense_describes_an_action_that')} <em>{t('lab.e11tensesverbals_will_be')}</em>  {t('lab.e11tensesverbals_present_participle')} <br/>
    <em>{t('lab.e11tensesverbals_example_by_this_time_tomorrow_')} <strong>{t('lab.e11tensesverbals_will_be_traveling')}</strong>."</em>
   </p>
   </div>
  </section>

  {/* Window 2: Controls */}
  <section className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex-col '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="mb-6">
   <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-slate-800 dark:text-white">
    <Clock className="w-5 h-5 text-blue-500" />
    
                             {t('lab.e11tensesverbals_narrative_editor')}
                            </h2>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">
    
                             {t('lab.e11tensesverbals_fix_the_tense_inconsistencies_')}
                            </p>
   </div>

   <div className={`flex-1 text-lg leading-[2.5] p-6 rounded-xl border border-slate-200 dark:border-[#1c1b1b] lg:overflow-y-auto flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   {STORY_PARTS.map((part) => (
    <span key={part.id}>
    <span>{part.text}</span>
    <span className="inline-block relative">
     <select
     className={`appearance-none bg-slate-50 dark:bg-[#1c1b1b] border-b-2 font-semibold text-blue-600 dark:text-blue-400 px-3 py-1 mx-1 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer ${feedback[part.id] === true ? 'border-green-500 text-green-600 dark:text-green-400' : ''} ${feedback[part.id] === false ? 'border-red-500 text-red-600 dark:text-red-400' : 'border-blue-300 dark:border-blue-700'}`}
     value={answers[part.id] || ""}
     onChange={(e) => handleSelect(part.id, e.target.value)}
     >
     <option value="" disabled>{t('lab.e11tensesverbals_select')}</option>
     {part.options.map(opt => (
      <option key={opt} value={opt}>{opt}</option>
     ))}
     </select>
     {feedback[part.id] === true && (
     <CheckCircle className={`w-4 h-4 text-green-500 absolute -top-2 -right-2 rounded-full flex-col `} />
     )}
     {feedback[part.id] === false && (
     <XCircle className={`w-4 h-4 text-red-500 absolute -top-2 -right-2 rounded-full flex-col `} />
     )}
    </span>
    {feedback[part.id] === false && (
     <span className="block text-xs text-red-600 dark:text-red-400 mt-1 font-medium bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded border border-red-200 dark:border-red-800/50 max-w-sm">
     
                        {t('lab.e11tensesverbals_hint')} {part.hint}
     </span>
    )}
    </span>
   ))}
   </div>

   <div className="mt-6 flex justify-end">
   <button
    onClick={checkAnswers}
    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-sm dark:bg-blue-500 dark:hover:bg-blue-400 w-full justify-center md:w-auto"
   >
    <Check className="w-5 h-5" />  {t('lab.e11tensesverbals_check_narrative')}
                            </button>
   </div>
  </section>

  {/* Window 3: Simulation */}
  <section className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] relative flex-col items-center justify-center p-4 md:p-8 lg:min-h-[300px] md:lg:min-h-[500px] '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="w-full mb-8 z-10 self-start">
   <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">{t('lab.e11tensesverbals_temporal_visualization')}</h2>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">
    
                             {t('lab.e11tensesverbals_as_you_correct_the_tenses_the_')}
                            </p>
   </div>
   
   <div className={`flex-1 w-full relative rounded-xl border border-slate-200 dark:border-[#1c1b1b] items-center p-8 shadow-inner overflow-x-auto min-h-[300px] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   {/* Timeline Axis */}
   <div className="absolute left-8 right-8 h-1 bg-slate-300 dark:bg-slate-600 top-1/2 -translate-y-1/2 rounded-full min-w-[500px]"></div>
   
   {/* Markers */}
   <div className="absolute left-[10%] top-1/2 w-0.5 h-6 bg-slate-400 dark:bg-slate-50 dark:bg-[#000000]0 -translate-y-1/2 -ml-[1px]"></div>
   <div className="absolute left-[30%] top-1/2 w-0.5 h-6 bg-slate-400 dark:bg-slate-50 dark:bg-[#000000]0 -translate-y-1/2 -ml-[1px]"></div>
   <div className="absolute left-[50%] top-1/2 w-0.5 h-8 bg-blue-500 dark:bg-blue-400 -translate-y-1/2 -ml-[1px]"></div>
   <div className="absolute left-[80%] top-1/2 w-0.5 h-6 bg-slate-400 dark:bg-slate-50 dark:bg-[#000000]0 -translate-y-1/2 -ml-[1px]"></div>

   {/* Axis Labels */}
   <div className="absolute left-[10%] top-1/2 mt-6 -translate-x-1/2 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('lab.e11tensesverbals_past_perfect')}</div>
   <div className="absolute left-[30%] top-1/2 mt-6 -translate-x-1/2 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('lab.e11tensesverbals_past')}</div>
   <div className="absolute left-[50%] top-1/2 mt-8 -translate-x-1/2 text-sm font-bold text-blue-500 uppercase tracking-wider">{t('lab.e11tensesverbals_present')}</div>
   <div className="absolute left-[80%] top-1/2 mt-6 -translate-x-1/2 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('lab.e11tensesverbals_future')}</div>

   {/* Events */}
   {STORY_PARTS.map(renderTimelineEvent)}
   </div>
  </section>

  </main>
 </div>
 );
}
