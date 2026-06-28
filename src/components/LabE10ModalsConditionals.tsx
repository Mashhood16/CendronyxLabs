import { useState } from 'react';
import { BookOpen, Target, Cpu, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabE10ModalsConditionalsProps {
  onExit?: () => void;
}

const LOGIC_GATES = [
  { 
    ifClause: "If it rains tomorrow,", 
    type: "First Conditional",
    matches: [
      { text: "we will cancel the picnic.", isCorrect: true, explanation: "First conditional uses Present Simple + Future Simple for real possibilities." },
      { text: "we would cancel the picnic.", isCorrect: false, explanation: "Incorrect. 'Would' is used in Second Conditional." },
      { text: "we cancel the picnic.", isCorrect: false, explanation: "Incorrect. Main clause needs 'will' for First Conditional." }
    ]
  },
  { 
    ifClause: "If I had a million dollars,", 
    type: "Second Conditional",
    matches: [
      { text: "I will buy an island.", isCorrect: false, explanation: "Incorrect. 'Will' is used for First Conditional (real possibilities)." },
      { text: "I would buy an island.", isCorrect: true, explanation: "Second conditional uses Past Simple + 'Would' + Verb for imaginary situations." },
      { text: "I bought an island.", isCorrect: false, explanation: "Incorrect tense for the main clause." }
    ]
  },
  {
    ifClause: "You are feeling very sick.",
    type: "Modal of Necessity",
    matches: [
      { text: "You might see a doctor.", isCorrect: false, explanation: "Too weak. 'Might' shows possibility." },
      { text: "You can see a doctor.", isCorrect: false, explanation: "Too weak. 'Can' shows ability or permission." },
      { text: "You must see a doctor.", isCorrect: true, explanation: "'Must' shows strong necessity or obligation." }
    ]
  }
];

export default function LabE10ModalsConditionals({ onExit = () => {} }: LabE10ModalsConditionalsProps) {
  const [currentGate, setCurrentGate] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

  const questions = [
    {
      q: "Which modal verb expresses strong obligation?",
      options: ["Can", "May", "Must", "Might"],
      correct: 2
    },
    {
      q: "Which sentence is a First Conditional?",
      options: [
        "If I were you, I would study harder.",
        "If it snows, we will build a snowman.",
        "I must finish this assignment.",
        "If I had known, I would have gone."
      ],
      correct: 1
    },
    {
      q: "What does the Second Conditional express?",
      options: [
        "General truths (Zero Conditional)",
        "Real future possibilities",
        "Imaginary or unrealistic situations",
        "Past regrets"
      ],
      correct: 2
    }
  ];

  const handleMatchSelect = (idx: number) => {
    if (selectedMatch === null) {
      setSelectedMatch(idx);
    }
  };

  const nextGate = () => {
    setCurrentGate((prev) => (prev + 1) % LOGIC_GATES.length);
    setSelectedMatch(null);
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
      <LabHeader title="Unit 5: Possibility Engine (Modals & Conditionals)" variant="dark" onExit={onExit} />
      
      <div className="flex-1 lg:overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          
          {/* Column 1: Theory */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-hidden">
            <div className="p-6 bg-purple-50 dark:bg-purple-900/30 border-b border-purple-100 dark:border-purple-800/50 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-300">Modals & Conditionals</h2>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-700 dark:text-slate-300">
              <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Modal Verbs</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li><strong>Necessity/Obligation:</strong> <em>must, have to, should</em>.</li>
                  <li><strong>Ability:</strong> <em>can, could</em>.</li>
                  <li><strong>Possibility:</strong> <em>may, might, could</em>.</li>
                  <li><strong>Permission:</strong> <em>can, may</em>.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Conditional Sentences</h3>
                <div className="space-y-4">
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <strong className="text-purple-600 dark:text-purple-400 block mb-1">First Conditional (Real Possibility)</strong>
                    <p className="text-sm">If + Present Simple, ... will + infinitive</p>
                    <p className="text-sm italic mt-1 text-slate-500">"If it rains, I will stay home."</p>
                  </div>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <strong className="text-fuchsia-600 dark:text-fuchsia-400 block mb-1">Second Conditional (Imaginary)</strong>
                    <p className="text-sm">If + Past Simple, ... would + infinitive</p>
                    <p className="text-sm italic mt-1 text-slate-500">"If I won the lottery, I would buy a boat."</p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Column 2: Logic Engine */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-lg">
                <Cpu className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-300">Logic Engine</h2>
            </div>
            
            <div className="flex-1 flex flex-col">
              <div className="mb-6 flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Scenario {currentGate + 1} of {LOGIC_GATES.length}
                </span>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full">
                  {LOGIC_GATES[currentGate].type}
                </span>
              </div>

              <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 text-center mb-6 shadow-inner">
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  "{LOGIC_GATES[currentGate].ifClause}"
                </p>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Select the correct continuation:</p>
                {LOGIC_GATES[currentGate].matches.map((match, idx) => {
                  const isSelected = selectedMatch === idx;
                  const isAnswered = selectedMatch !== null;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleMatchSelect(idx)}
                      disabled={isAnswered}
                      className={`w-full p-4 rounded-xl text-left transition-all border-2 flex flex-col gap-2 ${
                        !isAnswered
                          ? 'border-slate-200 dark:border-slate-700 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30'
                          : isSelected
                            ? match.isCorrect 
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' 
                              : 'border-rose-500 bg-rose-50 dark:bg-rose-900/30'
                            : match.isCorrect
                              ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 opacity-70'
                              : 'border-slate-200 dark:border-slate-700 opacity-40'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className={`font-medium ${
                          isAnswered && (isSelected || match.isCorrect)
                            ? match.isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}>
                          {match.text}
                        </span>
                        {isAnswered && isSelected && match.isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                        {isAnswered && isSelected && !match.isCorrect && <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
                      </div>
                      
                      {isAnswered && (isSelected || match.isCorrect) && (
                        <div className={`text-sm mt-2 p-2 rounded bg-white/50 dark:bg-slate-900/50 ${
                          match.isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}>
                          {match.explanation}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedMatch !== null && (
                <div className="mt-4 flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={nextGate}
                    className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-colors"
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
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-lg">
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
                              className="mt-1 w-4 h-4 text-purple-600 dark:text-purple-400 bg-slate-100 dark:bg-slate-900/50 border-slate-300 dark:border-slate-600"
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
                    className="w-full mt-4 py-2 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 dark:bg-slate-900 disabled:dark:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Submit Evaluation
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 mb-4">
                    <span className="text-3xl font-bold">{calculateScore()}/{questions.length}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-300 mb-2">Assessment Complete</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    {calculateScore() === questions.length 
                      ? "Perfect score! You've mastered modals and conditionals." 
                      : "Good effort! Review the definitions of First and Second Conditionals to improve."}
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
