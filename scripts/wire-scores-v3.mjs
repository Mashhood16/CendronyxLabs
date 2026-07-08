import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const LABS_DIR = 'src/components';
const files = readdirSync(LABS_DIR)
  .filter(f => f.startsWith('Lab') && f.endsWith('.tsx'))
  .sort();

let updated = 0;
let skippedNoScore = 0;
let skippedAlready = 0;

for (const file of files) {
  const filePath = join(LABS_DIR, file);
  let content = readFileSync(filePath, 'utf-8');

  if (content.includes('setLabScore(')) {
    skippedAlready++;
    continue;
  }

  const hasCheck = /checkAns(?:wer)?s?\s*/.test(content);
  if (!hasCheck) continue;

  // Detect the scoring pattern
  const hasScoreVar = /let\s+(score|correct)\s*=\s*0/i.test(content);
  const hasAssessmentStatus = /setAssessmentStatus\s*\(/.test(content);
  const hasFeedbackType = /setFeedbackType\s*\(/.test(content);
  const hasIsCorrect = /setIsCorrect\s*\(/.test(content);

  if (!hasScoreVar && !hasAssessmentStatus && !hasFeedbackType && !hasIsCorrect) {
    skippedNoScore++;
    continue;
  }

  try {
    // Add import if needed
    if (!content.includes("import { useLab }")) {
      content = content.replace(
        /^(import .+ from ['"].+['"];)$/m,
        "$1\nimport { useLab } from '../store';"
      );
    }

    // Add setLabScore to useLab destructuring if not already there
    if (!content.includes('setLabScore')) {
      content = content.replace(
        /const\s*\{\s*([^}]*)\s*\}\s*=\s*useLab\(\)/,
        (_, inner) => `const { ${inner.trim()}, setLabScore } = useLab()`
      );
    }

    // Now find checkAnswer function and add setLabScore before its closing brace

    // Build the score line based on the pattern
    let scoreLine = '';
    if (hasScoreVar) {
      // Determine max score from variable name
      const varName = content.match(/let\s+(score|correct)\s*=\s*0/i)[1];
      const incMatches = content.match(new RegExp(`${varName}\\s*\\+\\+`, 'g'));
      const maxScore = incMatches ? incMatches.length : 1;
      scoreLine = `\n    setLabScore(${varName}, ${maxScore});`;
    } else if (hasAssessmentStatus) {
      scoreLine = `\n    setLabScore(assessmentStatus === 'correct' ? 100 : 0, 100);`;
    } else if (hasFeedbackType) {
      scoreLine = `\n    setLabScore(feedbackType === 'correct' ? 100 : 0, 100);`;
    } else if (hasIsCorrect) {
      scoreLine = `\n    setLabScore(isCorrect ? 100 : 0, 100);`;
    }

    if (!scoreLine) {
      skippedNoScore++;
      continue;
    }

    // Insert scoreLine at the end of checkAnswer function
    // Find checkAnswer function and add scoreLine before its closing brace
    const origContent = content; // save for comparison
    content = content.replace(
      /((?:const|function)\s+checkAns(?:wer)?s?\s*(?:=\s*)?(?:\([^)]*\)\s*(?:=>\s*)?)?\{[\s\S]*?)(\n\s*\}\)?;?\s*)(?=\n|$)/g,
      (match, bodyStart, closing) => {
        // Only add if setLabScore not already present
        if (match.includes('setLabScore(')) return match;
        // Only add if the function body has relevant score logic
        if (!hasScoreVar && !hasAssessmentStatus && !hasFeedbackType && !hasIsCorrect) return match;
        return bodyStart + scoreLine + closing;
      }
    );

    if (content === origContent) {
      // Fallback: try alternative closing patterns
      content = origContent.replace(
        /((?:const|function)\s+checkAns(?:wer)?s?\s*(?:=\s*)?(?:\([^)]*\)\s*(?:=>\s*)?)?\{[\s\S]*?)\n\s*\};?\s*(?=\n|$)/g,
        (match, bodyStart) => {
          if (match.includes('setLabScore(')) return match;
          return bodyStart + scoreLine + '\n };';
        }
      );
    }

    if (content === origContent) {
      skippedNoScore++;
      console.log(`⚠️ ${file} - regex didn't match`);
      continue;
    }

    writeFileSync(filePath, content, 'utf-8');
    updated++;
    console.log(`✅ ${file}`);
  } catch (e) {
    console.log(`❌ ${file}: ${e.message}`);
  }
}

console.log(`\n--- Done ---`);
console.log(`Updated: ${updated}, Skipped (no score logic): ${skippedNoScore}, Already had setLabScore: ${skippedAlready}`);
