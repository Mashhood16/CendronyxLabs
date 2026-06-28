import { useState } from 'react';
import { BookOpen, Target, Clock } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabE10ConjunctionsTensesProps {
  onExit?: () => void;
}

const TENSES_TIMELINE = [
  { tense: 'Past Perfect', sentence: 'He had finished the report.' },
  { tense: 'Past Continuous', sentence: 'He was finishing the report.' },
  { tense: 'Past Indefinite', sentence: 'He finished the report.' },
  { tense: 'Present Perfect', sentence: 'He has finished the report.' },
  { tense: 'Present Continuous', sentence: 'He is finishing the report.' },
  { tense: 'Present Indefinite', sentence: 'He finishes the report.' },
  { tense: 'Future Indefinite', sentence: 'He will finish the report.' }
];

export default function LabE10ConjunctionsTenses({ onExit = () => {} }: LabE10ConjunctionsTensesProps) {
  const [timelineIndex, setTimelineIndex] = useState(5); // Default to Present Indefinite
  
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

  const questions = [
    {
      q: "Which pair is a Correlative Conjunction?",
      options: ["Although / Yet", "Either / Or", "Because / So", "If / Then"],
      correct: 1
    },
    {
      q: "Identify the tense: 'They have been playing for two hours.'",
      options: [
        "Present Perfect",
        "Present Continuous",
        "Present Perfect Continuous",
        "Past Continuous"
      ],
      correct: 2
    },
    {
      q: "Which conjunction shows Concession?",
      options: ["Because", "Although", "When", "If"],
      correct: 1
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
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-[#ffffff]">
      <LabHeader title="Unit 4: Chronology & Connections" variant="dark" onExit={onExit} />
      
      <div className="flex-1 lg:overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          
          {/* Column 1: Theory */}
          <div className="bg-white dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-neutral-900 flex flex-col h-full overflow-hidden">
            <div className="p-6 bg-rose-50 dark:bg-rose-900/30 border-b border-rose-100 dark:border-rose-800/50 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-[#a1a1aa]">Conjunctions & Tenses</h2>
            </div>
            <div className="p-6 lg:overflow-y-auto flex-1 space-y-6 text-slate-700 dark:text-[#a1a1aa]">
              <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-[#ffffff] mb-2">Conjunctions</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li><strong>Correlative:</strong> Work in pairs (e.g., <em>either/or, neither/nor, not only/but also</em>).</li>
                  <li><strong>Subordinating:</strong> Introduce dependent clauses and show relationships:
                    <ul className="list-circle pl-5 mt-1 text-slate-600 dark:text-[#71717a]">
                      <li>Reason: <em>because, since</em></li>
                      <li>Concession: <em>although, though</em></li>
                      <li>Condition: <em>if, unless</em></li>
                    </ul>
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-[#ffffff] mb-2">Tenses</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li><strong>Present:</strong> Indefinite (I walk), Continuous (I am walking), Perfect (I have walked), Perfect Continuous (I have been walking).</li>
                  <li><strong>Past:</strong> Indefinite (I walked), Continuous (I was walking), Perfect (I had walked).</li>
                  <li><strong>Future:</strong> Indefinite (I will walk).</li>
                </ul>
              </section>
            </div>
          </div>

          {/* Column 2: Tense Slider */}
          <div className="bg-white dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-neutral-900 p-6 flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-neutral-900">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 rounded-lg">
                <Clock className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-[#a1a1aa]">Chronology Slider</h2>
            </div>
            
            <div className="flex-1 flex flex-col">
              <p className="text-sm text-slate-600 dark:text-[#71717a] mb-8">Move the slider to shift the sentence backwards and forwards in time.</p>
              
              <div className="bg-slate-100 dark:bg-[#121212]/50 p-6 rounded-xl border border-slate-200 dark:border-[#1c1b1b] text-center mb-12">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block mb-2">
                  {TENSES_TIMELINE[timelineIndex].tense}
                </span>
                <p className="text-xl font-medium text-slate-900 dark:text-[#ffffff]">
                  {TENSES_TIMELINE[timelineIndex].sentence}
                </p>
              </div>

              <div className="relative px-4">
                <input 
                  type="range" 
                  min="0" 
                  max={TENSES_TIMELINE.length - 1} 
                  value={timelineIndex}
                  onChange={(e) => setTimelineIndex(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
                <div className="flex justify-between mt-2 text-xs font-bold text-slate-400">
                  <span>Past</span>
                  <span>Present</span>
                  <span>Future</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Assessment */}
          <div className="bg-white dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-neutral-900 p-6 flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-neutral-900">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 rounded-lg">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-[#a1a1aa]">Knowledge Check</h2>
            </div>

            <div className="flex-1 lg:overflow-y-auto">
              {!assessmentSubmitted ? (
                <div className="space-y-6">
                  {questions.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-3">
                      <p className="text-sm font-medium text-slate-800 dark:text-[#ffffff]">
                        {qIdx + 1}. {q.q}
                      </p>
                      <div className="space-y-2">
                        {q.options.map((opt, oIdx) => (
                          <label key={oIdx} className="flex items-start gap-3 cursor-pointer group">
                            <input
                              type="radio"
                              name={`question-${qIdx}`}
                              className="mt-1 w-4 h-4 text-rose-600 dark:text-rose-400 bg-slate-100 dark:bg-[#121212]/50 border-slate-300 dark:border-[#1c1b1b]"
                              checked={assessmentAnswers[qIdx] === oIdx}
                              onChange={() => setAssessmentAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                            />
                            <span className="text-sm text-slate-700 dark:text-[#a1a1aa] group-hover:text-slate-900 dark:group-hover:text-slate-100">
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
                    className="w-full mt-4 py-2 px-4 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 disabled: text-white rounded-lg font-medium transition-colors dark:bg-rose-500 dark:hover:bg-rose-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-rose-500/40"
                  >
                    Submit Evaluation
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 mb-4">
                    <span className="text-3xl font-bold">{calculateScore()}/{questions.length}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-[#a1a1aa] mb-2">Assessment Complete</h3>
                  <p className="text-slate-600 dark:text-[#71717a] mb-6">
                    {calculateScore() === questions.length 
                      ? "Perfect score! You've mastered conjunctions and tenses." 
                      : "Good effort! Review the rules of tenses and correlative conjunctions to improve."}
                  </p>
                  <button
                    onClick={() => {
                      setAssessmentSubmitted(false);
                      setAssessmentAnswers({});
                    }}
                    className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-slate-100 dark:bg-[#121212] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-[#a1a1aa] rounded-lg font-medium transition-colors"
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
