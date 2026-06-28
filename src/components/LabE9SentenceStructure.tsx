import { useState, useMemo } from 'react';
import { GitMerge, CheckCircle2, XCircle, BookOpen, Terminal, Shield, Combine, MoveRight } from 'lucide-react';
import LabHeader from './LabHeader';

const COLLIDER_DATA = [
  {
    clause1: "If you heat ice,",
    clause2: "it melts.",
    type: "Zero Conditional",
    rule: "Used for general truths. (If + present simple, present simple).",
    wrongOptions: ["it will melt.", "it would melt.", "it is melting."]
  },
  {
    clause1: "If it rains tomorrow,",
    clause2: "we will cancel the picnic.",
    type: "Type-1 Conditional",
    rule: "Used for future possibilities. (If + present simple, will + base verb).",
    wrongOptions: ["we would cancel the picnic.", "we canceled the picnic.", "we cancel the picnic."]
  },
  {
    clause1: "Although he was tired,",
    clause2: "he finished his homework.",
    type: "Complex Sentence",
    rule: "A dependent clause joined with an independent clause.",
    wrongOptions: ["but he finished his homework.", "so he finished his homework.", "and he finished his homework."]
  },
  {
    clause1: "Unless you study hard,",
    clause2: "you will fail the exam.",
    type: "Type-1 Conditional",
    rule: "Unless means 'if not'. Requires future tense in main clause.",
    wrongOptions: ["you fail the exam.", "you would fail the exam.", "you have failed the exam."]
  },
  {
    clause1: "When the sun goes down,",
    clause2: "it gets dark.",
    type: "Zero Conditional",
    rule: "General fact. (When + present simple, present simple).",
    wrongOptions: ["it will get dark.", "it would get dark.", "it got dark."]
  }
];

const ASSESSMENT_QUESTIONS = [
  {
    question: "Which tense is used in the main clause of a Type 1 conditional?",
    options: ["Simple Present", "Simple Past", "Future (will + verb)", "Present Perfect"],
    correct: 2
  },
  {
    question: "What does a Zero Conditional express?",
    options: ["A hypothetical situation", "A general truth or scientific fact", "A past regret", "A future possibility"],
    correct: 1
  },
  {
    question: "What must be attached to a dependent clause to make it a complete sentence?",
    options: ["A preposition", "A subordinating conjunction", "An independent clause", "An adjective"],
    correct: 2
  }
];

export default function LabE9SentenceStructure({ onExit }: { onExit?: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'success' | 'error'>('idle');
  const [logs, setLogs] = useState<{ id: number; message: string; success: boolean }[]>([]);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

  const currentData = COLLIDER_DATA[currentIndex];
  
  const options = useMemo(() => {
    return [currentData.clause2, ...currentData.wrongOptions].sort((a, b) => a.length - b.length);
  }, [currentIndex, currentData]);

  const handleSelect = (opt: string) => {
    setSelectedOption(opt);
    if (opt === currentData.clause2) {
      setResult('success');
      setLogs((prev) => [{ id: Date.now(), message: `Collided: "${currentData.clause1} ${opt}" (${currentData.type})`, success: true }, ...prev]);
    } else {
      setResult('error');
      setLogs((prev) => [{ id: Date.now(), message: `Collision Failed: Tense/Logic mismatch with "${opt}"`, success: false }, ...prev]);
    }
  };

  const nextCollider = () => {
    setCurrentIndex((prev) => (prev + 1) % COLLIDER_DATA.length);
    setSelectedOption(null);
    setResult('idle');
  };

  const calculateScore = () => {
    let score = 0;
    ASSESSMENT_QUESTIONS.forEach((q, idx) => {
      if (assessmentAnswers[idx] === q.correct) score++;
    });
    return score;
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-300 dark:text-slate-300 selection:bg-purple-200 dark:bg-purple-900 dark:selection:bg-purple-900">
      <LabHeader title="Clause Collider: Conditionals & Structure" variant="blue" onExit={onExit} />
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Column 1: Theory */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-700 overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
            <div className="p-4 bg-slate-100 dark:bg-slate-900 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-700 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-500 dark:text-purple-400" />
              <h2 className="font-semibold">Grammar Manual</h2>
            </div>
            <div className="p-6 overflow-y-auto space-y-6 text-sm flex-1">
              <section>
                <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-2">1. Dependent vs Independent Clauses</h3>
                <p className="text-slate-600 dark:text-slate-400 dark:text-slate-300 mb-2">
                  An <strong>independent clause</strong> can stand alone as a complete sentence. A <strong>dependent clause</strong> has a subject and a verb but cannot stand alone because it begins with a subordinating conjunction (e.g., if, when, because).
                </p>
                <div className="bg-purple-50 dark:bg-purple-900 p-3 rounded-lg border border-purple-100 dark:border-purple-800">
                  <p className="font-mono text-xs text-purple-800 dark:text-purple-200 dark:text-purple-300">
                    Dep: If you study hard,<br/>Ind: you will pass the exam.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-2">2. Zero Conditional</h3>
                <p className="text-slate-600 dark:text-slate-400 dark:text-slate-300 mb-2">
                  Used to express general truths, scientific facts, or habits. The condition always has the same result.
                </p>
                <p className="font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300 mb-2">Structure: <span className="text-purple-600 dark:text-purple-400 dark:text-purple-400">If + Present Simple, Present Simple</span></p>
                <div className="bg-purple-50 dark:bg-purple-900 p-3 rounded-lg border border-purple-100 dark:border-purple-800">
                  <p className="font-mono text-xs text-purple-800 dark:text-purple-200 dark:text-purple-300">
                    Example: If you heat ice, it melts.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-2">3. Type 1 Conditional</h3>
                <p className="text-slate-600 dark:text-slate-400 dark:text-slate-300 mb-2">
                  Used to express real or very probable situations in the present or future.
                </p>
                <p className="font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300 mb-2">Structure: <span className="text-purple-600 dark:text-purple-400 dark:text-purple-400">If + Present Simple, Will + Base Verb</span></p>
                <div className="bg-purple-50 dark:bg-purple-900 p-3 rounded-lg border border-purple-100 dark:border-purple-800">
                  <p className="font-mono text-xs text-purple-800 dark:text-purple-200 dark:text-purple-300">
                    Example: If it rains, I will stay at home.
                  </p>
                </div>
              </section>
            </div>
          </div>

          {/* Column 2: Simulation */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-700 overflow-hidden flex flex-col h-[calc(100vh-8rem)] relative">
            <div className="absolute inset-0 bg-purple-500 dark:bg-purple-500 z-0"></div>
            <div className="p-4 bg-slate-100 dark:bg-slate-900 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-700 flex items-center gap-2 relative z-10">
              <Combine className="w-5 h-5 text-purple-500 dark:text-purple-400" />
              <h2 className="font-semibold">Clause Collider Simulator</h2>
            </div>
            
            <div className="p-6 flex-1 flex flex-col justify-center relative z-10 overflow-y-auto">
              <div className="flex flex-col items-center gap-4 mb-8">
                
                <div className="w-full bg-slate-100 dark:bg-slate-900 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 dark:border-slate-600 rounded-xl p-6 flex flex-col justify-center text-center shadow-inner relative">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest absolute top-3 left-0 w-full">Dependent Clause</span>
                  <span className="text-xl font-medium mt-4">{currentData.clause1}</span>
                </div>
                
                <div className="flex justify-center items-center px-2 text-slate-400">
                  <GitMerge className="w-8 h-8 text-purple-500 dark:text-purple-400" />
                </div>

                <div className={`w-full border-2 rounded-xl p-6 flex flex-col justify-center text-center relative transition-colors ${
                  selectedOption
                    ? result === 'success'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 shadow-lg'
                      : 'border-red-500 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 shadow-md'
                    : 'border-dashed border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300 dark:text-purple-300'
                }`}>
                  <span className="text-xs font-bold opacity-60 uppercase tracking-widest absolute top-3 left-0 w-full">Independent Clause</span>
                  <span className="text-xl font-medium mt-4">{selectedOption || "Select an option below..."}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {options.map(opt => (
                  <button
                    key={opt}
                    disabled={result === 'success'}
                    onClick={() => handleSelect(opt)}
                    className={`p-4 rounded-xl text-left font-medium transition-all border-2 ${
                      selectedOption === opt
                        ? result === 'success'
                          ? 'border-green-500 bg-green-50 dark:bg-green-900 dark:bg-green-900/20'
                          : 'border-red-500 bg-red-50 dark:bg-red-900 dark:bg-red-900/20'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md hover:-translate-y-0.5'
                    } disabled:opacity-75`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {result !== 'idle' && (
                <div className={`mt-8 flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl animate-in fade-in zoom-in duration-300 gap-4 ${
                  result === 'success' 
                    ? 'bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700/50 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700/50 dark:border-red-800'
                }`}>
                  <div className={`flex items-start gap-3 ${result === 'success' ? 'text-green-700 dark:text-green-300 dark:text-green-300' : 'text-red-700 dark:text-red-300 dark:text-red-300'}`}>
                    {result === 'success' ? <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" /> : <XCircle className="w-6 h-6 shrink-0 mt-0.5" />}
                    <div>
                      <p className="font-bold">{result === 'success' ? 'Collision Successful!' : 'Tense/Logic Mismatch!'}</p>
                      {result === 'success' && (
                        <p className="text-xs opacity-90 mt-1"><strong>{currentData.type}</strong>: {currentData.rule}</p>
                      )}
                    </div>
                  </div>
                  {result === 'success' && (
                    <button onClick={nextCollider} className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-50 text-white font-bold rounded-lg transition-colors whitespace-nowrap flex items-center justify-center gap-2">
                      Next <MoveRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Logging & Assessment */}
          <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-700 overflow-hidden flex flex-col flex-1">
              <div className="p-4 bg-slate-100 dark:bg-slate-900 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-700 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                <h2 className="font-semibold">Collision Logs</h2>
              </div>
              <div className="p-4 overflow-y-auto flex-1 space-y-3 font-mono text-xs">
                {logs.length === 0 ? (
                  <p className="text-slate-400 dark:text-slate-500 text-center mt-4">Waiting for initial collision...</p>
                ) : (
                  logs.map(log => (
                    <div key={log.id} className={`p-2 rounded border-l-2 ${log.success ? 'bg-purple-50 dark:bg-purple-900 border-purple-500 dark:bg-purple-900 text-slate-700 dark:text-slate-300 dark:text-slate-300' : 'bg-red-50 dark:bg-red-900 border-red-500 dark:bg-red-900 text-red-700 dark:text-red-300 dark:text-red-300'}`}>
                      <span className="opacity-50">[{new Date(log.id).toLocaleTimeString()}]</span> {log.message}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-700 overflow-hidden flex flex-col flex-1">
              <div className="p-4 bg-slate-100 dark:bg-slate-900 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-700 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                <h2 className="font-semibold">Knowledge Assessment</h2>
              </div>
              <div className="p-4 overflow-y-auto flex-1 space-y-6">
                {!assessmentSubmitted ? (
                  <>
                    {ASSESSMENT_QUESTIONS.map((q, idx) => (
                      <div key={idx} className="space-y-2">
                        <p className="text-sm font-medium">{idx + 1}. {q.question}</p>
                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => (
                            <label key={optIdx} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-700 p-2 rounded">
                              <input
                                type="radio"
                                name={`q-${idx}`}
                                checked={assessmentAnswers[idx] === optIdx}
                                onChange={() => setAssessmentAnswers(prev => ({ ...prev, [idx]: optIdx }))}
                                className="text-purple-600 dark:text-purple-400 focus:ring-purple-500"
                              />
                              <span className="text-slate-600 dark:text-slate-400 dark:text-slate-300">{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => setAssessmentSubmitted(true)}
                      disabled={Object.keys(assessmentAnswers).length < ASSESSMENT_QUESTIONS.length}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 dark:bg-slate-900 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                    >
                      Submit Assessment
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <div className="text-4xl font-bold text-purple-500 dark:text-purple-400">
                      {calculateScore()} / {ASSESSMENT_QUESTIONS.length}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">Assessment Completed</p>
                    <button
                      onClick={() => { setAssessmentSubmitted(false); setAssessmentAnswers({}); }}
                      className="px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900 rounded-lg hover:bg-purple-100 dark:bg-purple-900 dark:hover:bg-purple-900 transition-colors"
                    >
                      Retake
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
