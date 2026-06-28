import { useState } from 'react';
import { BookOpen, Target, Mic, CheckCircle2, ChevronRight } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabE10SentenceNarrationProps {
  onExit?: () => void;
}

const NARRATION_SCENARIOS = [
  {
    speaker: "Reporter",
    direct: "The mayor said, \"I will build a new hospital tomorrow.\"",
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
    speaker: "Witness",
    direct: "The man asked, \"Where are you going?\"",
    parts: [
      { id: 'p1', text: "The man asked", type: "intro" },
      { id: 'p2', text: "where", type: "question_word" },
      { id: 'p3', text: "I", type: "pronoun" },
      { id: 'p4', text: "was going.", type: "verb" }
    ],
    incorrectOptions: [
      { id: 'i1', text: "where was I going.", type: "verb" }, // Question format instead of statement
      { id: 'i2', text: "where are you going.", type: "verb" },
      { id: 'i3', text: "if", type: "question_word" } // Used for yes/no questions, not WH questions
    ]
  }
];

export default function LabE10SentenceNarration({ onExit = () => {} }: LabE10SentenceNarrationProps) {
  const [currentScenario, setCurrentScenario] = useState(0);
  
  // Track the constructed sentence. We'll just build it by clicking pieces in order.
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
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <LabHeader title="Unit 7: The Reporter's Desk (Narration)" variant="dark" onExit={onExit} />
      
      <div className="flex-1 lg:overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          
          {/* Column 1: Theory */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-hidden">
            <div className="p-6 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-300">Rules of Narration</h2>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-700 dark:text-slate-300">
              <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Sentence Types</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li><strong>Simple:</strong> One independent clause. (e.g., <em>I walked home.</em>)</li>
                  <li><strong>Compound:</strong> Two independent clauses joined by a conjunction (FANBOYS).</li>
                  <li><strong>Complex:</strong> One independent clause + one or more dependent clauses.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Direct to Indirect Speech</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li><strong>Tenses Shift Back:</strong> Present becomes Past. Past becomes Past Perfect. "Will" becomes "Would".</li>
                  <li><strong>Pronouns Change:</strong> To reflect the speaker's perspective. (e.g., "I" becomes "he/she").</li>
                  <li><strong>Time/Place Change:</strong> 
                    <ul className="list-circle pl-5 mt-1 text-slate-600 dark:text-slate-400">
                      <li>Now ➔ Then</li>
                      <li>Today ➔ That day</li>
                      <li>Tomorrow ➔ The next day</li>
                    </ul>
                  </li>
                  <li><strong>Questions:</strong> Use "if" or "whether" for Yes/No questions. Keep WH-words. Change the word order back to a statement (Subject + Verb).</li>
                </ul>
              </section>
            </div>
          </div>

          {/* Column 2: Narration Constructor */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg">
                <Mic className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-300">Press Room Simulator</h2>
            </div>
            
            <div className="flex-1 flex flex-col">
              <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 text-center mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                  Direct Quote (from {NARRATION_SCENARIOS[currentScenario].speaker})
                </span>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {NARRATION_SCENARIOS[currentScenario].direct}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Construct the Indirect Speech:</p>
                <div className="min-h-[80px] p-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-wrap gap-2 items-start bg-slate-50 dark:bg-slate-900/50">
                  {constructed.map((piece: any, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleRemovePiece(piece)}
                      className="px-3 py-2 bg-slate-700 text-white rounded-lg text-sm shadow hover:bg-slate-800 transition-colors flex items-center gap-1"
                    >
                      {piece.text}
                    </button>
                  ))}
                  {constructed.length === 0 && (
                    <span className="text-sm text-slate-400 my-auto ml-2">Click pieces below to build the sentence...</span>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Available Pieces:</p>
                <div className="flex flex-wrap gap-2">
                  {availablePieces.map((piece: any, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectPiece(piece)}
                      className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      {piece.text}
                    </button>
                  ))}
                </div>
              </div>

              {checkConstruction() && (
                <div className="mt-4 flex flex-col gap-4">
                  <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Perfect indirect speech conversion!
                  </div>
                  <button
                    onClick={nextScenario}
                    className="flex items-center justify-center gap-2 w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold transition-colors"
                  >
                    Next Scenario <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Assessment */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg">
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
                              className="mt-1 w-4 h-4 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/50 border-slate-300 dark:border-slate-600"
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
                    className="w-full mt-4 py-2 px-4 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 dark:bg-slate-700 disabled:dark:bg-slate-800 text-white rounded-lg font-medium transition-colors"
                  >
                    Submit Evaluation
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 mb-4">
                    <span className="text-3xl font-bold">{calculateScore()}/{questions.length}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-300 mb-2">Assessment Complete</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    {calculateScore() === questions.length 
                      ? "Perfect score! You are a master reporter." 
                      : "Good effort! Remember that tenses and time words shift backward in reported speech."}
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
