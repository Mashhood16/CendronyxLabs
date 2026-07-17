import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const LAB_DIR = 'src/components';
const files = readdirSync(LAB_DIR)
  .filter(f => /^Lab(B|C|CS|Ch|E|M|P|S)\d+.*\.tsx$/.test(f))
  .map(f => join(LAB_DIR, f));

let fixedCount = 0;

for (const file of files) {
  let content = readFileSync(file, 'utf-8');
  let original = content;

  // Remove orphaned responsive prefixes (left by previous buggy runs)
  content = content.replace(/\blg:\s+/g, '');
  content = content.replace(/\bmd:lg:\s+/g, '');

  // Remove standalone (non-responsive) min-h-[500px]
  content = content.replace(/(?<![-\w:])min-h-\[500px\]/g, '');

  // Clean up overflow- artifact
  content = content.replace(/overflow-\s+/g, '');

  // Clean double spaces
  content = content.replace(/  +/g, ' ');

  if (content !== original) {
    writeFileSync(file, content, 'utf-8');
    fixedCount++;
  }
}

console.log(`\n${fixedCount} files updated`);
