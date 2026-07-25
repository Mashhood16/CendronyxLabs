import { readFileSync, writeFileSync } from 'fs';

// ── Read ForceMomentum as template ──
const tmpl = readFileSync('src/components/labs/class9/physics/LabP9DerivationForceMomentum.tsx', 'utf-8');

// Extract the test tab JSX section (between `) : (` and `)}</div>);`)
const testStart = tmpl.indexOf('/* ═══════════════════ TEST TAB ═══════════════════ */');
const testEnd = tmpl.indexOf(')}', tmpl.indexOf('testFullyCompleted', testStart)) + 2;
// But we need the exact end. Let me find it more precisely.
// Look for the pattern where the test tab content ends
const testTabJSX = tmpl.substring(
  tmpl.indexOf('<div className="flex-1 overflow-y-auto p-4 lg:p-6">', testStart),
  tmpl.indexOf('</div>\n )}\n</div>\n);\n}', testStart) + 6 // the last </div> before )}\n</div>\n);\n}
);

// Verify by counting divs in the test tab JSX only
const testOpens = (testTabJSX.match(/<div[^a-zA-Z]/g)||[]).length;
const testCloses = (testTabJSX.match(/<\/div>/g)||[]).length;
console.log('Template test JSX: opens='+testOpens+' closes='+testCloses+' diff='+(testOpens-testCloses));

// ── Per-file replacements ──
const fileConfigs = [
  { file: 'Recoil',    icon: 'Rocket',    color: 'amber',  colorNum: '500', oldIcon: 'Target', oldColor: 'blue', oldColorNum: '500' },
  { file: 'Orbital',   icon: 'Satellite', color: 'indigo', colorNum: '500', oldIcon: 'Target', oldColor: 'blue', oldColorNum: '500' },
  { file: 'LiquidPressure', icon: 'Waves', color: 'cyan', colorNum: '500', oldIcon: 'Target', oldColor: 'blue', oldColorNum: '500' },
  { file: 'Hydraulic', icon: 'Flower2',   color: 'emerald', colorNum: '500', oldIcon: 'Target', oldColor: 'blue', oldColorNum: '500' },
  { file: 'KE',        icon: 'Zap',       color: 'yellow', colorNum: '500', oldIcon: 'Target', oldColor: 'blue', oldColorNum: '500' },
  { file: 'GPE',       icon: 'Mountain',  color: 'purple', colorNum: '500', oldIcon: 'Target', oldColor: 'blue', oldColorNum: '500' },
];

for (const cfg of fileConfigs) {
  const path = 'src/components/labs/class9/physics/LabP9Derivation'+cfg.file+'.tsx';
  let c = readFileSync(path, 'utf-8');
  
  // 1. Fix import: add useEffect
  c = c.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';");
  
  // 2. Replace old test state with progressive state
  const newState = ` const [activeTab, setActiveTab] = useState<'learn'|'test'>('learn');
 const [currentStep, setCurrentStep] = useState(0);
 const [testInput, setTestInput] = useState('');
 const [testStatus, setTestStatus] = useState<'idle'|'correct'|'incorrect'>('idle');
 const [showTestHint, setShowTestHint] = useState(false);
 const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
 const [testFullyCompleted, setTestFullyCompleted] = useState(false);`;

  // Remove old test state lines
  c = c.replace(/const \[testInputs, setTestInputs\] = useState<Record<number, string>>\(\{\}\);\s*/g, '');
  c = c.replace(/const \[testStatuses, setTestStatuses\] = useState<Record<number, 'idle'\|'correct'\|'incorrect'>>\(\{\}\);\s*/g, '');
  c = c.replace(/const \[testShowHints, setTestShowHints\] = useState<Record<number, boolean>>\(\{\}\);\s*/g, '');
  // Add new state after testFullyCompleted
  c = c.replace(
    /(const \[testFullyCompleted, setTestFullyCompleted\] = useState\(false\);)/,
    '$1\n' + newState
  );
  
  // 3. Replace handlers
  const newHandlers = `useEffect(() => { const el = document.querySelector(\`[data-step-idx="\${currentStep}"]\`); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, [currentStep]);
 const handleTestCheck = () => { const expected = testSteps[currentStep].testEquation; const isCorrect = ck(testInput, expected); setTestStatus(isCorrect ? 'correct' : 'incorrect'); if (isCorrect) { setCompletedSteps(prev => ({ ...prev, [currentStep]: true })); if (currentStep + 1 >= steps.length) { setTestFullyCompleted(true); } else { setCurrentStep(currentStep + 1); setTestInput(''); setTestStatus('idle'); setShowTestHint(false); } } };
 const resetTest = () => { setCurrentStep(0); setTestInput(''); setTestStatus('idle'); setShowTestHint(false); setCompletedSteps({}); setTestFullyCompleted(false); };`;
  
  // Remove old handleTestCheck and resetTest
  c = c.replace(/const handleTestCheck=[^;]+;\s*/g, '');
  c = c.replace(/const resetTest=\(\)=>\{[^}]+\};\s*/g, '');
  // Add new handlers before the computed values (like bMassKg, recoilV)
  c = c.replace(/\n\nconst /, '\n' + newHandlers + '\n\nconst ');
  
  // 4. Build the customized test JSX from the template
  let testJSX = testTabJSX;
  
  // Replace the icon and color pattern
  // The template uses: <Target className="w-5 h-5 text-blue-500" />
  // We need to replace Target with the file's icon and blue-500 with the file's color
  testJSX = testJSX
    .replace(/Target className="w-5 h-5 text-blue-500"/g, cfg.icon + ' className="w-5 h-5 text-' + cfg.color + '-' + cfg.colorNum + '"')
    .replace(/bg-blue-500 text-white shadow-sm/g, 'bg-' + cfg.color + '-' + cfg.colorNum + ' text-white shadow-sm')
    .replace(/bg-blue-400 animate-pulse/g, 'bg-' + cfg.color + '-' + (parseInt(cfg.colorNum)-100) + ' animate-pulse')
    .replace(/border-blue-400 dark:border-blue-600/g, 'border-' + cfg.color + '-400 dark:border-' + cfg.color + '-600')
    .replace(/shadow-blue-500\/10/g, 'shadow-' + cfg.color + '-500/10')
    .replace(/ring-1 ring-blue-400\/30/g, 'ring-1 ring-' + cfg.color + '-400/30')
    .replace(/bg-blue-600 hover:bg-blue-700/g, 'bg-' + cfg.color + '-600 hover:bg-' + cfg.color + '-700')
    .replace(/border-blue-300 dark:border-blue-700/g, 'border-' + cfg.color + '-300 dark:border-' + cfg.color + '-700');
  
  // 5. Find the test JSX line and replace it
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
      const minified = testJSX
        .replace(/\n\s*/g, '')  // Remove newlines and leading whitespace
        .replace(/>\s+</g, '><')  // Remove spaces between tags
        .replace(/\s{2,}/g, ' ')  // Collapse multiple spaces
        .trim();
      
      const newLine = prefix + minified;
      const before = lines.slice(0, testLineIdx).join('\n');
      
      // File ending: } closes ternary, </div> closes main wrapper, ); closes return, } closes function
      c = before + '\n' + newLine + '\n}</div>);\n}\n';
    }
  }
  
  writeFileSync(path, c, 'utf-8');
  console.log(cfg.file+': Done');
  
  // Verify div balance
  const opens = (c.match(/<div[^a-zA-Z]/g)||[]).length;
  const closes = (c.match(/<\/div>/g)||[]).length;
  console.log('  div diff: '+(opens-closes));
}
