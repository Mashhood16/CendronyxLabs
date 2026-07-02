import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = join(__dirname, '..', 'src', 'components');

const files = readdirSync(srcDir)
  .filter(f => /LabP\d+Derivation.+\.tsx$/.test(f) && f !== 'LabP9Derivations.tsx')
  .map(f => join(srcDir, f));

let totalFixes = 0;

for (const filePath of files) {
  let content = readFileSync(filePath, 'utf-8');
  let original = content;

  // Fix remaining text-[10px] in practice problem hint areas (any color)
  content = content.replace(/text-\[10px\] text-/g, 'text-xs text-');
  
  // Fix remaining text-[10px] in other places
  content = content.replace(/text-\[10px\]/g, 'text-xs');

  if (content !== original) {
    writeFileSync(filePath, content, 'utf-8');
    totalFixes++;
    console.log(`Fixed ${filePath.split('/').pop()}`);
  }
}

console.log(`\nFixed ${totalFixes} files.`);
