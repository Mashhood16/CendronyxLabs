import { useState, useEffect } from 'react';
import LabHeader from './LabHeader';
import { CheckCircle, RefreshCw, BookOpen, Activity, Target, Layers, Info } from 'lucide-react';
import { useTranslate } from "../i18n";
import { VocabularyPanel } from './WordCard';

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
 return colors[index % colors.length] || 'bg-slate-500';
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

 return ( <div className="p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-shrink-0">
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

 const renderToken = (token: WordToken) => {
 if (token.type === 'other') {
 return <span key={token.id} className="px-0.5 text-slate-800 dark:text-[#ffffff]">{token.text} </span>;
 }
 if (token.type === 'pronoun') {
 const isConnected = connections.some(c => c.pronounId === token.id);
 const isSelected = selectedPronoun === token.id;
 const connectionColor = isConnected ? getConnectionColor(token.id) : '';
 let style = 'px-2 py-1 mx-0.5 rounded-lg border-2 text-sm md:text-base font-medium transition-all duration-200 inline-block cursor-pointer ';
 if (isSelected) {
 style += 'border-indigo-500 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 shadow-md scale-105';
 } else if (isConnected) {
 style += connectionColor + ' border-opacity-50 text-white shadow-sm';
 } else {
 style += 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40';
 }
 return (
 <button key={token.id} onClick={() => handleWordClick(token)} className={style}>
 {token.text}
 {isSelected && <span className="block text-[10px] opacity-70 font-normal">selected</span>}
 </button>
 );
 }
 if (token.type === 'noun') {
 const isAntecedentFor = connections.filter(c => c.antecedentId === token.id);
 const isClickable = selectedPronoun !== null;
 let style = 'px-2 py-1 mx-0.5 rounded-lg border-2 text-sm md:text-base font-medium transition-all duration-200 inline-block ';
 if (isAntecedentFor.length > 0) {
 style += 'border-emerald-400 dark:border-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 shadow-sm';
 } else if (isClickable) {
 style += 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:shadow-md animate-pulse';
 } else {
 style += 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
 }
 return (
 <button key={token.id} onClick={() => handleWordClick(token)} disabled={!isClickable} className={style}>
 {token.text}
 {isAntecedentFor.length > 0 && (
 <span className="block text-[10px] font-normal opacity-70">{isAntecedentFor.length} link{isAntecedentFor.length > 1 ? 's' : ''}</span>
 )}
 </button>
 );
 }
 return null;
 };

 return (
 <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#ffffff] overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.e11nounspronouns_nouns_amp_pronouns_reference_m')} />

 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button onClick={() => setActiveMobileTab('theory')} className={'w-full py-3 text-sm font-bold rounded-xl transition-all text-center ' + (activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700')}>
 {t('lab.e11nounspronouns_theory')}
 </button>
 <button onClick={() => setActiveMobileTab('lab')} className={'w-full py-3 text-sm font-bold rounded-xl transition-all text-center ' + (activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700')}>
 {t('lab.e11nounspronouns_lab')}
 </button>
 </div>

 <main className="flex-grow p-4 md:p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 min-h-0 lg:overflow-hidden">

 <section className={'w-full rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] overflow-y-auto flex-col ' + (activeMobileTab === 'theory' ? 'flex' : 'hidden') + ' lg:flex'}>
 <VocabularyPanel words={['queen', 'king', 'dragon', 'knights', 'kingdom', 'crown', 'fire', 'pronoun', 'antecedent', 'reference', 'noun', 'cataphoric']} title="Key Words" />
 <div className="flex items-center gap-2 mb-4 flex-shrink-0">
 <BookOpen className="w-5 h-5 text-indigo-500" />
 <h2 className="text-lg font-semibold">{t('lab.e11nounspronouns_grammar_theory')}</h2>
 </div>
 <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto pr-2 flex-grow">
 <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2">{t('lab.e11nounspronouns_nouns_and_pronouns')}</h3>
 <p className="mb-3">{t('lab.e11nounspronouns_nouns_and_pronouns_serve_as_th')}</p>
 <h4 className="font-semibold text-slate-700 dark:text-slate-300 mt-4 mb-1">{t('lab.e11nounspronouns_what_is_a_noun')}</h4>
 <p className="mb-3">{t('lab.e11nounspronouns_a_noun_is_a_word_that_names_a_')}</p>
 <h4 className="font-semibold text-slate-700 dark:text-slate-300 mt-4 mb-1">{t('lab.e11nounspronouns_what_is_a_pronoun')}</h4>
 <p className="mb-3">{t('lab.e11nounspronouns_a_pronoun_is_a_word_that_takes')}</p>
 <h4 className="font-semibold text-slate-700 dark:text-slate-300 mt-4 mb-1">{t('lab.e11nounspronouns_antecedents')}</h4>
 <p className="mb-3">{t('lab.e11nounspronouns_the_antecedent_is_the_noun_that')}</p>
 <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800/50 my-4">
 <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
 <strong>{t('lab.e11nounspronouns_example')}</strong> {t('lab.e11nounspronouns_the_queen_lost_her_crown')}
 </p>
 <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2">{t('lab.e11nounspronouns_her_refers_to_queen_so_queen')}</p>
 </div>
 <h4 className="font-semibold text-slate-700 dark:text-slate-300 mt-4 mb-1">{t('lab.e11nounspronouns_types_of_reference')}</h4>
 <ul className="list-disc pl-5 space-y-1 mb-4">
 <li><strong>{t('lab.e11nounspronouns_anaphoric')}</strong> {t('lab.e11nounspronouns_pronoun_comes_after_its_antece')} <em>{t('lab.e11nounspronouns_the_queen_smiled_she_was')}</em></li>
 <li><strong>{t('lab.e11nounspronouns_cataphoric')}</strong> {t('lab.e11nounspronouns_pronoun_comes_before_its_antece')} <em>{t('lab.e11nounspronouns_although_he_was_tired_the_ki')}</em></li>
 </ul>
 </div>
 </section>

 <section className={'w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex-col rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ' + (activeMobileTab === 'lab' ? 'flex' : 'hidden') + ' lg:flex'}>
 <div className="flex items-center gap-2 mb-6 flex-shrink-0">
 <Activity className="w-5 h-5 text-indigo-500" />
 <h2 className="text-lg font-semibold">{t('lab.e11nounspronouns_lab_controls')}</h2>
 </div>
 <div className="space-y-6 flex-grow overflow-y-auto pr-2">
 <div className="w-full p-4 rounded-xl border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b]">
 <label className="text-sm font-semibold mb-2 block">{t('lab.e11nounspronouns_complexity')} {complexity}</label>
 <input type="range" min="1" max="3" value={complexity} onChange={(e) => setComplexity(parseInt(e.target.value))} className="w-full accent-indigo-600" />
 <div className="flex justify-between text-xs text-slate-500 mt-1">
 <span>{t('lab.e11nounspronouns_simple')}</span>
 <span>{t('lab.e11nounspronouns_medium')}</span>
 <span>{t('lab.e11nounspronouns_complex')}</span>
 </div>
 </div>
 <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-[#1c1b1b]">
 <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
 <Target className="w-4 h-4 text-indigo-500" /> {t('lab.e11nounspronouns_status')}
 </h3>
 <p className="text-sm font-medium mb-4 min-h-[40px] text-indigo-700 dark:text-indigo-300">{feedback}</p>
 <div className="flex flex-wrap gap-2">
 <button onClick={checkAnswers} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors whitespace-nowrap flex-shrink-0 font-medium text-sm">
 <CheckCircle className="w-4 h-4" /> {t('lab.e11nounspronouns_check_connections')}
 </button>
 <button onClick={resetActivity} className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded-lg transition-colors whitespace-nowrap flex-shrink-0 font-medium text-sm">
 <RefreshCw className="w-4 h-4" /> {t('lab.e11nounspronouns_reset')}
 </button>
 </div>
 </div>
 <div>
 <h3 className="font-semibold mb-2 text-sm text-slate-500 uppercase tracking-wider">{t('lab.e11nounspronouns_current_connections')}</h3>
 <div className="border border-slate-200 dark:border-[#1c1b1b] rounded-lg overflow-hidden">
 <table className="w-full text-sm text-left">
 <thead className="bg-slate-50 dark:bg-[#1c1b1b] border-b border-slate-200 dark:border-[#2a2a2a] text-xs uppercase text-slate-500">
 <tr><th className="px-4 py-2">{t('lab.e11nounspronouns_pronoun')}</th><th className="px-4 py-2">{t('lab.e11nounspronouns_antecedent')}</th></tr>
 </thead>
 <tbody>
 {connections.length === 0 ? (
 <tr><td colSpan={2} className="px-4 py-3 text-center text-slate-400 italic">{t('lab.e11nounspronouns_no_connections_yet')}</td></tr>
 ) : (
 connections.map((c, i) => {
 const pt = currentData.tokens.find(t => t.id === c.pronounId);
 const at = currentData.tokens.find(t => t.id === c.antecedentId);
 return (
 <tr key={i} className="border-b border-slate-100 dark:border-[#2a2a2a]/50 last:border-0">
 <td className="px-4 py-2 font-medium text-amber-600 dark:text-amber-400">{pt?.text}</td>
 <td className="px-4 py-2 font-medium text-emerald-600 dark:text-emerald-400">{at?.text}</td>
 </tr>
 );
 })
 )}
 </tbody>
 </table>
 </div>
 </div>
 {renderGraph()}
 <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
 <h3 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-2 text-sm">{t('lab.e11nounspronouns_assessment')}</h3>
 <p className="text-xs text-indigo-800 dark:text-indigo-300 mb-3">{t('lab.e11nounspronouns_what_is_it_called_when_a_pro')}</p>
 <div className="flex gap-2">
 <input type="text" value={assessmentAnswer} onChange={(e) => setAssessmentAnswer(e.target.value)} placeholder={t('lab.e11nounspronouns_type_answer')} className="flex-1 px-3 py-2 rounded-lg border border-indigo-200 dark:border-indigo-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-[#1c1b1b] dark:text-white" />
 <button onClick={checkAssessment} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium whitespace-nowrap flex-shrink-0">{t('lab.e11nounspronouns_submit')}</button>
 </div>
 {assessmentResult && <p className="mt-2 text-sm font-medium text-indigo-700 dark:text-indigo-400">{assessmentResult}</p>}
 </div>
 </div>
 </section>

 <section className={'bg-slate-100 dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] relative flex-col items-center justify-center p-6 overflow-y-auto ' + (activeMobileTab === 'lab' ? 'flex' : 'hidden') + ' lg:flex'}>
 <div className="w-full max-w-2xl mb-6 flex-shrink-0">
 <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
 <Layers className="w-4 h-4 text-indigo-500" /> {t('lab.e11nounspronouns_sentence_analysis')}
 <span className="ml-auto text-xs font-normal text-slate-400">{t('lab.e11nounspronouns_level')} {complexity}</span>
 </h3>
 <div className="p-6 rounded-xl border border-slate-200 dark:border-[#1c1b1b] shadow-sm bg-white dark:bg-[#121212]">
 <div className="flex flex-wrap items-center gap-y-4 leading-loose justify-center">
 {currentData.tokens.map((token) => renderToken(token))}
 </div>
 </div>
 </div>
 <div className="w-full max-w-2xl rounded-xl border border-slate-200 dark:border-[#1c1b1b] p-4 flex-shrink-0">
 <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
 <Info className="w-4 h-4 text-slate-500" /> {t('lab.e11nounspronouns_legend')}
 </h3>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
 <div className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded border-2 border-amber-300 bg-amber-50"></span><span className="text-slate-600 dark:text-[#a1a1aa]">{t('lab.e11nounspronouns_clickable_pronoun')}</span></div>
 <div className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded border-2 border-emerald-400 bg-emerald-100"></span><span className="text-slate-600 dark:text-[#a1a1aa]">{t('lab.e11nounspronouns_linked_noun_antecedent')}</span></div>
 <div className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded border-2 border-blue-300 bg-blue-50 animate-pulse"></span><span className="text-slate-600 dark:text-[#a1a1aa]">{t('lab.e11nounspronouns_available_noun')}</span></div>
 <div className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded bg-slate-300 dark:bg-slate-600"></span><span className="text-slate-600 dark:text-[#a1a1aa]">{t('lab.e11nounspronouns_other_words')}</span></div>
 </div>
 </div>
 </section>

 </main>
 </div>
 );
}
