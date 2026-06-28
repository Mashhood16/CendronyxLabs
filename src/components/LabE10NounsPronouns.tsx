import { useState } from 'react';
import { BookOpen, Target, CheckCircle2, Check } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabE10NounsPronounsProps {
  onExit?: () => void;
}

interface DraggableWord {
  id: string;
  word: string;
  category: 'Concrete Noun' | 'Abstract Noun' | 'Collective Noun' | 'Personal Pronoun' | 'Relative Pronoun' | 'Reflexive Pronoun';
}

const WORDS: DraggableWord[] = [
  { id: 'w1', word: 'Courage', category: 'Abstract Noun' },
  { id: 'w2', word: 'Flock', category: 'Collective Noun' },
  { id: 'w3', word: 'Microscope', category: 'Concrete Noun' },
  { id: 'w4', word: 'Themselves', category: 'Reflexive Pronoun' },
  { id: 'w5', word: 'Who', category: 'Relative Pronoun' },
  { id: 'w6', word: 'They', category: 'Personal Pronoun' },
  { id: 'w7', word: 'Wisdom', category: 'Abstract Noun' },
  { id: 'w8', word: 'Committee', category: 'Collective Noun' }
];

const CATEGORIES = [
  'Concrete Noun', 'Abstract Noun', 'Collective Noun', 
  'Personal Pronoun', 'Relative Pronoun', 'Reflexive Pronoun'
];

export default function LabE10NounsPronouns({ onExit = () => {} }: LabE10NounsPronounsProps) {
  const [placedWords, setPlacedWords] = useState<Record<string, string>>({});
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

  const questions = [
    {
      q: "Which of the following is an Abstract Noun?",
      options: ["Guitar", "Happiness", "Orchestra", "She"],
      correct: 1
    },
    {
      q: "Identify the Relative Pronoun in the sentence: 'The book that I read was fascinating.'",
      options: ["The", "I", "that", "was"],
      correct: 2
    },
    {
      q: "Which word is a Collective Noun?",
      options: ["Mountains", "Honesty", "Swarm", "Himself"],
      correct: 2
    },
    {
      q: "What type of pronoun is 'Themselves'?",
      options: ["Personal", "Reflexive", "Demonstrative", "Indefinite"],
      correct: 1
    }
  ];

  const handleCategoryClick = (category: string) => {
    if (selectedWordId) {
      setPlacedWords(prev => ({
        ...prev,
        [selectedWordId]: category
      }));
      setSelectedWordId(null);
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (assessmentAnswers[idx] === q.correct) score++;
    });
    return score;
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <LabHeader title="Unit 1: The Identity Matrix (Nouns & Pronouns)" variant="dark" onExit={onExit} />
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          
          {/* Column 1: Theory */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-hidden">
            <div className="p-6 bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-300">Nouns & Pronouns</h2>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-700 dark:text-slate-300">
              <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Types of Nouns</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li><strong>Concrete Nouns:</strong> Physical things you can touch (e.g., <em>apple, table, microscope</em>).</li>
                  <li><strong>Abstract Nouns:</strong> Ideas, qualities, or conditions (e.g., <em>freedom, joy, courage</em>).</li>
                  <li><strong>Collective Nouns:</strong> Names for a group or collection of things (e.g., <em>flock, committee, swarm</em>).</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Types of Pronouns</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li><strong>Personal:</strong> Refer to specific people or things (e.g., <em>I, they, them</em>).</li>
                  <li><strong>Relative:</strong> Connect a clause to a noun or pronoun (e.g., <em>who, which, that</em>).</li>
                  <li><strong>Reflexive:</strong> Used when the subject and object are the same (e.g., <em>myself, themselves</em>).</li>
                  <li><strong>Demonstrative:</strong> Point out specific things (e.g., <em>this, those</em>).</li>
                  <li><strong>Indefinite:</strong> Refer to non-specific things (e.g., <em>someone, anything</em>).</li>
                </ul>
              </section>
            </div>
          </div>

          {/* Column 2: Classification Engine */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-300">Classification Matrix</h2>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">1. Select a word from the pool below:</p>
              <div className="flex flex-wrap gap-2">
                {WORDS.filter(w => !placedWords[w.id]).map(w => (
                  <button
                    key={w.id}
                    onClick={() => setSelectedWordId(selectedWordId === w.id ? null : w.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedWordId === w.id
                        ? 'bg-blue-600 text-white shadow-md scale-105'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {w.word}
                  </button>
                ))}
                {Object.keys(placedWords).length === WORDS.length && (
                  <div className="text-emerald-600 dark:text-emerald-400 font-medium text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> All words classified!
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto mt-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">2. Assign it to the correct category:</p>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map(cat => {
                  const itemsInCat = WORDS.filter(w => placedWords[w.id] === cat);
                  const isHovered = selectedWordId !== null;
                  
                  return (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      disabled={!selectedWordId}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        isHovered 
                          ? 'border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/20 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/40 cursor-pointer'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 opacity-80 cursor-default'
                      }`}
                    >
                      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{cat}</h4>
                      <div className="space-y-1 min-h-[30px]">
                        {itemsInCat.map(w => (
                          <div key={w.id} className="flex items-center gap-2 text-sm">
                            <span className={w.category === cat ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400 line-through'}>
                              {w.word}
                            </span>
                            {w.category === cat ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : null}
                          </div>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column 3: Assessment */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 rounded-lg">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-300">Knowledge Check</h2>
            </div>

            <div className="flex-1 overflow-y-auto">
              {!assessmentSubmitted ? (
                <div className="space-y-6">
                  {questions.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-3">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {qIdx + 1}. {q.q}
                      </p>
                      <div className="space-y-2">
                        {q.options.map((opt, oIdx) => (
                          <label key={oIdx} className="flex items-start gap-3 cursor-pointer group">
                            <input
                              type="radio"
                              name={`question-${qIdx}`}
                              className="mt-1 w-4 h-4 text-rose-600 dark:text-rose-400 bg-slate-100 dark:bg-slate-900/50 border-slate-300 dark:border-slate-600"
                              checked={assessmentAnswers[qIdx] === oIdx}
                              onChange={() => setAssessmentAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100">
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
                    className="w-full mt-4 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:bg-slate-900 disabled:dark:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Submit Evaluation
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 mb-4">
                    <span className="text-3xl font-bold">{calculateScore()}/{questions.length}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-300 mb-2">Assessment Complete</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    {calculateScore() === questions.length 
                      ? "Perfect score! You have mastered nouns and pronouns." 
                      : "Good effort! Review the classifications and try again to improve your score."}
                  </p>
                  <button
                    onClick={() => {
                      setAssessmentSubmitted(false);
                      setAssessmentAnswers({});
                      setPlacedWords({});
                    }}
                    className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
                  >
                    Retry Lab
                  </button>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
