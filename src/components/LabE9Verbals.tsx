import { useState, useEffect } from 'react';
import { 
  BookOpen, CheckCircle, AlertCircle, Play, Pause,
  History, HelpCircle, Activity, Info, 
  ArrowRight, Filter, Settings, FileText
} from 'lucide-react';
import LabHeader from './LabHeader';

type VerbalType = 'Gerund' | 'Participle' | 'Infinitive';

interface PhraseItem {
  id: number;
  text: string;
  highlight: string;
  verbalType: VerbalType;
  explanation: string;
}

const CONVEYOR_ITEMS: PhraseItem[] = [
  { id: 1, text: "I enjoy running every morning.", highlight: "running", verbalType: "Gerund", explanation: "Functions as a noun (direct object of 'enjoy')." },
  { id: 2, text: "The running water was very cold.", highlight: "running", verbalType: "Participle", explanation: "Functions as an adjective describing 'water'." },
  { id: 3, text: "To run a marathon is her dream.", highlight: "To run", verbalType: "Infinitive", explanation: "Functions as a noun (subject of the sentence)." },
  { id: 4, text: "The broken vase lay on the floor.", highlight: "broken", verbalType: "Participle", explanation: "Functions as an adjective modifying 'vase'." },
  { id: 5, text: "Swimming is my favorite sport.", highlight: "Swimming", verbalType: "Gerund", explanation: "Functions as a noun (subject of the sentence)." },
  { id: 6, text: "She wants to eat dinner early.", highlight: "to eat", verbalType: "Infinitive", explanation: "Functions as a noun (direct object of 'wants')." },
  { id: 7, text: "The fascinating book kept me awake.", highlight: "fascinating", verbalType: "Participle", explanation: "Functions as an adjective modifying 'book'." },
];

const ASSESSMENT_QUESTIONS = [
  {
    question: 'A verbal that ends in -ing and functions as a noun is called a:',
    options: ['Participle', 'Infinitive', 'Gerund', 'Verb'],
    answer: 2
  },
  {
    question: 'In the sentence "She has a lot of work to do," what role does the infinitive "to do" play?',
    options: ['Noun', 'Adjective', 'Adverb', 'Preposition'],
    answer: 1 // Adjective modifying 'work'
  },
  {
    question: 'Which of the following is a participle functioning as an adjective?',
    options: ['Sleeping is important.', 'I love to sleep.', 'The sleeping baby is peaceful.', 'He went to sleep.'],
    answer: 2
  }
];

export default function LabE9Verbals({ onExit }: { onExit?: () => void }) {
  const [queue, setQueue] = useState<PhraseItem[]>([]);
  const [currentItem, setCurrentItem] = useState<PhraseItem | null>(null);
  const [sortedLog, setSortedLog] = useState<{ item: PhraseItem, isCorrect: boolean }[]>([]);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const [assessmentScores, setAssessmentScores] = useState<number[]>(Array(ASSESSMENT_QUESTIONS.length).fill(-1));
  const [showResults, setShowResults] = useState(false);

  // Initialize queue
  useEffect(() => {
    resetConveyor();
  }, []);

  const resetConveyor = () => {
    const shuffled = [...CONVEYOR_ITEMS].sort(() => Math.random() - 0.5);
    setQueue(shuffled);
    setCurrentItem(shuffled[0] || null);
    setSortedLog([]);
    setFeedbackMsg(null);
    setIsSimulationRunning(false);
  };

  const advanceConveyor = (currentQueue: PhraseItem[]) => {
    const nextQueue = currentQueue.slice(1);
    setQueue(nextQueue);
    setCurrentItem(nextQueue.length > 0 ? nextQueue[0] : null);
    if (nextQueue.length === 0) {
      setIsSimulationRunning(false);
    }
  };

  const handleSort = (selectedType: VerbalType) => {
    if (!currentItem || !isSimulationRunning) return;

    const isCorrect = currentItem.verbalType === selectedType;
    
    setSortedLog(prev => [{ item: currentItem, isCorrect }, ...prev]);
    
    if (isCorrect) {
      setFeedbackMsg({ text: `Correct! ${currentItem.highlight} is a ${selectedType}.`, type: 'success' });
    } else {
      setFeedbackMsg({ text: `Incorrect. ${currentItem.highlight} is a ${currentItem.verbalType}.`, type: 'error' });
    }

    advanceConveyor(queue);
    
    // Clear feedback after 3 seconds
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 3000);
  };

  const handleAssessment = (qIndex: number, optIndex: number) => {
    const newScores = [...assessmentScores];
    newScores[qIndex] = optIndex;
    setAssessmentScores(newScores);
  };

  const calculateScore = () => {
    let score = 0;
    assessmentScores.forEach((ans, i) => {
      if (ans === ASSESSMENT_QUESTIONS[i].answer) score++;
    });
    return score;
  };

  const highlightText = (text: string, highlight: string) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? (
            <strong key={i} className="text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-1 rounded">{part}</strong>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#000000] flex flex-col">
      <LabHeader title="Verbals: Gerunds, Participles & Infinitives" onExit={onExit} />
      
      <div className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1: Theory */}
          <div className="bg-white dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b]/50 dark:border-[#1c1b1b] p-6 flex flex-col h-[calc(100vh-8rem)] lg:overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-[#a1a1aa] dark:text-white">Verbals Theory</h2>
            </div>

            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-[#a1a1aa] mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  What is a Verbal?
                </h3>
                <p className="text-sm text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa] leading-relaxed">
                  A verbal is a verb form that does <strong>not</strong> function as a verb in the sentence. Instead, it functions as a noun, an adjective, or an adverb. There are three types of verbals: Gerunds, Participles, and Infinitives.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-[#a1a1aa] mb-2 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                  1. Gerunds
                </h3>
                <div className="bg-orange-50 dark:bg-orange-900 p-4 rounded-xl border border-orange-100 dark:border-orange-800/50 text-sm text-slate-700 dark:text-[#a1a1aa] dark:text-[#a1a1aa]">
                  <p className="mb-2"><strong>Form:</strong> Verb + <em>-ing</em></p>
                  <p className="mb-2"><strong>Function:</strong> Noun (can be a subject, direct object, or object of a preposition).</p>
                  <p className="italic text-orange-800 dark:text-orange-300">Example: "<strong>Swimming</strong> is good exercise." (Subject)</p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-[#a1a1aa] mb-2 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-green-500 dark:text-green-400" />
                  2. Participles
                </h3>
                <div className="bg-green-50 dark:bg-green-900 p-4 rounded-xl border border-green-100 dark:border-green-800/50 text-sm text-slate-700 dark:text-[#a1a1aa] dark:text-[#a1a1aa]">
                  <p className="mb-2"><strong>Form:</strong> Verb + <em>-ing</em> (Present) OR Verb + <em>-ed, -en, -d, -t, -n</em> (Past)</p>
                  <p className="mb-2"><strong>Function:</strong> Adjective (modifies a noun or pronoun).</p>
                  <p className="italic text-green-800 dark:text-green-200 dark:text-green-300 mb-1">Example 1: "The <strong>crying</strong> baby needs milk." (Modifies 'baby')</p>
                  <p className="italic text-green-800 dark:text-green-200 dark:text-green-300">Example 2: "The <strong>broken</strong> vase is on the floor." (Modifies 'vase')</p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-[#a1a1aa] mb-2 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                  3. Infinitives
                </h3>
                <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-xl border border-purple-100 dark:border-purple-800/50 text-sm text-slate-700 dark:text-[#a1a1aa] dark:text-[#a1a1aa]">
                  <p className="mb-2"><strong>Form:</strong> <em>to</em> + Verb</p>
                  <p className="mb-2"><strong>Function:</strong> Noun, Adjective, or Adverb.</p>
                  <p className="italic text-purple-800 dark:text-purple-200 dark:text-purple-300">Example: "I want <strong>to eat</strong>." (Noun - Direct Object)</p>
                </div>
              </section>
            </div>
          </div>

          {/* Column 2: Simulation */}
          <div className="bg-white dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b]/50 dark:border-[#1c1b1b] p-6 flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-xl">
                  <Settings className="w-6 h-6 text-indigo-600 dark:text-indigo-400 dark:text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-[#a1a1aa] dark:text-white">Conveyor Sorter</h2>
                  <p className="text-sm text-slate-500 dark:text-[#71717a] dark:text-[#71717a]">Sort phrases by their verbal type</p>
                </div>
              </div>
              <button
                onClick={() => isSimulationRunning ? setIsSimulationRunning(false) : (queue.length === 0 ? resetConveyor() : setIsSimulationRunning(true))}
                className={`p-3 rounded-xl text-white shadow-md transition-all ${
                  isSimulationRunning 
                    ? 'bg-amber-50 hover:bg-amber-600' 
                    : queue.length === 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isSimulationRunning ? <Pause className="w-5 h-5" /> : (queue.length === 0 ? <History className="w-5 h-5" /> : <Play className="w-5 h-5" />)}
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative bg-slate-50 dark:bg-[#121212] rounded-2xl border-2 border-slate-200 dark:border-[#1c1b1b]/50 dark:border-[#1c1b1b] overflow-hidden p-6">
              
              {/* Conveyor Belt Background */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-20 bg-slate-200 dark:bg-[#121212] dark:bg-[#121212] flex items-center overflow-hidden border-y-4 border-slate-300 dark:border-[#1c1b1b]">
                <div className="w-[200%] h-full flex opacity-20">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="flex-1 border-r-4 border-slate-400 dark:border-[#1c1b1b] skew-x-[20deg]" />
                  ))}
                </div>
              </div>

              {/* Current Item */}
              <div className="z-10 w-full max-w-md">
                {!isSimulationRunning && queue.length > 0 && (
                  <div className="text-center p-6 bg-white dark:!bg-[#121212] rounded-xl shadow-xl border border-slate-200 dark:border-[#1c1b1b]/50 dark:border-[#1c1b1b]">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-[#a1a1aa] mb-2">Simulation Paused</h3>
                    <p className="text-sm text-slate-500 dark:text-[#71717a]">Press Play to start sorting!</p>
                  </div>
                )}

                {queue.length === 0 && (
                  <div className="text-center p-6 bg-white dark:!bg-[#121212] rounded-xl shadow-xl border border-slate-200 dark:border-[#1c1b1b]/50 dark:border-[#1c1b1b]">
                    <CheckCircle className="w-12 h-12 text-emerald-500 dark:text-emerald-400 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-slate-800 dark:text-[#a1a1aa] mb-2">All Items Sorted!</h3>
                    <p className="text-sm text-slate-500 dark:text-[#71717a]">Check your log or restart the conveyor.</p>
                  </div>
                )}

                {isSimulationRunning && currentItem && (
                  <div className="text-center p-6 bg-white dark:!bg-[#121212] rounded-xl shadow-xl border-2 border-indigo-200 dark:border-indigo-700/50 dark:border-indigo-800 animate-in zoom-in duration-300">
                    <FileText className="w-8 h-8 text-indigo-500 dark:text-indigo-400 mx-auto mb-3" />
                    <p className="text-lg text-slate-800 dark:text-[#a1a1aa] font-medium leading-relaxed">
                      "{highlightText(currentItem.text, currentItem.highlight)}"
                    </p>
                    <div className="mt-4 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      Identify the highlighted verbal
                    </div>
                  </div>
                )}
              </div>

              {/* Feedback Overlay */}
              {feedbackMsg && (
                <div className={`absolute top-4 inset-x-4 p-3 rounded-lg text-sm text-center font-bold shadow-md animate-in slide-in-from-top-2 ${
                  feedbackMsg.type === 'success' ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border border-emerald-300' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border border-red-300'
                }`}>
                  {feedbackMsg.text}
                </div>
              )}

              {/* Sorting Bins */}
              <div className="absolute bottom-6 inset-x-4 flex justify-center gap-4">
                <button
                  onClick={() => handleSort('Gerund')}
                  disabled={!isSimulationRunning || !currentItem}
                  className="flex-1 py-3 px-2 bg-orange-50 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition-all active:scale-95 text-sm"
                >
                  Gerund
                </button>
                <button
                  onClick={() => handleSort('Participle')}
                  disabled={!isSimulationRunning || !currentItem}
                  className="flex-1 py-3 px-2 bg-green-50 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition-all active:scale-95 text-sm dark:!bg-[#121212] dark:border-[#1c1b1b] dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 dark:border-transparent"
                >
                  Participle
                </button>
                <button
                  onClick={() => handleSort('Infinitive')}
                  disabled={!isSimulationRunning || !currentItem}
                  className="flex-1 py-3 px-2 bg-purple-50 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition-all active:scale-95 text-sm dark:!bg-[#121212] dark:border-[#1c1b1b] dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 dark:border-transparent"
                >
                  Infinitive
                </button>
              </div>

            </div>
          </div>

          {/* Column 3: Log & Assessment */}
          <div className="bg-white dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b]/50 dark:border-[#1c1b1b] p-6 flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-xl">
                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 dark:text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-[#a1a1aa] dark:text-white">Log & Assessment</h2>
            </div>

            <div className="flex-1 lg:overflow-y-auto space-y-8 pr-2">
              
              {/* Log Section */}
              <section>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-[#a1a1aa] mb-3 flex items-center gap-2">
                  <History className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                  Sorting Log
                </h3>
                {sortedLog.length === 0 ? (
                  <div className="text-sm text-slate-500 dark:text-[#71717a] italic bg-slate-50 dark:bg-[#121212] p-4 rounded-xl text-center border border-dashed border-slate-200 dark:border-[#1c1b1b]/50 dark:border-[#1c1b1b]">
                    No items sorted yet. Start the conveyor!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sortedLog.map((log, idx) => (
                      <div key={idx} className={`p-3 rounded-lg border flex flex-col gap-1 ${
                        log.isCorrect 
                          ? 'bg-emerald-50 dark:bg-emerald-900 border-emerald-200 dark:border-emerald-700/50 dark:border-emerald-800' 
                          : 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700/50 dark:border-red-800'
                      }`}>
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-sm text-slate-800 dark:text-[#a1a1aa] line-clamp-1">
                            "{log.item.text}"
                          </span>
                          {log.isCorrect ? (
                            <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
                          )}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-[#71717a] dark:text-[#71717a]">
                          <span className="font-bold">{log.item.highlight}</span> is a <span className="font-bold">{log.item.verbalType}</span>.
                        </div>
                        {log.isCorrect && (
                          <div className="text-xs text-emerald-700 dark:text-emerald-300 dark:text-emerald-400 mt-1 italic">
                            {log.item.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Assessment Section */}
              <section className="pt-6 border-t border-slate-200 dark:border-[#1c1b1b]/50 dark:border-[#1c1b1b]">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-[#a1a1aa] mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                  Knowledge Check
                </h3>
                
                <div className="space-y-6">
                  {ASSESSMENT_QUESTIONS.map((q, qIndex) => (
                    <div key={qIndex} className="space-y-3">
                      <p className="text-sm font-medium text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa]">
                        {qIndex + 1}. {q.question}
                      </p>
                      <div className="space-y-2">
                        {q.options.map((opt, oIndex) => {
                          const isSelected = assessmentScores[qIndex] === oIndex;
                          const isCorrect = showResults && oIndex === q.answer;
                          const isWrong = showResults && isSelected && oIndex !== q.answer;
                          
                          let btnClass = "bg-white dark:bg-[#121212] border-slate-200 dark:border-[#1c1b1b]/50 dark:border-[#1c1b1b] dark:border-slate-600 text-slate-700 dark:text-[#ffffff] hover:bg-slate-50 dark:bg-[#121212] dark:hover:bg-slate-700";
                          
                          if (isSelected && !showResults) {
                            btnClass = "bg-emerald-50 dark:bg-emerald-900 border-emerald-500 text-emerald-700 dark:text-emerald-300 dark:text-emerald-300";
                          } else if (isCorrect) {
                            btnClass = "bg-green-100 dark:bg-green-900 border-green-500 text-green-800 dark:text-green-200 dark:text-green-200";
                          } else if (isWrong) {
                            btnClass = "bg-red-100 dark:bg-red-900 border-red-500 text-red-800 dark:text-red-200 dark:text-red-200";
                          } else if (showResults) {
                            btnClass = "bg-slate-50 dark:bg-[#121212] border-slate-200 dark:border-[#1c1b1b]/50 dark:border-[#1c1b1b] text-slate-400 opacity-50";
                          }

                          return (
                            <button
                              key={oIndex}
                              disabled={showResults}
                              onClick={() => handleAssessment(qIndex, oIndex)}
                              className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-colors ${btnClass}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {!showResults ? (
                    <button
                      onClick={() => setShowResults(true)}
                      disabled={assessmentScores.includes(-1)}
                      className={`w-full py-3 rounded-xl font-bold transition-all ${
                        assessmentScores.includes(-1)
                          ? 'bg-slate-100 dark:bg-[#121212] dark:bg-[#121212] text-slate-400 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                      }`}
                    >
                      Check Answers
                    </button>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b]/50 dark:border-[#1c1b1b] text-center space-y-3">
                      <div className="text-2xl font-black text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa]">
                        {calculateScore()} / {ASSESSMENT_QUESTIONS.length}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-[#71717a] dark:text-[#71717a]">
                        {calculateScore() === ASSESSMENT_QUESTIONS.length 
                          ? 'Perfect! You have mastered verbals.' 
                          : 'Good effort! Review the differences between gerunds and participles and try again.'}
                      </p>
                      <button
                        onClick={() => {
                          setShowResults(false);
                          setAssessmentScores(Array(ASSESSMENT_QUESTIONS.length).fill(-1));
                        }}
                        className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        <History className="w-4 h-4" />
                        Retry Assessment
                      </button>
                    </div>
                  )}
                </div>
              </section>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
