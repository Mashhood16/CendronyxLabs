import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const brokenFiles = [
  'LabB11Enzymes.tsx',
  'LabB12Biotechnology.tsx',
  'LabB12PharmacologyEcology.tsx',
  'LabB12StructuralStats.tsx',
  'LabB9Enzymes.tsx',
  'LabB9PlantPhysiology.tsx',
  'LabB9PlantReproduction.tsx',
  'LabCS12DeepLearning.tsx',
  'LabCS12Entrepreneurship.tsx',
  'LabCS12IoTCloud.tsx',
  'LabCS12MachineLearning.tsx',
  'LabE11AdjectivesAdverbs.tsx',
  'LabM10FractionApplications.tsx',
  'LabM10FunctionApplications.tsx',
  'LabM7FinancialArithmetic.tsx',
  'LabP12AlternatingCurrent.tsx',
  'LabP12Diffraction.tsx',
  'LabP12ElectricPotential.tsx',
];

let fixed = 0;

for (const file of brokenFiles) {
  const filePath = join('src/components', file);
  let content = readFileSync(filePath, 'utf-8');

  // Step 1: Remove ANY incorrectly placed setLabScore lines 
  // that are not inside a checkAnswer function
  // We do this by finding setLabScore lines that appear OUTSIDE
  // the checkAnswer/checkAnswers function body

  // First, let's find the checkAnswer function bounds
  const checkRegex = /(const\s+checkAns(?:wer)?s?\s*=\s*\([^)]*\)\s*=>\s*\{)/g;
  const checkFnMatch = checkRegex.exec(content);
  
  if (!checkFnMatch) {
    console.log(`⚠️ ${file} - no checkAnswer function found`);
    continue;
  }

  const fnBodyStart = checkFnMatch.index + checkFnMatch[1].length;
  
  // Find the closing brace of the checkAnswer function
  let braceCount = 1;
  let fnBodyEnd = fnBodyStart;
  for (let i = fnBodyStart; i < content.length && braceCount > 0; i++) {
    if (content[i] === '{') braceCount++;
    if (content[i] === '}') braceCount--;
    if (braceCount === 0) fnBodyEnd = i;
  }

  // Extract the function body
  const beforeFn = content.slice(0, checkFnMatch.index);
  const fnBody = content.slice(fnBodyStart, fnBodyEnd);
  const afterFn = content.slice(fnBodyEnd);

  // Check if setLabScore is already properly inside the function body
  if (fnBody.includes('setLabScore(')) {
    console.log(`✅ ${file} - already has correct setLabScore inside checkAnswer`);
    fixed++;
    continue;
  }

  // Remove ALL setLabScore lines from the entire file (they're all misplaced)
  content = content.replace(/^[ \t]*setLabScore\([^;]+;\s*$/gm, '');
  // Also remove lines like: \n    setLabScore(...) ...rest of JSX
  content = content.replace(/[ \t]*setLabScore\([^)]+\);\s*/g, '');
  
  // Clean up any double blank lines
  content = content.replace(/\n{3,}/g, '\n\n');

  // Step 2: Re-read the file and find the checkAnswer function
  
  // Find the score pattern
  const hasScoreVar = /let\s+(score|correct)\s*=\s*0/i.test(content);
  const hasAssessmentStatus = /setAssessmentStatus\s*\(/.test(content);
  const hasFeedbackType = /setFeedbackType\s*\(/.test(content);
  const hasIsCorrect = /setIsCorrect\s*\(/.test(content);
  const hasScoreIncrement = /score\+\+|correct\+\+/.test(content);

  let scoreLine = '';
  if (hasScoreVar && hasScoreIncrement) {
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
    console.log(`⚠️ ${file} - no score pattern found`);
    continue;
  }

  // Add setLabScore inside the checkAnswer function
  content = content.replace(
    /((?:const|function)\s+checkAns(?:wer)?s?\s*(?:=\s*)?(?:\([^)]*\)\s*(?:=>\s*)?)?\{[\s\S]*?)(\n\s*\}\)?;?\s*)(?=\n|$)/,
    (match, bodyStart, closing) => {
      if (match.includes('setLabScore(')) return match;
      return bodyStart + scoreLine + closing;
    }
  );

  if (content.includes('setLabScore(')) {
    writeFileSync(filePath, content, 'utf-8');
    fixed++;
    console.log(`✅ ${file} - fixed`);
  } else {
    console.log(`⚠️ ${file} - failed to add setLabScore`);
  }
}

console.log(`\n--- Done ---`);
console.log(`Fixed: ${fixed}/${brokenFiles.length}`);
