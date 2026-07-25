import { readFileSync, writeFileSync } from 'fs';

const files = ['Recoil','Orbital','LiquidPressure','Hydraulic','KE','GPE'];

for (const f of files) {
  const path = 'src/components/labs/class9/physics/LabP9Derivation'+f+'.tsx';
  let c = readFileSync(path, 'utf-8');
  const nl = c.includes('\r\n') ? '\r\n' : '\n';
  
  const lines = c.split(nl);
  let testLineIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('</>:<div className="flex-1 overflow-y-auto')) {
      testLineIdx = i;
      break;
    }
  }
  
  if (testLineIdx < 0) {
    console.log(f+': test JSX line not found');
    continue;
  }
  
  const testLine = lines[testLineIdx];
  const endsWithClose = testLine.trimEnd().endsWith('</div>}');
  console.log(f+': test JSX line at idx '+testLineIdx+', ends with </div>}: '+endsWithClose);
  
  // Keep all lines up to and including testLineIdx
  const keepLines = lines.slice(0, testLineIdx + 1);
  // Remove carriage return from last line if present
  const lastLine = keepLines[keepLines.length - 1].replace(/\r$/, '');
  keepLines[keepLines.length - 1] = lastLine;
  // Add the correct ending: close return + close function
  keepLines.push(');');
  keepLines.push('}');
  
  const result = keepLines.join(nl) + nl;
  writeFileSync(path, result, 'utf-8');
  
  // Verify
  const opens = (result.match(/<div[^a-zA-Z]/g)||[]).length;
  const closes = (result.match(/<\/div>/g)||[]).length;
  console.log('  -> '+f+': total lines='+keepLines.length+', div diff='+(opens-closes));
}
