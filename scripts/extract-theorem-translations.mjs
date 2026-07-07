/**
 * Script to extract all theorem translatable strings from theorem data files
 * and generate English translation JSON entries.
 * 
 * Run: node scripts/extract-theorem-translations.mjs
 */
import { readFileSync, writeFileSync } from 'fs';

const FILES = [
  { path: 'src/data/class9Theorems.tsx', exportName: 'CLASS9_THEOREMS' },
  { path: 'src/data/class10Theorems.tsx', exportName: 'CLASS10_THEOREMS' },
  { path: 'src/data/class11Theorems.tsx', exportName: 'CLASS11_THEOREMS' },
  { path: 'src/data/class12Theorems.tsx', exportName: 'CLASS12_THEOREMS' },
];

/**
 * A simple heuristic extraction that reads the theoremConfig objects.
 * We parse a simplified structure to extract the fields.
 */
function extractStrings(content) {
  const entries = {};
  
  // Match theoremKey lines to find theorem boundaries
  // theoremKey: 'classX.theoremName',
  const keyRegex = /theoremKey:\s*'([^']+)'/g;
  let keyMatch;
  const theoremKeys = [];
  while ((keyMatch = keyRegex.exec(content)) !== null) {
    theoremKeys.push({ key: keyMatch[1], index: keyMatch.index });
  }

  // Now for each theorem key, extract the fields
  for (const { key, index } of theoremKeys) {
    // Find the opening brace of this theorem config
    const prefix = key.split('.')[0]; // e.g. 'class9'
    const theoremName = key.split('.').slice(1).join('.');
    
    // Find the content between theoremKey and the next theoremKey or closing "};"
    const nextKeyIndex = theoremKeys.find(tk => tk.index > index)?.index || content.length;
    const theoremContent = content.substring(index, nextKeyIndex);
    
    // Extract fields
    const fields = {};
    
    // title (string field)
    const titleMatch = theoremContent.match(/title:\s*"([^"]*)"/);
    if (titleMatch) fields.title = titleMatch[1];

    // title with single quotes
    const titleMatch2 = theoremContent.match(/title:\s*'([^']*)'/);
    if (titleMatch2 && !titleMatch) fields.title = titleMatch2[1];
    
    // finalFormulaDesc
    const ffdMatch = theoremContent.match(/finalFormulaDesc:\s*"([^"]*)"/);
    if (ffdMatch) fields.finalFormulaDesc = ffdMatch[1];
    const ffdMatch2 = theoremContent.match(/finalFormulaDesc:\s*'([^']*)'/);
    if (ffdMatch2 && !ffdMatch) fields.finalFormulaDesc = ffdMatch2[1];
    
    // keyInsight
    const kiMatch = theoremContent.match(/keyInsight:\s*"((?:[^"\\]|\\.)*)"/);
    if (kiMatch) fields.keyInsight = kiMatch[1];
    const kiMatch2 = theoremContent.match(/keyInsight:\s*'((?:[^'\\]|\\.)*)'/);
    if (kiMatch2 && !kiMatch) fields.keyInsight = kiMatch2[1];
    
    // Steps
    const stepRegex = /{[\s\n]*label:\s*"((?:[^"\\]|\\.)*)"/g;
    let stepMatch;
    let stepIndex = 1;
    while ((stepMatch = stepRegex.exec(theoremContent)) !== null) {
      fields[`step${stepIndex}_label`] = stepMatch[1];
      stepIndex++;
    }

    // Step details
    const detailRegex = /detail:\s*"((?:[^"\\]|\\.)*)"/g;
    let detailMatch;
    let detailIndex = 1;
    while ((detailMatch = detailRegex.exec(theoremContent)) !== null) {
      fields[`step${detailIndex}_detail`] = detailMatch[1];
      detailIndex++;
    }
    
    // Practice
    const pqMatch = theoremContent.match(/question:\s*"((?:[^"\\]|\\.)*)"/);
    if (pqMatch) fields.practice_question = pqMatch[1];
    
    const phMatch = theoremContent.match(/hint:\s*"((?:[^"\\]|\\.)*)"/);
    if (phMatch) fields.practice_hint = phMatch[1];
    
    const peMatch = theoremContent.match(/explanation:\s*"((?:[^"\\]|\\.)*)"/);
    if (peMatch) fields.practice_explanation = peMatch[1];
    
    const pehMatch = theoremContent.match(/errorHint:\s*"((?:[^"\\]|\\.)*)"/);
    if (pehMatch) fields.practice_errorHint = pehMatch[1];
    
    // Store
    entries[key] = fields;
  }
  
  return entries;
}

// Generate translation entries
const allEntries = {};

for (const { path } of FILES) {
  const content = readFileSync(path, 'utf8');
  const entries = extractStrings(content);
  
  // Convert to flat key-value pairs
  for (const [theoremKey, fields] of Object.entries(entries)) {
    for (const [field, value] of Object.entries(fields)) {
      const fullKey = `theorem.${theoremKey}.${field}`;
      allEntries[fullKey] = value;
    }
  }
  
  console.log(`✓ ${path}: Extracted ${Object.keys(entries).length} theorems, ${Object.keys(allEntries).length} total entries so far`);
}

// Write English translations
const englishPath = 'src/locales/en/theorem-translations-generated.json';
writeFileSync(englishPath, JSON.stringify(allEntries, null, 2), 'utf8');
console.log(`\n✓ Wrote ${Object.keys(allEntries).length} English translation entries to ${englishPath}`);

// Write Roman Urdu (same values for now - AI translation pass needed)
const urduPath = 'src/locales/roman-urdu/theorem-translations-generated.json';
writeFileSync(urduPath, JSON.stringify(allEntries, null, 2), 'utf8');
console.log(`✓ Wrote ${Object.keys(allEntries).length} Roman Urdu placeholder entries to ${urduPath}`);

// Also generate summary
console.log('\n=== Summary ===');
const theoremsByClass = {};
for (const key of Object.keys(allEntries)) {
  const cls = key.split('.')[1]; // theorem.class9.xxx.field -> class9
  if (!theoremsByClass[cls]) theoremsByClass[cls] = new Set();
  theoremsByClass[cls].add(key.split('.').slice(1, -1).join('.'));
}

for (const [cls, theorems] of Object.entries(theoremsByClass)) {
  console.log(`${cls}: ${theorems.size} theorems`);
}

const totalTheorems = new Set(Object.keys(allEntries).map(k => k.split('.').slice(1, -1).join('.')));
console.log(`Total unique theorems: ${totalTheorems.size}`);
console.log(`Total translation keys: ${Object.keys(allEntries).length}`);
