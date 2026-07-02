import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = join(__dirname, '..', 'src', 'components');

// Get all derivation lab files
const files = readdirSync(srcDir)
  .filter(f => /LabP\d+Derivation.+\.tsx$/.test(f) && f !== 'LabP9Derivations.tsx')
  .map(f => join(srcDir, f));

console.log(`Found ${files.length} derivation lab files to fix.`);

let totalFixes = 0;

for (const filePath of files) {
  let content = readFileSync(filePath, 'utf-8');
  let original = content;
  
  // 1. Fix formula text in derivation steps: text-xs → text-base
  content = content.replace(/className="text-xs font-mono font-bold text-yellow-400"/g, 'className="text-base font-mono font-bold text-yellow-400"');
  
  // 2. Fix derivation trace labels: text-[10px] → text-xs
  content = content.replace(/className="text-\[10px\] text-slate-500 font-semibold uppercase/g, 'className="text-xs text-slate-500 font-semibold uppercase');
  
  // 3. Fix derivation trace heading pattern
  content = content.replace(/text-\[10px\] text-slate-500 font-semibold uppercase tracking-wider/g, 'text-xs text-slate-500 font-semibold uppercase tracking-wider');
  
  // 4. Fix derivation trace values: text-[11px] → text-sm
  content = content.replace(/text-\[11px\]/g, 'text-sm');
  
  // 5. Fix final formulas that are too small (text-sm → text-xl in formula cards)
  content = content.replace(
    /className="text-sm font-bold font-mono text-white mt-1">([^<]+)<\/p>/g,
    'className="text-xl font-bold font-mono text-white mt-1">$1</p>'
  );
  
  // 6. Fix detail text in steps: text-xs → text-sm for better readability
  content = content.replace(
    /<p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed px-1">/g,
    '<p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-1">'
  );
  
  // 7. Fix key insight text: text-xs → text-sm
  content = content.replace(
    /<p className="text-xs text-amber-700 dark:text-amber-300 mt-1">/g,
    '<p className="text-sm text-amber-700 dark:text-amber-300 mt-1">'
  );
  
  // 8. Fix description text in simulators
  content = content.replace(
    /<p className="text-xs text-slate-500 mb-4">/g,
    '<p className="text-sm text-slate-500 mb-4">'
  );
  
  // 9. Fix label text in steps: font-bold text-sm → font-bold text-base
  content = content.replace(
    /<p className="font-bold text-sm text-([a-z]+)-800 dark:text-\1-300">/g,
    '<p className="font-bold text-base text-$1-800 dark:text-$1-300">'
  );
  
  // 10. Fix key insight title: font-bold text-sm → font-bold text-base
  content = content.replace(
    /<p className="font-bold text-sm text-amber-700 dark:text-amber-300">/g,
    '<p className="font-bold text-base text-amber-700 dark:text-amber-300">'
  );
  
  // 11. Fix assessment and problem text: text-sm → text-base
  content = content.replace(
    /<p className="text-sm font-medium mb-2">/g,
    '<p className="text-base font-medium mb-2">'
  );
  content = content.replace(
    /<p className="text-sm font-medium">/g,
    '<p className="text-base font-medium">'
  );
  
  if (content !== original) {
    writeFileSync(filePath, content, 'utf-8');
    const diffs = countDiffs(original, content);
    totalFixes += diffs;
    console.log(`Fixed ${filePath.split('/').pop()} - ${diffs} changes`);
  }
}

function countDiffs(orig, mod) {
  const origLines = orig.split('\n');
  const modLines = mod.split('\n');
  let count = 0;
  for (let i = 0; i < Math.max(origLines.length, modLines.length); i++) {
    if (origLines[i] !== modLines[i]) count++;
  }
  return count;
}

console.log(`\nDone! Total files modified: ${files.length}, total changed lines: ${totalFixes}`);
