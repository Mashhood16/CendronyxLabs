import { readFileSync } from 'fs';

const t = readFileSync('full-eslint.txt', 'utf8');
const lines = t.split('\n');
const rules = {};
let total = 0;
for (const l of lines) {
  // Match rule names at end of error lines
  const m = l.match(/\s+(react-hooks\/\S+|@typescript-eslint\/\S+|no-useless-\S+|react-refresh\/\S+|prefer-const|no-case-declarations|no-shadow-restricted-names|no-empty)\s*$/);
  if (m && l.includes('error')) {
    rules[m[1]] = (rules[m[1]] || 0) + 1;
    total++;
  }
}
console.log('Error breakdown by rule:');
Object.entries(rules).sort((a, b) => b[1] - a[1]).forEach(([r, c]) => console.log(`${c}\t${r}`));
console.log(`Total categorized: ${total}`);

// Also get file counts
const fileErrors = {};
let currentFile = '';
for (const l of lines) {
  if (l.match(/^[A-Z]:\\/)) {
    const f = l.replace(/^.*[\\/]/, '');
    currentFile = f;
    continue;
  }
  if (l.includes('error') && currentFile) {
    fileErrors[currentFile] = (fileErrors[currentFile] || 0) + 1;
  }
}
console.log('\nFiles with most errors:');
Object.entries(fileErrors).sort((a, b) => b[1] - a[1]).slice(0, 20).forEach(([f, c]) => console.log(`${c}\t${f}`));
