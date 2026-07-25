import { readFileSync, writeFileSync } from 'fs';

// ── Per-file customizations ──
const fileConfig = {
  Recoil: {
    icon: 'Rocket',
    stepColor: 'amber',
    stepColorNum: '500',
    stepColorDark: '600',
    accent: 'amber-500',
    accentLight: 'amber-100',
    accentBg: 'bg-amber-50',
  },
  Orbital: {
    icon: 'Satellite',
    stepColor: 'indigo',
    stepColorNum: '500',
    stepColorDark: '600',
    accent: 'indigo-500',
    accentLight: 'indigo-100',
    accentBg: 'bg-indigo-50',
  },
  LiquidPressure: {
    icon: 'Waves',
    stepColor: 'cyan',
    stepColorNum: '500',
    stepColorDark: '600',
    accent: 'cyan-500',
    accentLight: 'cyan-100',
    accentBg: 'bg-cyan-50',
  },
  Hydraulic: {
    icon: 'Flower2',
    stepColor: 'emerald',
    stepColorNum: '500',
    stepColorDark: '600',
    accent: 'emerald-500',
    accentLight: 'emerald-100',
    accentBg: 'bg-emerald-50',
  },
  KE: {
    icon: 'Zap',
    stepColor: 'yellow',
    stepColorNum: '500',
    stepColorDark: '600',
    accent: 'yellow-500',
    accentLight: 'yellow-100',
    accentBg: 'bg-yellow-50',
  },
  GPE: {
    icon: 'Mountain',
    stepColor: 'purple',
    stepColorNum: '500',
    stepColorDark: '600',
    accent: 'purple-500',
    accentLight: 'purple-100',
    accentBg: 'bg-purple-50',
  },
};

// ── Build the test tab JSX from template ──
function buildTestJSX(cfg) {
  const { icon, stepColor, stepColorNum, accent } = cfg;
  const activeBg = `bg-${stepColor}-${stepColorNum}`;
  const activeRing = `ring-${stepColor}-400/30`;
  const activeShadow = `shadow-${stepColor}-500/10`;
  const activeBorder = `border-${stepColor}-400`;
  const activeBorderDark = `border-${stepColor}-600`;
  const activeDotPulse = `bg-${stepColor}-400 animate-pulse`;
  const leftActiveBorder = `border-${stepColor}-300`;
  const leftActiveBorderDark = `border-${stepColor}-700`;
  const btnBg = `bg-${stepColor}-600`;
  const btnHover = `hover:bg-${stepColor}-700`;
  const iconClass = `text-${stepColor}-500`;

  // Build the JSX with template literals
  return `<div className="flex-1 overflow-y-auto p-4 lg:p-6">
 <div className="h-full flex flex-col lg:flex-row gap-4 lg:gap-6">

 {/* ── LEFT PANEL: Derivation Steps ── */}
 <div className="flex-1 min-w-0">
 <div className="bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b] p-4 mb-4">
 <div className="flex items-center gap-2">
 <${icon} className="w-5 h-5 ${iconClass}" />
 <div>
 <h2 className="text-base font-bold text-slate-800 dark:text-white">Derivation Steps</h2>
 <p className="text-xs text-slate-500">Complete each step to unlock the next one</p>
 </div>
 {testFullyCompleted && <Trophy className="w-6 h-6 text-yellow-500 ml-auto" />}
 </div>
 {/* Progress dots */}
 <div className="flex gap-1 mt-3">
 {steps.map((_, idx) => (
 <div key={idx} className={\`flex-1 h-1.5 rounded-full transition-all \${completedSteps[idx] ? 'bg-emerald-500' : idx === currentStep ? '${activeDotPulse}' : 'bg-slate-200 dark:bg-[#1c1b1b]'}\`} />
 ))}
 </div>
 </div>

 {testFullyCompleted ? (
 <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800 p-8 text-center">
 <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
 <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-300 mb-1">Derivation Mastered! 🎉</h3>
 <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-4">You completed all steps correctly.</p>
 <button onClick={resetTest} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 mx-auto"><RefreshCcw className="w-3.5 h-3.5" /> Retry</button>
 </div>
 ) : (
 <div className="space-y-2">
 {steps.map((step, idx) => {
  const isCompleted = completedSteps[idx];
  const isActive = idx === currentStep;
  const isLocked = idx > currentStep;
  return (
 <div
  key={idx}
  onClick={() => { if (!isLocked) { setCurrentStep(idx); if (completedSteps[idx]) { setTestInput(testSteps[idx].testEquation); setTestStatus('correct'); setShowTestHint(false); } else { setTestInput(''); setTestStatus('idle'); setShowTestHint(false); } } }}
  data-step-idx={idx}
  className={\`relative rounded-xl border transition-all cursor-pointer overflow-hidden
   \${isCompleted ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/10' : ''}
   \${isActive ? '${activeBorder} dark:${activeBorderDark} bg-white dark:bg-[#1c1b1b] shadow-md ${activeShadow} ring-1 ${activeRing}' : ''}
   \${isLocked ? 'border-slate-100 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212] opacity-50 cursor-not-allowed' : ''}
   \${!isCompleted && !isActive && !isLocked ? 'border-slate-200 dark:border-[#2a2a2a] bg-white dark:bg-[#121212]' : ''}\`}
 >
  {/* Step Header */}
  <div className="px-4 py-3 flex items-center gap-3">
   <div className={\`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all
    \${isCompleted ? 'bg-emerald-500 text-white' : ''}
    \${isActive ? '${activeBg} text-white shadow-sm' : ''}
    \${isLocked ? 'bg-slate-200 dark:bg-[#1c1b1b] text-slate-400' : ''}
    \${!isCompleted && !isActive && !isLocked ? 'bg-slate-200 dark:bg-[#2a2a2a] text-slate-500' : ''}\`}>
    {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : idx + 1}
   </div>
   <div className="flex-1 min-w-0">
    <p className={\`text-sm font-bold \${isLocked ? 'text-slate-400' : 'text-slate-700 dark:text-slate-300'}\`}>{step.label}</p>
   </div>
   {isCompleted && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
   {isActive && !isCompleted && <div className="w-2 h-2 rounded-full ${activeBg} animate-pulse shrink-0" />}
  </div>

  {/* Equation box - empty placeholder */}
  <div className="px-4 pb-4">
   {isCompleted ? (
    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
     <MathFormula formula={testSteps[idx].testEquation} className="text-sm font-bold text-emerald-600" />
    </div>
   ) : isActive ? (
    <div
     className="bg-slate-50 dark:bg-[#000000] rounded-lg border-2 border-dashed ${leftActiveBorder} dark:${leftActiveBorderDark} p-3 text-center cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
    >
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
     <p className="text-xs text-slate-400 text-center">🔒 Complete previous step</p>
    </div>
   ) : (
    <div className="bg-slate-50 dark:bg-[#000000] rounded-lg border border-slate-200 dark:border-[#2a2a2a] p-3 text-center cursor-pointer hover:bg-slate-100 dark:hover:bg-[#1c1b1b] transition-colors">
     <p className="text-xs text-slate-500">Click to edit equation</p>
    </div>
   )}
  </div>

  {/* Connecting line between steps */}
  {idx < steps.length - 1 && (
   <div className={\`absolute left-[22px] bottom-0 w-0.5 h-4 transition-all \${isCompleted ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-[#1c1b1b]'}\`} />
  )}
 </div>
  );
 })}
 </div>
 )}
 </div>

 {/* ── RIGHT PANEL: Equation Builder ── */}
 {!testFullyCompleted && (
 <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0">
  <div className="bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b] p-5 sticky top-4">
   <div className="flex items-center gap-2 mb-4">
    <div className="w-8 h-8 rounded-full ${activeBg} text-white flex items-center justify-center text-xs font-bold shrink-0">{currentStep + 1}</div>
    <div>
     <p className="text-sm font-bold text-slate-800 dark:text-white">{steps[currentStep].label}</p>
     <p className="text-[10px] text-slate-500">Step {currentStep + 1} of {steps.length}</p>
    </div>
   </div>

   <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4 bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-3 border border-slate-200 dark:border-[#2a2a2a]">
    {steps[currentStep].detail}
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
       : '${btnBg} ${btnHover} text-white shadow-md active:scale-95'}\`}
    >
     {testStatus === 'correct' ? (
      <><CheckCircle className="w-3.5 h-3.5 inline mr-1.5" /> Correct ✓</>
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
       <p className="text-xs text-amber-600">{testSteps[currentStep].testHint}</p>
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
      <span className="text-xs font-bold text-emerald-700">✓ Correct! Moving to next step...</span>
     </div>
     <MathFormula formula={testSteps[currentStep].testEquation} className="text-sm font-bold text-emerald-600 block mt-1" />
    </div>
   )}
  </div>
 </div>
 )}
 </div>
 </div>`;
}

// ── New state + handlers template ──
const NEW_STATE = ` const [activeTab, setActiveTab] = useState<'learn'|'test'>('learn');
 const [currentStep, setCurrentStep] = useState(0);
 const [testInput, setTestInput] = useState('');
 const [testStatus, setTestStatus] = useState<'idle'|'correct'|'incorrect'>('idle');
 const [showTestHint, setShowTestHint] = useState(false);
 const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
 const [testFullyCompleted, setTestFullyCompleted] = useState(false);`;

const NEW_HANDLERS = `useEffect(() => { const el = document.querySelector(\`[data-step-idx=\"\${currentStep}\"]\`); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, [currentStep]);
 const handleTestCheck = () => { const expected = testSteps[currentStep].testEquation; const isCorrect = ck(testInput, expected); setTestStatus(isCorrect ? 'correct' : 'incorrect'); if (isCorrect) { setCompletedSteps(prev => ({ ...prev, [currentStep]: true })); if (currentStep + 1 >= steps.length) { setTestFullyCompleted(true); } else { setCurrentStep(currentStep + 1); setTestInput(''); setTestStatus('idle'); setShowTestHint(false); } } };
 const resetTest = () => { setCurrentStep(0); setTestInput(''); setTestStatus('idle'); setShowTestHint(false); setCompletedSteps({}); setTestFullyCompleted(false); };`;

// ── Process each file ──
const files = ['Recoil','Orbital','LiquidPressure','Hydraulic','KE','GPE'];

for (const f of files) {
  const path = 'src/components/labs/class9/physics/LabP9Derivation'+f+'.tsx';
  let c = readFileSync(path, 'utf-8');
  const cfg = fileConfig[f];
  
  // Step 1: Add useEffect to import
  c = c.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';");
  c = c.replace("import { useState, useEffect } from 'react';\r", "import { useState, useEffect } from 'react';\r");
  // Ensure it's just once
  if (c.includes('import { useState, useEffect, useEffect }')) {
    c = c.replace('useState, useEffect, useEffect', 'useState, useEffect');
  }

  // Step 2: Replace old test state with progressive state
  // Old: const [testInputs, setTestInputs] = ...; const [testStatuses,...]; const [testShowHints,...];
  // But they might be on different lines in the minified format
  
  // Find the old state block: from `const [testInputs, setTestInputs]` to `const [testFullyCompleted, setTestFullyCompleted]`
  const oldStateRegex = /const \[testInputs, setTestInputs\] = useState<Record<number, string>>\(\{\}\);\r?\n\s*const \[testStatuses, setTestStatuses\] = useState<Record<number, 'idle'\|'correct'\|'incorrect'>>\(\{\}\);\r?\n\s*const \[testShowHints, setTestShowHints\] = useState<Record<number, boolean>>\(\{\}\);/;
  const oldStateMatch = c.match(oldStateRegex);
  
  if (oldStateMatch) {
    c = c.replace(oldStateRegex, NEW_STATE);
    console.log(f+': State replaced');
  } else {
    // Try minified format (all on one line)
    const oldStateMinified = /const \[testInputs, setTestInputs\] = useState<Record<number, string>>\(\{\}\);\s*const \[testStatuses, setTestStatuses\] = useState<Record<number, 'idle'\|'correct'\|'incorrect'>>\(\{\}\);\s*const \[testShowHints, setTestShowHints\] = useState<Record<number, boolean>>\(\{\}\);/;
    const minifiedMatch = c.match(oldStateMinified);
    if (minifiedMatch) {
      c = c.replace(oldStateMinified, NEW_STATE.replace(/\n/g, '\n'));
      console.log(f+': State replaced (minified)');
    } else {
      console.log(f+': State pattern not found, trying alt approach');
      // Try to find individual state declarations
      c = c.replace(/const \[testInputs, setTestInputs\] = useState<Record<number, string>>\(\{\}\);/g, '');
      c = c.replace(/const \[testStatuses, setTestStatuses\] = useState<Record<number, 'idle'\|'correct'\|'incorrect'>>\(\{\}\);/g, '');
      c = c.replace(/const \[testShowHints, setTestShowHints\] = useState<Record<number, boolean>>\(\{\}\);/g, '');
      // Add new state after `const [testFullyCompleted, setTestFullyCompleted] = useState(false);`
      c = c.replace(
        /const \[testFullyCompleted, setTestFullyCompleted\] = useState\(false\);/,
        'const [testFullyCompleted, setTestFullyCompleted] = useState(false);\n' + NEW_STATE
      );
      console.log(f+': State replaced (alt approach)');
    }
  }
  
  // Step 3: Replace handlers
  // Find handleTestCheck and resetTest
  const oldHandlers = /const handleTestCheck=[^;]+;\s*const resetTest=\(\)=>\{[^;]+;[^;]+;[^;]+;[^;]+;\};/;
  const handlersMatch = c.match(oldHandlers);
  if (handlersMatch) {
    c = c.replace(oldHandlers, NEW_HANDLERS);
    console.log(f+': Handlers replaced');
  } else {
    // Try with more flexible matching
    const oldSimple = /const handleTestCheck=[^;]+;\s*const resetTest=\(\)=>\{[^}]+\};/;
    if (c.match(oldSimple)) {
      c = c.replace(oldSimple, NEW_HANDLERS);
      console.log(f+': Handlers replaced (flexible)');
    } else {
      console.log(f+': Handler pattern not found, searching manually');
      // Find the handleTestCheck line
      const htcIdx = c.indexOf('const handleTestCheck=');
      const resetIdx = c.indexOf('const resetTest=');
      if (htcIdx >= 0 && resetIdx >= 0) {
        // Find end of resetTest (next const or blank line)
        const afterReset = c.indexOf('\n', resetIdx + 50);
        const endOfBlock = c.indexOf('\nconst ', afterReset + 1) > 0 ? c.indexOf('\nconst ', afterReset + 1) : c.indexOf('\n\n', afterReset + 1);
        const endPos = endOfBlock > 0 ? endOfBlock : afterReset + 1;
        const oldBlock = c.substring(htcIdx, endPos);
        c = c.replace(oldBlock, NEW_HANDLERS);
        console.log(f+': Handlers replaced (manual slice)');
      }
    }
  }
  
  // Step 4: Replace the test JSX (everything after `</>:` to the file ending)
  const testJSX = buildTestJSX(cfg);
  
  // Find the line containing `</>:<div className="flex-1 overflow-y-auto`
  const lines = c.split('\n');
  let testLineIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('</>:<div className="flex-1 overflow-y-auto')) {
      testLineIdx = i;
      break;
    }
  }
  
  if (testLineIdx >= 0) {
    const testLine = lines[testLineIdx];
    const markerIdx = testLine.indexOf('</>:');
    if (markerIdx >= 0) {
      const prefix = testLine.substring(0, markerIdx + 4);
      
      // Minify the test JSX to one line
      const minifiedJSX = testJSX
        .replace(/\s*\n\s*/g, '')
        .replace(/>\s+</g, '><')
        .trim();
      
      const newLine = prefix + minifiedJSX;
      const before = lines.slice(0, testLineIdx).join('\n');
      
      // File ending (minified ternary - no extra parens)
      c = before + '\n' + newLine + '\n}</div>);\n}\n';
      
      console.log(f+': Test JSX replaced');
    }
  } else {
    console.log(f+': Test JSX line not found! Looking for pattern...');
    // Try to find an alternative pattern
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('</>:')) {
        console.log('  Found </>: at line '+(i+1)+': '+lines[i].substring(0,100));
      }
    }
  }
  
  // Write the file
  writeFileSync(path, c, 'utf-8');
  console.log(f+': Done');
}
