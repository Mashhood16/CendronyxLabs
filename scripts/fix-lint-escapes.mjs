/**
 * Bulk fix script: parses full-eslint.txt for exact error locations
 * and applies fixes for no-useless-escape, no-shadow-restricted-names, no-empty
 */
import { readFileSync, writeFileSync } from 'fs';

// Parse eslint output
function getEslintErrors() {
  const output = readFileSync('full-eslint.txt', 'utf8');
  const errors = [];
  let currentFile = '';
  
  for (const line of output.split('\n')) {
    if (line.match(/^[A-Z]:\\/)) {
      currentFile = line;
      continue;
    }
    const m = line.match(/^\s+(\d+):(\d+)\s+error\s+([\s\S]+?)\s+([\w\-/]+)\s*$/);
    if (m && currentFile) {
      errors.push({
        file: currentFile,
        line: parseInt(m[1]),
        col: parseInt(m[2]),
        message: m[3].trim(),
        rule: m[4]
      });
    }
  }
  return errors;
}

console.log('Parsing eslint output...');
const allErrors = getEslintErrors();
console.log(`Found ${allErrors.length} errors`);

// Group by file+rule
const fileRuleMap = {};
for (const err of allErrors) {
  if (!fileRuleMap[err.file]) fileRuleMap[err.file] = {};
  if (!fileRuleMap[err.file][err.rule]) fileRuleMap[err.file][err.rule] = [];
  fileRuleMap[err.file][err.rule].push(err);
}

let totalFixed = 0;

// Fix no-useless-escape: remove backslash at exact column
console.log('\n--- Fixing no-useless-escape ---');
let escCount = 0;
for (const [file, rules] of Object.entries(fileRuleMap)) {
  if (!rules['no-useless-escape']) continue;
  try {
    let content = readFileSync(file, 'utf8');
    const lines = content.split('\n');
    let changed = false;
    for (const err of rules['no-useless-escape']) {
      const lineIdx = err.line - 1;
      const colIdx = err.col - 1;
      if (lineIdx < lines.length) {
        const line = lines[lineIdx];
        if (colIdx < line.length && line[colIdx] === '\\') {
          lines[lineIdx] = line.slice(0, colIdx) + line.slice(colIdx + 1);
          changed = true;
          escCount++;
        }
      }
    }
    if (changed) {
      writeFileSync(file, lines.join('\n'));
    }
  } catch (e) { /* skip */ }
}
console.log(`Fixed ${escCount} useless escapes`);
totalFixed += escCount;

// Fix no-shadow-restricted-names
console.log('\n--- Fixing no-shadow-restricted-names ---');
let shadowCount = 0;
for (const [file, rules] of Object.entries(fileRuleMap)) {
  if (!rules['no-shadow-restricted-names']) continue;
  try {
    let content = readFileSync(file, 'utf8');
    const lines = content.split('\n');
    let changed = false;
    for (const err of rules['no-shadow-restricted-names']) {
      const lineIdx = err.line - 1;
      const varMatch = err.message.match(/'(\w+)'/);
      if (varMatch && lineIdx < lines.length) {
        const varName = varMatch[1];
        lines[lineIdx] = lines[lineIdx].replace(new RegExp('\\b' + varName + '\\b'), varName + '_');
        changed = true;
        shadowCount++;
      }
    }
    if (changed) {
      writeFileSync(file, lines.join('\n'));
    }
  } catch (e) { /* skip */ }
}
console.log(`Fixed ${shadowCount} shadow restrictions`);
totalFixed += shadowCount;

// Fix no-empty: add comment to empty blocks
console.log('\n--- Fixing no-empty ---');
let emptyCount = 0;
for (const [file, rules] of Object.entries(fileRuleMap)) {
  if (!rules['no-empty']) continue;
  try {
    let content = readFileSync(file, 'utf8');
    const lines = content.split('\n');
    let changed = false;
    for (const err of rules['no-empty']) {
      const lineIdx = err.line - 1;
      if (lineIdx < lines.length && lines[lineIdx].match(/\{\s*\}/)) {
        lines[lineIdx] = lines[lineIdx].replace('{}', '{ /* intentionally empty */ }');
        changed = true;
        emptyCount++;
      }
    }
    if (changed) {
      writeFileSync(file, lines.join('\n'));
    }
  } catch (e) { /* skip */ }
}
console.log(`Fixed ${emptyCount} empty blocks`);
totalFixed += emptyCount;

console.log(`\nTotal fixed: ${totalFixed}`);
