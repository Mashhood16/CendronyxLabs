import React, { useState } from 'react';
import { BookOpen, Target, Navigation, ChevronRight } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabE10AdverbsPrepositionsProps {
  onExit?: () => void;
}

const ADVERB_PUZZLES = [
  {
    sentence: "She completed the challenging assignment ____.",
    options: ["yesterday (Time)", "quickly (Manner)", "there (Place)", "very (Degree)"],
    correctOptionIndex: 1,
    type: "Manner"
  },
  {
    sentence: "They search for the missing keys ____.",
    options: ["always (Frequency)", "everywhere (Place)", "yesterday (Time)", "extremely (Degree)"],
    correctOptionIndex: 1,
    type: "Place"
  },
  {
    sentence: "He has been working on the project ____ 8:00 AM.",
    options: ["for", "since", "in", "on"],
    correctOptionIndex: 1,
    type: "Preposition (Time)"
  }
];

export default function LabE10AdverbsPrepositions({ onExit = () => {} }: LabE10AdverbsPrepositionsProps) {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [puzzleAnswered, setPuzzleAnswered] = useState(false);

  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

  const questions = [
    {
      q: "Which word is an Adverb of Frequency?",
      options: ["Often", "Here", "Beautifully", "Soon"],
      correct: 0
    },
    {
      q: "Fill in the blank: I have lived in this city ____ five years.",
      options: ["since", "for", "from", "during"],
      correct: 1
    },
    {
      q: "Which sentence contains a Compound Preposition?",
      options: [
        "He hid under the bed.",
        "She sat next to her friend.",
        "They walked across the bridge.",
        "The cat jumped off the counter."
      ],
      correct: 1
    }
  ];

  const handlePuzzleSelect = (idx: number) => {
    if (puzzleAnswered) return;
    setSelectedOption(idx);
    setPuzzleAnswered(true);
  };

  const nextPuzzle = () => {
    setCurrentPuzzle((prev) => (prev + 1) % ADVERB_PUZZLES.length);
    setSelectedOption(null);
    setPuzzleAnswered(false);
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
      <LabHeader title="Unit 3: Contextual Vectors (Adverbs & Prepositions)" variant="dark" onExit={onExit} />
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          
          {/* Column 1: Theory */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-hidden">
            <div className="p-6 bg-amber-50 dark:bg-amber-900/30 border-b border-amber-100 dark:border-amber-800/50 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-300">Contextual Grammar</h2>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-700 dark:text-slate-300">
              <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Types of Adverbs</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li><strong>Manner:</strong> How something happens (e.g., <em>quickly, carefully</em>).</li>
                  <li><strong>Time:</strong> When something happens (e.g., <em>now, yesterday</em>).</li>
                  <li><strong>Place:</strong> Where something happens (e.g., <em>here, everywhere</em>).</li>
                  <li><strong>Frequency:</strong> How often something happens (e.g., <em>always, rarely</em>).</li>
                  <li><strong>Degree:</strong> Intensity of an action (e.g., <em>very, extremely</em>).</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Prepositions of Time & Movement</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li><strong>Since vs For:</strong> Use <em>since</em> with a specific point in time (since 2010). Use <em>for</em> with a duration of time (for five years).</li>
                  <li><strong>Movement:</strong> Indicate direction (e.g., <em>towards, through, across</em>).</li>
                  <li><strong>Compound Prepositions:</strong> Made of two or more words (e.g., <em>in front of, next to, because of</em>).</li>
                </ul>
              </section>
            </div>
          </div>

          {/* Column 2: Vector Simulator */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-lg">
                <Navigation className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-300">Vector Simulator</h2>
            </div>
            
            <div className="flex-1 flex flex-col space-y-6">
              <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Puzzle {currentPuzzle + 1} of {ADVERB_PUZZLES.length}
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">
                    {ADVERB_PUZZLES[currentPuzzle].type}
                  </span>
                </div>
                
                <p className="text-xl font-medium text-slate-900 dark:text-slate-100 text-center py-6 leading-relaxed">
                  {ADVERB_PUZZLES[currentPuzzle].sentence.split('____').map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className={`inline-block min-w-[120px] border-b-2 px-4 mx-2 ${
                          puzzleAnswered 
                            ? selectedOption === ADVERB_PUZZLES[currentPuzzle].correctOptionIndex
                              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                              : 'border-rose-500 text-rose-600 dark:text-rose-400'
                            : 'border-amber-500 text-slate-400 border-dashed'
                        }`}>
                          {puzzleAnswered ? ADVERB_PUZZLES[currentPuzzle].options[selectedOption!] : '?'}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {ADVERB_PUZZLES[currentPuzzle].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePuzzleSelect(idx)}
                    disabled={puzzleAnswered}
                    className={`p-4 rounded-xl text-center text-sm font-bold transition-all border-2 ${
                      !puzzleAnswered
                        ? 'border-slate-200 dark:border-slate-700 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30'
                        : idx === ADVERB_PUZZLES[currentPuzzle].correctOptionIndex
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                          : idx === selectedOption
                            ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300'
                            : 'border-slate-200 dark:border-slate-700 opacity-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {puzzleAnswered && (
                <div className="mt-auto flex justify-end">
                  <button
                    onClick={nextPuzzle}
                    className="flex items-center gap-2 px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold transition-colors"
                  >
                    Next Puzzle <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Assessment */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-lg">
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
                              className="mt-1 w-4 h-4 text-amber-600 dark:text-amber-400 bg-slate-100 dark:bg-slate-900/50 border-slate-300 dark:border-slate-600"
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
                    className="w-full mt-4 py-2 px-4 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 dark:bg-slate-900 disabled:dark:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Submit Evaluation
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 mb-4">
                    <span className="text-3xl font-bold">{calculateScore()}/{questions.length}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-300 mb-2">Assessment Complete</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    {calculateScore() === questions.length 
                      ? "Perfect score! You've mastered adverbs and prepositions." 
                      : "Good effort! Review the definitions of since/for and adverb types to improve."}
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
