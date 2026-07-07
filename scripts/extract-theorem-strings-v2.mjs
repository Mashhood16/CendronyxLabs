/**
 * Improved script to extract theorem translatable strings.
 * Handles escaped quotes, multiline strings, and complex source patterns.
 * 
 * Run: node scripts/extract-theorem-strings-v2.mjs
 */
import { readFileSync, writeFileSync } from 'fs';

const FILES = [
  { path: 'src/data/class9Theorems.tsx' },
  { path: 'src/data/class10Theorems.tsx' },
  { path: 'src/data/class11Theorems.tsx' },
  { path: 'src/data/class12Theorems.tsx' },
];

/**
 * Extract a JS string value from source text starting at a given position.
 * Handles both single-quoted and double-quoted strings with proper escaping.
 */
function extractJSString(text, startPos, quoteChar = '"') {
  let result = '';
  let i = startPos;
  while (i < text.length) {
    const ch = text[i];
    if (ch === '\\') {
      result += text[i] + (text[i + 1] || '');
      i += 2;
    } else if (ch === quoteChar) {
      return { value: result, endPos: i };
    } else {
      result += ch;
      i++;
    }
  }
  return { value: result, endPos: text.length };
}

function extractAllTranslations(content) {
  const entries = {};
  
  // First, find all theoremKey strings
  const keyPattern = /theoremKey:\s*'([^']+)'/g;
  let keyMatch;
  const theoremKeys = [];
  while ((keyMatch = keyPattern.exec(content)) !== null) {
    theoremKeys.push({ key: keyMatch[1], index: keyMatch.index });
  }

  // Also find theorem configs without theoremKey (like product_log)
  // Look for patterns like: word_key: {\n  title: "...
  // We'll use the theoremKey matches as anchors
  if (theoremKeys.length === 0) {
    console.log('No theorem keys found!');
    return entries;
  }

  for (let tkIdx = 0; tkIdx < theoremKeys.length; tkIdx++) {
    const { key } = theoremKeys[tkIdx];
    const startIdx = theoremKeys[tkIdx].index;
    const endIdx = tkIdx < theoremKeys.length - 1 
      ? theoremKeys[tkIdx + 1].index 
      : content.length;
    
    const chunk = content.substring(startIdx, endIdx);
    
    // Extract various fields using careful string extraction
    
    // Helper: find a field value
    function getFieldValue(fieldName) {
      const fieldRegex = new RegExp(fieldName + ':\\s*"', 'g');
      const match = fieldRegex.exec(chunk);
      if (match) {
        const result = extractJSString(chunk, match.index + match[0].length, '"');
        // Unescape common sequences
        return result.value.replace(/\\\\/g, '\\').replace(/\\'/g, "'").replace(/\\"/g, '"');
      }
      // Try single-quoted version
      const fieldRegex2 = new RegExp(fieldName + ":\\s*'", 'g');
      const match2 = fieldRegex2.exec(chunk);
      if (match2) {
        const result = extractJSString(chunk, match2.index + match2[0].length, "'");
        return result.value.replace(/\\\\/g, '\\').replace(/\\'/g, "'").replace(/\\"/g, '"');
      }
      return null;
    }
    
    // Get all occurrences of a field (for steps)
    function getAllFieldValues(fieldName) {
      const values = [];
      const regex = new RegExp(fieldName + ':\\s*"', 'g');
      let m;
      while ((m = regex.exec(chunk)) !== null) {
        const result = extractJSString(chunk, m.index + m[0].length, '"');
        values.push(result.value.replace(/\\\\/g, '\\').replace(/\\'/g, "'").replace(/\\"/g, '"'));
      }
      // Try single-quoted
      if (values.length === 0) {
        const regex2 = new RegExp(fieldName + ":\\s*'", 'g');
        let m2;
        while ((m2 = regex2.exec(chunk)) !== null) {
          const result = extractJSString(chunk, m2.index + m2[0].length, "'");
          values.push(result.value.replace(/\\\\/g, '\\').replace(/\\'/g, "'").replace(/\\"/g, '"'));
        }
      }
      return values;
    }
    
    // Title
    const title = getFieldValue('title');
    if (title) entries[`theorem.${key}.title`] = title;
    
    // finalFormulaDesc
    const ffd = getFieldValue('finalFormulaDesc');
    if (ffd) entries[`theorem.${key}.finalFormulaDesc`] = ffd;
    
    // keyInsight
    const ki = getFieldValue('keyInsight');
    if (ki) entries[`theorem.${key}.keyInsight`] = ki;
    
    // Step labels
    const labels = getAllFieldValues('label');
    labels.forEach((label, i) => {
      entries[`theorem.${key}.step${i+1}_label`] = label;
    });
    
    // Step details
    const details = getAllFieldValues('detail');
    details.forEach((detail, i) => {
      entries[`theorem.${key}.step${i+1}_detail`] = detail;
    });
    
    // Practice question
    const question = getFieldValue('question');
    if (question) entries[`theorem.${key}.practice_question`] = question;
    
    // Practice hint
    const hint = getFieldValue('hint');
    if (hint) entries[`theorem.${key}.practice_hint`] = hint;
    
    // Practice explanation
    const explanation = getFieldValue('explanation');
    if (explanation) entries[`theorem.${key}.practice_explanation`] = explanation;
    
    // Practice errorHint
    const errorHint = getFieldValue('errorHint');
    if (errorHint) entries[`theorem.${key}.practice_errorHint`] = errorHint;
  }
  
  return entries;
}

const allEntries = {};

for (const { path } of FILES) {
  const content = readFileSync(path, 'utf8');
  const entries = extractAllTranslations(content);
  Object.assign(allEntries, entries);
  const theoremCount = new Set(Object.keys(entries).map(k => k.split('.').slice(1, -2).join('.')));
  console.log(`${path}: ${theoremCount.size} theorems processed`);
}

// Write English translations
const englishPath = 'src/locales/en/theorem-translations-v2.json';
writeFileSync(englishPath, JSON.stringify(allEntries, null, 2), 'utf8');
console.log(`\n✓ Wrote ${Object.keys(allEntries).length} English translation entries to ${englishPath}`);

// Summary
const theoremsByClass = {};
for (const key of Object.keys(allEntries)) {
  const cls = key.split('.')[1];
  const theoremId = key.split('.').slice(1, -1).join('.');
  if (!theoremsByClass[cls]) theoremsByClass[cls] = new Set();
  theoremsByClass[cls].add(theoremId);
}

console.log('\n=== Summary ===');
let totalTheorems = 0;
for (const [cls, theorems] of Object.entries(theoremsByClass)) {
  console.log(`${cls}: ${theorems.size} theorems`);
  totalTheorems += theorems.size;
}
console.log(`Total unique theorems: ${totalTheorems}`);
console.log(`Total translation keys: ${Object.keys(allEntries).length}`);
