import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const base = resolve(__dirname, '..', 'src', 'components', 'labs', 'class9', 'physics');

const files = [
  { name: 'LabP9DerivationRecoil.tsx', icon: 'Rocket', title: 'Recoil Velocity', color: 'amber' },
  { name: 'LabP9DerivationOrbital.tsx', icon: 'Satellite', title: 'Orbital Speed', color: 'indigo' },
  { name: 'LabP9DerivationLiquidPressure.tsx', icon: 'Waves', title: 'Liquid Pressure', color: 'cyan' },
  { name: 'LabP9DerivationHydraulic.tsx', icon: 'Flower2', title: 'Hydraulic Lift', color: 'emerald' },
  { name: 'LabP9DerivationKE.tsx', icon: 'Zap', title: 'Kinetic Energy', color: 'yellow' },
  { name: 'LabP9DerivationGPE.tsx', icon: 'Mountain', title: 'Gravitational Potential Energy', color: 'purple' },
];

function normalizeLineEndings(text) {
  return text.replace(/\r\n/g, '\n');
}

for (const file of files) {
  const filePath = resolve(base, file.name);
  let content = readFileSync(filePath, 'utf-8');
  const nl = content.includes('\r\n') ? '\r\n' : '\n'; // preserve original line endings
  
  // Normalize to \n for easier matching, then switch back
  content = normalizeLineEndings(content);

  // 1. Replace state declarations  
  const oldState = ` const [activeTab, setActiveTab] = useState<'learn'|'test'>('learn');\n const [currentTestStep, setCurrentTestStep] = useState(0);\n const [testEquationInput, setTestEquationInput] = useState('');\n const [showTestHint, setShowTestHint] = useState(false);\n const [testStepStatus, setTestStepStatus] = useState<'idle'|'correct'|'incorrect'>('idle');\n const [testFullyCompleted, setTestFullyCompleted] = useState(false);\n const testSteps=`;

  // Find the testSteps line and build the full replacement
  const stateStartIdx = content.indexOf(oldState);
  if (stateStartIdx >= 0) {
    // Find the full testSteps line (ends before the next const)
    const restAfterState = content.substring(stateStartIdx + oldState.length);
    const testStepsEnd = restAfterState.indexOf('\n const handle');
    if (testStepsEnd >= 0) {
      const testStepsLine = restAfterState.substring(0, testStepsEnd);
      
      const newState = ` const [activeTab, setActiveTab] = useState<'learn'|'test'>('learn');\n const [testInputs, setTestInputs] = useState<Record<number, string>>({});\n const [testStatuses, setTestStatuses] = useState<Record<number, 'idle'|'correct'|'incorrect'>>({});\n const [testShowHints, setTestShowHints] = useState<Record<number, boolean>>({});\n const [testFullyCompleted, setTestFullyCompleted] = useState(false);\n const testSteps=`;
      
      const before = content.substring(0, stateStartIdx);
      const after = content.substring(stateStartIdx + oldState.length + testStepsEnd);
      content = before + newState + testStepsLine + after;
      console.log(`${file.name}: state + testSteps replaced ✓`);
    } else {
      console.log(`${file.name}: testSteps end not found ✗`);
    }
  } else {
    console.log(`${file.name}: old state NOT found ✗`);
    // Debug: show what's around where we expect the state
    const activeTabIdx = content.indexOf("useState<'learn'|'test'>('learn')");
    if (activeTabIdx >= 0) {
      console.log(`  Found 'learn'|'test' at ${activeTabIdx}, context: ${content.substring(activeTabIdx - 30, activeTabIdx + 60)}`);
    }
  }

  // 2. Replace handlers using index-based approach
  const handleStart = '\n const handleTestCheck=';
  const resetEndMarker = 'setShowTestHint(false);};';
  const handleStartIdx = content.indexOf(handleStart);
  if (handleStartIdx >= 0) {
    // Find the end of resetTest (3 lines combined or 2 without handleTestNext)
    const afterHandleStart = content.substring(handleStartIdx + handleStart.length);
    // Look for the next const or variable definition after the handlers
    const nextDef = afterHandleStart.search(/\n const (bMassKg|g |liquidColors|maxKe|maxGpe|rKm|gpe|ke |deltaP|recoilV|area1|depth|bulletMass|radius)/);
    if (nextDef >= 0) {
      const before = content.substring(0, handleStartIdx);
      const after = content.substring(handleStartIdx + nextDef); // skip handler line but keep \n
      const newHandlers = `\n const handleTestCheck=(stepIdx:number)=>{const e=testSteps[stepIdx].testEquation;const i=(testInputs[stepIdx]||'');const c=ck(i,e);setTestStatuses(p=>({...p,[stepIdx]:c?'correct':'incorrect'}));if(c){const d=steps.every((_,si)=>testStatuses[si]==='correct'||si===stepIdx);if(d)setTestFullyCompleted(true);}};\n const resetTest=()=>{setTestInputs({});setTestStatuses({});setTestShowHints({});setTestFullyCompleted(false);};`;
      content = before + newHandlers + after;
      console.log(`${file.name}: handlers replaced ✓`);
    } else {
      console.log(`${file.name}: handlers - nextDef not found ✗`);
    }
  } else {
    console.log(`${file.name}: handlers not found ✗`);
  }

  // 3. Replace test tab JSX using index-based slicing
  const testTabMarker = '</>:<div className="flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-0 lg:gap-6 p-4 lg:p-6 overflow-y-auto">';
  
  const newTestTabContent = `</>:<div className="flex-1 overflow-y-auto p-4 lg:p-6"><div className="max-w-4xl mx-auto flex flex-col gap-4"><div className="flex items-center gap-2 bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b] p-4"><${file.icon} className="w-5 h-5 text-${file.color}-500" /><div><h2 className="text-base font-bold text-slate-800 dark:text-white">${file.title} · Test</h2><p className="text-xs text-slate-500">Write the correct equation for each step to build the full derivation</p></div>{testFullyCompleted&&<Trophy className="w-6 h-6 text-yellow-500 ml-auto" />}</div><div className="bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b] p-4"><div className="flex items-center justify-between mb-2"><span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Progress</span><span className="text-xs font-bold text-emerald-600">{Object.values(testStatuses).filter(s=>s==='correct').length}/{steps.length} steps done</span></div><div className="flex gap-1">{steps.map((_,idx)=><div key={idx} className={\`flex-1 h-2 rounded-full transition-all \${testStatuses[idx]==='correct'?'bg-emerald-500':testStatuses[idx]==='incorrect'?'bg-red-400':testInputs[idx]?'bg-${file.color}-400 animate-pulse':'bg-slate-200 dark:bg-[#1c1b1b]'}\`} />)}</div></div>{testFullyCompleted?<div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800 p-8 text-center"><Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" /><h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-300 mb-1">Derivation Mastered! 🎉</h3><p className="text-sm text-emerald-600 dark:text-emerald-400 mb-4">You completed all steps correctly.</p><button onClick={resetTest} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 mx-auto"><RefreshCcw className="w-3.5 h-3.5" /> Retry</button></div>:<div className="space-y-4">{steps.map((step,idx)=>{const input=testInputs[idx]||'';const status=testStatuses[idx]||'idle';const showHint=testShowHints[idx]||false;return(<div key={idx} className={\`bg-white dark:bg-[#121212] rounded-xl border transition-all overflow-hidden \${status==='correct'?'border-emerald-300 dark:border-emerald-700 shadow-md shadow-emerald-500/10':status==='incorrect'?'border-red-300 dark:border-red-800':input?'border-${file.color}-300 dark:border-${file.color}-800':'border-slate-200 dark:border-[#1c1b1b]'}\`}><div className={\`px-4 py-3 border-b flex items-center gap-2 \${status==='correct'?'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20':'border-slate-100 dark:border-[#1c1b1b]'}\`}><div className={\`w-5 h-5 rounded-full \${status==='correct'?'bg-emerald-500':'bg-${file.color}-500'} text-white flex items-center justify-center text-[9px] font-bold shrink-0\`}>{status==='correct'?<CheckCircle className="w-3 h-3" />:idx+1}</div><span className={\`text-sm font-bold \${status==='correct'?'text-emerald-700 dark:text-emerald-300':'text-slate-700 dark:text-slate-300'}\`}>{step.label}</span>{status==='correct'&&<CheckCircle className="w-3.5 h-3.5 text-emerald-500 ml-auto" />}</div><div className="p-4 space-y-3"><p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">{step.detail}</p><div className="bg-slate-50 dark:bg-[#1c1b1b] rounded-lg border border-slate-200 dark:border-[#2a2a2a] p-3"><label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 block">Equation {idx+1}:</label><EquationBuilder value={input} onChange={v=>{setTestInputs(p=>({...p,[idx]:v}));if(status!=='idle')setTestStatuses(p=>({...p,[idx]:'idle'}));}} placeholder="Tap to build your equation..." /></div><div className="flex items-center gap-2"><button onClick={()=>handleTestCheck(idx)} disabled={!input.trim()||status==='correct'} className={\`flex-1 px-4 py-2 rounded-xl text-xs font-bold transition-all \${!input.trim()||status==='correct'?'bg-slate-200 dark:bg-[#1c1b1b] text-slate-400 cursor-not-allowed':'bg-${file.color}-600 hover:bg-${file.color}-700 text-white shadow-md'}\`}>{status==='correct'?<><CheckCircle className="w-3.5 h-3.5 inline mr-1" /> Correct!</>:<><CheckCircle className="w-3.5 h-3.5 inline mr-1" /> Check Answer</>}</button><button onClick={()=>setTestShowHints(p=>({...p,[idx]:!showHint}))} className={\`px-3 py-2 rounded-xl text-xs font-bold transition-all \${showHint?'bg-amber-100 dark:bg-amber-900/30 text-amber-700':'bg-slate-100 dark:bg-[#1c1b1b] text-slate-500 hover:bg-slate-200 dark:hover:bg-[#2a2a2a]'}\`}>{showHint?<EyeOff className="w-3.5 h-3.5" />:<HelpCircle className="w-3.5 h-3.5" />}</button></div>{showHint&&<div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800"><div className="flex items-start gap-2"><Lightbulb className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" /><div><p className="text-xs font-bold text-amber-700 mb-0.5">Hint</p><p className="text-xs text-amber-600">{testSteps[idx].testHint}</p></div></div></div>}{status==='incorrect'&&<div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800"><div className="flex items-start gap-2"><XCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" /><div><p className="text-xs font-bold text-red-700 mb-0.5">Not quite right</p><p className="text-xs text-red-600">Try a different equation. Use standard math notation (+, -, *, /, ^).</p></div></div></div>}{status==='correct'&&<div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800"><div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /><span className="text-xs font-bold text-emerald-700">✓ Correct!</span></div><MathFormula formula={testSteps[idx].testEquation} className="text-sm font-bold text-emerald-600 block mt-1" /></div>}</div></div>);})}</div>}</div></div>`;

  const testStartIdx = content.indexOf(testTabMarker);
  if (testStartIdx >= 0) {
    // Find the component end: look for ');\n}' from the end
    const endSearch = ');\n}';
    let endIdx = content.lastIndexOf(endSearch);
    // Try with \r\n if not found
    if (endIdx === -1) endIdx = content.lastIndexOf(');\r\n}');
    
    if (endIdx > testStartIdx) {
      const before = content.substring(0, testStartIdx);
      const after = content.substring(endIdx);
      content = before + newTestTabContent + after;
      console.log(`${file.name}: test tab JSX replaced ✓`);
    } else {
      console.log(`${file.name}: test tab JSX - end not found after start ✗`);
    }
  } else {
    console.log(`${file.name}: test tab JSX marker not found ✗`);
  }

  // Restore original line endings
  content = content.replace(/\n/g, nl);
  
  writeFileSync(filePath, content, 'utf-8');
  console.log(`${file.name}: saved ✓`);
}

console.log('\nDone!');
