import { readFileSync, writeFileSync } from 'fs';

// ── Template from ForceMomentum ──
const tmpl = readFileSync('src/components/labs/class9/physics/LabP9DerivationForceMomentum.tsx', 'utf-8');

// Extract the test tab section
const testTabStart = tmpl.indexOf('/* ═══════════════════ TEST TAB ═══════════════════ */');
const testTabRaw = tmpl.substring(testTabStart);
const testTabContent = testTabRaw.substring(
  testTabRaw.indexOf('<div className="flex-1 overflow-y-auto p-4 lg:p-6">'),
  testTabRaw.lastIndexOf('</div>') + 6
);

// ── Proper JSX minifier ──
function minifyJSX(jsx) {
  const parts = jsx.split('`');
  const result = [];
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      let s = parts[i].replace(/\n\s*/g, '').replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').trim();
      result.push(s);
    } else {
      result.push(parts[i]);
    }
  }
  return result.join('`');
}

const minified = minifyJSX(testTabContent);
console.log('Minified test tab: '+minified.length+' chars');

// ── Per-file configs ──
const fileConfigs = [
  { file: 'Recoil',    icon: 'Rocket',    color: 'amber',  num: '500', oldActiveColor: 'bg-amber-500 text-white shadow-md' },
  { file: 'Orbital',   icon: 'Satellite', color: 'indigo', num: '500', oldActiveColor: 'bg-indigo-500 text-white shadow-md' },
  { file: 'LiquidPressure', icon: 'Waves', color: 'cyan',  num: '500', oldActiveColor: 'bg-cyan-500 text-white shadow-md' },
  { file: 'Hydraulic', icon: 'Flower2',   color: 'emerald',num: '500', oldActiveColor: 'bg-emerald-500 text-white shadow-md' },
  { file: 'KE',        icon: 'Zap',       color: 'yellow', num: '500', oldActiveColor: 'bg-yellow-500 text-white shadow-md' },
  { file: 'GPE',       icon: 'Mountain',  color: 'purple', num: '500', oldActiveColor: 'bg-purple-500 text-white shadow-md' },
];

// ── Customize test JSX ──
function customize(jsx, cfg) {
  let r = jsx;
  // Icon
  r = r.replace(/(<| )Target(?=\s|\.|\/)/g, '$1'+cfg.icon);
  // Colors - only replace specific blue patterns used in ForceMomentum's test tab
  r = r.replace(/text-blue-500/g, 'text-'+cfg.color+'-'+cfg.num);
  r = r.replace(/bg-blue-500(?!-)/g, 'bg-'+cfg.color+'-'+cfg.num);
  r = r.replace(/bg-blue-400 animate-pulse/g, 'bg-'+cfg.color+'-'+(parseInt(cfg.num)-100)+' animate-pulse');
  r = r.replace(/border-blue-400 dark:border-blue-600/g, 'border-'+cfg.color+'-400 dark:border-'+cfg.color+'-600');
  r = r.replace(/shadow-blue-500\/10/g, 'shadow-'+cfg.color+'-500/10');
  r = r.replace(/ring-blue-400\/30/g, 'ring-'+cfg.color+'-400/30');
  r = r.replace(/bg-blue-600 hover:bg-blue-700/g, 'bg-'+cfg.color+'-600 hover:bg-'+cfg.color+'-700');
  r = r.replace(/border-blue-300 dark:border-blue-700/g, 'border-'+cfg.color+'-300 dark:border-'+cfg.color+'-700');
  r = r.replace(/hover:bg-blue-50 dark:hover:bg-blue-900\/10/g, 'hover:bg-'+cfg.color+'-50 dark:hover:bg-'+cfg.color+'-900/10');
  r = r.replace(/text-blue-400/g, 'text-'+cfg.color+'-400');
  r = r.replace(/text-blue-600/g, 'text-'+cfg.color+'-600');
  return r;
}

// ── Apply to each file ──
for (const cfg of fileConfigs) {
  const path = 'src/components/labs/class9/physics/LabP9Derivation'+cfg.file+'.tsx';
  let c = readFileSync(path, 'utf-8');
  
  // 1. Add useEffect to import
  c = c.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';");
  
  // 2. Replace entire old test state block with new progressive state
  // The old block is: const [activeTab...]; const [testInputs...]; const [testStatuses...]; const [testShowHints...]; const [testFullyCompleted...];
  const newState = ` const [activeTab, setActiveTab] = useState<'learn'|'test'>('learn');
 const [currentStep, setCurrentStep] = useState(0);
 const [testInput, setTestInput] = useState('');
 const [testStatus, setTestStatus] = useState<'idle'|'correct'|'incorrect'>('idle');
 const [showTestHint, setShowTestHint] = useState(false);
 const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
 const [testFullyCompleted, setTestFullyCompleted] = useState(false);`;
  
  // Find the old state block boundaries
  const activeTabIdx = c.indexOf("const [activeTab, setActiveTab] = useState<'learn'|'test'>('learn');");
  const testFullyCompletedIdx = c.indexOf("const [testFullyCompleted, setTestFullyCompleted] = useState(false);");
  
  if (activeTabIdx >= 0 && testFullyCompletedIdx >= 0) {
    const endOfBlock = c.indexOf('\n', testFullyCompletedIdx) + 1; // include the newline
    const oldBlock = c.substring(activeTabIdx, endOfBlock);
    c = c.replace(oldBlock, newState);
    console.log(cfg.file+': State replaced');
  } else {
    console.log(cfg.file+': State pattern not found, aborting');
    continue;
  }
  
  // 3. Remove old handlers and add new ones (by index, not regex)
  const htcIdx = c.indexOf('const handleTestCheck=');
  const resetIdx = c.indexOf('const resetTest=');
  
  if (htcIdx >= 0 && resetIdx >= 0) {
    // Find end of resetTest - next non-empty line that starts with `\nconst ` or `\n\n`
    const afterReset = resetIdx + 'const resetTest=()=>{};'.length + 200; // generous buffer
    const handlerEnd = c.indexOf('\n\nconst ', Math.max(afterReset, htcIdx + 50));
    const handlerBlockEnd = handlerEnd > 0 ? handlerEnd : c.indexOf('\nconst ', afterReset + 10);
    
    // Find the actual end: the const keyword after resetTest
    let actualEnd = c.length;
    const possibleEnds = [
      c.indexOf('\n\nconst ', resetIdx + 50),
      c.indexOf('\n\nconst ', htcIdx + 50),
      c.indexOf('\nconst bMassKg', resetIdx),
      c.indexOf('\nconst recoilV', resetIdx),
      c.indexOf('\nconst deltaP', resetIdx),
      c.indexOf('\nconst rKm', resetIdx),
      c.indexOf('\nconst pressure', resetIdx),
      c.indexOf('\nconst ke', resetIdx),
      c.indexOf('\nconst bMassKg', htcIdx),
    ];
    for (const idx of possibleEnds) {
      if (idx > resetIdx && idx < actualEnd) actualEnd = idx;
    }
    
    if (actualEnd === c.length) {
      // Fallback: find end at next blank line
      actualEnd = c.indexOf('\n\n', resetIdx + 50);
    }
    
    const oldHandlers = c.substring(htcIdx, actualEnd);
    
    const newHandlers = `useEffect(() => { const el = document.querySelector(\`[data-step-idx="\${currentStep}"]\`); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, [currentStep]);
 const handleTestCheck = () => { const expected = testSteps[currentStep].testEquation; const isCorrect = ck(testInput, expected); setTestStatus(isCorrect ? 'correct' : 'incorrect'); if (isCorrect) { setCompletedSteps(prev => ({ ...prev, [currentStep]: true })); if (currentStep + 1 >= steps.length) { setTestFullyCompleted(true); } else { setCurrentStep(currentStep + 1); setTestInput(''); setTestStatus('idle'); setShowTestHint(false); } } };
 const resetTest = () => { setCurrentStep(0); setTestInput(''); setTestStatus('idle'); setShowTestHint(false); setCompletedSteps({}); setTestFullyCompleted(false); };`;
    
    c = c.replace(oldHandlers, newHandlers);
    console.log(cfg.file+': Handlers replaced');
  } else {
    console.log(cfg.file+': Handlers not found');
    continue;
  }
  
  // 4. Replace test JSX
  const customJSX = customize(minified, cfg);
  
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
      const before = lines.slice(0, testLineIdx).join('\n');
      c = before + '\n' + prefix + customJSX + '\n}</div>);\n}\n';
      console.log(cfg.file+': Test JSX replaced');
    }
  }
  
  writeFileSync(path, c, 'utf-8');
  
  // Verify
  const opens = (c.match(/<div[^a-zA-Z]/g)||[]).length;
  const closes = (c.match(/<\/div>/g)||[]).length;
  console.log('  div diff: '+(opens-closes));
}
