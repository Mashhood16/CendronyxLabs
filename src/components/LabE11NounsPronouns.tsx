import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, RefreshCw, BookOpen, Activity, Target } from 'lucide-react';
import { useTranslate } from "../i18n";

interface WordToken {
 id: string;
 text: string;
 type: 'noun' | 'pronoun' | 'other';
}

interface Connection {
 pronounId: string;
 antecedentId: string;
}

export default function LabE11NounsPronouns({ onExit }: { onExit?: () => void }) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [complexity, setComplexity] = useState<number>(2);
 const [selectedPronoun, setSelectedPronoun] = useState<string | null>(null);
 const [connections, setConnections] = useState<Connection[]>([]);
 const [feedback, setFeedback] = useState<string>("Select a highlighted pronoun to begin mapping.");
 const [attempts, setAttempts] = useState<{ attempt: number, score: number, max: number }[]>([]);
 const [assessmentAnswer, setAssessmentAnswer] = useState('');
 const [assessmentResult, setAssessmentResult] = useState('');

 const datasets: Record<number, { tokens: WordToken[], correct: Connection[] }> = {
  1: {
   tokens: [
    { id: 't0', text: 'The', type: 'other' },
    { id: 't1', text: 'queen', type: 'noun' },
    { id: 't2', text: 'lost', type: 'other' },
    { id: 't3', text: 'her', type: 'pronoun' },
    { id: 't4', text: 'crown.', type: 'noun' }
   ],
   correct: [{ pronounId: 't3', antecedentId: 't1' }]
  },
  2: {
   tokens: [
    { id: 't0', text: 'The', type: 'other' },
    { id: 't1', text: 'wise', type: 'other' },
    { id: 't2', text: 'queen', type: 'noun' },
    { id: 't3', text: 'realized', type: 'other' },
    { id: 't4', text: 'that', type: 'other' },
    { id: 't5', text: 'her', type: 'pronoun' },
    { id: 't6', text: 'kingdom', type: 'noun' },
    { id: 't7', text: 'was', type: 'other' },
    { id: 't8', text: 'in', type: 'other' },
    { id: 't9', text: 'danger,', type: 'other' },
    { id: 't10', text: 'so', type: 'other' },
    { id: 't11', text: 'she', type: 'pronoun' },
    { id: 't12', text: 'summoned', type: 'other' },
    { id: 't13', text: 'the', type: 'other' },
    { id: 't14', text: 'knights.', type: 'noun' },
    { id: 't15', text: 'They', type: 'pronoun' },
    { id: 't16', text: 'arrived', type: 'other' },
    { id: 't17', text: 'to', type: 'other' },
    { id: 't18', text: 'protect', type: 'other' },
    { id: 't19', text: 'it.', type: 'pronoun' }
   ],
   correct: [
    { pronounId: 't5', antecedentId: 't2' },
    { pronounId: 't11', antecedentId: 't2' },
    { pronounId: 't15', antecedentId: 't14' },
    { pronounId: 't19', antecedentId: 't6' }
   ]
  },
  3: {
   tokens: [
    { id: 't0', text: 'Although', type: 'other' },
    { id: 't1', text: 'he', type: 'pronoun' },
    { id: 't2', text: 'was', type: 'other' },
    { id: 't3', text: 'tired,', type: 'other' },
    { id: 't4', text: 'the', type: 'other' },
    { id: 't5', text: 'king', type: 'noun' },
    { id: 't6', text: 'fought', type: 'other' },
    { id: 't7', text: 'the', type: 'other' },
    { id: 't8', text: 'dragon.', type: 'noun' },
    { id: 't9', text: 'It', type: 'pronoun' },
    { id: 't10', text: 'breathed', type: 'other' },
    { id: 't11', text: 'fire,', type: 'noun' },
    { id: 't12', text: 'but', type: 'other' },
    { id: 't13', text: 'he', type: 'pronoun' },
    { id: 't14', text: 'dodged', type: 'other' },
    { id: 't15', text: 'it.', type: 'pronoun' }
   ],
   correct: [
    { pronounId: 't1', antecedentId: 't5' },
    { pronounId: 't9', antecedentId: 't8' },
    { pronounId: 't13', antecedentId: 't5' },
    { pronounId: 't15', antecedentId: 't11' }
   ]
  }
 };

 const currentData = datasets[complexity];

 useEffect(() => {
  resetActivity();
 }, [complexity]);

 const handleWordClick = (token: WordToken) => {
  if (token.type === 'pronoun') {
   setSelectedPronoun(token.id);
   setFeedback(`You selected the pronoun "${token.text}". Now click its antecedent (noun).`);
  } else if (token.type === 'noun' && selectedPronoun) {
   setConnections(prev => {
    const filtered = prev.filter(c => c.pronounId !== selectedPronoun);
    return [...filtered, { pronounId: selectedPronoun, antecedentId: token.id }];
   });
   setSelectedPronoun(null);
   setFeedback(`Link created! You can select another pronoun, or check your answers.`);
  } else if (token.type === 'noun') {
   setFeedback(`"${token.text}" is a noun. First select a pronoun to find its antecedent.`);
  }
 };

 const checkAnswers = () => {
  let correctCount = 0;
  connections.forEach(c => {
   const isCorrect = currentData.correct.some(cc => cc.pronounId === c.pronounId && cc.antecedentId === c.antecedentId);
   if (isCorrect) correctCount++;
  });

  const maxScore = currentData.correct.length;
  setAttempts(prev => [...prev, { attempt: prev.length + 1, score: correctCount, max: maxScore }]);

  if (correctCount === maxScore && connections.length === maxScore) {
   setFeedback("Excellent! All pronoun-antecedent references are correct.");
  } else {
   setFeedback(`You got ${correctCount} out of ${maxScore} correct. Keep trying!`);
  }
 };

 const resetActivity = () => {
  setConnections([]);
  setSelectedPronoun(null);
  setFeedback("Select a highlighted pronoun to begin mapping.");
 };

 const checkAssessment = () => {
  if (assessmentAnswer.toLowerCase().includes('cataphoric')) {
   setAssessmentResult('Correct! When a pronoun appears before its antecedent, it is a cataphoric reference.');
  } else {
   setAssessmentResult('Incorrect. Hint: It starts with "cata".');
  }
 };

 const getConnectionColor = (pronounId: string) => {
  const colors = ['bg-rose-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-indigo-500'];
  const index = currentData.correct.findIndex(c => c.pronounId === pronounId);
  return colors[index % colors.length] || 'bg-slate-50 dark:bg-[#000000]0';
 };

 const renderGraph = () => {
  if (attempts.length === 0) return null;
  const width = 200;
  const height = 80;
  
  const maxAttempts = Math.max(1, attempts.length - 1);
  
  const points = attempts.map((a, i) => {
   const x = (i / maxAttempts) * width;
   const y = height - (a.score / a.max) * height;
   return `${x},${y}`;
  }).join(' ');

  return (
   <div className="p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-shrink-0 min-h-screen lg:h-screen overflow-x-hidden w-full">
    <h3 className="font-semibold text-sm mb-4 flex items-center gap-2 text-slate-700 dark:text-[#a1a1aa]">
     <Activity className="w-4 h-4 text-indigo-500" />
     
                   {t('lab.e11nounspronouns_accuracy_over_time')}
                  </h3>
    <svg viewBox={`-10 -10 ${width + 20} ${height + 20}`} className="w-full h-24 overflow-visible">
     <line x1="0" y1="0" x2="0" y2={height} stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-[#2a2a2a]" />
     <line x1="0" y1={height} x2={width} y2={height} stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-[#2a2a2a]" />
     
     <polyline fill="none" stroke="#6366f1" strokeWidth="3" points={points} />
     {attempts.map((a, i) => {
      const x = (i / maxAttempts) * width;
      const y = height - (a.score / a.max) * height;
      return (
       <g key={i}>
        <circle cx={x} cy={y} r="4" fill="#6366f1" />
        <text x={x} y={y - 10} fontSize="10" fill="currentColor" textAnchor="middle" className="text-slate-600 dark:text-[#71717a]">
         {Math.round((a.score / a.max) * 100)}%
        </text>
       </g>
      );
     })}
    </svg>
   </div>
  );
 };

 return (
  <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#ffffff]">
   <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#1c1b1b] flex-shrink-0">
    <div className="flex items-center gap-4">
     <button 
      onClick={onExit}
      className="p-2 hover:bg-slate-100 dark:hover:bg-[#1c1b1b] rounded-full transition-colors whitespace-nowrap flex-shrink-0"
      title={t('lab.e11nounspronouns_go_back')}
     >
      <ArrowLeft className="w-6 h-6 dark:text-[#a1a1aa]" />
     </button>
     <h1 className="text-lg md:text-xl font-bold dark:text-[#ffffff]">{t('lab.e11nounspronouns_nouns_amp_pronouns_reference_m')}</h1>
    </div>
   </header>

   {/* Mobile Tab Navigation */}
   <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
     onClick={() => setActiveMobileTab('theory')}
     className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
    >
     
                      {t('lab.e11nounspronouns_theory')}
                     </button>
   <button 
     onClick={() => setActiveMobileTab('lab')}
     className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
    >{t('lab.e11nounspronouns_lab')}</button>
  </div>

   <main className="flex-grow p-4 md:p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg:min-h-0 lg:overflow-visible">
    {/* Window 1: Theory */}
    <section className={`w-full rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col lg:h-full lg:min-h-0 overflow- ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
     <h2 className="text-lg font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-2 flex-shrink-0">
      <BookOpen className="w-5 h-5 text-indigo-500" />
      
                           {t('lab.e11nounspronouns_theory_nouns_amp_pronouns')}
                          </h2>
     <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-full pr-2">
      <h3 className="text-slate-800 dark:text-white mt-0">{t('lab.e11nounspronouns_1_introduction_to_reference_ma')}</h3>
      <p>{t('lab.e11nounspronouns_in_english_grammar_a')} <strong>{t('lab.e11nounspronouns_pronoun')}</strong>  {t('lab.e11nounspronouns_is_a_word_that_replaces_a')} <strong>{t('lab.e11nounspronouns_noun')}</strong>  {t('lab.e11nounspronouns_or_a_noun_phrase_the_noun_that')} <strong>{t('lab.e11nounspronouns_antecedent')}</strong>.</p>
      <p>{t('lab.e11nounspronouns_understanding_the_link_between')} <strong>{t('lab.e11nounspronouns_reference_mapping')}</strong>.</p>

      <h3 className="text-slate-800 dark:text-white">{t('lab.e11nounspronouns_2_types_of_references')}</h3>
      <ul>
       <li><strong>{t('lab.e11nounspronouns_anaphoric_reference')}</strong>  {t('lab.e11nounspronouns_this_is_the_most_common_type_o')} 
                                 <br/><em>{t('lab.e11nounspronouns_example')}</em>  {t('lab.e11nounspronouns_the')} <strong>{t('lab.e11nounspronouns_queen')}</strong>  {t('lab.e11nounspronouns_lost')} <strong>{t('lab.e11nounspronouns_her')}</strong>  {t('lab.e11nounspronouns_crown_here_her_refers_back_to_')}
                                    </li>
       <li><strong>{t('lab.e11nounspronouns_cataphoric_reference')}</strong>  {t('lab.e11nounspronouns_the_pronoun_appears')} <em>{t('lab.e11nounspronouns_before')}</em>  {t('lab.e11nounspronouns_the_noun_it_refers_to_this_is_')}
                                 <br/><em>{t('lab.e11nounspronouns_example')}</em>  {t('lab.e11nounspronouns_although')} <strong>he</strong>  {t('lab.e11nounspronouns_was_tired_the')} <strong>{t('lab.e11nounspronouns_king')}</strong>  {t('lab.e11nounspronouns_fought_the_dragon_here_he_refe')}
                                    </li>
      </ul>

      <h3 className="text-slate-800 dark:text-white">{t('lab.e11nounspronouns_3_pronoun_agreement')}</h3>
      <p>{t('lab.e11nounspronouns_a_pronoun_must_agree_with_its_')}</p>
      <ul>
       <li><strong>{t('lab.e11nounspronouns_number')}</strong>  {t('lab.e11nounspronouns_singular_antecedents_require_s')}</li>
       <li><strong>{t('lab.e11nounspronouns_gender')}</strong>  {t('lab.e11nounspronouns_masculine_feminine_or_neuter_p')}</li>
       <li><strong>{t('lab.e11nounspronouns_person')}</strong>  {t('lab.e11nounspronouns_first_person_i_we_second_perso')}</li>
      </ul>

      <h3 className="text-slate-800 dark:text-white">{t('lab.e11nounspronouns_4_common_pitfalls')}</h3>
      <p><strong>{t('lab.e11nounspronouns_ambiguous_reference')}</strong>  {t('lab.e11nounspronouns_when_a_sentence_contains_multi')}</p>
      <p><em>{t('lab.e11nounspronouns_example')}</em>  {t('lab.e11nounspronouns_john_told_mark_that_he_had_won')}</p>

      <h3 className="text-slate-800 dark:text-white">{t('lab.e11nounspronouns_5_lab_instructions')}</h3>
      <p>{t('lab.e11nounspronouns_in_this_interactive_lab_your_t')}</p>
      <ul>
       <li>{t('lab.e11nounspronouns_first_click_on_a_highlighted')} <strong>{t('lab.e11nounspronouns_pronoun_1')}</strong>  {t('lab.e11nounspronouns_underlined_in_blue')}</li>
       <li>{t('lab.e11nounspronouns_next_locate_and_click_on_its_c')} <strong>{t('lab.e11nounspronouns_antecedent_1')}</strong>  {t('lab.e11nounspronouns_underlined_with_dashed_yellow')}</li>
       <li>{t('lab.e11nounspronouns_use_the_check_links_button_in_')}</li>
      </ul>
     </div>
    </section>

    {/* Window 2: Controls */}
    <section className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex-col lg:h-full lg:min-h-0 '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
     <h2 className="text-lg font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-2 flex-shrink-0">
      <Activity className="w-5 h-5 text-indigo-500" />
      
                           {t('lab.e11nounspronouns_controls_amp_status')}
                          </h2>
     <div className="flex-1 overflow-y-auto pr-2 space-y-6">
      <div>
       <h3 className="font-semibold text-sm mb-2 text-slate-700 dark:text-slate-300">{t('lab.e11nounspronouns_lab_configuration')}</h3>
       <div className={`p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
        <label className="text-sm font-semibold mb-2 block dark:text-[#a1a1aa]">{t('lab.e11nounspronouns_sentence_complexity')} {complexity}</label>
        <input 
         type="range" 
         min="1" 
         max="3" 
         value={complexity} 
         onChange={(e) => setComplexity(parseInt(e.target.value))}
         className="w-full accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-slate-500 dark:text-[#71717a] mt-1">
         <span>{t('lab.e11nounspronouns_basic')}</span>
         <span>{t('lab.e11nounspronouns_standard')}</span>
         <span>{t('lab.e11nounspronouns_complex')}</span>
        </div>
       </div>
      </div>

      <div className={`rounded-xl p-4 border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
       <h3 className="font-semibold text-sm mb-2 text-slate-700 dark:text-slate-300 flex items-center gap-2">
        <Target className="w-4 h-4 text-indigo-500" />
        
                                     {t('lab.e11nounspronouns_activity_status')}
                                    </h3>
       <p className="text-sm font-medium mb-4 min-h-[40px] text-indigo-700 dark:text-indigo-400">
        {feedback}
       </p>
       
       <div className="flex flex-wrap gap-2">
        <button
         onClick={checkAnswers}
         className={`flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors whitespace-nowrap flex-shrink-0 font-medium text-sm shadow-sm flex-col `}
        >
         <CheckCircle className="w-4 h-4" />
         
                                          {t('lab.e11nounspronouns_check_links')}
                                         </button>
        <button
         onClick={resetActivity}
         className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors whitespace-nowrap flex-shrink-0 font-medium text-sm border border-transparent dark:border-slate-700"
        >
         <RefreshCw className="w-4 h-4" />
         
                                          {t('lab.e11nounspronouns_reset')}
                                         </button>
       </div>
      </div>

      <div>
       <h3 className="font-semibold mb-2 text-sm text-slate-700 dark:text-slate-300">{t('lab.e11nounspronouns_current_links')}</h3>
       <div className="border border-slate-200 dark:border-[#1c1b1b] rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
         <thead className="bg-slate-50 dark:bg-[#1c1b1b] border-b border-slate-200 dark:border-[#2a2a2a] text-xs uppercase text-slate-500 dark:text-[#a1a1aa]">
          <tr>
           <th className="px-4 py-2">{t('lab.e11nounspronouns_pronoun_1')}</th>
           <th className="px-4 py-2">{t('lab.e11nounspronouns_antecedent_1')}</th>
          </tr>
         </thead>
         <tbody>
          {connections.length === 0 ? (
           <tr>
            <td colSpan={2} className="px-4 py-3 text-center text-slate-400 dark:text-[#71717a] italic">{t('lab.e11nounspronouns_no_links_recorded_yet')}</td>
           </tr>
          ) : (
           connections.map((c, i) => {
            const p = currentData.tokens.find(t => t.id === c.pronounId);
            const a = currentData.tokens.find(t => t.id === c.antecedentId);
            return (
             <tr key={i} className="border-b border-slate-100 dark:border-[#2a2a2a] last:border-0">
              <td className="px-4 py-2 font-medium flex items-center gap-2 dark:text-[#a1a1aa]">
               <span className={`w-2 h-2 rounded-full ${getConnectionColor(c.pronounId)}`}></span>
               {p?.text}
              </td>
              <td className="px-4 py-2 font-medium text-amber-600 dark:text-amber-400">{a?.text}</td>
             </tr>
            );
           })
          )}
         </tbody>
        </table>
       </div>
      </div>

      {renderGraph()}

      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30 flex-shrink-0">
       <h3 className="font-semibold text-indigo-900 dark:text-indigo-300 text-sm mb-2">{t('lab.e11nounspronouns_assessment')}</h3>
       <p className="text-xs text-indigo-800 dark:text-indigo-400 mb-3">
        
                                     {t('lab.e11nounspronouns_in_complexity_3_the_pronoun_he')}
                                    </p>
       <div className="flex gap-2">
        <input 
         type="text" 
         value={assessmentAnswer}
         onChange={(e) => setAssessmentAnswer(e.target.value)}
         placeholder={t('lab.e11nounspronouns_enter_type')}
         className="flex-1 px-3 py-2 rounded-lg border border-indigo-200 dark:border-indigo-700/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-[#a1a1aa]"
        />
        <button 
         onClick={checkAssessment}
         className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium whitespace-nowrap"
        >
         
                                          {t('lab.e11nounspronouns_submit')}
                                         </button>
       </div>
       {assessmentResult && (
        <p className="mt-2 text-xs font-medium text-indigo-700 dark:text-indigo-400 bg-white dark:bg-[#1c1b1b] p-2 rounded border border-indigo-100 dark:border-indigo-800/30">{assessmentResult}</p>
       )}
      </div>
     </div>
    </section>

    {/* Window 3: Simulation */}
    <section className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] relative items-center justify-center p-8 lg:min-h-[35vh] lg:min-h-[500px] lg:h-full lg:min-h-0 flex-col '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
     <div className={`rounded-2xl shadow-xl p-8 max-w-3xl w-full border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
      <h2 className="text-2xl font-serif text-slate-800 dark:text-[#ffffff] mb-8 border-b border-slate-200 dark:border-[#2a2a2a] pb-4">
       
                                {t('lab.e11nounspronouns_interactive_stage_complexity')} {complexity}
      </h2>
      
      <div className="text-xl leading-loose font-serif text-slate-800 dark:text-[#ffffff]">
       {currentData.tokens.map((token) => {
        const isPronoun = token.type === 'pronoun';
        const isNoun = token.type === 'noun';
        const isSelected = selectedPronoun === token.id;
        
        const connectionAsPronoun = connections.find(c => c.pronounId === token.id);
        const connectionsAsAntecedent = connections.filter(c => c.antecedentId === token.id);

        let spanClasses = "inline-block px-1 rounded transition-colors duration-200 ";
        
        if (isPronoun) {
         spanClasses += "cursor-pointer font-bold border-b-2 border-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 ";
         if (isSelected) {
          spanClasses += "bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-100 ";
         } else if (connectionAsPronoun) {
          spanClasses += "bg-indigo-50 dark:bg-indigo-900/30 ";
         }
        } else if (isNoun) {
         spanClasses += "cursor-pointer border-b-2 border-dashed border-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50 ";
         if (connectionsAsAntecedent.length > 0) {
          spanClasses += "bg-amber-50 dark:bg-amber-900/30 ";
         }
        }

        return (
         <span key={token.id} className="relative inline-flex items-center">
          <span 
           className={spanClasses}
           onClick={() => handleWordClick(token)}
          >
           {token.text}
          </span>
          
          {/* Connection Badges */}
          {isPronoun && connectionAsPronoun && (
           <span className={`absolute -top-3 -right-1 w-3 h-3 rounded-full ${getConnectionColor(connectionAsPronoun.pronounId)} shadow-sm border border-white dark:border-[#1c1b1b]`} />
          )}
          {isNoun && connectionsAsAntecedent.length > 0 && (
           <div className="absolute -top-4 right-0 flex gap-0.5">
            {connectionsAsAntecedent.map(c => (
             <span key={c.pronounId} className={`w-3 h-3 rounded-full ${getConnectionColor(c.pronounId)} shadow-sm border border-white dark:border-[#1c1b1b]`} />
            ))}
           </div>
          )}
          {/* Space after word */}
          <span className="w-1.5 inline-block"></span>
         </span>
        );
       })}
      </div>

      <div className="mt-12 flex items-center justify-center gap-6 text-sm text-slate-500 dark:text-[#71717a] bg-slate-50 dark:bg-[#1c1b1b] p-4 rounded-lg border border-slate-100 dark:border-[#2a2a2a]">
       <div className="flex items-center gap-2">
        <span className="w-6 h-1 bg-indigo-400 rounded-full"></span>
        <span>{t('lab.e11nounspronouns_pronouns_click_first')}</span>
       </div>
       <div className="flex items-center gap-2">
        <span className="w-6 h-1 border-b-2 border-dashed border-amber-400"></span>
        <span>{t('lab.e11nounspronouns_nouns_antecedents')}</span>
       </div>
      </div>
     </div>
    </section>
   </main>
  </div>
 );
}
