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

// Determine the status variable name from the setter function
function getStatusVarName(setterName) {
  // setAssessmentStatus -> assessmentStatus
  // setFeedbackType -> feedbackType
  // setIsCorrect -> isCorrect
  if (setterName.startsWith('set')) {
    return setterName[3].toLowerCase() + setterName.slice(4);
  }
  return null;
}

for (const file of files) {
  const filePath = join(LABS_DIR, file);
  let content = readFileSync(filePath, 'utf-8');

  // Skip if already has setLabScore call (including in comments)
  if (content.includes('setLabScore(')) {
    skippedAlready++;
    continue;
  }

  // Find checkAnswer patterns
  const hasCheckAnswer = content.includes('checkAnswer') || content.includes('checkAnswers') || content.includes('checkAns');
  if (!hasCheckAnswer) continue;

  // Determine what pattern the lab uses for scoring
  // Pattern 1: let score = 0 or let correct = 0
  const scoreVarMatch = content.match(/let\s+(score|correct)\s*=\s*0/i);

  // Pattern 2: setAssessmentStatus('correct'), setFeedbackType('correct'), setIsCorrect(true)
  // Capture the setter function name
  const assessmentMatch = content.match(/set(AssessmentStatus|FeedbackType|IsCorrect)\s*\(\s*(['"]?(?:correct|incorrect)['"]?|true|false)/i);

  if (!scoreVarMatch && !assessmentMatch) {
    skippedNoScore++;
    continue;
  }

  try {
    // STEP 1: Add useLab import + destructuring if not already there
    if (!content.includes("import { useLab }")) {
      // Find the last import line
      const importLines = [...content.matchAll(/^import .+ from ['"].+['"];?$/gm)];
      if (importLines.length > 0) {
        const lastImport = importLines[importLines.length - 1];
        const importEnd = lastImport.index + lastImport[0].length;
        content = content.slice(0, importEnd) + "\nimport { useLab } from '../store';" + content.slice(importEnd);
      }
    }

    // Add setLabScore to useLab destructuring if present but not destructured
    if (content.includes("useLab } from '../store'") && !content.includes('setLabScore')) {
      content = content.replace(/const\s*\{\s*([^}]*)\s*\}\s*=\s*useLab\(\)/, (match, inner) => {
        if (inner.includes('setLabScore')) return match;
        return `const { ${inner.trim()}, setLabScore } = useLab()`;
      });
    } else if (content.includes("import { useLab }") && !content.includes("useLab } from '../store'")) {
      // Has import but no destructuring yet - find the component function and add it
      const funcStartMatch = content.match(/export default function Lab\w+\s*\([^)]*\)\s*\{/);
      if (funcStartMatch) {
        // Find the first line inside function body
        let parenCount = 0;
        let bracePos = funcStartMatch.index + funcStartMatch[0].length - 1; // point at {
        for (let i = bracePos + 1; i < content.length; i++) {
          if (content[i] === '\n') {
            bracePos = i + 1;
            break;
          }
        }
        if (bracePos > funcStartMatch.index) {
          // Check if there's already useLab call
          const afterFunction = content.slice(bracePos);
          if (!afterFunction.includes('useLab()')) {
            content = content.slice(0, bracePos) + 'const { setLabScore } = useLab();\n' + content.slice(bracePos);
          } else {
            // Add setLabScore to existing useLab destructuring
            content = content.replace(/const\s*\{\s*([^}]*)\s*\}\s*=\s*useLab\(\)/, (match, inner) => {
              if (inner.includes('setLabScore')) return match;
              return `const { ${inner.trim()}, setLabScore } = useLab()`;
            });
          }
        }
      }
    }

    // STEP 2: Add setLabScore call inside the checkAnswer function
    // Find lines that look like function definitions for checkAnswer
    const fnPatterns = [
      /const\s+(checkAnswer|checkAnswers)\s*=\s*\([^)]*\)\s*=>\s*\{/g,
      /const\s+(checkAns)\s*=\s*\([^)]*\)\s*=>\s*\{/g,
    ];

    let inserted = false;

    for (const pattern of fnPatterns) {
      if (inserted) break;
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const fnStart = match.index + match[0].length;
        // Find the closing brace of this function
        let braceCount = 1;
        let fnEnd = fnStart;
        let inString = false;
        let stringChar = null;
        let inTemplate = false;

        for (let i = fnStart; i < content.length && braceCount > 0; i++) {
          const ch = content[i];
          const prevCh = i > 0 ? content[i-1] : '';

          // Handle string literals to avoid counting braces inside strings
          if (!inTemplate && (ch === '"' || ch === "'" || ch === '`')) {
            if (!inString) {
              inString = true;
              stringChar = ch;
            } else if (ch === stringChar && prevCh !== '\\') {
              inString = false;
              stringChar = null;
            }
          } else if (ch === '`') {
            inTemplate = !inTemplate;
          }

          if (!inString && !inTemplate) {
            if (ch === '{') braceCount++;
            if (ch === '}') braceCount--;
          }
          if (braceCount === 0) fnEnd = i;
        }

        if (fnEnd <= fnStart) continue;

        const fnBody = content.slice(fnStart, fnEnd);

        // Check if setLabScore is already called inside
        if (fnBody.includes('setLabScore(')) {
          inserted = true;
          break;
        }

        // Determine what score line to add
        let scoreLine = '';

        if (scoreVarMatch) {
          const scoreVar = scoreVarMatch[1];
          // Count increments to determine maxScore
          const incrementRegex = new RegExp(`${scoreVar}\\s*\\+\\+|${scoreVar}\\s*=\\s*${scoreVar}\\s*\\+\\s*1`, 'g');
          let incCount = 0;
          while (incrementRegex.exec(fnBody)) incCount++;
          // Also check for += 1 or other increments
          const plusEqRegex = new RegExp(`${scoreVar}\\s*\\+=`, 'g');
          while (plusEqRegex.exec(fnBody)) incCount++;

          const maxScore = Math.max(incCount || 1, 1);
          scoreLine = `\n    setLabScore(${scoreVar}, ${maxScore});`;
        } else if (assessmentMatch) {
          const setterName = assessmentMatch[1]; // e.g., "AssessmentStatus", "FeedbackType", "IsCorrect"
          const varName = getStatusVarName(setterName); // e.g., "assessmentStatus", "feedbackType", "isCorrect"

          if (varName) {
            // Check how this var is set -- is it string 'correct'/'incorrect' or boolean true/false?
            if (setterName === 'IsCorrect') {
              scoreLine = `\n    setLabScore(${varName} ? 100 : 0, 100);`;
            } else {
              scoreLine = `\n    setLabScore(${varName} === 'correct' ? 100 : 0, 100);`;
            }
          }
        }

        if (scoreLine) {
          // Insert before the closing brace
          content = content.slice(0, fnStart + fnEnd) + scoreLine + content.slice(fnStart + fnEnd);
          inserted = true;
          break;
        }
      }
    }

    if (!inserted) {
      skippedNoScore++;
      console.log(`⚠️ ${file} - no insertion point found`);
      continue;
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
