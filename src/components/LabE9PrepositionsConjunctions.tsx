import { useState } from 'react';
import { BookOpen, Beaker, Terminal, CheckCircle2, XCircle, Shield, MoveRight } from 'lucide-react';
import LabHeader from './LabHeader';

const BRIDGE_DATA = [
  {
    islandA: "We stayed inside",
    islandB: "the heavy rain.",
    options: ["because of", "in addition to", "even though", "so that"],
    correct: "because of",
    type: "Compound Preposition"
  },
  {
    islandA: "She will",
    islandB: "take the train nor fly.",
    options: ["either / or", "neither / nor", "not only / but also", "both / and"],
    correct: "neither / nor",
    type: "Correlative Conjunction"
  },
  {
    islandA: "I will call you",
    islandB: "I arrive at the station.",
    options: ["as soon as", "even though", "in front of", "so that"],
    correct: "as soon as",
    type: "Subordinating Conjunction"
  },
  {
    islandA: "The car was parked",
    islandB: "the fire hydrant.",
    options: ["because of", "in addition to", "in front of", "instead of"],
    correct: "in front of",
    type: "Compound Preposition"
  },
  {
    islandA: "We should study",
    islandB: "we can pass the exam.",
    options: ["so that", "even if", "because of", "although"],
    correct: "so that",
    type: "Subordinating Conjunction"
  }
];

const ASSESSMENT_QUESTIONS = [
  {
    question: "Which of the following is a compound preposition?",
    options: ["And", "Although", "In front of", "Because"],
    correct: 2
  },
  {
    question: "Which conjunction type joins a dependent clause to an independent clause?",
    options: ["Coordinating", "Subordinating", "Correlative", "None of the above"],
    correct: 1
  },
  {
    question: "What is the acronym for coordinating conjunctions?",
    options: ["BOSSFAN", "FANBOYS", "BOYSFAN", "FABNOYS"],
    correct: 1
  }
];

export default function LabE9PrepositionsConjunctions({ onExit }: { onExit?: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedBridge, setSelectedBridge] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'success' | 'error'>('idle');
  const [logs, setLogs] = useState<{ id: number; message: string; success: boolean }[]>([]);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

  const currentData = BRIDGE_DATA[currentIndex];

  const handleBuild = (option: string) => {
    setSelectedBridge(option);
    if (option === currentData.correct) {
      setResult('success');
      setLogs((prev) => [{ id: Date.now(), message: `Bridge constructed: "${currentData.islandA} [${option}] ${currentData.islandB}" (${currentData.type})`, success: true }, ...prev]);
    } else {
      setResult('error');
      setLogs((prev) => [{ id: Date.now(), message: `Bridge failed: "${currentData.islandA} [${option}] ${currentData.islandB}" is structurally unsound.`, success: false }, ...prev]);
    }
  };

  const nextIsland = () => {
    setCurrentIndex((prev) => (prev + 1) % BRIDGE_DATA.length);
    setSelectedBridge(null);
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
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa] selection:bg-amber-200 dark:bg-amber-900 dark:selection:bg-amber-900">
      <LabHeader title="Bridge Builder: Prepositions & Conjunctions" variant="amber" onExit={onExit} />
      
      <div className="flex-1 lg:overflow-y-auto p-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Column 1: Theory */}
          <div className="bg-white dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b]/50 dark:border-[#1c1b1b] overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
            <div className="p-4 bg-slate-100 dark:bg-[#121212] dark:bg-slate-700 border-b border-slate-200 dark:border-[#1c1b1b]/50 dark:border-[#1c1b1b] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              <h2 className="font-semibold">Grammar Manual</h2>
            </div>
            <div className="p-6 lg:overflow-y-auto space-y-6 text-sm flex-1">
              <section>
                <h3 className="text-lg font-bold text-amber-600 dark:text-amber-400 mb-2">1. Subordinating Conjunctions</h3>
                <p className="text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa] mb-2">
                  These conjunctions introduce a <strong>dependent clause</strong> and tie it to an <strong>independent clause</strong>. They show cause and effect, time, or condition.
                </p>
                <div className="bg-amber-50 dark:bg-amber-900 p-3 rounded-lg border border-amber-100 dark:border-amber-800">
                  <p className="font-mono text-xs text-amber-800 dark:text-amber-200 dark:text-amber-300">
                    Examples: because, although, since, as soon as, unless.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-amber-600 dark:text-amber-400 mb-2">2. Coordinating Conjunctions</h3>
                <p className="text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa] mb-2">
                  They connect words, phrases, or clauses of equal grammatical rank. Remember the acronym <strong>FANBOYS</strong>.
                </p>
                <div className="bg-amber-50 dark:bg-amber-900 p-3 rounded-lg border border-amber-100 dark:border-amber-800">
                  <p className="font-mono text-xs text-amber-800 dark:text-amber-200 dark:text-amber-300">
                    For, And, Nor, But, Or, Yet, So.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-amber-600 dark:text-amber-400 mb-2">3. Compound Prepositions</h3>
                <p className="text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa] mb-2">
                  A compound preposition is a two- or three-word phrase that functions as a single preposition. They show spatial, temporal, or logical relationships.
                </p>
                <div className="bg-amber-50 dark:bg-amber-900 p-3 rounded-lg border border-amber-100 dark:border-amber-800">
                  <p className="font-mono text-xs text-amber-800 dark:text-amber-200 dark:text-amber-300">
                    Examples: in front of, because of, in addition to, next to.
                  </p>
                </div>
              </section>
            </div>
          </div>

          {/* Column 2: Simulation */}
          <div className="bg-white dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b]/50 dark:border-[#1c1b1b] overflow-hidden flex flex-col h-[calc(100vh-8rem)] relative">
            <div className="absolute inset-0 bg-amber-500 dark:bg-amber-500 z-0"></div>
            <div className="p-4 bg-slate-100 dark:bg-[#121212] dark:bg-slate-700 border-b border-slate-200 dark:border-[#1c1b1b]/50 dark:border-[#1c1b1b] flex items-center gap-2 relative z-10">
              <Beaker className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              <h2 className="font-semibold">Bridge Simulation Center</h2>
            </div>
            
            <div className="p-6 flex-1 flex flex-col justify-center relative z-10 lg:overflow-y-auto">
              <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 mb-12">
                <div className="flex-1 bg-sky-100 dark:bg-sky-900/40 border-2 border-sky-300 dark:border-sky-700 rounded-xl p-6 flex items-center justify-center text-center shadow-inner relative">
                  <span className="text-xl font-medium text-sky-900 dark:text-sky-200">{currentData.islandA}</span>
                </div>
                
                <div className="flex flex-col justify-center items-center px-4">
                  <div className={`h-12 w-2 md:h-2 md:w-16 ${result === 'success' ? 'bg-amber-500' : 'bg-slate-300 dark:bg-[#121212] dark:bg-slate-700'} transition-colors`}></div>
                  <div className={`px-4 py-3 rounded-lg border-2 font-bold text-center min-w-[140px] whitespace-pre-wrap transition-all shadow-md ${
                    selectedBridge 
                      ? result === 'success'
                        ? 'border-amber-500 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 dark:text-amber-300'
                        : 'border-red-500 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 dark:text-red-300'
                      : 'border-dashed border-amber-400 dark:border-amber-600 bg-amber-50 dark:bg-amber-900 text-amber-700 dark:text-amber-300 dark:text-amber-400'
                  }`}>
                    {selectedBridge || '???'}
                  </div>
                  <div className={`h-12 w-2 md:h-2 md:w-16 ${result === 'success' ? 'bg-amber-500' : 'bg-slate-300 dark:bg-[#121212] dark:bg-slate-700'} transition-colors`}></div>
                </div>

                <div className="flex-1 bg-emerald-100 dark:bg-emerald-900 border-2 border-emerald-300 dark:border-emerald-700 rounded-xl p-6 flex items-center justify-center text-center shadow-inner relative">
                  <span className="text-xl font-medium text-emerald-900 dark:text-emerald-100 dark:text-emerald-200">{currentData.islandB}</span>
                </div>
              </div>

              <div className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                Available Materials
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {currentData.options.map(opt => (
                  <button
                    key={opt}
                    disabled={result === 'success'}
                    onClick={() => handleBuild(opt)}
                    className={`p-4 rounded-xl font-bold text-sm lg:text-base transition-all border-2 ${
                      selectedBridge === opt
                        ? result === 'success'
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-900 text-amber-700 dark:text-amber-300 dark:text-amber-300'
                          : 'border-red-500 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 dark:text-red-300'
                        : 'bg-white dark:bg-[#121212] border-slate-200 dark:border-[#1c1b1b]/50 dark:border-[#1c1b1b] hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md'
                    } disabled:opacity-75`}
                  >
                    {opt.replace(' / ', ' ... ')}
                  </button>
                ))}
              </div>

              {result !== 'idle' && (
                <div className={`mt-8 flex items-center justify-between p-4 rounded-xl animate-in fade-in zoom-in duration-300 gap-4 ${
                  result === 'success' 
                    ? 'bg-amber-50 dark:bg-amber-900 border border-amber-200 dark:border-amber-700/50 dark:border-amber-800' 
                    : 'bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700/50 dark:border-red-800'
                }`}>
                  <div className={`flex items-center gap-3 ${result === 'success' ? 'text-amber-700 dark:text-amber-300 dark:text-amber-300' : 'text-red-700 dark:text-red-300 dark:text-red-300'}`}>
                    {result === 'success' ? <CheckCircle2 className="w-6 h-6 shrink-0" /> : <XCircle className="w-6 h-6 shrink-0" />}
                    <div>
                      <p className="font-bold">{result === 'success' ? 'Bridge Built Successfully!' : 'Structural Integrity Failed!'}</p>
                    </div>
                  </div>
                  {result === 'success' && (
                    <button onClick={nextIsland} className="px-4 py-2 bg-amber-600 hover:bg-amber-50 text-white font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 dark:text-white dark:text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40">
                      Next <MoveRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Logging & Assessment */}
          <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
            <div className="bg-white dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b]/50 dark:border-[#1c1b1b] overflow-hidden flex flex-col flex-1">
              <div className="p-4 bg-slate-100 dark:bg-[#121212] dark:bg-slate-700 border-b border-slate-200 dark:border-[#1c1b1b]/50 dark:border-[#1c1b1b] flex items-center gap-2">
                <Terminal className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                <h2 className="font-semibold">Construction Logs</h2>
              </div>
              <div className="p-4 lg:overflow-y-auto flex-1 space-y-3 font-mono text-xs">
                {logs.length === 0 ? (
                  <p className="text-slate-400 dark:text-[#71717a] text-center mt-4">Waiting for operations...</p>
                ) : (
                  logs.map(log => (
                    <div key={log.id} className={`p-2 rounded border-l-2 ${log.success ? 'bg-amber-50 dark:bg-amber-900 border-amber-500 dark:bg-amber-900 text-slate-700 dark:text-[#ffffff] dark:text-[#ffffff]' : 'bg-red-50 dark:bg-red-900 border-red-500 dark:bg-red-900 text-red-700 dark:text-red-300 dark:text-red-300'}`}>
                      <span className="opacity-50">[{new Date(log.id).toLocaleTimeString()}]</span> {log.message}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b]/50 dark:border-[#1c1b1b] overflow-hidden flex flex-col flex-1">
              <div className="p-4 bg-slate-100 dark:bg-[#121212] dark:bg-slate-700 border-b border-slate-200 dark:border-[#1c1b1b]/50 dark:border-[#1c1b1b] flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                <h2 className="font-semibold">Knowledge Assessment</h2>
              </div>
              <div className="p-4 lg:overflow-y-auto flex-1 space-y-6">
                {!assessmentSubmitted ? (
                  <>
                    {ASSESSMENT_QUESTIONS.map((q, idx) => (
                      <div key={idx} className="space-y-2">
                        <p className="text-sm font-medium">{idx + 1}. {q.question}</p>
                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => (
                            <label key={optIdx} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-50 dark:bg-[#121212] dark:hover:bg-slate-700 p-2 rounded">
                              <input
                                type="radio"
                                name={`q-${idx}`}
                                checked={assessmentAnswers[idx] === optIdx}
                                onChange={() => setAssessmentAnswers(prev => ({ ...prev, [idx]: optIdx }))}
                                className="text-amber-600 dark:text-amber-400 focus:ring-amber-500"
                              />
                              <span className="text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa]">{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => setAssessmentSubmitted(true)}
                      disabled={Object.keys(assessmentAnswers).length < ASSESSMENT_QUESTIONS.length}
                      className="w-full py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40"
                    >
                      Submit Assessment
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <div className="text-4xl font-bold text-amber-500 dark:text-amber-400">
                      {calculateScore()} / {ASSESSMENT_QUESTIONS.length}
                    </div>
                    <p className="text-slate-600 dark:text-[#71717a] font-medium">Assessment Completed</p>
                    <button
                      onClick={() => { setAssessmentSubmitted(false); setAssessmentAnswers({}); }}
                      className="px-4 py-2 text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900 rounded-lg hover:bg-amber-100 dark:bg-amber-900 dark:hover:bg-amber-900 transition-colors"
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
