const fs = require('fs');
let content = fs.readFileSync('src/routes/labRoutes.ts', 'utf8');

// Find all duplicate keys in moduleIdToComponent
const section = content.split('const moduleIdToComponent: Record<string, string> = {')[1].split('};')[0];
const keyRe = /'([a-z0-9_]+)':/g;
const seen = new Map();
let m;
while ((m = keyRe.exec(section)) !== null) {
  const key = m[1];
  const lineNum = section.substring(0, m.index).split('\n').length;
  if (seen.has(key)) {
    console.log('DUPLICATE: ' + key + ' at lines ' + seen.get(key) + ' and ' + lineNum);
  } else {
    seen.set(key, lineNum);
  }
}

// Remove the duplicate entries (keep the FIRST occurrence, remove the second)
const lines = content.split('\n');
const inMapping = { start: -1, end: -1 };
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const moduleIdToComponent')) inMapping.start = i;
  if (inMapping.start > 0 && lines[i].trim() === '};' && i > inMapping.start + 5) {
    inMapping.end = i;
    break;
  }
}

// Find and remove duplicate lines within the mapping section
const seenKeys = new Set();
const toRemove = new Set();
for (let i = inMapping.start; i <= inMapping.end; i++) {
  const keyMatch = lines[i].match(/'([a-z0-9_]+)':/);
  if (keyMatch) {
    if (seenKeys.has(keyMatch[1])) {
      toRemove.add(i);
      console.log('Removing duplicate line ' + (i+1) + ': ' + lines[i].trim());
    } else {
      seenKeys.add(keyMatch[1]);
    }
  }
}

const newLines = lines.filter((_, i) => !toRemove.has(i));
fs.writeFileSync('src/routes/labRoutes.ts', newLines.join('\n'));
console.log('Removed ' + toRemove.size + ' duplicate lines');

// Verify
const updated = fs.readFileSync('src/routes/labRoutes.ts', 'utf8');
const section2 = updated.split('const moduleIdToComponent: Record<string, string> = {')[1].split('};')[0];
const keys2 = [...section2.matchAll(/'([a-z0-9_]+)':/g)].map(m => m[1]);
const uniqueKeys = new Set(keys2);
console.log('Total entries: ' + keys2.length + ', Unique: ' + uniqueKeys.size);
if (keys2.length !== uniqueKeys.size) {
  console.log('WARNING: Still have duplicates!');
}
