// Fix simulation sections only: replace centering with scroll in 3-column lab files
// Uses targeted patterns to avoid corrupting buttons, icons, and inner divs
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const LAB_DIR = 'src/components';
const files = [
  'LabE10AdverbsPrepositions.tsx',
  'LabE10ModalsConditionals.tsx',
  'LabE10VocabularyStylistics.tsx',
  'LabE11PhrasesClauses.tsx',
  'LabE11PrepositionsConjunctions.tsx',
  'LabE11TensesVerbals.tsx',
  'LabE11VerbsModals.tsx',
  'LabE11VocabularyStylistics.tsx',
  'LabE12NounsPronouns.tsx',
  'LabE12PhrasesClauses.tsx',
  'LabE12PrepositionsConjunctions.tsx',
  'LabE12SentenceStructure.tsx',
  'LabE12TensesVerbals.tsx',
  'LabE12VerbsModals.tsx',
  'LabE12VocabularyStylistics.tsx',
  'LabE9Narration.tsx',
  'LabE9PunctuationVocabulary.tsx',
  'LabE9SentenceStructure.tsx',
  'LabE9TensesAgreement.tsx',
];

let fixedCount = 0;

for (const file of files) {
  const path = join(LAB_DIR, file);
  let content = readFileSync(path, 'utf-8');
  const original = content;

  // Targeted pattern: only match simulation section className="...relative items-center justify-center p-8..."
  // The "relative" prefix and "p-8"/"p-4 md:p-8" suffix ensure we only hit simulation sections
  content = content.replace(
    'relative items-center justify-center p-8',
    'relative min-h-0 overflow-y-auto p-8'
  );

  // Also handle the p-4 md:p-8 variant
  content = content.replace(
    'relative items-center justify-center p-4 md:p-8',
    'relative min-h-0 overflow-y-auto p-4 md:p-8'
  );

  if (content !== original) {
    writeFileSync(path, content);
    console.log(`Fixed: ${file}`);
    fixedCount++;
  }
}

console.log(`\n✅ ${fixedCount} files fixed`);
