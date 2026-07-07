import { useState } from 'react';
import { BookOpen, Target, Mic, CheckCircle2, ChevronRight } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabE10SentenceNarrationProps {
 onExit?: () => void;
}

const NARRATION_SCENARIOS = [
 {
 speaker: "Mayor",
 direct: "I will build a new hospital tomorrow.",
 parts: [
  { id: 'p1', text: "The mayor said that", type: "intro" },
  { id: 'p2', text: "he", type: "pronoun" },
  { id: 'p3', text: "would build", type: "verb" },
  { id: 'p4', text: "a new hospital", type: "object" },
  { id: 'p5', text: "the next day.", type: "time" }
 ],
 incorrectOptions: [
  { id: 'i1', text: "I", type: "pronoun" },
  { id: 'i2', text: "will build", type: "verb" },
  { id: 'i3', text: "tomorrow.", type: "time" }
 ]
 },
 {
 speaker: "Detective",
 direct: "Where are you going?",
 parts: [
  { id: 'p1', text: "The detective asked", type: "intro" },
  { id: 'p2', text: "where", type: "question_word" },
  { id: 'p3', text: "I", type: "pronoun" },
  { id: 'p4', text: "was going.", type: "verb" }
 ],
 incorrectOptions: [
  { id: 'i1', text: "where was I going.", type: "verb" },
  { id: 'i2', text: "where are you going.", type: "verb" },
  { id: 'i3', text: "if", type: "question_word" }
 ]
 },
 {
 speaker: "Teacher",
 direct: "Did you finish your homework?",
 parts: [
  { id: 'p1', text: "The teacher asked", type: "intro" },
  { id: 'p2', text: "if", type: "question_word" },
  { id: 'p3', text: "I", type: "pronoun" },
  { id: 'p4', text: "had finished", type: "verb" },
  { id: 'p5', text: "my homework.", type: "object" }
 ],
 incorrectOptions: [
  { id: 'i1', text: "did I finish", type: "verb" },
  { id: 'i2', text: "finished", type: "verb" },
  { id: 'i3', text: "your homework.", type: "object" },
  { id: 'i4', text: "that", type: "intro" }
 ]
 }
];

export default function LabE10SentenceNarration({ onExit = () => {} }: LabE10SentenceNarrationProps) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 
 const [currentScenario, setCurrentScenario] = useState(0);
 const [constructed, setConstructed] = useState<any[]>([]);
 const [availablePieces, setAvailablePieces] = useState(() => {
 const scene = NARRATION_SCENARIOS[0];
 return [...scene.parts, ...scene.incorrectOptions].sort(() => Math.random() - 0.5);
 });

 const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
 const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

 const questions = [
 {
  q: "Which type of sentence contains two independent clauses joined by a conjunction?",
  options: ["Simple", "Complex", "Compound", "Compound-Complex"],
  correct: 2
 },
 {
  q: "How does the time word 'yesterday' change in indirect speech?",
  options: ["the previous day", "the next day", "today", "yesterday"],
  correct: 0
 },
 {
  q: "Convert to indirect speech: She asked, 'Do you like tea?'",
  options: [
  "She asked do I like tea.",
  "She asked if I liked tea.",
  "She asked that I liked tea.",
  "She asked if I like tea."
  ],
  correct: 1
 }
 ];

 const handleSelectPiece = (piece: any) => {
 setConstructed(prev => [...prev, piece]);
 setAvailablePieces(prev => prev.filter(p => p.id !== piece.id));
 };

 const handleRemovePiece = (piece: any) => {
 setConstructed(prev => prev.filter(p => p.id !== piece.id));
 setAvailablePieces(prev => [...prev, piece]);
 };

 const checkConstruction = () => {
 const correctOrder = NARRATION_SCENARIOS[currentScenario].parts;
 if (constructed.length !== correctOrder.length) return false;
 
 for (let i = 0; i < constructed.length; i++) {
  if (constructed[i].id !== correctOrder[i].id) return false;
 }
 return true;
 };

 const nextScenario = () => {
 const nextIdx = (currentScenario + 1) % NARRATION_SCENARIOS.length;
 setCurrentScenario(nextIdx);
 setConstructed([]);
 const scene = NARRATION_SCENARIOS[nextIdx];
 setAvailablePieces([...scene.parts, ...scene.incorrectOptions].sort(() => Math.random() - 0.5));
 };

 const calculateScore = () => {
 let score = 0;
 questions.forEach((q, idx) => {
  if (assessmentAnswers[idx] === q.correct) score++;
 });
 return score;
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:bg-[#000000] font-sans text-slate-900 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader title={t('lab.e10sentencenarration_unit_7_the_reporter_s_desk_nar')} variant="dark" onExit={onExit} />
  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-[#a1a1aa] border border-slate-200 dark:border-[#2a2a2a]'}`}
   >
    
                     {t('lab.e10sentencenarration_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-[#a1a1aa] border border-slate-200 dark:border-[#2a2a2a]'}`}
   >{t('lab.e10sentencenarration_lab')}</button>
  </div>

  <main className="flex-grow p-4 md:p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg: lg:overflow-visible">
  
  {/* Window 1: Theory */}
  <section className={`w-full rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-3 mb-4">
   <BookOpen className="w-5 h-5 text-[#4158D1] dark:text-[#6b81fb]" />
   <h2 className="text-lg font-bold text-slate-900 dark:text-[#ffffff]">{t('lab.e10sentencenarration_grammar_theory')}</h2>
   </div>
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-[calc(100vh-250px)] lg:h-[calc(100vh-180px)] pr-2">
   <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mb-3">{t('lab.e10sentencenarration_1_types_of_sentences')}</h3>
   <p>{t('lab.e10sentencenarration_in_english_grammar_sentences_a')}</p>
   <ul className="list-disc pl-5 space-y-2 mb-6">
    <li><strong>{t('lab.e10sentencenarration_simple_sentence')}</strong>  {t('lab.e10sentencenarration_contains_a_single_independent_')} <br/><em className="text-slate-500 dark:text-[#71717a]">{t('lab.e10sentencenarration_example_the_reporter_took_note')}</em></li>
    <li><strong>{t('lab.e10sentencenarration_compound_sentence')}</strong>  {t('lab.e10sentencenarration_contains_two_or_more_independe')} <br/><em className="text-slate-500 dark:text-[#71717a]">{t('lab.e10sentencenarration_example_the_mayor_spoke_and_th')}</em></li>
    <li><strong>{t('lab.e10sentencenarration_complex_sentence')}</strong>  {t('lab.e10sentencenarration_contains_one_independent_claus')} <br/><em className="text-slate-500 dark:text-[#71717a]">{t('lab.e10sentencenarration_example_because_the_mayor_spok')}</em></li>
    <li><strong>{t('lab.e10sentencenarration_compound_complex_sentence')}</strong>  {t('lab.e10sentencenarration_contains_two_or_more_independe_1')}</li>
   </ul>

   <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mb-3">{t('lab.e10sentencenarration_2_direct_vs_indirect_speech_na')}</h3>
   <p><strong>{t('lab.e10sentencenarration_direct_speech')}</strong>  {t('lab.e10sentencenarration_quotes_the_exact_words_spoken_')} <br/><em className="text-slate-500 dark:text-[#71717a]">{t('lab.e10sentencenarration_example_she_said_i_am_reading_')}</em></p>
   <p className="mt-2 mb-4"><strong>{t('lab.e10sentencenarration_indirect_speech_reported_speec')}</strong>  {t('lab.e10sentencenarration_conveys_the_meaning_of_what_wa')}</p>

   <h3 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mb-3">{t('lab.e10sentencenarration_3_rules_for_converting_to_indi')}</h3>
   
   <h4 className="font-medium text-slate-700 dark:text-[#ffffff] mt-4 mb-2">{t('lab.e10sentencenarration_a_tense_changes_backshifting')}</h4>
   <p>{t('lab.e10sentencenarration_if_the_reporting_verb_e_g_said')}</p>
   <ul className="list-disc pl-5 space-y-1 mb-4">
    <li><strong>{t('lab.e10sentencenarration_simple_present_simple_past')}</strong>  {t('lab.e10sentencenarration_e_g_i_walk_he_walked')}</li>
    <li><strong>{t('lab.e10sentencenarration_present_continuous_past_contin')}</strong>  {t('lab.e10sentencenarration_e_g_i_am_walking_he_was_walkin')}</li>
    <li><strong>{t('lab.e10sentencenarration_present_perfect_past_perfect')}</strong>  {t('lab.e10sentencenarration_e_g_i_have_walked_he_had_walke')}</li>
    <li><strong>{t('lab.e10sentencenarration_simple_past_past_perfect')}</strong>  {t('lab.e10sentencenarration_e_g_i_walked_he_had_walked')}</li>
    <li><strong>{t('lab.e10sentencenarration_modals')}</strong>  {t('lab.e10sentencenarration_will_would_can_could_may_might')}</li>
   </ul>

   <h4 className="font-medium text-slate-700 dark:text-[#ffffff] mt-4 mb-2">{t('lab.e10sentencenarration_b_pronoun_changes')}</h4>
   <p>{t('lab.e10sentencenarration_pronouns_change_to_reflect_the')}</p>
   <ul className="list-disc pl-5 space-y-1 mb-4">
    <li>{t('lab.e10sentencenarration_first_person_pronouns_i_we_my_')}</li>
    <li>{t('lab.e10sentencenarration_second_person_pronouns_you_you')}</li>
   </ul>

   <h4 className="font-medium text-slate-700 dark:text-[#ffffff] mt-4 mb-2">{t('lab.e10sentencenarration_c_time_and_place_expressions')}</h4>
   <p>{t('lab.e10sentencenarration_words_indicating_proximity_in_')}</p>
   <ul className="list-disc pl-5 space-y-1 mb-4">
    <li>{t('lab.e10sentencenarration_now_then_at_that_time')}</li>
    <li>{t('lab.e10sentencenarration_today_that_day')}</li>
    <li>{t('lab.e10sentencenarration_tomorrow_the_next_day_the_foll')}</li>
    <li>{t('lab.e10sentencenarration_yesterday_the_previous_day_the')}</li>
    <li>{t('lab.e10sentencenarration_here_there')}</li>
    <li>{t('lab.e10sentencenarration_this_these_that_those')}</li>
   </ul>

   <h4 className="font-medium text-slate-700 dark:text-[#ffffff] mt-4 mb-2">{t('lab.e10sentencenarration_d_reporting_questions')}</h4>
   <p>{t('lab.e10sentencenarration_when_converting_questions_to_i')}</p>
   <ul className="list-disc pl-5 space-y-1 mb-4">
    <li>{t('lab.e10sentencenarration_change_the_reporting_verb_to_a')}</li>
    <li><strong>{t('lab.e10sentencenarration_yes_no_questions')}</strong>  {t('lab.e10sentencenarration_use_if_or_whether_as_the_conne')}</li>
    <li><strong>{t('lab.e10sentencenarration_wh_questions')}</strong>  {t('lab.e10sentencenarration_keep_the_original_question_wor')}</li>
    <li><strong>{t('lab.e10sentencenarration_word_order')}</strong>  {t('lab.e10sentencenarration_change_the_sentence_structure_')}</li>
    <li><em className="text-slate-500 dark:text-[#71717a]">{t('lab.e10sentencenarration_example_wh_he_asked_where_are_')}</em></li>
    <li><em className="text-slate-500 dark:text-[#71717a]">{t('lab.e10sentencenarration_example_y_n_she_asked_do_you_l')}</em></li>
   </ul>
   </div>
  </section>

  {/* Window 2: Controls */}
  <section className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex-col '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-3 mb-4">
   <Target className="w-5 h-5 text-[#4158D1] dark:text-[#6b81fb]" />
   <h2 className="text-lg font-bold text-slate-900 dark:text-[#ffffff]">{t('lab.e10sentencenarration_word_bank_assessment')}</h2>
   </div>

   <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 h-[calc(100vh-250px)] lg:h-[calc(100vh-180px)]">
   {/* Word Bank */}
   <div className={`w-full p-4 rounded-xl border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex-shrink-0 flex-col '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <h3 className="text-sm font-bold text-slate-700 dark:text-[#a1a1aa] mb-3">{t('lab.e10sentencenarration_available_words_click_to_add')}</h3>
    <div className="flex flex-wrap gap-2">
    {availablePieces.map((piece: any, idx) => (
     <button
     key={idx}
     onClick={() => handleSelectPiece(piece)}
     className={`px-3 py-2 bg-[#4158D1]/10 dark:bg-[#4158D1]/20 border border-[#4158D1]/30 dark:border-[#4158D1]/40 text-[#4158D1] dark:text-[#6b81fb] rounded-lg text-sm font-medium hover:bg-[#4158D1]/20 dark:hover:bg-[#4158D1]/40 transition-colors flex-col `}
     >
     {piece.text}
     </button>
    ))}
    {availablePieces.length === 0 && (
     <span className="text-sm text-slate-400 dark:text-[#71717a] italic">{t('lab.e10sentencenarration_all_words_used')}</span>
    )}
    </div>
   </div>

   {/* Knowledge Check */}
   <div className={`p-4 rounded-xl border border-slate-200 dark:border-[#2a2a2a] flex-1 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <h3 className="text-sm font-bold text-slate-700 dark:text-[#a1a1aa] mb-3">{t('lab.e10sentencenarration_knowledge_check')}</h3>
    {!assessmentSubmitted ? (
    <div className="space-y-4">
     {questions.map((q, qIdx) => (
     <div key={qIdx} className="space-y-2">
      <p className="text-sm font-medium text-slate-800 dark:text-[#ffffff]">
      {qIdx + 1}. {q.q}
      </p>
      <div className="space-y-1">
      {q.options.map((opt, oIdx) => (
       <label key={oIdx} className="flex items-start gap-2 cursor-pointer group">
       <input
        type="radio"
        name={`question-${qIdx}`}
        className="mt-1 text-[#4158D1] focus:ring-[#4158D1] bg-white dark:bg-[#1c1b1b] border-slate-300 dark:border-[#2a2a2a]"
        checked={assessmentAnswers[qIdx] === oIdx}
        onChange={() => setAssessmentAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
       />
       <span className="text-sm text-slate-700 dark:text-[#a1a1aa] group-hover:text-slate-900 dark:group-hover:text-slate-100">
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
     className="w-full mt-2 py-2 px-4 bg-[#4158D1] hover:bg-[#3144a8] disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg font-medium transition-colors text-sm"
     >
     
                                          {t('lab.e10sentencenarration_submit_assessment')}
                                          </button>
    </div>
    ) : (
    <div className="text-center py-4">
     <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#4158D1]/10 dark:bg-[#4158D1]/20 text-[#4158D1] dark:text-[#6b81fb] mb-3">
     <span className="text-2xl font-bold">{calculateScore()}/{questions.length}</span>
     </div>
     <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">
     {calculateScore() === questions.length 
      ? "Perfect score! You are a master reporter." 
      : "Good effort! Review the theory and try again."}
     </p>
     <button
     onClick={() => {
      setAssessmentSubmitted(false);
      setAssessmentAnswers({});
     }}
     className="w-full py-2 px-4 bg-slate-100 dark:bg-[#2a2a2a] hover:bg-slate-200 dark:hover:bg-[#3a3a3a] text-slate-700 dark:text-[#ffffff] rounded-lg font-medium transition-colors text-sm"
     >
     
                                              {t('lab.e10sentencenarration_retry_assessment')}
                                              </button>
    </div>
    )}
   </div>
   </div>
  </section>

  {/* Window 3: Simulation */}
  <section className={`bg-slate-100 dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] relative items-center justify-center p-4 md:p-8 overflow- min-h-[500px] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className={`w-full max-w-lg rounded-xl shadow-lg border border-slate-200 dark:border-[#2a2a2a] p-6 flex-col gap-8 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   
   {/* Speaker Bubble */}
   <div className="flex gap-4 items-start">
    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
    <Mic className="w-6 h-6 text-blue-600 dark:text-blue-400" />
    </div>
    <div className={`bg-slate-100 dark:bg-[#1c1b1b] p-4 rounded-2xl rounded-tl-none border border-slate-200 dark:border-[#2a2a2a] w-full flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#71717a] block mb-1">
     {NARRATION_SCENARIOS[currentScenario].speaker}
    </span>
    <p className="text-lg font-bold text-slate-900 dark:text-[#ffffff]">
     "{NARRATION_SCENARIOS[currentScenario].direct}"
    </p>
    </div>
   </div>

   {/* Reporter Notepad */}
   <div className="flex gap-4 items-start">
    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
    <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
    </div>
    <div className="flex-1 bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-2xl rounded-tl-none border border-yellow-200 dark:border-yellow-900/30 min-h-[120px] w-full">
    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#71717a] block mb-3">
     
                                      {t('lab.e10sentencenarration_your_report_indirect_speech')}
                                     </span>
    <div className="flex flex-wrap gap-2">
     {constructed.map((piece, idx) => (
     <button
      key={idx}
      onClick={() => handleRemovePiece(piece)}
      className="px-3 py-1.5 bg-slate-700 dark:bg-[#2a2a2a] text-white rounded-lg text-sm shadow hover:bg-slate-800 dark:hover:bg-[#1c1b1b] transition-colors"
      title={t('lab.e10sentencenarration_click_to_remove')}
     >
      {piece.text}
     </button>
     ))}
     {constructed.length === 0 && (
     <span className="text-sm text-slate-400 dark:text-[#71717a] italic mt-1">{t('lab.e10sentencenarration_select_words_from_the_word_ban')}</span>
     )}
    </div>
    </div>
   </div>

   {checkConstruction() && (
    <div className="mt-2 p-4 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 flex flex-col items-center gap-3">
    <div className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-2">
     <CheckCircle2 className="w-5 h-5" />  {t('lab.e10sentencenarration_perfect_report')}
                                     </div>
    <button
     onClick={nextScenario}
     className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-colors flex items-center gap-2"
    >
     
                                      {t('lab.e10sentencenarration_next_scenario')} <ChevronRight className="w-4 h-4" />
    </button>
    </div>
   )}
   </div>
  </section>
  </main>
 </div>
 );
}

