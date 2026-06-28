import { useState } from 'react';
import { 
  BookOpen, Search, Target, CheckCircle, Activity, 
  AlertCircle, ChevronRight, Layers, Tag, Eye, Info, Check
} from 'lucide-react';
import LabHeader from './LabHeader';

type PhraseType = "Adjectival Phrase" | "Adverbial Phrase" | "Noun Phrase" | "Verb Phrase";

interface SentencePart {
  type: 'text' | 'phrase';
  id?: string;
  content: string;
  correctType?: PhraseType;
  hint?: string;
}

interface Sentence {
  id: number;
  parts: SentencePart[];
}

const sentences: Sentence[] = [
  {
    id: 1,
    parts: [
      { type: 'text', content: "The ancient tree " },
      { type: 'phrase', id: '1-p1', content: "in the dense forest", correctType: "Adjectival Phrase", hint: "Describes which tree (a noun)." },
      { type: 'text', content: " stood " },
      { type: 'phrase', id: '1-p2', content: "for a thousand years", correctType: "Adverbial Phrase", hint: "Describes how long it stood (modifies a verb)." },
      { type: 'text', content: "." }
    ]
  },
  {
    id: 2,
    parts: [
      { type: 'text', content: "The athlete ran " },
      { type: 'phrase', id: '2-p1', content: "with incredible speed", correctType: "Adverbial Phrase", hint: "Describes how the athlete ran." },
      { type: 'text', content: " " },
      { type: 'phrase', id: '2-p2', content: "towards the finish line", correctType: "Adverbial Phrase", hint: "Describes where the athlete ran." },
      { type: 'text', content: "." }
    ]
  },
  {
    id: 3,
    parts: [
      { type: 'text', content: "A gift " },
      { type: 'phrase', id: '3-p1', content: "of immense value", correctType: "Adjectival Phrase", hint: "Describes the gift (a noun)." },
      { type: 'text', content: " was delivered " },
      { type: 'phrase', id: '3-p2', content: "in the morning", correctType: "Adverbial Phrase", hint: "Describes when it was delivered." },
      { type: 'text', content: "." }
    ]
  }
];

export default function LabE9Phrases({ onExit }: { onExit?: () => void }) {
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [activePhraseId, setActivePhraseId] = useState<string | null>(null);
  const [resolvedPhrases, setResolvedPhrases] = useState<Set<string>>(new Set());
  const [logs, setLogs] = useState<{ id: number; message: string; timestamp: string; type: 'success' | 'error' }[]>([]);
  
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

  const currentSentence = sentences[currentSentenceIdx];
  const activePhrasePart = currentSentence.parts.find(p => p.id === activePhraseId);

  const allPhrasesInSentence = currentSentence.parts.filter(p => p.type === 'phrase');
  const sentenceCompleted = allPhrasesInSentence.every(p => resolvedPhrases.has(p.id!));

  const addLog = (message: string, type: 'success' | 'error') => {
    setLogs(prev => [{
      id: Date.now(),
      message,
      timestamp: new Date().toLocaleTimeString(),
      type
    }, ...prev].slice(0, 5));
  };

  const handleClassify = (selectedType: PhraseType) => {
    if (!activePhrasePart) return;

    if (selectedType === activePhrasePart.correctType) {
      setResolvedPhrases(prev => {
        const newSet = new Set(prev);
        newSet.add(activePhrasePart.id!);
        return newSet;
      });
      addLog(`Correctly identified "${activePhrasePart.content}" as an ${selectedType}.`, 'success');
      setActivePhraseId(null);
    } else {
      addLog(`Incorrect classification for "${activePhrasePart.content}". Try again.`, 'error');
    }
  };

  const advanceSentence = () => {
    if (currentSentenceIdx < sentences.length - 1) {
      setCurrentSentenceIdx(prev => prev + 1);
      setActivePhraseId(null);
    }
  };

  const questions = [
    {
      q: "Which type of phrase modifies a noun or pronoun?",
      options: [
        "Adverbial Phrase",
        "Adjectival Phrase",
        "Noun Phrase"
      ],
      correct: 1
    },
    {
      q: "In the sentence 'She walked to the store', what is 'to the store'?",
      options: [
        "Adverbial Phrase (Prepositional)",
        "Adjectival Phrase (Prepositional)",
        "Verb Phrase"
      ],
      correct: 0
    },
    {
      q: "Which phrase describes WHEN, WHERE, HOW, or WHY an action happened?",
      options: [
        "Adjectival Phrase",
        "Noun Phrase",
        "Adverbial Phrase"
      ],
      correct: 2
    }
  ];

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (assessmentAnswers[idx] === q.correct) score++;
    });
    return score;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 dark:bg-slate-950 flex flex-col font-sans">
      <LabHeader title="Phrase Dynamics: Adjectival & Adverbial" onExit={onExit} />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1: Theory */}
          <div className="bg-white dark:bg-slate-800 dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-800 p-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-800">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-300 dark:text-slate-300">Theory Guide</h2>
            </div>
            
            <div className="space-y-6 text-slate-600 dark:text-slate-400 dark:text-slate-300">
              <section>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-300 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  What is a Phrase?
                </h3>
                <p className="text-sm">A phrase is a group of words that acts as a single part of speech in a sentence. It lacks a subject and a verb working together.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-300 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                  Adjectival Phrases
                </h3>
                <p className="text-sm mb-3">An adjectival phrase acts like an adjective. It modifies or describes a noun or a pronoun.</p>
                <div className="bg-emerald-50 dark:bg-emerald-900 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                  <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200 dark:text-emerald-300 mb-1">Example:</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 dark:text-slate-400">
                    The boy <span className="font-bold text-emerald-600 dark:text-emerald-400 dark:text-emerald-400">in the red shirt</span> is my brother.
                  </p>
                  <p className="text-xs mt-2 italic text-emerald-700 dark:text-emerald-300 dark:text-emerald-300/80 dark:text-emerald-400/80">"in the red shirt" describes the noun "boy".</p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-300 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                  Adverbial Phrases
                </h3>
                <p className="text-sm mb-3">An adverbial phrase acts like an adverb. It modifies a verb, an adjective, or another adverb by telling <em>when, where, how,</em> or <em>why</em>.</p>
                <div className="bg-amber-50 dark:bg-amber-900 p-3 rounded-lg border border-amber-100 dark:border-amber-900/30">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200 dark:text-amber-300 mb-1">Example:</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 dark:text-slate-400">
                    She painted the canvas <span className="font-bold text-amber-600 dark:text-amber-400 dark:text-amber-400">with great care</span>.
                  </p>
                  <p className="text-xs mt-2 italic text-amber-700 dark:text-amber-300 dark:text-amber-300/80 dark:text-amber-400/80">"with great care" tells how she painted (modifies the verb).</p>
                </div>
              </section>

              <section>
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 dark:text-blue-300 text-sm mb-1 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Prepositional Phrases
                  </h4>
                  <p className="text-xs">A prepositional phrase begins with a preposition (in, on, at, under, to, of) and ends with a noun. It can function as either an adjectival phrase or an adverbial phrase depending on what it modifies.</p>
                </div>
              </section>
            </div>
          </div>

          {/* Column 2: Simulation */}
          <div className="bg-white dark:bg-slate-800 dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-800 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-lg">
                  <Search className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-300 dark:text-slate-300">Dissection Engine</h2>
              </div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 dark:bg-slate-800 px-3 py-1 rounded-full">
                Sentence {currentSentenceIdx + 1} of {sentences.length}
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="mb-6 p-6 bg-slate-50 dark:bg-slate-900 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-700 text-lg leading-relaxed text-slate-800 dark:text-slate-300 shadow-sm">
                {currentSentence.parts.map((part, i) => {
                  if (part.type === 'text') {
                    return <span key={i}>{part.content}</span>;
                  } else {
                    const isResolved = resolvedPhrases.has(part.id!);
                    const isActive = activePhraseId === part.id;
                    return (
                      <button
                        key={i}
                        onClick={() => !isResolved && setActivePhraseId(part.id!)}
                        className={`inline-block px-2 py-0.5 rounded mx-1 transition-all font-medium border-b-2
                          ${isResolved 
                            ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border-emerald-400 dark:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-600 cursor-default' 
                            : isActive
                              ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-purple-400 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-500 animate-pulse'
                              : 'bg-slate-200 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-400 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-500 hover:bg-slate-300 dark:bg-slate-900 dark:hover:bg-slate-600 cursor-pointer'
                          }
                        `}
                      >
                        {part.content}
                        {isResolved && <Check className="w-4 h-4 inline ml-1" />}
                      </button>
                    );
                  }
                })}
              </div>

              {activePhrasePart ? (
                <div className="bg-purple-50 dark:bg-purple-900 rounded-xl p-5 border border-purple-100 dark:border-purple-900/30 animate-in slide-in-from-bottom-4">
                  <h3 className="text-purple-900 dark:text-purple-100 dark:text-purple-300 font-bold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Classify: "{activePhrasePart.content}"
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {(["Adjectival Phrase", "Adverbial Phrase", "Noun Phrase", "Verb Phrase"] as PhraseType[]).map(type => (
                      <button
                        key={type}
                        onClick={() => handleClassify(type)}
                        className="py-3 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-purple-400 hover:text-purple-600 dark:text-purple-400 dark:hover:border-purple-500 transition-colors text-left"
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-start gap-2 text-sm text-purple-700 dark:text-purple-300 dark:text-purple-400 bg-purple-100 dark:bg-purple-900 dark:bg-purple-900/50/50 dark:bg-purple-900 p-3 rounded-lg">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p><strong>Hint:</strong> {activePhrasePart.hint}</p>
                  </div>
                </div>
              ) : sentenceCompleted ? (
                <div className="text-center p-8 bg-emerald-50 dark:bg-emerald-900 rounded-xl border border-emerald-100 dark:border-emerald-900/50 animate-in zoom-in-95">
                  <CheckCircle className="w-12 h-12 text-emerald-500 dark:text-emerald-400 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-300 dark:text-slate-300 mb-4">Sentence Analyzed</h3>
                  {currentSentenceIdx < sentences.length - 1 ? (
                    <button
                      onClick={advanceSentence}
                      className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
                    >
                      Next Sentence <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <p className="text-emerald-700 dark:text-emerald-300 dark:text-emerald-400 font-medium">All sentences completely dissected!</p>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                  <Search className="w-12 h-12 mb-3 opacity-20" />
                  <p>Click on a highlighted phrase to classify it.</p>
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Assessment & Logging */}
          <div className="flex flex-col gap-6">
            {/* Logs */}
            <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 p-6 flex-1 max-h-[300px] flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-bold text-slate-100">Dissection Logs</h2>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {logs.length === 0 && (
                  <p className="text-slate-500 dark:text-slate-400 text-sm italic">No dissection actions recorded...</p>
                )}
                {logs.map(log => (
                  <div key={log.id} className="flex gap-3 text-sm">
                    <span className="text-slate-500 dark:text-slate-400 font-mono shrink-0">[{log.timestamp}]</span>
                    <span className={log.type === 'success' ? 'text-emerald-400' : 'text-red-400'}>
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Assessment */}
            <div className="bg-white dark:bg-slate-800 dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-800 p-6 flex-1 overflow-y-auto">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-800">
                <div className="p-2 bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-400 rounded-lg">
                  <Target className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-300 dark:text-slate-300">Assessment</h2>
              </div>

              {!assessmentSubmitted ? (
                <div className="space-y-6">
                  {questions.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-3">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-300 dark:text-slate-300">
                        {qIdx + 1}. {q.q}
                      </p>
                      <div className="space-y-2">
                        {q.options.map((opt, oIdx) => (
                          <label key={oIdx} className="flex items-start gap-3 cursor-pointer group">
                            <input
                              type="radio"
                              name={`phrase-q-${qIdx}`}
                              className="mt-1 w-4 h-4 text-rose-600 dark:text-rose-400 bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:border-slate-700"
                              checked={assessmentAnswers[qIdx] === oIdx}
                              onChange={() => setAssessmentAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                            />
                            <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-slate-200">
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
                    className="w-full py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 dark:bg-slate-900 dark:disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
                  >
                    Submit Evaluation
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-400 mb-4">
                    <span className="text-3xl font-bold">{calculateScore()}/{questions.length}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-300 dark:text-slate-300 mb-2">Assessment Complete</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    {calculateScore() === questions.length ? 'Masterful syntactic dissection!' : 'Review the theory and try again.'}
                  </p>
                  <button
                    onClick={() => {
                      setAssessmentSubmitted(false);
                      setAssessmentAnswers({});
                    }}
                    className="text-sm text-rose-600 dark:text-rose-400 font-medium hover:underline"
                  >
                    Retake Assessment
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
