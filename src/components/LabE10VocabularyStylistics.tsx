import { useState } from 'react';
import { BookOpen, Target, PenTool, ChevronRight, Hash } from 'lucide-react';
import LabHeader from './LabHeader';

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
    explanation: "'Inexpensive' implies good value without the negative aspect of low quality associated with 'cheap'." // Or thrifty, but inexpensive is a direct synonym often compared to cheap. Actually let's make it clearer.
  }
];

export default function LabE10VocabularyStylistics({ onExit = () => {} }: LabE10VocabularyStylisticsProps) {
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
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <LabHeader title="Unit 8: The Stylist's Workshop" variant="dark" onExit={onExit} />
      
      <div className="flex-1 lg:overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          
          {/* Column 1: Theory */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-hidden">
            <div className="p-6 bg-pink-50 dark:bg-pink-900/30 border-b border-pink-100 dark:border-pink-800/50 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-300">Stylistics & Mechanics</h2>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-700 dark:text-slate-300">
              <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Figures of Speech</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li><strong>Simile:</strong> Comparison using 'like' or 'as'.</li>
                  <li><strong>Metaphor:</strong> Direct comparison without 'like' or 'as'.</li>
                  <li><strong>Personification:</strong> Giving human traits to non-human things.</li>
                  <li><strong>Oxymoron:</strong> Contradictory terms together (e.g., <em>jumbo shrimp, deafening silence</em>).</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Vocabulary</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li><strong>Denotation:</strong> The literal, dictionary definition of a word.</li>
                  <li><strong>Connotation:</strong> The emotional or cultural meaning attached to a word (e.g., <em>cheap</em> vs <em>inexpensive</em>).</li>
                  <li><strong>Roots & Affixes:</strong> Prefixes (before a root, e.g., <em>un-</em>) and Suffixes (after a root, e.g., <em>-able</em>).</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Punctuation</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li><strong>Semicolon (;):</strong> Links two related independent clauses.</li>
                  <li><strong>Colon (:):</strong> Introduces a list, quote, or explanation.</li>
                </ul>
              </section>
            </div>
          </div>

          {/* Column 2: Stylist Workshop */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="p-2 bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 rounded-lg">
                <PenTool className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-300">Stylist's Workbench</h2>
            </div>
            
            <div className="flex-1 flex flex-col">
              <div className="mb-6 flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Challenge {currentChallenge + 1} of {STYLISTIC_CHALLENGES.length}
                </span>
                <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 text-xs font-bold rounded-full">
                  {STYLISTIC_CHALLENGES[currentChallenge].type}
                </span>
              </div>

              <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 text-center mb-8 shadow-inner">
                <p className="text-xl font-medium text-slate-900 dark:text-slate-100 leading-relaxed italic">
                  "{STYLISTIC_CHALLENGES[currentChallenge].text}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 flex-1">
                {STYLISTIC_CHALLENGES[currentChallenge].options.map((opt, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isAnswered = selectedAnswer !== null;
                  const isCorrect = idx === STYLISTIC_CHALLENGES[currentChallenge].correct;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(idx)}
                      disabled={isAnswered}
                      className={`p-4 rounded-xl font-medium text-sm transition-all border-2 flex items-center justify-center ${
                        !isAnswered
                          ? 'border-slate-200 dark:border-slate-700 hover:border-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/30'
                          : isSelected
                            ? isCorrect 
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                              : 'border-rose-500 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300'
                            : isCorrect
                              ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-300 opacity-70'
                              : 'border-slate-200 dark:border-slate-700 opacity-40'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {selectedAnswer !== null && (
                <div className="mt-6 flex flex-col gap-4">
                  <div className={`p-4 rounded-lg text-sm font-medium flex gap-3 ${
                    selectedAnswer === STYLISTIC_CHALLENGES[currentChallenge].correct
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}>
                    <Hash className="w-5 h-5 flex-shrink-0 mt-0.5 opacity-70" />
                    <p>{STYLISTIC_CHALLENGES[currentChallenge].explanation}</p>
                  </div>
                  <button
                    onClick={nextChallenge}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-bold transition-colors shadow-sm"
                  >
                    Next Challenge <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Assessment */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="p-2 bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 rounded-lg">
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
                              className="mt-1 w-4 h-4 text-pink-600 dark:text-pink-400 bg-slate-100 dark:bg-slate-900/50 border-slate-300 dark:border-slate-600"
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
                    className="w-full mt-4 py-2 px-4 bg-pink-600 hover:bg-pink-700 disabled:bg-slate-300 dark:bg-slate-900 disabled:dark:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Submit Evaluation
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 mb-4">
                    <span className="text-3xl font-bold">{calculateScore()}/{questions.length}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-300 mb-2">Assessment Complete</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    {calculateScore() === questions.length 
                      ? "Perfect score! Your stylistic skills are top-notch." 
                      : "Good effort! Review the figures of speech to improve."}
                  </p>
                  <button
                    onClick={() => {
                      setAssessmentSubmitted(false);
                      setAssessmentAnswers({});
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
