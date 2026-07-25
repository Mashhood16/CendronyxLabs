import { readFileSync, writeFileSync } from 'fs';

// Read ForceMomentum
const fm = readFileSync('src/components/labs/class9/physics/LabP9DerivationForceMomentum.tsx', 'utf-8');
const fmLines = fm.split('\n');

// Find the test tab section: from `) : (` or TEST TAB comment
// to the END of the test tab content (before `)}` that closes activeTab ternary)
let testStartIdx = -1;
for (let i = 0; i < fmLines.length; i++) {
  const line = fmLines[i].trim();
  if (line.includes(') : (') || line.includes('TEST TAB')) {
    testStartIdx = i;
    break;
  }
}

// Find the ELSE branch opening after `:`
// The line after `) : (` or TEST TAB should be ` <div className="flex-1...">`
let elseBranchIdx = -1;
for (let i = testStartIdx; i < fmLines.length; i++) {
  if (fmLines[i].includes('flex-1 overflow-y-auto')) {
    elseBranchIdx = i;
    break;
  }
}

// Find the end: look for `)}` followed by `</div>` followed by `);`
// This pattern only occurs at the end of the activeTab ternary  
let ternaryCloseIdx = -1;
let mainWrapperCloseIdx = -1;
for (let i = elseBranchIdx; i < fmLines.length; i++) {
  const t = fmLines[i].trim();
  // Look for `)}` (closes ternary + JSX)
  if (t.startsWith(')') && t.endsWith('}')) {
    // Check that next non-empty line is `</div>`
    let foundDiv = false;
    for (let j = i + 1; j < fmLines.length; j++) {
      const nt = fmLines[j].trim();
      if (nt === '') continue;
      if (nt.startsWith('</div>')) {
        foundDiv = true;
        mainWrapperCloseIdx = j;
        // Check that the one after that is `);`
        for (let k = j + 1; k < fmLines.length; k++) {
          const nt2 = fmLines[k].trim();
          if (nt2 === '') continue;
          if (nt2 === ');' || nt2.startsWith(');')) {
            ternaryCloseIdx = i;
            break;
          }
          break;
        }
        break;
      }
      break; // Not a </div> 
    }
    if (ternaryCloseIdx > 0) break;
  }
}

if (elseBranchIdx < 0 || ternaryCloseIdx < 0) {
  console.error(`Extraction failed: elseStart=${elseBranchIdx}, ternaryEnd=${ternaryCloseIdx}`);
  process.exit(1);
}

// Extract the test tab JSX (from elseBranchIdx to ternaryCloseIdx - 1, i.e., everything before the `)}` line)
const testJSXLines = fmLines.slice(elseBranchIdx, ternaryCloseIdx);

// Minify to a single line
let testJSX = testJSXLines
  .map(l => l.trim())
  .filter(l => l.length > 0 && !l.startsWith('/*') && !l.startsWith('*'))
  .join('')
  .replace(/>\s+</g, '><')
  .replace(/\s{2,}/g, ' ')
  .trim();

console.log(`Test JSX extracted: ${testJSX.length} chars`);
console.log(`  Starts with: ${JSON.stringify(testJSX.substring(0, 60))}`);
console.log(`  Ends with:   ${JSON.stringify(testJSX.substring(testJSX.length - 80))}`);

// Count divs in the minified test JSX alone
const testOpens = (testJSX.match(/<div[^a-zA-Z]/g)||[]).length;
const testCloses = (testJSX.match(/<\/div>/g)||[]).length;
console.log(`  Test JSX divs: opens=${testOpens} closes=${testCloses} diff=${testOpens-testCloses}`);

// The correct file ending after the test JSX line:
// )}   ← closes activeTab ternary + JSX expression
// </div> ← closes main wrapper
// );   ← closes return
// }    ← closes function
const CORRECT_ENDING = ')}</div>);\n}';

// Now fix each compressed file
const files = ['Recoil','Orbital','LiquidPressure','Hydraulic','KE','GPE'];

for (const f of files) {
  const path = 'src/components/labs/class9/physics/LabP9Derivation'+f+'.tsx';
  let c = readFileSync(path, 'utf-8');
  const nl = c.includes('\r\n') ? '\r\n' : '\n';
  
  // Find the test JSX line
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
  const ternaryMarkerIdx = testLine.indexOf('</>:');
  if (ternaryMarkerIdx < 0) {
    console.log(f+': </>: marker not found');
    continue;
  }
  
  // Build the new line: everything up to and including </>: + the minified test JSX
  const prefix = testLine.substring(0, ternaryMarkerIdx + 4); // includes </>:
  const newLine = prefix + testJSX;
  
  // Everything before the test line
  const before = lines.slice(0, testLineIdx).join(nl);
  
  const result = before + nl + newLine + nl + CORRECT_ENDING + nl;
  writeFileSync(path, result, 'utf-8');
  
  // Final div count
  const opens = (result.match(/<div[^a-zA-Z]/g)||[]).length;
  const closes = (result.match(/<\/div>/g)||[]).length;
  console.log(`${f}: div diff=${opens-closes} (opens=${opens} closes=${closes})`);
}
