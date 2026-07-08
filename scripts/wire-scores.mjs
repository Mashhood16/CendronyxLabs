import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const LABS_DIR = 'src/components';
const files = readdirSync(LABS_DIR)
  .filter(f => f.startsWith('Lab') && f.endsWith('.tsx'))
  .sort();

let updated = 0;
let skippedNoScore = 0;
let skippedAlready = 0;
let errors = [];

for (const file of files) {
  const filePath = join(LABS_DIR, file);
  let content = readFileSync(filePath, 'utf-8');

  // Skip if already has setLabScore call
  if (content.includes('setLabScore(')) {
    skippedAlready++;
    continue;
  }

  // Find checkAnswer pattern - look for functions that compute a score
  // Pattern 1: let score/correct = 0; ... score++ ... setFeedback(`Score: ${score}/...`)
  const scoreVarMatch = content.match(/let (score|correct)\s*=\s*0/i);
  
  // Pattern 2: assessmentStatus or feedbackType being set to 'correct' or 'incorrect'
  const assessmentMatch = content.match(/set(AssessmentStatus|FeedbackType|IsCorrect)\s*\(\s*(['"](?:correct|incorrect)['"]|true|false)/i);
  
  // Pattern 3: has setScore call already (different from setLabScore)
  const setScoreMatch = content.match(/setScore\s*\(/);
  
  if (!scoreVarMatch && !assessmentMatch && !setScoreMatch) {
    // Check if the file has a checkAnswer or checkAnswers function at all
    if (content.includes('checkAnswer') || content.includes('checkAnswers') || content.includes('checkAns')) {
      skippedNoScore++;
    }
    continue;
  }

  try {
    // Add import for useLab if not already there
    if (!content.includes("import { useLab } from '../store'") && !content.includes("import { useLab, ")) {
      const importLines = [...content.matchAll(/^import .+ from ['"].+['"];$/gm)];
      if (importLines.length > 0) {
        const lastImport = importLines[importLines.length - 1];
        const importEnd = lastImport.index + lastImport[0].length;
        content = content.slice(0, importEnd) + "\nimport { useLab } from '../store';" + content.slice(importEnd);
      }
    }

    // If setLabScore is already in useLab import but not destructured, add it
    if (content.includes("useLab } from '../store'") && !content.includes('setLabScore')) {
      // Add setLabScore to the destructuring
      content = content.replace(/const\s*\{\s*([^}]*)\s*\}\s*=\s*useLab\(\)/, (match, inner) => {
        if (inner.includes('setLabScore')) return match;
        return `const { ${inner.trim()}, setLabScore } = useLab()`;
      });
    } else if (!content.includes('useLab') && !content.includes("useLab } from '../store'")) {
      // Add useLab + setLabScore destructuring
      // Find the first component function body
      const funcMatch = content.match(/export default function Lab\w+\s*\(/);
      if (funcMatch) {
        // Find opening brace of function body
        let parenCount = 0;
        let bracePos = funcMatch.index + funcMatch[0].length;
        for (let i = bracePos; i < content.length; i++) {
          if (content[i] === '(') parenCount++;
          if (content[i] === ')') parenCount--;
          if (content[i] === '{' && parenCount === 0) {
            bracePos = i + 1;
            break;
          }
        }
        // Insert after the first line of the function body
        const afterBrace = content.slice(bracePos);
        const firstLineEnd = afterBrace.indexOf('\n') + 1;
        const insertPos = bracePos + firstLineEnd;
        content = content.slice(0, insertPos) + '  const { setLabScore } = useLab();\n' + content.slice(insertPos);
      }
    }

    // Now add setLabScore call - find the checkAnswer function that sets score
    // Look for patterns like `if (correct === N) setFeedback(...)` or `setFeedbackType('correct')`
    // We'll insert setLabScore right after the score-computing logic

    // Pattern: find lines that set feedback based on score
    const checkAnsMatches = [...content.matchAll(/checkAns(?:wer)?s?\s*\(\)\s*=>\s*\{/g)];
    
    for (const match of checkAnsMatches) {
      const fnBodyStart = match.index + match[0].length;
      const fnBody = content.slice(fnBodyStart);
      
      // Find the closing brace of the checkAnswer function by counting braces
      let braceCount = 1; // already inside the opening {
      let fnEnd = 0;
      for (let i = 0; i < fnBody.length && braceCount > 0; i++) {
        if (fnBody[i] === '{') braceCount++;
        if (fnBody[i] === '}') braceCount--;
        if (braceCount === 0) { fnEnd = i; break; }
      }
      
      if (fnEnd === 0) continue;
      
      // Check if setLabScore is already called inside this function
      const fnBodyContent = fnBody.slice(0, fnEnd);
      if (fnBodyContent.includes('setLabScore(')) continue;
      
      // Try to extract the score logic:
      // Look for patterns like: let score = 0; ... if (...) score++; ... if (score === N) setFeedback(...)
      const scoreCalc = fnBodyContent.match(/let\s+(score|correct)\s*=\s*0/i);
      
      if (scoreCalc) {
        const scoreVar = scoreCalc[1];
        // Find the maximum possible score by counting score++ or correct++ occurrences
        const increments = fnBodyContent.match(new RegExp(`${scoreVar}\\+\\+`, 'g'));
        const maxScore = increments ? increments.length : 1;
        
        // Add setLabScore call before the closing brace
        const insertAt = fnBodyStart + fnEnd;
        content = content.slice(0, insertAt) + `\n    setLabScore(${scoreVar}, ${maxScore});` + content.slice(insertAt);
      } else if (assessmentMatch) {
        // Simple pass/fail - score 100 if correct, 0 if incorrect
        // Find if/else blocks that set correct/incorrect
        if (fnBodyContent.includes("'correct'") || fnBodyContent.includes('true')) {
          // Add score tracking - try to add setLabScore at the end with a smart default
          const insertAt = fnBodyStart + fnEnd;
          content = content.slice(0, insertAt) + '\n    // Report score: 100 if correct, 0 if incorrect\n    setLabScore(feedbackType === \'correct\' ? 100 : 0, 100);' + content.slice(insertAt);
        }
      }
    }

    writeFileSync(filePath, content, 'utf-8');
    updated++;
    console.log(`✅ ${file}`);
  } catch (e) {
    errors.push(`${file}: ${e.message}`);
  }
}

console.log(`\n--- Done ---`);
console.log(`Updated: ${updated}, Skipped (no score logic): ${skippedNoScore}, Already had setLabScore: ${skippedAlready}, Errors: ${errors.length}`);
if (errors.length > 0) {
  console.log('\nErrors:');
  errors.forEach(e => console.log(`  ${e}`));
}
