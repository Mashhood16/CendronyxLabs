import { readFileSync, writeFileSync } from 'fs';

// ── Template from ForceMomentum ──
const tmpl = readFileSync('src/components/labs/class9/physics/LabP9DerivationForceMomentum.tsx', 'utf-8');

// Extract the ENTIRE test tab section (from `) : (` to the closing `)}`)
const testTabStart = tmpl.indexOf('/* ═══════════════════ TEST TAB ═══════════════════ */');
const testTabRaw = tmpl.substring(testTabStart);

// Find the end: `)}` then `</div>` then `);\n}`
const endMarkerIdx = testTabRaw.indexOf(')}');
const afterEndMarker = testTabRaw.substring(endMarkerIdx);
// The `)}` should be followed by `</div>` (main wrapper) then `);\n}`
// Extract just the test tab itself (from `<div className="flex-1...">` to the last `</div>` before `)}`)
const testTabContent = testTabRaw.substring(
  testTabRaw.indexOf('<div className="flex-1 overflow-y-auto p-4 lg:p-6">'),
  testTabRaw.lastIndexOf('</div>', endMarkerIdx) + 6  // include the last </div> before )}
);

// ── Proper JSX minifier that preserves template literals ──
function minifyJSX(jsx) {
  // Split into segments at backtick boundaries
  const parts = jsx.split('`');
  const result = [];
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      // Outside template literal - can minify freely
      let segment = parts[i]
        .replace(/\n\s*/g, '')    // Remove newlines
        .replace(/>\s+</g, '><')  // Clean between tags
        .replace(/\s{2,}/g, ' ')  // Collapse spaces
        .trim();
      result.push(segment);
    } else {
      // Inside template literal - preserve as-is
      result.push(parts[i]);
    }
  }
  return result.join('`');
}

const minifiedTestTab = minifyJSX(testTabContent);
console.log('Minified test tab length:', minifiedTestTab.length);

// Count divs
const testOpens = (minifiedTestTab.match(/<div[^a-zA-Z]/g)||[]).length;
const testCloses = (minifiedTestTab.match(/<\/div>/g)||[]).length;
console.log('Minified test tab divs: opens='+testOpens+' closes='+testCloses+' diff='+(testOpens-testCloses));

// ── Per-file configs ──
const fileConfigs = [
  { file: 'Recoil',    icon: 'Rocket',    color: 'amber',  colorNum: '500' },
  { file: 'Orbital',   icon: 'Satellite', color: 'indigo', colorNum: '500' },
  { file: 'LiquidPressure', icon: 'Waves', color: 'cyan',   colorNum: '500' },
  { file: 'Hydraulic', icon: 'Flower2',   color: 'emerald',colorNum: '500' },
  { file: 'KE',        icon: 'Zap',       color: 'yellow', colorNum: '500' },
  { file: 'GPE',       icon: 'Mountain',  color: 'purple', colorNum: '500' },
];

// ── Generate customized test JSX per file ──
function customizeTestJSX(jsx, cfg) {
  let result = jsx;
  // Replace icon references
  result = result.replace(/<Target\s/g, '<' + cfg.icon + ' ');
  result = result.replace(/Target className=/g, cfg.icon + ' className=');
  
  // Replace color references - be specific to avoid over-matching
  // Only replace colors that are specifically for the accent (not emerald, slate, etc.)
  result = result.replace(/text-blue-500/g, 'text-' + cfg.color + '-' + cfg.colorNum);
  result = result.replace(/bg-blue-500(?!-)/g, 'bg-' + cfg.color + '-' + cfg.colorNum);
  result = result.replace(/bg-blue-400 animate-pulse/g, 'bg-' + cfg.color + '-' + (parseInt(cfg.colorNum)-100) + ' animate-pulse');
  result = result.replace(/border-blue-400 dark:border-blue-600/g, 'border-' + cfg.color + '-400 dark:border-' + cfg.color + '-600');
  result = result.replace(/shadow-blue-500\/10/g, 'shadow-' + cfg.color + '-500/10');
  result = result.replace(/ring-1 ring-blue-400\/30/g, 'ring-1 ring-' + cfg.color + '-400/30');
  result = result.replace(/bg-blue-600 hover:bg-blue-700/g, 'bg-' + cfg.color + '-600 hover:bg-' + cfg.color + '-700');
  result = result.replace(/border-blue-300 dark:border-blue-700/g, 'border-' + cfg.color + '-300 dark:border-' + cfg.color + '-700');
  result = result.replace(/hover:bg-blue-50 dark:hover:bg-blue-900\/10/g, 'hover:bg-' + cfg.color + '-50 dark:hover:bg-' + cfg.color + '-900/10');
  return result;
}

// ── Apply to each file ──
for (const cfg of fileConfigs) {
  const path = 'src/components/labs/class9/physics/LabP9Derivation'+cfg.file+'.tsx';
  let c = readFileSync(path, 'utf-8');
  
  // 1. Add useEffect to import
  c = c.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';");
  
  // 2. Remove old test state and add new
  // Remove old per-step state declarations
  c = c.replace(/const \[testInputs, setTestInputs\] = useState<Record<number, string>>\(\{\}\);\s*/g, '');
  c = c.replace(/const \[testStatuses, setTestStatuses\] = useState<Record<number, 'idle'\|'correct'\|'incorrect'>>\(\{\}\);\s*/g, '');
  c = c.replace(/const \[testShowHints, setTestShowHints\] = useState<Record<number, boolean>>\(\{\}\);\s*/g, '');
  
  // Add new progressive state after testFullyCompleted
  const newState = ` const [activeTab, setActiveTab] = useState<'learn'|'test'>('learn');
 const [currentStep, setCurrentStep] = useState(0);
 const [testInput, setTestInput] = useState('');
 const [testStatus, setTestStatus] = useState<'idle'|'correct'|'incorrect'>('idle');
 const [showTestHint, setShowTestHint] = useState(false);
 const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
 const [testFullyCompleted, setTestFullyCompleted] = useState(false);`;
  
  c = c.replace(
    /(const \[testFullyCompleted, setTestFullyCompleted\] = useState\(false\);)/,
    '$1\n' + newState
  );
  
  // 3. Remove old handlers and add new ones
  c = c.replace(/const handleTestCheck=[^;]+;\s*/g, '');
  c = c.replace(/const resetTest=\(\)=>\{[^}]+\};\s*/g, '');
  
  const newHandlers = `useEffect(() => { const el = document.querySelector(\`[data-step-idx="\${currentStep}"]\`); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, [currentStep]);
 const handleTestCheck = () => { const expected = testSteps[currentStep].testEquation; const isCorrect = ck(testInput, expected); setTestStatus(isCorrect ? 'correct' : 'incorrect'); if (isCorrect) { setCompletedSteps(prev => ({ ...prev, [currentStep]: true })); if (currentStep + 1 >= steps.length) { setTestFullyCompleted(true); } else { setCurrentStep(currentStep + 1); setTestInput(''); setTestStatus('idle'); setShowTestHint(false); } } };
 const resetTest = () => { setCurrentStep(0); setTestInput(''); setTestStatus('idle'); setShowTestHint(false); setCompletedSteps({}); setTestFullyCompleted(false); };`;
  
  // Insert handlers before the first computed value (like bMassKg or deltaP or recoilV)
  c = c.replace(/\n\nconst (bMassKg|recoilV|deltaP|rKm|pressure|ke|bMassKg|force|speed)/, '\n' + newHandlers + '\n\nconst $1');
  
  // 4. Customize and replace the test JSX
  const customJSX = customizeTestJSX(minifiedTestTab, cfg);
  
  // Find the test JSX line
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
    }
  }
  
  writeFileSync(path, c, 'utf-8');
  console.log(cfg.file+': Done');
  
  // Verify
  const opens = (c.match(/<div[^a-zA-Z]/g)||[]).length;
  const closes = (c.match(/<\/div>/g)||[]).length;
  console.log('  div diff: '+(opens-closes));
}
