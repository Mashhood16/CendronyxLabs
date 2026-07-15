import { useState, useEffect } from 'react';
import LabHeader from './LabHeader';
import { CheckCircle, RefreshCw, BookOpen, Activity, Target } from 'lucide-react';
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
  <LabHeader onExit={onExit} title={t('lab.e11nounspronouns_nouns_amp_pronouns_reference_m')} />
 );
}
