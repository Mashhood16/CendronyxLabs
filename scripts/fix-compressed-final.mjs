import { readFileSync, writeFileSync } from 'fs';

// ── Read ForceMomentum for the correct test tab structure (state, handlers, JSX) ──
const fm = readFileSync('src/components/labs/class9/physics/LabP9DerivationForceMomentum.tsx', 'utf-8');
const fmLines = fm.split('\n');

// Find state declarations in ForceMomentum
function findLinesContaining(lines, pattern) {
  const result = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(pattern)) result.push(i);
  }
  return result;
}

// ── Define replacements ──

// NEW state block (from ForceMomentum but generic)
const newStateBlock = ` const [activeTab, setActiveTab] = useState<'learn' | 'test'>('learn');
 // Per-step test state
 const [testInputs, setTestInputs] = useState<Record<number, string>>({});
 const [testStatuses, setTestStatuses] = useState<Record<number, 'idle' | 'correct' | 'incorrect'>>({});
 const [testShowHints, setTestShowHints] = useState<Record<number, boolean>>({});
 const [testFullyCompleted, setTestFullyCompleted] = useState(false);
 const testSteps=`;

// NEW handlers
const newHandlers = `const handleTestCheck=(stepIdx: number)=>{const input=testInputs[stepIdx]||'';const expected=testSteps[stepIdx].testEquation;const isCorrect=checkEquation(input,expected);setTestStatuses(prev=>({...prev,[stepIdx]:isCorrect?'correct':'incorrect'}));if(isCorrect){const allDone=steps.every((_,i)=>testStatuses[i]==='correct'||i===stepIdx);if(allDone)setTestFullyCompleted(true);}};
 const resetTest=()=>{setTestInputs({});setTestStatuses({});setTestShowHints({});setTestFullyCompleted(false);};`;

// ── Fix each file ──
const files = ['Recoil','Orbital','LiquidPressure','Hydraulic','KE','GPE'];

// Read all compressed files to get their step/test data
for (const f of files) {
  const path = 'src/components/labs/class9/physics/LabP9Derivation'+f+'.tsx';
  let c = readFileSync(path, 'utf-8');
  const nl = c.includes('\r\n') ? '\r\n' : '\n';
  const lines = c.split(nl);

  // DEBUG: Show first 15 lines
  for (let i = 0; i < Math.min(15, lines.length); i++) {
    console.log(f+' L'+(i+1)+': '+JSON.stringify(lines[i].substring(0,100)));
  }

  // Find key structures
  // 1. The old testSteps line
  let testStepsLineIdx = -1;
  let oldHandlerLineIdx = -1;
  let testJSXLineIdx = -1;
  let stepsDeclLineIdx = -1; // for "const steps = [...]" which has the step labels

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith('const testSteps=')) {
      testStepsLineIdx = i;
    }
    if (trimmed.startsWith('const handleTestCheck=')) {
      oldHandlerLineIdx = i;
    }
    if (lines[i].includes('</>:<div className="flex-1 overflow-y-auto')) {
      testJSXLineIdx = i;
    }
    if (trimmed.startsWith('const steps=')) {
      stepsDeclLineIdx = i;
    }
  }

  console.log(`  ${f}: testStepsIdx=${testStepsLineIdx}, handlersIdx=${oldHandlerLineIdx}, testJSXIdx=${testJSXLineIdx}, stepsDeclIdx=${stepsDeclLineIdx}`);

  // Build the new file content
  // We need to:
  // a) Replace the old state section with the new one
  // b) Replace the old handlers with the new ones
  // c) Replace the test JSX with a minified version from ForceMomentum

  // Since the files are heavily different in structure, let's use index-based replacement
  // Find the old state block (from activeTab useState to testSteps= line)
  let activeTabLineIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("useState<'learn' | 'test'>")) {
      activeTabLineIdx = i;
      break;
    }
  }

  // Find the old handlers (3 lines: handleTestCheck, handleTestNext, resetTest)
  let oldHandlersEndIdx = -1;
  for (let i = (oldHandlerLineIdx >= 0 ? oldHandlerLineIdx + 1 : 0); i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith('const handleTestNext=') || trimmed.startsWith('const resetTest=')) {
      oldHandlersEndIdx = i;
    }
  }
  // oldHandlersEndIdx should be the last handler line (resetTest)
  // But we need to find where the handlers block ends - it's followed by a newline or the calc logic
  // Let's find the line after all handlers
  let afterHandlersIdx = (oldHandlersEndIdx >= 0) ? oldHandlersEndIdx + 1 : -1;
  // Skip blank lines after handlers
  while (afterHandlersIdx > 0 && afterHandlersIdx < lines.length && lines[afterHandlersIdx].trim() === '') {
    afterHandlersIdx++;
  }

  // Build new content by slicing
  // Part 1: Everything before the old state block
  // Part 2: New state block
  // Part 3: Continue from after testSteps line until old handlers start
  // Part 4: New handlers
  // Part 5: Continue from after old handlers until test JSX line
  // Part 6: New test JSX (minified from working structure)
  // Part 7: Close the file properly

  if (activeTabLineIdx < 0 || testStepsLineIdx < 0 || oldHandlerLineIdx < 0 || testJSXLineIdx < 0) {
    console.log(`  ${f}: MISSING REQUIRED STRUCTURE, skipping`);
    continue;
  }

  // Part 1: before state
  const part1Lines = lines.slice(0, activeTabLineIdx);
  // + import CheckCircle etc if needed

  // Part 2: new state
  // We need to insert new state block AFTER all existing state declarations but before testSteps
  // Actually, let's find the old `const [activeTab` line and replace everything from there to the testSteps line
  const part1End = activeTabLineIdx;
  const part2Start = testStepsLineIdx;

  // Part 3: the testSteps content (the array literal right after "const testSteps=")
  // In compressed files, testSteps is: `const testSteps=[{testEquation:'...',testHint:'...'},...];`
  // We need to extract the array content
  let testStepsContent = '';
  let testStepsEndLine = testStepsLineIdx;
  // Find the line with ]; that closes testSteps
  for (let i = testStepsLineIdx; i < lines.length; i++) {
    testStepsContent += lines[i];
    if (lines[i].includes('];') && !lines[i].includes('testSteps=[') && i > testStepsLineIdx) {
      testStepsEndLine = i;
      break;
    }
  }
  // Extract just the content after "const testSteps="
  testStepsContent = testStepsContent.replace(/^\s*const testSteps=/, '');

  // Part 4: lines between testSteps end and old handlers
  const part4Lines = lines.slice(testStepsEndLine + 1, oldHandlerLineIdx);

  // Part 5: skip old handlers, go to after them
  // Find line after last handler
  let afterResetTest = -1;
  for (let i = oldHandlerLineIdx; i < lines.length; i++) {
    if (lines[i].includes('const resetTest=')) {
      afterResetTest = i + 1;
      break;
    }
  }
  
  // Part 6: lines between old handlers and test JSX line
  const part6Lines = lines.slice(afterResetTest >= 0 ? afterResetTest : oldHandlerLineIdx + 1, testJSXLineIdx);

  // Part 7: NEW test JSX - minified from correct structure
  // Extract the test tab JSX from ForceMomentum and minify it
  // Find the test tab section in ForceMomentum
  let fmTestStart = -1;
  let fmTestEnd = -1;
  for (let i = 0; i < fmLines.length; i++) {
    if (fmLines[i].includes('<div className="flex-1 overflow-y-auto p-4 lg:p-6">') && fmLines[i].includes('>') && !fmLines[i].includes('</>')) {
      // This could be in the test tab section
      // Check if it's after `) : (`
      let foundTernary = false;
      for (let j = Math.max(0, i-3); j < i; j++) {
        if (fmLines[j].includes(') : (')) foundTernary = true;
        if (fmLines[j].includes('/* ═══════════════════ TEST TAB ═══════════════════ */')) foundTernary = true;
      }
      if (foundTernary) {
        fmTestStart = i;
        break;
      }
    }
  }

  // Find the end of test tab in ForceMomentum
  // The test tab ends at ` )}` (closing activeTab ternary), then `</div>` (main wrapper), then `);`
  if (fmTestStart >= 0) {
    // Collect all lines from fmTestStart to the end of the test tab
    // The test tab in ForceMomentum ends at a specific pattern
    // We want: everything between `):` and `)}` for activeTab ternary
    // Let's collect from test start until we find ourselves at `)}` that closes the activeTab ternary
    
    // Actually, we need the ENTIRE test tab JSX as a block that can replace the compressed file's test JSX line
    // The test tab in ForceMomentum spans multiple lines. We need to minify it.
    
    let fmTestLines = [];
    let depth = 0;
    let foundEnd = false;
    
    for (let i = fmTestStart; i < fmLines.length && !foundEnd; i++) {
      const line = fmLines[i];
      // Track depth by counting ( and { 
      // Actually, let's look for a line that is just `  )}`  which closes the activeTab ternary
      const trimmed = line.trim();
      
      // The activeTab ternary close is ` )}` (parentheses then brace)
      // But we need to make sure we've closed all inner structures first
      
      fmTestLines.push(line);
      
      // Check if this line contains `)}` for activeTab ternary close
      // The pattern is after test tab ends: `)}` then `</div>` then `);`
      if (trimmed.startsWith(')') && trimmed.endsWith('}') && i > fmTestStart + 3) {
        // Check if next line is `</div>` (main wrapper close)
        if (i + 1 < fmLines.length) {
          const nextTrimmed = fmLines[i + 1].trim();
          if (nextTrimmed.startsWith('</div>')) {
            foundEnd = true;
          }
        }
      }
    }
    
    const fmTestJSX = fmTestLines.join(' ');
    // Minify: replace multiple spaces with single space
    const minifiedTestJSX = fmTestJSX.replace(/\s+/g, ' ').replace(/\\s+</g, '<').replace(/>\\s+/g, '>').trim();
    
    console.log(`  ${f}: Extracted FM test JSX (${minifiedTestJSX.length} chars)`);
  }

  break; // TEMP: only process first file first
}
