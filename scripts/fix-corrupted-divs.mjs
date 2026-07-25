import { readFileSync, writeFileSync } from 'fs';

const files = ['Recoil','Orbital','LiquidPressure','Hydraulic','KE','GPE'];

for (const f of files) {
  const path = 'src/components/labs/class9/physics/LabP9Derivation'+f+'.tsx';
  let c = readFileSync(path, 'utf-8');
  const nl = c.includes('\r\n') ? '\r\n' : '\n';
  const lines = c.split(nl);
  
  // Find the test JSX line (contains `</>:<div className="flex-1 overflow-y-auto`)
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
  
  // Find the test JSX content (after `</>:`)
  const markerIdx = testLine.indexOf('</>:');
  if (markerIdx < 0) {
    console.log(f+': </>: marker not found, skipping');
    continue;
  }
  
  // Count divs in the test JSX portion only
  const jsxContent = testLine.substring(markerIdx + 4); // after `</>:`
  
  // Count <div followed by non-letter (space, >, etc.)
  const opens = (jsxContent.match(/<div[^a-zA-Z]/g)||[]).length;
  const closes = (jsxContent.match(/<\/div>/g)||[]).length;
  const diff = opens - closes;
  
  console.log(f+': test JSX has opens='+opens+' closes='+closes+' diff='+diff);
  
  if (diff > 0) {
    // Add diff number of </div> tags to balance
    const fixedLine = testLine + '</div>'.repeat(diff);
    lines[testLineIdx] = fixedLine;
    c = lines.join(nl);
    writeFileSync(path, c, 'utf-8');
    console.log('  -> Added '+diff+' closing </div> tags');
  } else if (diff < 0) {
    console.log('  -> File has MORE closes than opens (diff='+diff+'), unexpected');
  } else {
    console.log('  -> Already balanced!');
  }
}
