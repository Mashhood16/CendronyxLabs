import { useState } from 'react';
import { BookOpen, CheckCircle2, XCircle, FileEdit, History, ArrowRight, PenTool } from 'lucide-react';
import LabHeader from './LabHeader';

const EDITOR_DATA = [
  {
    id: 1,
    original: "The company announced it was 'downsizing' its workforce and letting go of several 'associates'.",
    issue: "Euphemism",
    options: ["downsizing", "firing", "terminating", "letting go"],
    correct: "firing",
    prompt: "Replace the corporate euphemism 'downsizing' with a more direct, accurate term for mass job losses:",
    rule: "A euphemism is a mild or indirect word substituted for one considered to be too harsh or blunt."
  },
  {
    id: 2,
    original: "He experienced an 'awfully good' day at the amusement park.",
    issue: "Oxymoron",
    options: ["terribly good", "awfully good", "extremely good", "badly good"],
    correct: "extremely good",
    prompt: "Identify and replace the oxymoron 'awfully good' with a standard intensifier:",
    rule: "An oxymoron is a figure of speech in which apparently contradictory terms appear in conjunction (e.g., 'awfully good', 'deafening silence')."
  },
  {
    id: 3,
    original: "We need a well known expert to review this high risk project.",
    issue: "Hyphenation",
    options: ["well known expert", "well-known expert", "well known-expert"],
    correct: "well-known expert",
    prompt: "Fix the compound adjective describing the expert:",
    rule: "Use a hyphen to join two or more words serving as a single adjective before a noun (e.g., 'well-known expert', 'high-risk project')."
  },
  {
    id: 4,
    original: "She bought a state of the art computer system.",
    issue: "Hyphenation",
    options: ["state of the art computer", "state-of-the-art computer", "state of-the-art computer"],
    correct: "state-of-the-art computer",
    prompt: "Hyphenate the compound adjective 'state of the art':",
    rule: "Hyphenate phrasal adjectives when they precede the noun they modify."
  },
  {
    id: 5,
    original: "The dog 'passed away' last night.",
    issue: "Euphemism",
    options: ["passed away", "went to sleep", "died", "kicked the bucket"],
    correct: "died",
    prompt: "Replace the euphemism 'passed away' with a literal biological term:",
    rule: "While euphemisms soften the blow of harsh news, journalistic or academic writing often requires literal, direct terms."
  }
];

export default function LabE9PunctuationVocabulary({ onExit }: { onExit?: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'success' | 'error'>('idle');
  const [logs, setLogs] = useState<{ id: number; original: string; choice: string; status: 'success' | 'error' }[]>([]);

  // Assessment State
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, string>>({});
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

  const currentData = EDITOR_DATA[currentIndex];

  const handleSelect = (opt: string) => {
    setSelectedOption(opt);
    const isCorrect = opt === currentData.correct;
    setResult(isCorrect ? 'success' : 'error');

    if (isCorrect) {
      setLogs(prev => [
        { id: Date.now(), original: currentData.original, choice: opt, status: 'success' as const },
        ...prev
      ].slice(0, 5));
    } else {
      setLogs(prev => [
        { id: Date.now(), original: currentData.original, choice: opt, status: 'error' as const },
        ...prev
      ].slice(0, 5));
    }
  };

  const nextTask = () => {
    setCurrentIndex((prev) => (prev + 1) % EDITOR_DATA.length);
    setSelectedOption(null);
    setResult('idle');
  };

  const assessmentQuestions = [
    {
      id: 1,
      q: "Which of the following is an example of an oxymoron?",
      options: ["A friendly giant", "A deafening silence", "A loud noise"],
      correct: "A deafening silence"
    },
    {
      id: 2,
      q: "When should you use a hyphen in a compound adjective?",
      options: [
        "When it appears AFTER the noun it modifies.",
        "When it appears BEFORE the noun it modifies.",
        "Never."
      ],
      correct: "When it appears BEFORE the noun it modifies."
    },
    {
      id: 3,
      q: "What is the primary purpose of a euphemism?",
      options: [
        "To make an expression more offensive or harsh.",
        "To combine two contradictory terms.",
        "To substitute a mild or indirect term for a harsh one."
      ],
      correct: "To substitute a mild or indirect term for a harsh one."
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
      <LabHeader title="Editor's Desk: Vocabulary & Punctuation" variant="dark" onExit={onExit} />
      
      <div className="flex-1 lg:overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          
          {/* Column 1: Theory */}
          <div className="bg-white dark:bg-slate-800 dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-800 flex flex-col h-full overflow-hidden">
            <div className="p-6 bg-slate-100 dark:bg-slate-900 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-800 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400 dark:text-indigo-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-300">The Style Guide</h2>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-700 dark:text-slate-300 dark:text-slate-300">
              
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-slate-300 dark:text-white border-b border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-700 pb-2 flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  Euphemisms
                </h3>
                <p className="text-sm">A <strong>euphemism</strong> is a polite, mild, or indirect word or expression substituted for one considered to be too harsh, blunt, or unpleasant.</p>
                <div className="bg-slate-50 dark:bg-slate-900 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-700">
                  <ul className="text-sm space-y-2">
                    <li><span className="line-through text-rose-500 dark:text-rose-400 mr-2">Died</span> &rarr; <span className="text-emerald-600 dark:text-emerald-400 dark:text-emerald-400">Passed away</span></li>
                    <li><span className="line-through text-rose-500 dark:text-rose-400 mr-2">Fired</span> &rarr; <span className="text-emerald-600 dark:text-emerald-400 dark:text-emerald-400">Let go</span></li>
                    <li><span className="line-through text-rose-500 dark:text-rose-400 mr-2">Used cars</span> &rarr; <span className="text-emerald-600 dark:text-emerald-400 dark:text-emerald-400">Pre-owned vehicles</span></li>
                  </ul>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">While euphemisms are polite, editors often remove them to ensure clarity and directness in journalistic writing.</p>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-slate-300 dark:text-white border-b border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-700 pb-2 flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  Oxymorons
                </h3>
                <p className="text-sm">An <strong>oxymoron</strong> is a figure of speech that places two seemingly contradictory or opposite words side by side to create a rhetorical effect.</p>
                <div className="bg-slate-50 dark:bg-slate-900 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-700">
                  <ul className="text-sm space-y-2 list-disc pl-4">
                    <li>Deafening silence</li>
                    <li>Open secret</li>
                    <li>Awfully good</li>
                    <li>Living dead</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-slate-300 dark:text-white border-b border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-700 pb-2 flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  Hyphenation Rules
                </h3>
                <p className="text-sm">Use a hyphen to join two or more words serving as a <strong>single adjective</strong> before a noun (Compound Adjective).</p>
                <ul className="list-disc pl-5 text-sm space-y-2">
                  <li><strong>Rule:</strong> Hyphenate before the noun. <br/><span className="text-slate-500 dark:text-slate-400 italic">"He is a well-known author."</span></li>
                  <li><strong>Rule:</strong> Do NOT hyphenate after the noun. <br/><span className="text-slate-500 dark:text-slate-400 italic">"The author is well known."</span></li>
                  <li><strong>Rule:</strong> Do NOT hyphenate with '-ly' adverbs. <br/><span className="text-slate-500 dark:text-slate-400 italic">"A highly regarded expert."</span></li>
                </ul>
              </div>

            </div>
          </div>

          {/* Column 2: Simulation */}
          <div className="bg-white dark:bg-slate-800 dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-800 flex flex-col h-full overflow-hidden">
             <div className="p-6 bg-slate-100 dark:bg-slate-900 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-800 flex items-center gap-3">
              <FileEdit className="w-6 h-6 text-amber-600 dark:text-amber-400 dark:text-amber-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-300">Proofreading Desk</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 lg:p-8 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full space-y-8">
                
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 dark:text-amber-400 text-xs font-bold uppercase tracking-wider rounded-full">
                    Target: {currentData.issue}
                  </div>
                  
                  <div className="p-5 bg-slate-50 dark:bg-slate-900 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-700 shadow-inner">
                    <p className="text-lg font-serif text-slate-800 dark:text-slate-300 leading-relaxed">
                      "{currentData.original}"
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 dark:text-slate-400">{currentData.prompt}</p>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {currentData.options.map(opt => (
                      <button
                        key={opt}
                        disabled={result === 'success'}
                        onClick={() => handleSelect(opt)}
                        className={`w-full p-4 rounded-xl text-left font-serif transition-all border-2 ${
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
                          {result === 'success' ? 'Revision Approved!' : 'Needs Revision!'}
                        </p>
                        <p className={`text-sm mt-1 ${result === 'success' ? 'text-emerald-700 dark:text-emerald-300 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-300 dark:text-rose-400'}`}>
                          {result === 'success' ? currentData.rule : 'Check the style guide rules and try again.'}
                        </p>
                      </div>
                    </div>
                    {result === 'success' && (
                      <button onClick={nextTask} className="mt-4 flex items-center justify-center gap-2 w-full px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 dark:bg-slate-900 transition-colors">
                        Next Assignment <ArrowRight className="w-4 h-4" />
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
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-300">Revision Logs</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-800 pb-2">Recent Edits</h3>
                {logs.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400 italic">No revisions made yet.</p>
                ) : (
                  <div className="space-y-3">
                    {logs.map(log => (
                      <div key={log.id} className="text-sm p-3 rounded-lg border border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 dark:bg-slate-800/50">
                        <div className="text-slate-500 dark:text-slate-400 mb-1 italic line-clamp-1">"{log.original}"</div>
                        <div className={`font-medium flex items-center gap-2 ${log.status === 'success' ? 'text-emerald-600 dark:text-emerald-400 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400 dark:text-rose-400'}`}>
                          {log.status === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                          <span className="line-clamp-2">Selected: {log.choice}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="font-semibold text-slate-900 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700/50 dark:border-slate-700 dark:border-slate-800 pb-2">Style Guide Assessment</h3>
                
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
                              name={`vocab-q-${q.id}`}
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
