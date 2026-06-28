import { useState } from 'react';
import { 
  BookOpen, CheckCircle, RefreshCcw, Hammer, Layers, ChevronRight, BookA, Info, Star,
  History, HelpCircle
} from 'lucide-react';
import LabHeader from './LabHeader';

interface ForgeRule {
  base: string;
  baseType: string;
  suffix: string;
  result: string;
  rule: string;
}

const FORGE_RULES: ForgeRule[] = [
  { base: 'beauty', baseType: 'Noun', suffix: 'ful', result: 'beautiful', rule: 'Change y to i, add -ful (full of)' },
  { base: 'create', baseType: 'Verb', suffix: 'ive', result: 'creative', rule: 'Drop e, add -ive (tending to)' },
  { base: 'child', baseType: 'Noun', suffix: 'ish', result: 'childish', rule: 'Add -ish (having characteristics of)' },
  { base: 'danger', baseType: 'Noun', suffix: 'ous', result: 'dangerous', rule: 'Add -ous (full of / possessing)' },
  { base: 'magic', baseType: 'Noun', suffix: 'al', result: 'magical', rule: 'Add -al (relating to)' },
  { base: 'act', baseType: 'Verb', suffix: 'ive', result: 'active', rule: 'Add -ive (tending to)' },
  { base: 'rely', baseType: 'Verb', suffix: 'able', result: 'reliable', rule: 'Change y to i, add -able (capable of)' },
];

const ASSESSMENT_QUESTIONS = [
  {
    question: 'Which suffix turns the noun "comfort" into an adjective?',
    options: ['-able', '-ful', '-ous', '-ive'],
    answer: 0
  },
  {
    question: 'What is the morphological rule when adding "-ful" to "beauty"?',
    options: ['Drop the y completely', 'Change y to i before adding the suffix', 'Keep the y and add the suffix', 'Double the y'],
    answer: 1
  },
  {
    question: 'The suffix "-ous" typically means:',
    options: ['Relating to', 'Capable of', 'Full of / possessing', 'Action or process'],
    answer: 2
  }
];

export default function LabE9PartsOfSpeech({ onExit }: { onExit?: () => void }) {
  const [selectedBase, setSelectedBase] = useState<string>('');
  const [selectedSuffix, setSelectedSuffix] = useState<string>('');
  const [forgeResult, setForgeResult] = useState<ForgeRule | null>(null);
  const [forgeError, setForgeError] = useState<string>('');
  const [forgedLog, setForgedLog] = useState<ForgeRule[]>([]);
  
  const [assessmentScores, setAssessmentScores] = useState<number[]>(Array(ASSESSMENT_QUESTIONS.length).fill(-1));
  const [showResults, setShowResults] = useState(false);

  const bases = Array.from(new Set(FORGE_RULES.map(r => r.base)));
  const suffixes = Array.from(new Set(FORGE_RULES.map(r => r.suffix)));

  const handleForge = () => {
    setForgeError('');
    setForgeResult(null);
    if (!selectedBase || !selectedSuffix) {
      setForgeError('Select both a base word and a suffix to forge.');
      return;
    }

    const match = FORGE_RULES.find(r => r.base === selectedBase && r.suffix === selectedSuffix);
    if (match) {
      setForgeResult(match);
      if (!forgedLog.find(log => log.result === match.result)) {
        setForgedLog(prev => [match, ...prev]);
      }
    } else {
      setForgeError(`Incompatible combination: ${selectedBase} + -${selectedSuffix}. Try another!`);
    }
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#000000] flex flex-col">
      <LabHeader title="Parts of Speech: Word Forge" onExit={onExit} />
      
      <div className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1: Theory */}
          <div className="bg-white dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b]/50 dark:border-[#1c1b1b] p-6 flex flex-col h-[calc(100vh-8rem)] lg:overflow-y-auto overflow-x-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-[#a1a1aa] dark:text-white">Morphology Theory</h2>
            </div>

            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-[#a1a1aa] mb-2 flex items-center gap-2">
                  <BookA className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  What is Morphology?
                </h3>
                <p className="text-sm text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa] leading-relaxed">
                  Morphology is the study of words, how they are formed, and their relationship to other words in the same language. 
                  It analyzes the structure of words and parts of words, such as stems, root words, prefixes, and suffixes.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-[#a1a1aa] mb-2 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  Forming Adjectives
                </h3>
                <p className="text-sm text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa] leading-relaxed mb-3">
                  Adjectives can often be formed from nouns or verbs by adding a derivational suffix. This process changes the word's part of speech and its meaning.
                </p>
                <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-100 dark:border-[#1c1b1b]">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-[#a1a1aa] mb-2">Common Suffixes:</h4>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-[#71717a] dark:text-[#71717a]">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 mt-0.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                      <span><strong>-ful</strong> (full of): beauty → beautiful</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 mt-0.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                      <span><strong>-ous</strong> (possessing): danger → dangerous</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 mt-0.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                      <span><strong>-ive</strong> (tending to): create → creative</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 mt-0.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                      <span><strong>-ish</strong> (characteristic of): child → childish</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 mt-0.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                      <span><strong>-able / -ible</strong> (capable of): rely → reliable</span>
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-[#a1a1aa] mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  Spelling Rules
                </h3>
                <p className="text-sm text-slate-600 dark:text-[#71717a] dark:text-[#a1a1aa] leading-relaxed">
                  When adding suffixes, spelling changes often occur in the base word:
                  <br /><br />
                  • <strong>Y to I:</strong> If a word ends in a consonant + y, change the 'y' to 'i' before adding a suffix (beauty → beautiful).<br />
                  • <strong>Silent E:</strong> Drop the silent 'e' before adding a suffix that begins with a vowel (create → creative).
                </p>
              </section>
            </div>
          </div>

          {/* Column 2: Simulation */}
          <div className="bg-white dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b]/50 dark:border-[#1c1b1b] p-6 flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-xl">
                <Hammer className="w-6 h-6 text-indigo-600 dark:text-indigo-400 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-[#a1a1aa] dark:text-white">Word Forge</h2>
                <p className="text-sm text-slate-500 dark:text-[#71717a] dark:text-[#71717a]">Combine bases and suffixes to craft adjectives</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-6 lg:overflow-y-auto">
              
              <div className="grid grid-cols-2 gap-4">
                {/* Base Selector */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 dark:text-[#a1a1aa] dark:text-[#a1a1aa]">1. Select Base Word</label>
                  <div className="grid gap-2">
                    {bases.map(b => (
                      <button
                        key={b}
                        onClick={() => setSelectedBase(b)}
                        className={`px-4 py-3 rounded-xl text-left text-sm font-medium transition-all ${
                          selectedBase === b
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-slate-100 dark:bg-[#121212] dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212] dark:hover:bg-slate-700 border border-slate-200 dark:border-[#1c1b1b]/50 dark:border-[#1c1b1b] dark:border-slate-600'
                        }`}
                      >
                        {b.charAt(0).toUpperCase() + b.slice(1)}
                        <span className="block text-xs opacity-70 mt-0.5">
                          {FORGE_RULES.find(r => r.base === b)?.baseType}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Suffix Selector */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 dark:text-[#a1a1aa] dark:text-[#a1a1aa]">2. Select Suffix</label>
                  <div className="grid gap-2">
                    {suffixes.map(s => (
                      <button
                        key={s}
                        onClick={() => setSelectedSuffix(s)}
                        className={`px-4 py-3 rounded-xl text-left text-sm font-medium transition-all ${
                          selectedSuffix === s
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'bg-slate-100 dark:bg-[#121212] dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] hover:bg-slate-200 dark:bg-[#121212] dark:hover:bg-slate-700 border border-slate-200 dark:border-[#1c1b1b]/50 dark:border-[#1c1b1b] dark:border-slate-600'
                        }`}
                      >
                        -{s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Forge Action */}
              <div className="mt-4 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-[#121212] rounded-2xl border-2 border-dashed border-slate-200 dark:border-[#1c1b1b]/50 dark:border-[#1c1b1b] relative">
                
                <div className="flex items-center justify-center gap-4 mb-6 w-full">
                  <div className={`flex-1 p-3 text-center rounded-xl font-bold text-lg ${selectedBase ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 dark:text-blue-300' : 'bg-slate-100 dark:bg-[#121212] dark:bg-[#121212] text-slate-400'}`}>
                    {selectedBase || '?'}
                  </div>
                  <div className="text-2xl text-slate-400 font-bold">+</div>
                  <div className={`flex-1 p-3 text-center rounded-xl font-bold text-lg ${selectedSuffix ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 dark:text-purple-300' : 'bg-slate-100 dark:bg-[#121212] dark:bg-[#121212] text-slate-400'}`}>
                    {selectedSuffix ? `-${selectedSuffix}` : '?'}
                  </div>
                </div>

                <button
                  onClick={handleForge}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-full shadow-lg hover:shadow-indigo-500/30 hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Hammer className="w-5 h-5" />
                  FORGE WORD
                </button>

                {forgeError && (
                  <div className="mt-4 text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900 px-4 py-2 rounded-lg text-center w-full">
                    {forgeError}
                  </div>
                )}

                {forgeResult && (
                  <div className="mt-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700/50 dark:border-green-800 rounded-xl p-4 text-center">
                      <div className="text-sm font-semibold text-green-600 dark:text-green-400 mb-1">Success! Adjective Formed:</div>
                      <div className="text-3xl font-black text-green-700 dark:text-green-300 tracking-tight">
                        {forgeResult.result}
                      </div>
                      <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-700/50/50 dark:border-green-800/50 text-sm text-green-700 dark:text-green-300 dark:text-green-400">
                        <strong>Rule applied:</strong> {forgeResult.rule}
                      </div>
                    </div>
                  </div>
                )}
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
                  Forged Dictionary
                </h3>
                {forgedLog.length === 0 ? (
                  <div className="text-sm text-slate-500 dark:text-[#71717a] italic bg-slate-50 dark:bg-[#121212] p-4 rounded-xl text-center border border-dashed border-slate-200 dark:border-[#1c1b1b]/50 dark:border-[#1c1b1b]">
                    No words forged yet. Use the Word Forge to create adjectives!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {forgedLog.map((log, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-[#121212] p-3 rounded-lg border border-slate-200 dark:border-[#1c1b1b]/50 dark:border-[#1c1b1b] flex justify-between items-center">
                        <div>
                          <span className="font-bold text-slate-800 dark:text-[#a1a1aa] dark:text-[#a1a1aa]">{log.result}</span>
                          <span className="text-xs text-slate-500 dark:text-[#71717a] ml-2">({log.base} + -{log.suffix})</span>
                        </div>
                        <Star className="w-4 h-4 text-yellow-500 dark:text-yellow-400 fill-current" />
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
                          ? 'Excellent work! You are a master of morphology.' 
                          : 'Good try! Review the rules and try again.'}
                      </p>
                      <button
                        onClick={() => {
                          setShowResults(false);
                          setAssessmentScores(Array(ASSESSMENT_QUESTIONS.length).fill(-1));
                        }}
                        className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        <RefreshCcw className="w-4 h-4" />
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
