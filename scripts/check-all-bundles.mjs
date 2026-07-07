import fs from 'fs';
import path from 'path';

const dir = 'dist/assets';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

console.log(`Found ${files.length} JS files in dist/assets/`);

for (const file of files) {
  const c = fs.readFileSync(path.join(dir, file), 'utf-8');
  
  // Search for common preprocessFormula markers
  const markers = ['f.replace(', '\\sqrt{$', '\\bsin\\b', 'preprocessFormula', 'let f = formula'];
  
  for (const marker of markers) {
    if (c.includes(marker)) {
      const idx = c.indexOf(marker);
      const end = Math.min(c.length, idx + 120);
      console.log(`\nFound '${marker}' in ${file} at ${idx}:`);
      console.log('  TEXT:', JSON.stringify(c.slice(idx, end)));
      
      // Check for backslash count - how many backslashes before sqrt?
      if (marker.includes('sqrt') || marker.includes('\\\\')) {
        const hexStart = Math.max(0, idx - 5);
        const hexEnd = Math.min(c.length, idx + 20);
        console.log('  HEX:', Buffer.from(c.slice(hexStart, hexEnd)).toString('hex'));
      }
      break;
    }
  }
}
