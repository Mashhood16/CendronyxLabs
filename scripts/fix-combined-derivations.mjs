import { readFileSync, writeFileSync } from 'fs';

let c = readFileSync('src/components/labs/class9/physics/LabP9Derivations.tsx', 'utf-8');

// ═══ 1. REPLACE STATE ═══
const stateLine = ' // \u2500\u2500 Test Tab State \u2500\u2500\r\n';
const stateStart = c.indexOf(stateLine);
let lineStart, stateEnd;

if (stateStart < 0) {
  const fallback = c.indexOf('Test Tab State');
  if (fallback < 0) { console.log('State section not found!'); process.exit(1); }
  lineStart = c.lastIndexOf('\n', fallback) + 1;
} else {
  lineStart = stateStart;
}

const currentAnchor = '\n const current = DERIVATIONS.find(d => d.id === activeDerivation)!;\r\n';
stateEnd = c.indexOf(currentAnchor, lineStart);
if (stateEnd < 0) { console.log('current anchor not found!'); process.exit(1); }

const newState = ' // \u2500\u2500 Test Tab State \u2500\u2500\r\n const [activeTab, setActiveTab] = useState<\'learn\' | \'test\'>(\'learn\');\r\n const [currentStep, setCurrentStep] = useState(0);\r\n const [testInput, setTestInput] = useState(\'\');\r\n const [testStatus, setTestStatus] = useState<\'idle\' | \'correct\' | \'incorrect\'>(\'idle\');\r\n const [showTestHint, setShowTestHint] = useState(false);\r\n const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});\r\n const [testFullyCompleted, setTestFullyCompleted] = useState(false);\r';

c = c.substring(0, lineStart) + newState + c.substring(stateEnd);
console.log('State replaced');

// ═══ 2. REPLACE HANDLERS ═══
const handlerLine = '  // \u2500\u2500 Test Tab Handlers \u2500\u2500\r\n';
let handlerStart = c.indexOf(handlerLine);
if (handlerStart < 0) {
  handlerStart = c.indexOf('Test Tab Handlers');
  if (handlerStart < 0) { console.log('Handler section not found!'); process.exit(1); }
  handlerStart = c.lastIndexOf('\n', handlerStart) + 1;
}

const derivationChangeAnchor = '\n  const handleDerivationChange = (id: string) => {';
const handlerEnd = c.indexOf(derivationChangeAnchor, handlerStart);
if (handlerEnd < 0) { console.log('handleDerivationChange not found!'); process.exit(1); }

const newHandlers = `  // \u2500\u2500 Auto-scroll \u2500\u2500\r\n  useEffect(() => {\r\n    const el = document.querySelector(\`[data-step-idx="\${currentStep}"]\`);\r\n    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });\r\n  }, [currentStep]);\r\n\r\n  // \u2500\u2500 Test Tab Handlers \u2500\u2500\r\n  const handleTestCheck = () => {\r\n    const expected = current.steps[currentStep].testEquation;\r\n    const isCorrect = checkEquation(testInput, expected);\r\n    setTestStatus(isCorrect ? 'correct' : 'incorrect');\r\n    if (isCorrect) {\r\n      setCompletedSteps(prev => ({ ...prev, [currentStep]: true }));\r\n      const allDone = current.steps.every((_, i) => i === currentStep || completedSteps[i]);\r\n      if (allDone) {\r\n        setTestFullyCompleted(true);\r\n        if (!completed[activeDerivation]) {\r\n          setCompleted(prev => ({ ...prev, [activeDerivation]: true }));\r\n          setScore(s => s + 1);\r\n        }\r\n      } else {\r\n        setCurrentStep(currentStep + 1);\r\n        setTestInput('');\r\n        setTestStatus('idle');\r\n        setShowTestHint(false);\r\n      }\r\n    }\r\n  };\r\n\r\n  const resetTest = () => {\r\n    setCurrentStep(0);\r\n    setTestInput('');\r\n    setTestStatus('idle');\r\n    setShowTestHint(false);\r\n    setCompletedSteps({});\r\n    setTestFullyCompleted(false);\r\n  };`;

c = c.substring(0, handlerStart) + newHandlers + c.substring(handlerEnd);
console.log('Handlers replaced');

// ═══ 3. REPLACE TEST TAB JSX ═══
const markerIdx = c.indexOf(') : (');
if (markerIdx < 0) { console.log('Test JSX marker not found!'); process.exit(1); }

const afterParen = markerIdx + 6; // skip `) : (`
const contentStart = c.indexOf('\n', afterParen) + 1;
if (contentStart <= afterParen) { process.exit(1); }

const lastClose = c.lastIndexOf(')}');
if (lastClose < contentStart) { console.log('Test JSX end not found!'); process.exit(1); }

// IMPORTANT: No JSX comment at the start! Start directly with JSX elements.
// The content is inside `( ... )` which is a JavaScript expression group.
// JSX comments ({/* ... */}) don't work there - they need JSX child context.
const progTestJSX = `                <div className="flex-1 overflow-y-auto">
                  <div className="h-full flex flex-col lg:flex-row gap-4 lg:gap-6">

                    {/* LEFT PANEL: Derivation Steps */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b] p-4 mb-4">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-5 h-5 text-blue-500" />
                          <div>
                            <h2 className="text-base font-bold text-slate-800 dark:text-white">Derivation Steps</h2>
                            <p className="text-xs text-slate-500">Complete each step to unlock the next one</p>
                          </div>
                          {testFullyCompleted && <Trophy className="w-6 h-6 text-yellow-500 ml-auto" />}
                        </div>
                        <div className="flex gap-1 mt-3">
                          {current.steps.map((_, idx) => (
                            <div key={idx} className={\`flex-1 h-1.5 rounded-full transition-all \${completedSteps[idx] ? 'bg-emerald-500' : idx === currentStep ? 'bg-blue-400 animate-pulse' : 'bg-slate-200 dark:bg-[#1c1b1b]'}\`} />
                          ))}
                        </div>
                      </div>

                      {testFullyCompleted ? (
                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800 p-8 text-center">
                          <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                          <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-300 mb-1">Derivation Mastered! \uD83C\uDF89</h3>
                          <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-4">You've completed all steps correctly.</p>
                          <button onClick={resetTest} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 mx-auto"><RefreshCcw className="w-3.5 h-3.5" /> Retry</button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {current.steps.map((step, idx) => {
                            const isCompleted = completedSteps[idx];
                            const isActive = idx === currentStep;
                            const isLocked = idx > currentStep;
                            return (
                              <div
                                key={idx}
                                onClick={() => { if (!isLocked) { setCurrentStep(idx); if (completedSteps[idx]) { setTestInput(current.steps[idx].testEquation); setTestStatus('correct'); setShowTestHint(false); } else { setTestInput(''); setTestStatus('idle'); setShowTestHint(false); } } }}
                                data-step-idx={idx}
                                className={\`relative rounded-xl border transition-all cursor-pointer overflow-hidden
                                  \${isCompleted ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/10' : ''}
                                  \${isActive ? 'border-blue-400 dark:border-blue-600 bg-white dark:bg-[#1c1b1b] shadow-md shadow-blue-500/10 ring-1 ring-blue-400/30' : ''}
                                  \${isLocked ? 'border-slate-100 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212] opacity-50 cursor-not-allowed' : ''}
                                  \${!isCompleted && !isActive && !isLocked ? 'border-slate-200 dark:border-[#2a2a2a] bg-white dark:bg-[#121212]' : ''}\`}
                              >
                                <div className="px-4 py-3 flex items-center gap-3">
                                  <div className={\`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all
                                    \${isCompleted ? 'bg-emerald-500 text-white' : ''}
                                    \${isActive ? 'bg-blue-500 text-white shadow-sm' : ''}
                                    \${isLocked ? 'bg-slate-200 dark:bg-[#1c1b1b] text-slate-400' : ''}
                                    \${!isCompleted && !isActive && !isLocked ? 'bg-slate-200 dark:bg-[#2a2a2a] text-slate-500' : ''}\`}>
                                    {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : idx + 1}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={\`text-sm font-bold \${isLocked ? 'text-slate-400' : 'text-slate-700 dark:text-slate-300'}\`}>{step.label}</p>
                                  </div>
                                  {isCompleted && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
                                  {isActive && !isCompleted && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />}
                                </div>

                                <div className="px-4 pb-4">
                                  {isCompleted ? (
                                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
                                      <MathFormula formula={current.steps[idx].testEquation} className="text-sm font-bold text-emerald-600" />
                                    </div>
                                  ) : isActive ? (
                                    <div className="bg-slate-50 dark:bg-[#000000] rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-700 p-3 text-center">
                                      {testInput ? (
                                        <MathFormula formula={testInput} className="text-sm font-bold text-blue-600" />
                                      ) : (
                                        <p className="text-xs text-blue-400 flex items-center justify-center gap-1.5">
                                          <span className="text-lg">+</span> Tap to enter equation
                                        </p>
                                      )}
                                    </div>
                                  ) : isLocked ? (
                                    <div className="bg-slate-50 dark:bg-[#000000] rounded-lg border border-slate-200 dark:border-[#1c1b1b] p-3">
                                      <p className="text-xs text-slate-400 text-center">\uD83D\uDD12 Complete previous step</p>
                                    </div>
                                  ) : (
                                    <div className="bg-slate-50 dark:bg-[#000000] rounded-lg border border-slate-200 dark:border-[#2a2a2a] p-3 text-center">
                                      <p className="text-xs text-slate-500">Click to edit equation</p>
                                    </div>
                                  )}
                                </div>

                                {idx < current.steps.length - 1 && (
                                  <div className={\`absolute left-[22px] bottom-0 w-0.5 h-4 transition-all \${isCompleted ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-[#1c1b1b]'}\`} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* RIGHT PANEL: Equation Builder */}
                    {!testFullyCompleted && (
                      <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0">
                        <div className="bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b] p-5 sticky top-4">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shrink-0">{currentStep + 1}</div>
                            <div>
                              <p className="text-sm font-bold text-slate-800 dark:text-white">{current.steps[currentStep].label}</p>
                              <p className="text-[10px] text-slate-500">Step {currentStep + 1} of {current.steps.length}</p>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4 bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-3 border border-slate-200 dark:border-[#2a2a2a]">
                            {current.steps[currentStep].content}
                          </p>

                          <div className="bg-slate-50 dark:bg-[#000000] rounded-lg border border-slate-200 dark:border-[#2a2a2a] p-4 mb-4">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 block">
                              Equation for Step {currentStep + 1}
                            </label>
                            <EquationBuilder
                              value={testInput}
                              onChange={v => { setTestInput(v); if (testStatus !== 'idle') setTestStatus('idle'); }}
                              placeholder="Build your equation..."
                            />
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <button
                              onClick={handleTestCheck}
                              disabled={!testInput.trim() || testStatus === 'correct'}
                              className={\`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-all
                                \${!testInput.trim() || testStatus === 'correct'
                                  ? 'bg-slate-200 dark:bg-[#1c1b1b] text-slate-400 cursor-not-allowed'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-95'}\`}
                            >
                              {testStatus === 'correct' ? (
                                <><CheckCircle className="w-3.5 h-3.5 inline mr-1.5" /> Correct \u2713</>
                              ) : (
                                <><CheckCircle className="w-3.5 h-3.5 inline mr-1.5" /> Check Answer</>
                              )}
                            </button>
                            <button
                              onClick={() => setShowTestHint(!showTestHint)}
                              className={\`px-3 py-2.5 rounded-xl text-xs font-bold transition-all
                                \${showTestHint ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700' : 'bg-slate-100 dark:bg-[#1c1b1b] text-slate-500 hover:bg-slate-200 dark:hover:bg-[#2a2a2a]'}\`}
                            >
                              {showTestHint ? <EyeOff className="w-3.5 h-3.5" /> : <HelpCircle className="w-3.5 h-3.5" />}
                            </button>
                          </div>

                          {showTestHint && (
                            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800 mb-3">
                              <div className="flex items-start gap-2">
                                <Lightbulb className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                                <div>
                                  <p className="text-xs font-bold text-amber-700 mb-0.5">Hint</p>
                                  <p className="text-xs text-amber-600">{current.steps[currentStep].testHint}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {testStatus === 'incorrect' && (
                            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
                              <div className="flex items-start gap-2">
                                <XCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                                <div>
                                  <p className="text-xs font-bold text-red-700 mb-0.5">Not quite right</p>
                                  <p className="text-xs text-red-600">Try a different equation. Use standard math notation (+, -, *, /, ^).</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {testStatus === 'correct' && (
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                <span className="text-xs font-bold text-emerald-700">\u2713 Correct! Moving to next step...</span>
                              </div>
                              <MathFormula formula={current.steps[currentStep].testEquation} className="text-sm font-bold text-emerald-600 block mt-1" />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>`;

c = c.substring(0, contentStart) + progTestJSX + c.substring(lastClose);

writeFileSync('src/components/labs/class9/physics/LabP9Derivations.tsx', c, 'utf-8');
console.log('Test JSX replaced');
