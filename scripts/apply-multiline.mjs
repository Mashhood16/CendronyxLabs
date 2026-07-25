import { readFileSync, writeFileSync } from 'fs';

// ── Template from ForceMomentum ──
const tmpl = readFileSync('src/components/labs/class9/physics/LabP9DerivationForceMomentum.tsx', 'utf-8');

// Extract the test tab section (multi-line, preserves template literals)
const testTabStart = tmpl.indexOf('/* ═══════════════════ TEST TAB ═══════════════════ */');
const testTabRaw = tmpl.substring(testTabStart);
const testStart = testTabRaw.indexOf('<div className="flex-1 overflow-y-auto p-4 lg:p-6">');
// Find the LAST `)}` that closes the activeTab ternary - it's followed by `\n</div>\n);\n}`
const ternaryEndPattern = ')}';
// The final `)}` before the `</div>\n);\n}` ending
const lastTernaryClose = testTabRaw.lastIndexOf(ternaryEndPattern);
// The template ends at the `</div>` BEFORE this final `)}`
const testEnd = testTabRaw.lastIndexOf('</div>', lastTernaryClose) + 6;
let testTabJSX = testTabRaw.substring(testStart, testEnd);

// Clean: remove empty lines
testTabJSX = testTabJSX.split('\n').filter(l => l.trim()).join('\n');

const testOpens = (testTabJSX.match(/<div[^a-zA-Z]/g)||[]).length;
const testCloses = (testTabJSX.match(/<\/div>/g)||[]).length;
console.log('Template test JSX: '+testTabJSX.length+' chars, div diff='+(testOpens-testCloses));

// ── Customize per file ──
function customize(jsx, cfg) {
  let r = jsx;
  r = r.replace(/(<| )Target(?=\s|\.)/g, '$1'+cfg.icon);
  r = r.replace(/text-blue-500/g, 'text-'+cfg.color+'-'+cfg.num);
  r = r.replace(/(?<!dark:)(?<!border-)bg-blue-500/g, 'bg-'+cfg.color+'-'+cfg.num);
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

const fileConfigs = [
  { file: 'Recoil',    icon: 'Rocket',    color: 'amber',  num: '500' },
  { file: 'Orbital',   icon: 'Satellite', color: 'indigo', num: '500' },
  { file: 'LiquidPressure', icon: 'Waves', color: 'cyan',  num: '500' },
  { file: 'Hydraulic', icon: 'Flower2',   color: 'emerald',num: '500' },
  { file: 'KE',        icon: 'Zap',       color: 'yellow', num: '500' },
  { file: 'GPE',       icon: 'Mountain',  color: 'purple', num: '500' },
];

// File ending: } closes ternary, </div> closes main wrapper, ); closes return, } closes function
const FILE_ENDING = '\n}</div>);\n}\n';

for (const cfg of fileConfigs) {
  const path = 'src/components/labs/class9/physics/LabP9Derivation'+cfg.file+'.tsx';
  let c = readFileSync(path, 'utf-8');

  // 1. Add useEffect
  c = c.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';");

  // 2. Replace old test state
  const newState = ` const [activeTab, setActiveTab] = useState<'learn'|'test'>('learn');
 const [currentStep, setCurrentStep] = useState(0);
 const [testInput, setTestInput] = useState('');
 const [testStatus, setTestStatus] = useState<'idle'|'correct'|'incorrect'>('idle');
 const [showTestHint, setShowTestHint] = useState(false);
 const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
 const [testFullyCompleted, setTestFullyCompleted] = useState(false);`;

  const atIdx = c.indexOf("const [activeTab, setActiveTab] = useState<'learn'|'test'>('learn');");
  const tfIdx = c.indexOf("const [testFullyCompleted, setTestFullyCompleted] = useState(false);");

  if (atIdx >= 0 && tfIdx >= 0) {
    const endOfBlock = c.indexOf('\n', tfIdx) + 1;
    c = c.substring(0, atIdx) + newState + c.substring(endOfBlock);
    console.log(cfg.file+': State replaced');
  } else {
    console.log(cfg.file+': State NOT found, skip');
    continue;
  }

  // 3. Replace handlers
  const htcIdx = c.indexOf('const handleTestCheck=');
  if (htcIdx >= 0) {
    const rstIdx = c.indexOf('const resetTest=', htcIdx);
    if (rstIdx >= 0) {
      // Find end: next `\nconst ` or `\n\n`
      let endIdx = c.indexOf('\nconst ', rstIdx + 30);
      if (endIdx < 0) endIdx = c.indexOf('\n\n', rstIdx + 30);
      if (endIdx < 0) endIdx = c.length;
      const old = c.substring(htcIdx, endIdx);

      const newHandlers = `useEffect(() => { const el = document.querySelector(\`[data-step-idx="\${currentStep}"]\`); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, [currentStep]);
 const handleTestCheck = () => { const expected = testSteps[currentStep].testEquation; const isCorrect = ck(testInput, expected); setTestStatus(isCorrect ? 'correct' : 'incorrect'); if (isCorrect) { setCompletedSteps(prev => ({ ...prev, [currentStep]: true })); if (currentStep + 1 >= steps.length) { setTestFullyCompleted(true); } else { setCurrentStep(currentStep + 1); setTestInput(''); setTestStatus('idle'); setShowTestHint(false); } } };
 const resetTest = () => { setCurrentStep(0); setTestInput(''); setTestStatus('idle'); setShowTestHint(false); setCompletedSteps({}); setTestFullyCompleted(false); };`;

      c = c.substring(0, htcIdx) + newHandlers + c.substring(endIdx);
      console.log(cfg.file+': Handlers replaced');
    } else {
      console.log(cfg.file+': resetTest not found');
    }
  } else {
    console.log(cfg.file+': handleTestCheck not found - already removed by previous run?');
  }

  // 4. Replace test JSX
  const customJSX = customize(testTabJSX, cfg);
  const marker = '</>:';
  const mIdx = c.indexOf(marker);
  if (mIdx >= 0) {
    c = c.substring(0, mIdx + 4) + '\n' + customJSX + FILE_ENDING;
    console.log(cfg.file+': Test JSX replaced');
  } else {
    console.log(cfg.file+': Marker not found');
  }

  writeFileSync(path, c, 'utf-8');

  const opens = (c.match(/<div[^a-zA-Z]/g)||[]).length;
  const closes = (c.match(/<\/div>/g)||[]).length;
  console.log('  div diff: '+(opens-closes));
}
