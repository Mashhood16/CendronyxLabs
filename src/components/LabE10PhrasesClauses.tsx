import { useState } from 'react';
import { BookOpen, Target, Scissors, CheckCircle2, ChevronRight, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabE10PhrasesClausesProps {
  onExit?: () => void;
}

const DISSECTION_SENTENCES = [
  {
    text: "The student who studied hard passed the exam.",
    segments: [
      { text: "The student", type: "Noun Phrase", isClause: false },
      { text: "who studied hard", type: "Adjective Clause", isClause: true },
      { text: "passed the exam", type: "Verb Phrase", isClause: false }
    ],
    targetType: "Clause",
    correctIndex: 1
  },
  {
    text: "Running in the park is my favorite hobby.",
    segments: [
      { text: "Running in the park", type: "Gerund Phrase", isClause: false },
      { text: "is", type: "Verb", isClause: false },
      { text: "my favorite hobby", type: "Noun Phrase", isClause: false }
    ],
    targetType: "Gerund Phrase",
    correctIndex: 0
  },
  {
    text: "I believe that she will succeed.",
    segments: [
      { text: "I believe", type: "Independent Clause", isClause: true },
      { text: "that she will succeed", type: "Noun Clause", isClause: true }
    ],
    targetType: "Noun Clause",
    correctIndex: 1
  }
];

export default function LabE10PhrasesClauses({ onExit = () => {} }: LabE10PhrasesClausesProps) {
  const [currentSentence, setCurrentSentence] = useState(0);
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

  const questions = [
    {
      q: "What is the main difference between a phrase and a clause?",
      options: [
        "A phrase has a subject and a verb; a clause does not.",
        "A clause has a subject and a verb; a phrase does not.",
        "Phrases are always longer than clauses.",
        "Clauses cannot stand alone."
      ],
      correct: 1
    },
    {
      q: "Identify the Adverb Clause: 'She left the party because she was tired.'",
      options: [
        "She left",
        "left the party",
        "because she was tired",
        "was tired"
      ],
      correct: 2
    },
    {
      q: "Which of the following is a Prepositional Phrase?",
      options: ["Walking fast", "To the store", "She said", "Is going"],
      correct: 1
    }
  ];

  const handleSegmentSelect = (idx: number) => {
    if (hasAnswered) return;
    setSelectedSegment(idx);
    setHasAnswered(true);
  };

  const nextSentence = () => {
    setCurrentSentence((prev) => (prev + 1) % DISSECTION_SENTENCES.length);
    setSelectedSegment(null);
    setHasAnswered(false);
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (assessmentAnswers[idx] === q.correct) score++;
    });
    return score;
  };

  const currentData = DISSECTION_SENTENCES[currentSentence];

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <LabHeader title="Unit 6: Syntactic Blueprints (Phrases & Clauses)" variant="dark" onExit={onExit} />
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          
          {/* Column 1: Theory */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-hidden">
            <div className="p-6 bg-cyan-50 dark:bg-cyan-900/30 border-b border-cyan-100 dark:border-cyan-800/50 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-300">Phrases vs Clauses</h2>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-700 dark:text-slate-300">
              <section>
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-6">
                  <h4 className="font-bold text-cyan-600 dark:text-cyan-400 mb-2">The Golden Rule</h4>
                  <p className="text-sm">A <strong>Clause</strong> has a subject and a verb. A <strong>Phrase</strong> does NOT have a subject and a verb.</p>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Types of Phrases</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li><strong>Noun Phrase:</strong> Acts as a noun. (e.g., <em>The big red dog</em>)</li>
                  <li><strong>Gerund Phrase:</strong> Starts with an -ing verb acting as a noun. (e.g., <em>Running in the park</em>)</li>
                  <li><strong>Prepositional Phrase:</strong> Starts with a preposition. (e.g., <em>in the morning</em>)</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Types of Clauses</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li><strong>Independent:</strong> Can stand alone as a sentence. (e.g., <em>She went home.</em>)</li>
                  <li><strong>Subordinate (Dependent):</strong> Cannot stand alone. It must attach to an independent clause.
                    <ul className="list-circle pl-5 mt-1 text-slate-600 dark:text-slate-400">
                      <li><strong>Noun Clause:</strong> (e.g., <em>I know <strong>that you are tired</strong>.</em>)</li>
                      <li><strong>Adjective Clause:</strong> (e.g., <em>The boy <strong>who cried wolf</strong>.</em>)</li>
                      <li><strong>Adverb Clause:</strong> (e.g., <em><strong>Because it rained</strong>, we stayed inside.</em>)</li>
                    </ul>
                  </li>
                </ul>
              </section>
            </div>
          </div>

          {/* Column 2: Sentence Dissection Engine */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="p-2 bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400 rounded-lg">
                <Scissors className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-300">Dissection Engine</h2>
            </div>
            
            <div className="flex-1 flex flex-col">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                Click on the segment that functions as a <strong>{currentData.targetType}</strong>:
              </p>
              
              <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 text-center my-6 flex flex-wrap justify-center gap-2 shadow-inner">
                {currentData.segments.map((seg, idx) => {
                  
                  let bgClass = "bg-white dark:bg-slate-700 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 border-slate-200 dark:border-slate-600";
                  
                  if (hasAnswered) {
                    if (idx === currentData.correctIndex) {
                      bgClass = "bg-emerald-100 dark:bg-emerald-900/50 border-emerald-500 text-emerald-700 dark:text-emerald-300";
                    } else if (idx === selectedSegment) {
                      bgClass = "bg-rose-100 dark:bg-rose-900/50 border-rose-500 text-rose-700 dark:text-rose-300";
                    } else {
                      bgClass = "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-40";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSegmentSelect(idx)}
                      disabled={hasAnswered}
                      className={`px-4 py-2 border-2 rounded-lg font-medium text-lg transition-all ${bgClass}`}
                    >
                      {seg.text}
                    </button>
                  );
                })}
              </div>

              {hasAnswered && (
                <div className={`p-4 rounded-xl border-2 flex items-start gap-3 ${
                  selectedSegment === currentData.correctIndex 
                    ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200' 
                    : 'border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-200'
                }`}>
                  {selectedSegment === currentData.correctIndex ? (
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                  ) : (
                    <XCircle className="w-6 h-6 flex-shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-bold mb-1">
                      {selectedSegment === currentData.correctIndex ? "Correct!" : "Incorrect"}
                    </h4>
                    <p className="text-sm">
                      "{currentData.segments[currentData.correctIndex].text}" is a {currentData.segments[currentData.correctIndex].type}.
                      {currentData.segments[currentData.correctIndex].isClause 
                        ? " Notice that it contains a subject and a verb." 
                        : " Notice that it lacks a subject-verb pair."}
                    </p>
                  </div>
                </div>
              )}

              {hasAnswered && (
                <div className="mt-auto flex justify-end pt-4">
                  <button
                    onClick={nextSentence}
                    className="flex items-center gap-2 px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-bold transition-colors"
                  >
                    Next Sentence <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Assessment */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="p-2 bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400 rounded-lg">
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
                              className="mt-1 w-4 h-4 text-cyan-600 dark:text-cyan-400 bg-slate-100 dark:bg-slate-900/50 border-slate-300 dark:border-slate-600"
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
                    className="w-full mt-4 py-2 px-4 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-300 dark:bg-slate-900 disabled:dark:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Submit Evaluation
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400 mb-4">
                    <span className="text-3xl font-bold">{calculateScore()}/{questions.length}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-300 mb-2">Assessment Complete</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    {calculateScore() === questions.length 
                      ? "Perfect score! You can easily identify phrases and clauses." 
                      : "Good effort! Remember that a clause must have a subject and a verb."}
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
