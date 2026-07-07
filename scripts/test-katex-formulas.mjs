import fs from 'fs';
import katex from 'katex';

// Read the actual data file
const raw = fs.readFileSync('src/data/class11Derivations.tsx', 'utf-8');

// Find all formula values (raw text between the single quotes after formula:)
const regex = /((?:final)?formula:\s*')([^']*)'/g;
let match;
let pass = 0;
let fail = 0;

while ((match = regex.exec(raw)) !== null) {
  const rawFormulaContent = match[2];
  
  // Simulate JS string literal unescaping on the raw file content
  // In the TSX file, single-quoted strings use: \\ -> \, \' -> ', etc.
  let jsFormulaValue = '';
  for (let i = 0; i < rawFormulaContent.length; i++) {
    if (rawFormulaContent[i] === '\\' && i + 1 < rawFormulaContent.length) {
      const next = rawFormulaContent[i + 1];
      if (next === '\\') { jsFormulaValue += '\\'; i++; }
      else if (next === "'") { jsFormulaValue += "'"; i++; }
      else if (next === 'n') { jsFormulaValue += '\n'; i++; }
      else if (next === 't') { jsFormulaValue += '\t'; i++; }
      else if (next === 'r') { jsFormulaValue += '\r'; i++; }
      else { jsFormulaValue += '\\' + next; i++; }
    } else {
      jsFormulaValue += rawFormulaContent[i];
    }
  }

  // Now jsFormulaValue is what KaTeX would receive at runtime
  // Render it with KaTeX and check for errors
  try {
    const html = katex.renderToString(jsFormulaValue, {
      throwOnError: true,
      errorColor: '#cc0000'
    });
    
    // Check if output contains \t as error (red text span)
    if (html.includes('color:#cc0000') || html.includes('\\\\t')) {
      fail++;
      console.log(`❌ FAIL (render error): ${rawFormulaContent.substring(0, 80)}`);
      console.log(`   JS value (hex start): ${Buffer.from(jsFormulaValue.substring(0, 20)).toString('hex')}`);
      console.log(`   Contains \\\\t in output? ${html.includes('\\\\t')}`);
    } else {
      pass++;
    }
  } catch (e) {
    fail++;
    console.log(`❌ FAIL (exception): ${rawFormulaContent.substring(0, 80)}`);
    console.log(`   Error: ${e.message.substring(0, 100)}`);
  }
}

console.log(`\nResults: ${pass} pass, ${fail} fail out of ${pass + fail} formulas`);
