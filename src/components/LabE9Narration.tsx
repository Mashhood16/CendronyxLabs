import { useState } from 'react';
import { BookOpen, CheckCircle2, XCircle, Mic, NotebookPen, History, FileText, ArrowRight } from 'lucide-react';
import LabHeader from './LabHeader';

const NARRATION_DATA = [
  {
    id: 1,
    direct: 'He said, "I am writing a letter now."',
    indirectStart: "He said that",
    options: ["he was writing a letter then.", "he is writing a letter now.", "I was writing a letter then."],
    correct: "he was writing a letter then.",
    rule: "Present Continuous -> Past Continuous. 'Now' changes to 'then'. 'I' changes to 'he'."
  },
  {
    id: 2,
    direct: 'She said to me, "You can do this."',
    indirectStart: "She told me that",
    options: ["I could do that.", "I can do this.", "you could do that."],
    correct: "I could do that.",
    rule: "'said to' becomes 'told'. 'can' becomes 'could'. 'this' becomes 'that'. 'you' (object) becomes 'I'."
  },
  {
    id: 3,
    direct: 'The teacher said, "The earth revolves around the sun."',
    indirectStart: "The teacher said that",
    options: ["the earth revolves around the sun.", "the earth revolved around the sun.", "the earth had revolved around the sun."],
    correct: "the earth revolves around the sun.",
    rule: "Universal truths do NOT change tense when converted to indirect speech."
  },
  {
    id: 4,
    direct: 'Ali said, "I have passed the examination."',
    indirectStart: "Ali said that",
    options: ["he had passed the examination.", "he has passed the examination.", "I had passed the examination."],
    correct: "he had passed the examination.",
    rule: "Present Perfect changes to Past Perfect ('have passed' -> 'had passed')."
  },
  {
    id: 5,
    direct: 'He said, "I will go to Lahore tomorrow."',
    indirectStart: "He said that",
    options: ["he would go to Lahore the next day.", "he will go to Lahore tomorrow.", "he would go to Lahore tomorrow."],
    correct: "he would go to Lahore the next day.",
    rule: "'will' becomes 'would'. 'tomorrow' becomes 'the next day'."
  }
];

export default function LabE9Narration({ onExit }: { onExit?: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'success' | 'error'>('idle');
  const [logs, setLogs] = useState<{ id: number; direct: string; indirect: string; status: 'success' | 'error' }[]>([]);

  // Assessment State
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, string>>({});
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

  const currentData = NARRATION_DATA[currentIndex];

  const handleSelect = (opt: string) => {
    setSelectedOption(opt);
    const isCorrect = opt === currentData.correct;
    setResult(isCorrect ? 'success' : 'error');

    if (isCorrect) {
      setLogs(prev => [
        { id: Date.now(), direct: currentData.direct, indirect: `${currentData.indirectStart} ${opt}`, status: 'success' as const },
        ...prev
      ].slice(0, 5)); // Keep last 5
    } else {
      setLogs(prev => [
        { id: Date.now(), direct: currentData.direct, indirect: `Attempted: ${opt}`, status: 'error' as const },
        ...prev
      ].slice(0, 5));
    }
  };

  const nextQuote = () => {
    setCurrentIndex((prev) => (prev + 1) % NARRATION_DATA.length);
    setSelectedOption(null);
    setResult('idle');
  };

  const assessmentQuestions = [
    {
      id: 1,
      q: "When converting to indirect speech, what does 'tomorrow' change to?",
      options: ["the previous day", "the next day", "that day"],
      correct: "the next day"
    },
    {
      id: 2,
      q: "If the reporting verb is in the past tense (e.g., 'said'), the simple present tense inside the quotes changes to:",
      options: ["present continuous", "past perfect", "simple past"],
      correct: "simple past"
    },
    {
      id: 3,
      q: "Convert: He said, \"Honesty is the best policy.\"",
      options: [
        "He said that honesty was the best policy.",
        "He said that honesty is the best policy.",
        "He said that honesty had been the best policy."
      ],
      correct: "He said that honesty is the best policy."
    }
  ];

  const calculateScore = () => {
    let score = 0;
    assessmentQuestions.forEach(q => {
      if (assessmentAnswers[q.id] === q.correct) score++;
    });
    return score;
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-300 dark:text-slate-300">
      <LabHeader title="Reporter's Notepad: Narration" variant="dark" onExit={onExit} />
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          
          {/* Column 1: Theory */}
          <div className="bg-white dark:bg-slate-800 dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-800 flex flex-col h-full overflow-hidden">
            <div className="p-6 bg-slate-100 dark:bg-slate-900 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-800 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400 dark:text-indigo-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-300">Narration Rules</h2>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-700 dark:text-slate-300 dark:text-slate-300">
              <p>
                <strong>Direct Speech</strong> quotes the exact words spoken. <strong>Indirect (Reported) Speech</strong> conveys the meaning of what was said without using the exact words.
              </p>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-slate-300 dark:text-white border-b border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-700 pb-2">Tense Step-Backs</h3>
                <p className="text-sm">When the reporting verb is in the past tense (e.g., <em>said</em>), tenses inside the quotation marks usually "step back" one tense into the past:</p>
                <ul className="list-disc pl-5 text-sm space-y-2">
                  <li><strong>Simple Present</strong> &rarr; Simple Past</li>
                  <li><strong>Present Continuous</strong> &rarr; Past Continuous</li>
                  <li><strong>Present Perfect</strong> &rarr; Past Perfect</li>
                  <li><strong>Simple Past</strong> &rarr; Past Perfect</li>
                  <li><strong>Will / Can / May</strong> &rarr; Would / Could / Might</li>
                </ul>
                <div className="bg-amber-50 dark:bg-amber-900 border-l-4 border-amber-500 p-3 text-sm rounded-r-md text-slate-800 dark:text-slate-300 dark:text-slate-300">
                  <strong>Exception:</strong> Universal truths or habitual facts do not change tense. (e.g., "The sun rises in the east.")
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-slate-300 dark:text-white border-b border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-700 pb-2">Pronoun Shifts (SON Rule)</h3>
                <p className="text-sm">Pronouns change according to the <strong>SON</strong> rule:</p>
                <ul className="list-disc pl-5 text-sm space-y-2">
                  <li><strong>First Person (I, We):</strong> Changes according to the <strong>Subject</strong> of the reporting verb.</li>
                  <li><strong>Second Person (You):</strong> Changes according to the <strong>Object</strong> of the reporting verb.</li>
                  <li><strong>Third Person (He, She, It, They):</strong> <strong>No</strong> change.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-slate-300 dark:text-white border-b border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-700 pb-2">Time and Place Words</h3>
                <ul className="list-disc pl-5 text-sm space-y-2">
                  <li>Now &rarr; Then</li>
                  <li>Here &rarr; There</li>
                  <li>Today &rarr; That day</li>
                  <li>Tomorrow &rarr; The next day</li>
                  <li>Yesterday &rarr; The previous day</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Column 2: Simulation */}
          <div className="bg-white dark:bg-slate-800 dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-800 flex flex-col h-full overflow-hidden">
             <div className="p-6 bg-slate-100 dark:bg-slate-900 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-800 flex items-center gap-3">
              <NotebookPen className="w-6 h-6 text-rose-600 dark:text-rose-400 dark:text-rose-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-300">The Reporter's Notepad</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto relative bg-[#faf9f6] dark:bg-slate-900">
              {/* Notepad styling lines */}
              <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #94a3b8 31px, #94a3b8 32px)', backgroundPositionY: '32px' }}></div>
              <div className="absolute top-0 bottom-0 left-12 w-px bg-red-400 opacity-40 pointer-events-none"></div>

              <div className="relative z-10 pl-16 pr-8 py-8 space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Mic className="w-5 h-5 text-rose-500 dark:text-rose-400" />
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Live Quote</span>
                  </div>
                  <div className="text-2xl font-serif font-medium text-slate-800 dark:text-slate-300 italic bg-slate-200 dark:bg-slate-900/50/50 dark:bg-slate-800 p-6 rounded-r-xl border-l-4 border-rose-400 shadow-sm">
                    {currentData.direct}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Reported Draft</span>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-2 text-xl font-serif text-slate-800 dark:text-slate-300 dark:text-slate-300">
                    <span>{currentData.indirectStart}</span>
                    <div className={`flex-1 min-w-[200px] border-b-2 border-dashed pb-1 transition-colors ${
                      selectedOption 
                        ? result === 'success' ? 'border-emerald-500 text-emerald-700 dark:text-emerald-300 dark:text-emerald-400' : 'border-rose-500 text-rose-700 dark:text-rose-300 dark:text-rose-400'
                        : 'border-slate-400 text-slate-500 dark:text-slate-400'
                    }`}>
                      {selectedOption || '...'}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {currentData.options.map(opt => (
                    <button
                      key={opt}
                      disabled={result === 'success'}
                      onClick={() => handleSelect(opt)}
                      className={`w-full p-4 rounded-xl text-left font-serif text-lg transition-all border-2 ${
                        selectedOption === opt
                          ? result === 'success'
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900 shadow-md text-emerald-900 dark:text-emerald-100 dark:text-emerald-100'
                            : 'border-rose-500 bg-rose-50 dark:bg-rose-900 shadow-md text-rose-900 dark:text-rose-100 dark:text-rose-100'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 dark:text-slate-300 hover:shadow-md'
                      } disabled:opacity-75`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {result !== 'idle' && (
                  <div className={`mt-6 p-5 rounded-xl animate-in fade-in zoom-in duration-300 ${
                    result === 'success' 
                      ? 'bg-emerald-50 dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-700/50 dark:border-emerald-800' 
                      : 'bg-rose-50 dark:bg-rose-900 border border-rose-200 dark:border-rose-700/50 dark:border-rose-800'
                  }`}>
                    <div className="flex items-start gap-3">
                      {result === 'success' ? <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" /> : <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />}
                      <div>
                        <p className={`font-bold ${result === 'success' ? 'text-emerald-800 dark:text-emerald-200 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-200 dark:text-rose-300'}`}>
                          {result === 'success' ? 'Published!' : 'Editor Rejected!'}
                        </p>
                        <p className={`text-sm mt-1 ${result === 'success' ? 'text-emerald-700 dark:text-emerald-300 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-300 dark:text-rose-400'}`}>
                          {result === 'success' ? currentData.rule : 'Check the tense step-back and pronoun shifts.'}
                        </p>
                      </div>
                    </div>
                    {result === 'success' && (
                      <button onClick={nextQuote} className="mt-4 flex items-center justify-center gap-2 w-full px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 dark:bg-slate-900 transition-colors">
                        Next Interview <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Column 3: Logs & Assessment */}
          <div className="bg-white dark:bg-slate-800 dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-800 flex flex-col h-full overflow-hidden">
            <div className="p-6 bg-slate-100 dark:bg-slate-900 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-800 flex items-center gap-3">
              <History className="w-6 h-6 text-emerald-600 dark:text-emerald-400 dark:text-emerald-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-300">Editorial Log</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-800 pb-2">Recent Drafts</h3>
                {logs.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400 italic">No drafts submitted yet.</p>
                ) : (
                  <div className="space-y-3">
                    {logs.map(log => (
                      <div key={log.id} className="text-sm p-3 rounded-lg border border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 dark:bg-slate-800/50">
                        <div className="text-slate-500 dark:text-slate-400 mb-1 line-clamp-1">{log.direct}</div>
                        <div className={`font-medium flex items-center gap-2 ${log.status === 'success' ? 'text-emerald-600 dark:text-emerald-400 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400 dark:text-rose-400'}`}>
                          {log.status === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                          <span className="line-clamp-2">{log.indirect}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="font-semibold text-slate-900 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-800 pb-2">Knowledge Check</h3>
                
                {assessmentQuestions.map((q, i) => (
                  <div key={q.id} className="space-y-2">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-300 dark:text-slate-300">{i + 1}. {q.q}</p>
                    <div className="space-y-2 pl-2">
                      {q.options.map(opt => {
                        const isSelected = assessmentAnswers[q.id] === opt;
                        const isCorrect = opt === q.correct;
                        const showCorrect = assessmentSubmitted && isCorrect;
                        const showWrong = assessmentSubmitted && isSelected && !isCorrect;

                        return (
                          <label key={opt} className={`flex items-start gap-2 text-sm p-2 rounded-md border cursor-pointer transition-colors ${
                            showCorrect ? 'bg-emerald-50 dark:bg-emerald-900 border-emerald-200 dark:border-emerald-700/50 text-emerald-800 dark:text-emerald-200 dark:text-emerald-200' :
                            showWrong ? 'bg-rose-50 dark:bg-rose-900 border-rose-200 dark:border-rose-700/50 text-rose-800 dark:text-rose-200 dark:text-rose-200' :
                            isSelected ? 'bg-slate-100 dark:bg-slate-900 dark:bg-slate-800 border-slate-300 dark:border-slate-600 dark:border-slate-600' :
                            'border-transparent hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/50'
                          }`}>
                            <input
                              type="radio"
                              name={`q-${q.id}`}
                              value={opt}
                              disabled={assessmentSubmitted}
                              checked={isSelected}
                              onChange={() => setAssessmentAnswers(prev => ({ ...prev, [q.id]: opt }))}
                              className="w-4 h-4 mt-0.5 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500"
                            />
                            <span className="flex-1 text-slate-700 dark:text-slate-300">{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setAssessmentSubmitted(true)}
                  disabled={assessmentSubmitted || Object.keys(assessmentAnswers).length < assessmentQuestions.length}
                  className="w-full mt-4 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:bg-slate-900 disabled:dark:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                >
                  {assessmentSubmitted ? `Score: ${calculateScore()} / ${assessmentQuestions.length}` : 'Submit Assessment'}
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
