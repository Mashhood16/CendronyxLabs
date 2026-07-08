import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const LABS_DIR = 'src/components';
const files = readdirSync(LABS_DIR)
  .filter(f => f.startsWith('Lab') && f.endsWith('.tsx'))
  .sort();

let fixed = 0;

for (const file of files) {
  const filePath = join(LABS_DIR, file);
  let content = readFileSync(filePath, 'utf-8');

  // Skip files that don't have the hardcoded feedbackType pattern
  if (!content.includes("setLabScore(feedbackType === 'correct' ? 100 : 0, 100)")) continue;

  // Detect the actual state variable name used for assessment
  const stateVarMatch = content.match(/set(AssessmentStatus|FeedbackType|IsCorrect|ResultStatus|AnswerStatus|CheckStatus)\s*\(/);
  
  if (!stateVarMatch) {
    console.log(`⚠️  ${file}: no state setter found, leaving as-is`);
    continue;
  }

  const setterName = stateVarMatch[1];
  const varName = setterName[0].toLowerCase() + setterName.slice(1);

  let replacement;
  if (varName === 'isCorrect') {
    replacement = `setLabScore(${varName} === true ? 100 : 0, 100)`;
  } else {
    replacement = `setLabScore(${varName} === 'correct' ? 100 : 0, 100)`;
  }

  const oldLine = "setLabScore(feedbackType === 'correct' ? 100 : 0, 100)";
  if (content.includes(oldLine)) {
    content = content.replace(oldLine, replacement);
    writeFileSync(filePath, content, 'utf-8');
    fixed++;
    console.log(`✅ ${file}: feedbackType → ${varName}`);
  }
}

console.log(`\nFixed: ${fixed} files`);
