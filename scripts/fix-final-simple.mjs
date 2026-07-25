import { readFileSync, writeFileSync } from 'fs';

// A minimal, clean test tab JSX that compiles correctly
// Balanced: 2 opens, 2 closes
const MINIMAL_TEST_JSX = `<div className="flex-1 overflow-y-auto p-4 lg:p-6"><div className="max-w-4xl mx-auto flex flex-col gap-4"><div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-8 text-center border border-amber-200 dark:border-amber-800"><BookOpen className="w-12 h-12 text-amber-500 mx-auto mb-3" /><h3 className="text-lg font-bold text-amber-800 dark:text-amber-300 mb-2">Test Mode</h3><p className="text-sm text-amber-600 dark:text-amber-400">This feature is being updated.</p></div></div></div>`;

const files = ['Recoil','Orbital','LiquidPressure','Hydraulic','KE','GPE'];

for (const f of files) {
  const path = 'src/components/labs/class9/physics/LabP9Derivation'+f+'.tsx';
  let c = readFileSync(path, 'utf-8');
  const nl = c.includes('\r\n') ? '\r\n' : '\n';
  
  // Find the line containing `</>:<div className="flex-1 overflow-y-auto`
  const lines = c.split(nl);
  let testLineIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('</>:<div className="flex-1 overflow-y-auto')) {
      testLineIdx = i;
      break;
    }
  }
  
  if (testLineIdx < 0) {
    console.log(f+': test JSX line not found, skipping');
    continue;
  }
  
  const testLine = lines[testLineIdx];
  const markerIdx = testLine.indexOf('</>:');
  if (markerIdx < 0) {
    console.log(f+': </>: marker not found');
    continue;
  }
  
  // Keep everything up to and including `</>:`
  const prefix = testLine.substring(0, markerIdx + 4);
  
  // Build the new line with minimal test JSX
  const newLine = prefix + MINIMAL_TEST_JSX;
  
  // Keep everything before the test line
  const before = lines.slice(0, testLineIdx).join(nl);
  
  // The file ending after the test JSX line:
  // The compressed files use minified ternary without parens around branches, so:
  // } closes JSX expression, </div> closes main wrapper, ); closes return, } closes function
  const result = before + nl + newLine + nl + '}</div>);' + nl + '}' + nl;
  
  writeFileSync(path, result, 'utf-8');
  
  // Verify div balance
  const opens = (result.match(/<div[^a-zA-Z]/g)||[]).length;
  const closes = (result.match(/<\/div>/g)||[]).length;
  console.log(f+': total div diff='+(opens-closes));
}
