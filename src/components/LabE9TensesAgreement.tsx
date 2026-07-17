import { useState } from 'react';
import { 
 Clock, CheckCircle, AlertTriangle, Activity, 
 ShieldCheck, Zap, 
 BookOpen, Target, Settings, GitCommit
} from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

interface Anomaly {
 id: number;
 sentenceStart: string;
 sentenceEnd: string;
 baseVerb: string;
 expectedTimeframe: string;
 expectedAspect: string;
 expectedSubjectNumber: string;
 correctVerb: string;
 hint: string;
}

const anomalies: Anomaly[] = [
 {
 id: 1,
 sentenceStart: "Neither the captain nor the crew members ",
 sentenceEnd: " the coordinates when the system crashed.",
 baseVerb: "calculate",
 expectedTimeframe: "Past",
 expectedAspect: "Continuous",
 expectedSubjectNumber: "Plural",
 correctVerb: "were calculating",
 hint: "An ongoing action interrupted by another action in the past. Proximity rule: 'crew members' is plural."
 },
 {
 id: 2,
 sentenceStart: "The fleet of starships ",
 sentenceEnd: " in orbit for three weeks by tomorrow.",
 baseVerb: "wait",
 expectedTimeframe: "Future",
 expectedAspect: "Perfect Continuous",
 expectedSubjectNumber: "Singular",
 correctVerb: "will have been waiting",
 hint: "Action continuing up to a point in the future. 'Fleet' acts as a single entity."
 },
 {
 id: 3,
 sentenceStart: "Everybody in the station ",
 sentenceEnd: " a daily ration of water.",
 baseVerb: "receive",
 expectedTimeframe: "Present",
 expectedAspect: "Simple",
 expectedSubjectNumber: "Singular",
 correctVerb: "receives",
 hint: "'Everybody' is an indefinite pronoun and takes a singular verb. General fact -> Present Simple."
 },
 {
 id: 4,
 sentenceStart: "By the time the rescue team arrives, the survivors ",
 sentenceEnd: " all their supplies.",
 baseVerb: "consume",
 expectedTimeframe: "Future",
 expectedAspect: "Perfect",
 expectedSubjectNumber: "Plural",
 correctVerb: "will have consumed",
 hint: "Action completed before a future moment. 'Survivors' is plural."
 }
];

export default function LabE9TensesAgreement({ onExit }: { onExit?: () => void }) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [currentAnomalyIdx, setCurrentAnomalyIdx] = useState(0);
 const [timeframe, setTimeframe] = useState("Present");
 const [aspect, setAspect] = useState("Simple");
 const [subjectNumber, setSubjectNumber] = useState("Singular");
 const [simulationStatus, setSimulationStatus] = useState<'idle' | 'success' | 'error'>('idle');
 const [logs, setLogs] = useState<{ id: number; message: string; timestamp: string; type: 'success' | 'error' }[]>([]);
 
 const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
 const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

 const currentAnomaly = anomalies[currentAnomalyIdx];

 const handleFixTimeline = () => {
 if (!currentAnomaly) return;

 if (
  timeframe === currentAnomaly.expectedTimeframe &&
  aspect === currentAnomaly.expectedAspect &&
  subjectNumber === currentAnomaly.expectedSubjectNumber
 ) {
  setSimulationStatus('success');
  addLog(`Stabilized Timeline #${currentAnomaly.id}: Used ${timeframe} ${aspect} (${subjectNumber}) -> "${currentAnomaly.correctVerb}"`, 'success');
  setTimeout(() => {
  if (currentAnomalyIdx < anomalies.length - 1) {
   setCurrentAnomalyIdx(prev => prev + 1);
   setSimulationStatus('idle');
   setTimeframe("Present");
   setAspect("Simple");
   setSubjectNumber("Singular");
  } else {
   setCurrentAnomalyIdx(prev => prev + 1);
  }
  }, 2000);
 } else {
  setSimulationStatus('error');
  addLog(`Failed to stabilize Timeline #${currentAnomaly.id}: Invalid parameters selected.`, 'error');
 }
 };

 const addLog = (message: string, type: 'success' | 'error') => {
 setLogs(prev => [{
  id: Date.now(),
  message,
  timestamp: new Date().toLocaleTimeString(),
  type
 }, ...prev].slice(0, 5));
 };

 const questions = [
 {
  q: "Which sentence demonstrates the correct application of the 'Proximity Rule'?",
  options: [
  "Either the commander or the officers is going to the surface.",
  "Either the commander or the officers are going to the surface.",
  "Either the officers or the commander are going to the surface."
  ],
  correct: 1
 },
 {
  q: "Select the correct tense for an action that started in the past, continues into the present, and emphasizes duration:",
  options: [
  "Present Perfect",
  "Present Continuous",
  "Present Perfect Continuous"
  ],
  correct: 2
 },
 {
  q: "Identify the correct verb agreement: 'The jury ___ finally reached a verdict.'",
  options: [
  "have",
  "has",
  "are"
  ],
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
 <div className="min-min- lg: bg-slate-50 dark:!bg-[#000000] flex flex-col font-sans min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader title={t('lab.e9tensesagreement_tenses_subject_verb_agreement')} onExit={onExit} />
  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
   onClick={() => setActiveMobileTab('theory')}
   className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-[#a1a1aa] border border-slate-200 dark:border-gray-700'}`}
  >
   
                    {t('lab.e9tensesagreement_theory')}
                   </button>
   <button 
   onClick={() => setActiveMobileTab('lab')}
   className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-[#a1a1aa] border border-slate-200 dark:border-gray-700'}`}
  >{t('lab.e9tensesagreement_lab')}</button>
  </div>

  <main className="flex-grow p-4 md:p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg:overflow-visible">
  
  {/* Window 1: Theory */}
  <section className={`w-full rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-[#2a2a2a]">
   <div className={`p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex-col `}>
    <BookOpen className="w-6 h-6" />
   </div>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.e9tensesagreement_theory_matrix')}</h2>
   </div>
   
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-[500px] pr-2">
   <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] flex items-center gap-2 mb-4">
    <Clock className="w-5 h-5 text-indigo-500" />
    
                             {t('lab.e9tensesagreement_the_tense_timeline')}
                            </h3>
   <p>{t('lab.e9tensesagreement_tenses_establish_when_an_actio')} <strong>{t('lab.e9tensesagreement_timeframe')}</strong>  {t('lab.e9tensesagreement_past_present_future_and_an')} <strong>{t('lab.e9tensesagreement_aspect')}</strong>  {t('lab.e9tensesagreement_simple_continuous_perfect_perf')}</p>
   
   <ul className="space-y-4 my-4">
    <li>
    <strong className="text-slate-800 dark:text-[#ffffff]">{t('lab.e9tensesagreement_simple')}</strong>  {t('lab.e9tensesagreement_general_facts_habitual_actions')}
                                 <br/><em className="text-slate-500 dark:text-slate-400">{t('lab.e9tensesagreement_example_she_writes_code')}</em>
    </li>
    <li>
    <strong className="text-slate-800 dark:text-[#ffffff]">{t('lab.e9tensesagreement_continuous_progressive')}</strong>  {t('lab.e9tensesagreement_ongoing_actions_happening_at_a')}
                                 <br/><em className="text-slate-500 dark:text-slate-400">{t('lab.e9tensesagreement_example_she_is_writing_code_ri')}</em>
    </li>
    <li>
    <strong className="text-slate-800 dark:text-[#ffffff]">{t('lab.e9tensesagreement_perfect')}</strong>  {t('lab.e9tensesagreement_actions_completed_before_a_cer')}
                                 <br/><em className="text-slate-500 dark:text-slate-400">{t('lab.e9tensesagreement_example_she_has_written_the_co')}</em>
    </li>
    <li>
    <strong className="text-slate-800 dark:text-[#ffffff]">{t('lab.e9tensesagreement_perfect_continuous')}</strong>  {t('lab.e9tensesagreement_ongoing_actions_leading_up_to_')}
                                 <br/><em className="text-slate-500 dark:text-slate-400">{t('lab.e9tensesagreement_example_she_has_been_writing_c')}</em>
    </li>
   </ul>

   <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] flex items-center gap-2 mt-8 mb-4">
    <GitCommit className="w-5 h-5 text-emerald-500" />
    
                             {t('lab.e9tensesagreement_subject_verb_agreement')}
                            </h3>
   <p>{t('lab.e9tensesagreement_the_verb_must_always_align_wit')}</p>
   
   <div className="space-y-4 mt-4">
    <div className={`bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex-col `}>
    <h4 className="font-medium text-emerald-800 dark:text-emerald-400 mb-1">{t('lab.e9tensesagreement_1_the_proximity_rule')}</h4>
    <p className="text-sm">{t('lab.e9tensesagreement_when_subjects_are_joined_by')} <em>or</em>, <em>{t('lab.e9tensesagreement_nor')}</em>, <em>{t('lab.e9tensesagreement_either_or')}</em>{t('lab.e9tensesagreement_or')} <em>{t('lab.e9tensesagreement_neither_nor')}</em>{t('lab.e9tensesagreement_the_verb_agrees_with_the_subje')}</p>
    <p className={`text-sm font-mono mt-2 bg-white dark:bg-[#1a1a1a] p-2 rounded text-slate-600 dark:text-[#a1a1aa] flex-col `}>{t('lab.e9tensesagreement_neither_the_captain_nor_the')} <span className="text-emerald-600 dark:text-emerald-400 font-bold">{t('lab.e9tensesagreement_officers_are')}</span>  {t('lab.e9tensesagreement_present')}</p>
    </div>
    
    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
    <h4 className="font-medium text-indigo-800 dark:text-indigo-400 mb-1">{t('lab.e9tensesagreement_2_collective_nouns')}</h4>
    <p className="text-sm">{t('lab.e9tensesagreement_nouns_like')} <em>{t('lab.e9tensesagreement_team_jury_fleet_family')}</em>  {t('lab.e9tensesagreement_take_a_singular_verb_when_acti')}</p>
    </div>

    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30">
    <h4 className="font-medium text-amber-800 dark:text-amber-400 mb-1">{t('lab.e9tensesagreement_3_indefinite_pronouns')}</h4>
    <p className="text-sm">{t('lab.e9tensesagreement_pronouns_like')} <em>{t('lab.e9tensesagreement_everyone_nobody_somebody_anyth')}</em>  {t('lab.e9tensesagreement_are_always_singular')}</p>
    </div>
   </div>
   </div>
  </section>

  {/* Window 2: Controls */}
  <section className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex-col '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-[#2a2a2a]">
   <div className="flex items-center gap-3">
    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
    <Settings className="w-6 h-6" />
    </div>
    <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.e9tensesagreement_controls_assessment')}</h2>
   </div>
   </div>

   <div className="overflow-y-auto h-[500px] pr-2 space-y-8">
   {/* Controls */}
   <div className="space-y-6">
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
    <Activity className="w-5 h-5 text-indigo-500" />
    
                                 {t('lab.e9tensesagreement_timeline_parameters')}
                                 </h3>
    <div className="space-y-5">
    <div>
     <label className="block text-sm font-medium text-slate-700 dark:text-[#a1a1aa] mb-2">{t('lab.e9tensesagreement_subject_number')}</label>
     <div className="flex bg-slate-200 dark:bg-[#121212] p-1 rounded-lg">
     {['Singular', 'Plural'].map(num => (
      <button
      key={num}
      onClick={() => setSubjectNumber(num)}
      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${ subjectNumber === num ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-slate-600 dark:text-[#a1a1aa] hover:text-slate-900 dark:hover:text-slate-200' }`}
      >
      {num}
      </button>
     ))}
     </div>
    </div>

    <div>
     <label className="block text-sm font-medium text-slate-700 dark:text-[#a1a1aa] mb-2">{t('lab.e9tensesagreement_timeframe')}</label>
     <div className="flex bg-slate-200 dark:bg-[#121212] p-1 rounded-lg">
     {['Past', 'Present', 'Future'].map(tf => (
      <button
      key={tf}
      onClick={() => setTimeframe(tf)}
      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${ timeframe === tf ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-slate-600 dark:text-[#a1a1aa] hover:text-slate-900 dark:hover:text-slate-200' }`}
      >
      {tf}
      </button>
     ))}
     </div>
    </div>

    <div>
     <label className="block text-sm font-medium text-slate-700 dark:text-[#a1a1aa] mb-2">{t('lab.e9tensesagreement_aspect')}</label>
     <div className="grid grid-cols-2 gap-2">
     {['Simple', 'Continuous', 'Perfect', 'Perfect Continuous'].map(asp => (
      <button
      key={asp}
      onClick={() => setAspect(asp)}
      className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${ aspect === asp ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'border-slate-300 dark:border-[#2a2a2a] text-slate-600 dark:text-[#a1a1aa] hover:border-slate-400 dark:hover:border-slate-600' }`}
      >
      {asp}
      </button>
     ))}
     </div>
    </div>
    </div>
    
    <button
    onClick={handleFixTimeline}
    disabled={simulationStatus === 'success' || currentAnomalyIdx >= anomalies.length}
    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${ simulationStatus === 'success' || currentAnomalyIdx >= anomalies.length ? 'bg-slate-300 dark:bg-[#2a2a2a] text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg' }`}
    >
    <Zap className="w-5 h-5" />  {t('lab.e9tensesagreement_inject_correct_conjugation')}
                                 </button>
   </div>

   {/* Assessment Section */}
   <div className="border-t border-slate-200 dark:border-[#2a2a2a] pt-6">
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] flex items-center gap-2 mb-6">
    <Target className="w-5 h-5 text-rose-500" />
    
                                 {t('lab.e9tensesagreement_knowledge_assessment')}
                                 </h3>
    
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
        className="mt-1 w-4 h-4 text-rose-600 bg-slate-100 dark:bg-[#1c1b1b] border-slate-300 focus:ring-rose-500 dark:bg-[#121212] dark:border-[#2a2a2a]"
        checked={assessmentAnswers[qIdx] === oIdx}
        onChange={() => setAssessmentAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
       />
       <span className="text-sm text-slate-600 dark:text-[#a1a1aa] group-hover:text-slate-900 dark:group-hover:text-slate-200">
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
     className="w-full py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 dark:disabled:bg-[#2a2a2a] disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
     >
     
                                          {t('lab.e9tensesagreement_submit_evaluation')}
                                          </button>
    </div>
    ) : (
    <div className="text-center py-6">
     <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 mb-4">
     <span className="text-3xl font-bold">{calculateScore()}/{questions.length}</span>
     </div>
     <h3 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.e9tensesagreement_assessment_complete')}</h3>
     <p className="text-slate-600 dark:text-[#a1a1aa] mb-6">
     {calculateScore() === questions.length ? 'Perfect mastery of the temporal matrix!' : 'Review the theory matrix and try again.'}
     </p>
     <button
     onClick={() => {
      setAssessmentSubmitted(false);
      setAssessmentAnswers({});
     }}
     className="text-sm text-rose-600 dark:text-rose-400 font-medium hover:underline"
     >
     
                                              {t('lab.e9tensesagreement_retake_assessment')}
                                              </button>
    </div>
    )}
   </div>
   </div>
  </section>

  {/* Window 3: Simulation */}
  <section className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] relative min-h-0 overflow-y-auto p-8 lg:min-h-[35vh] lg:min-h-[500px] flex-col '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="w-full h-full flex flex-col">
   <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
    <Activity className="w-6 h-6 text-indigo-500" />
    
                                 {t('lab.e9tensesagreement_simulation_view')}
                                 </h2>
    <div className="text-sm font-medium text-slate-500 px-3 py-1 rounded-full border border-slate-200 dark:border-[#1c1b1b]">
    
                                 {t('lab.e9tensesagreement_anomaly')} {Math.min(currentAnomalyIdx + 1, anomalies.length)} of {anomalies.length}
    </div>
   </div>

   <div className="flex-1 flex flex-col justify-center space-y-6">
    {currentAnomalyIdx < anomalies.length ? (
    <div className="bg-[#121212] rounded-xl p-6 border border-neutral-800 shadow-inner relative overflow-hidden">
     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 opacity-50 animate-pulse"></div>
     <h3 className="text-red-400 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
     <AlertTriangle className="w-4 h-4" />  {t('lab.e9tensesagreement_temporal_anomaly_detected')}
                                          </h3>
     <p className="text-lg text-slate-300 font-mono leading-relaxed">
     {currentAnomaly.sentenceStart}
     <span className="inline-block px-2 py-1 bg-black text-slate-400 border border-neutral-700 rounded mx-1">
      [{currentAnomaly.baseVerb}]
     </span>
     {currentAnomaly.sentenceEnd}
     </p>
     
     {simulationStatus === 'error' && (
     <div className="mt-4 p-3 bg-red-900/30 border border-red-800/50 rounded-lg text-red-300 text-sm">
      <strong>{t('lab.e9tensesagreement_hint')}</strong> {currentAnomaly.hint}
     </div>
     )}
     {simulationStatus === 'success' && (
     <div className="mt-4 p-3 bg-emerald-900/30 border border-emerald-800/50 rounded-lg text-emerald-400 text-sm font-mono flex items-center gap-2">
      <CheckCircle className="w-4 h-4" />  {t('lab.e9tensesagreement_timeline_stabilized')}{currentAnomaly.correctVerb}"
     </div>
     )}
    </div>
    ) : (
    <div className="text-center p-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
     <ShieldCheck className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
     <h3 className="text-2xl font-bold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.e9tensesagreement_all_timelines_stable')}</h3>
     <p className="text-slate-600 dark:text-[#a1a1aa] mb-6">{t('lab.e9tensesagreement_you_have_successfully_correcte')}</p>
     <button 
     onClick={() => {
      setCurrentAnomalyIdx(0);
      setSimulationStatus('idle');
      setLogs([]);
     }}
     className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
     >
     
                                              {t('lab.e9tensesagreement_restart_simulation')}
                                              </button>
    </div>
    )}

    {/* Logs Panel */}
    <div className="bg-[#121212] rounded-xl border border-neutral-800 p-4 mt-auto h-48 flex flex-col">
    <div className="flex items-center gap-2 mb-3">
     <Activity className="w-4 h-4 text-slate-400" />
     <h3 className="text-sm font-bold text-slate-300">{t('lab.e9tensesagreement_system_logs')}</h3>
    </div>
    <div className="flex-1 overflow-y-auto space-y-2 pr-2">
     {logs.length === 0 ? (
     <p className="text-slate-500 text-xs italic">{t('lab.e9tensesagreement_awaiting_stabilization_attempt')}</p>
     ) : (
     logs.map(log => (
      <div key={log.id} className="flex gap-3 text-xs">
      <span className="text-slate-600 font-mono shrink-0">[{log.timestamp}]</span>
      <span className={log.type === 'success' ? 'text-emerald-400' : 'text-red-400'}>
       {log.message}
      </span>
      </div>
     ))
     )}
    </div>
    </div>
   </div>
   </div>
  </section>

  </main>
 </div>
 );
}
