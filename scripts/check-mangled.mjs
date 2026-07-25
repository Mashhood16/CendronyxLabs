import { readFileSync } from 'fs';

const f = 'GPE';
const path = 'src/components/labs/class9/physics/LabP9Derivation'+f+'.tsx';
let c = readFileSync(path, 'utf-8');
const lines = c.split('\n');

// Find the test JSX line
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('</>:<div className="flex-1 overflow-y-auto')) {
    const line = lines[i];
    console.log('Line '+(i+1)+' length:', line.length);
    
    // Count backticks
    const backtickCount = (line.match(/`/g)||[]).length;
    console.log('Backtick count:', backtickCount, '(should be even)');
    
    // Count <div and </div>
    const opens = (line.match(/<div[^a-zA-Z]/g)||[]).length;
    const closes = (line.match(/<\/div>/g)||[]).length;
    console.log('Div opens:', opens, 'closes:', closes, 'diff:', opens-closes);
    
    // Show the suffix of the test JSX line (after </>:)
    const markerIdx = line.indexOf('</>:');
    if (markerIdx >= 0) {
      const jsxContent = line.substring(markerIdx + 4);
      console.log('JSX content ends with:', JSON.stringify(jsxContent.slice(-200)));
      
      // Check for template literals - find all `${` patterns
      const templateExprs = jsxContent.match(/\$\{/g);
      if (templateExprs) {
        console.log('Template expressions found:', templateExprs.length);
      }
      
      // Find where backticks are
      let btIdx = jsxContent.indexOf('`');
      if (btIdx >= 0) {
        console.log('First backtick context:', JSON.stringify(jsxContent.substring(Math.max(0,btIdx-20), btIdx+30)));
      }
    }
    break;
  }
}

// Also check overall div balance
const totalOpens = (c.match(/<div[^a-zA-Z]/g)||[]).length;
const totalCloses = (c.match(/<\/div>/g)||[]).length;
console.log('Total file: opens='+totalOpens+' closes='+totalCloses+' diff='+(totalOpens-totalCloses));
