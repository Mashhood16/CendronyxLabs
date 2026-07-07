/**
 * Script to add theoremKey to all theorem configs in class data files.
 * Run: node scripts/add-theorem-keys.mjs
 */
import { readFileSync, writeFileSync } from 'fs';

const FILES = [
  { path: 'src/data/class9Theorems.tsx', prefix: 'class9' },
  { path: 'src/data/class10Theorems.tsx', prefix: 'class10' },
  { path: 'src/data/class11Theorems.tsx', prefix: 'class11' },
  { path: 'src/data/class12Theorems.tsx', prefix: 'class12' },
];

for (const { path, prefix } of FILES) {
  let content = readFileSync(path, 'utf8');
  let modified = false;

  // Match theorem configs:  {theorem_id}: {\n  title:
  // We need to find lines like:  some_key: {
  // followed somewhere by title:
  // And inject theoremKey after the opening brace

  // Find all theorem key patterns
  // Theorem configs start with a word key followed by ": {" at the start of a line
  // They're inside a CLASS?_THEOREMS record

  // Strategy: Split by lines, find "exports.CLASS?" or "export const CLASS?" to get start,
  // then find all "theorem_key: {" patterns between there and the closing "};"
  const lines = content.split('\n');
  let inRecord = false;
  let recordStart = -1;
  const theoremLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect start of CLASS records
    if (/export\s+(const\s+)?CLASS\d+_THEOREMS/.test(line)) {
      inRecord = true;
      recordStart = i;
    }
    
    // Detect end of record (closing brace + semicolon for the record)
    if (inRecord && /^};$/.test(line.trim()) && i > recordStart + 2) {
      inRecord = false;
    }

    if (inRecord && i > recordStart + 1) {
      // Match lines like "  product_log: {" or "  some_key: {"
      const match = line.match(/^(\s*)(\w[\w_]*)(:\s*\{)\s*$/);
      if (match && !line.includes('CLASS') && !line.includes('export')) {
        theoremLines.push({ index: i, indent: match[1], key: match[2], open: match[3] });
      }
    }
  }

  // Process in reverse order so indices stay valid
  let changes = 0;
  for (const tl of theoremLines.reverse()) {
    const theoremKey = `${prefix}.${tl.key}`;
    const newLine = `${tl.indent}${tl.key}${tl.open}`;
    const theoremKeyLine = `${tl.indent}  theoremKey: '${theoremKey}',`;
    
    // Check if theoremKey already exists
    const nextLine = lines[tl.index + 1]?.trim();
    if (nextLine && nextLine.startsWith('theoremKey:')) {
      continue; // Already has theoremKey
    }

    lines.splice(tl.index + 1, 0, theoremKeyLine);
    changes++;
  }

  if (changes > 0) {
    writeFileSync(path, lines.join('\n'), 'utf8');
    console.log(`✓ ${path}: Added ${changes} theoremKey entries`);
  } else {
    console.log(`✓ ${path}: No changes needed (${teoremsExist(path) ? 'keys already exist' : 'no theorems found'})`);
  }
}

function teoremsExist(path) {
  return readFileSync(path, 'utf8').includes('theoremKey:');
}
