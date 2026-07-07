import fs from 'fs';
import katex from 'katex';

// Simulate the preprocessFormula function from MathFormula.tsx
function preprocessFormula(formula) {
  let f = formula;
  f = f.replace(/sqrt\(([^)]+)\)/g, '\\sqrt{$1}');
  f = f.replace(/\bsin\b/g, '\\sin');
  f = f.replace(/\bcos\b/g, '\\cos');
  f = f.replace(/\btan\b/g, '\\tan');
  f = f.replace(/\blog\b/g, '\\log');
  f = f.replace(/\bln\b/g, '\\ln');
  f = f.replace(/e\^\(([^)]+)\)/g, 'e^{$1}');
  f = f.replace(/10\^(-?\d+)/g, '10^{-$1}');
  f = f.replace(/log₁₀/g, '\\log_{10}');
  return f;
}

const raw = fs.readFileSync('src/data/class11Derivations.tsx', 'utf-8');

const regex = /((?:final)?formula:\s*')([^']*)'/g;
let match;
let pass = 0;
let fail = 0;
let details = [];

while ((match = regex.exec(raw)) !== null) {
  // Raw text between quotes in the TSX file
  const rawFormula = match[2];
  
  // Step 1: Simulate JS string literal unescaping
  let jsValue = '';
  for (let i = 0; i < rawFormula.length; i++) {
    if (rawFormula[i] === '\\' && i + 1 < rawFormula.length) {
      const next = rawFormula[i + 1];
      if (next === '\\') { jsValue += '\\'; i++; }
      else if (next === "'") { jsValue += "'"; i++; }
      else if (next === 'n') { jsValue += '\n'; i++; }
      else if (next === 't') { jsValue += '\t'; i++; }
      else if (next === 'r') { jsValue += '\r'; i++; }
      else if (next === 'u') {
        // Handle \uXXXX unicode escapes
        const hex = rawFormula.substring(i + 2, i + 6);
        if (/^[0-9a-fA-F]{4}$/.test(hex)) {
          jsValue += String.fromCharCode(parseInt(hex, 16));
          i += 5;
        } else {
          jsValue += '\\u';
          i++;
        }
      }
      else { jsValue += '\\' + next; i++; }
    } else {
      jsValue += rawFormula[i];
    }
  }
  
  // Step 2: Apply preprocessFormula (same as MathFormula component)
  const processed = preprocessFormula(jsValue);
  
  // Step 3: Render with KaTeX
  try {
    const html = katex.renderToString(processed, {
      throwOnError: true,
      errorColor: '#cc0000'
    });
    
    // Check for error indicators in output
    if (html.includes('color:#cc0000') || html.includes('\\t')) {
      fail++;
      details.push({ raw: rawFormula.substring(0, 60), processed: processed.substring(0, 60) });
    } else {
      // Verify \times renders as times symbol (check for the actual HTML of ×)
      if (processed.includes('\\times')) {
        // Make sure it renders properly, not as \t
        if (!html.includes('\u00D7') && html.includes('times')) {
          fail++;
          details.push({ raw: rawFormula.substring(0, 60), 
                         issue: '\\times might be rendering as text',
                         html: html.substring(html.indexOf('times') - 30, html.indexOf('times') + 30) });
        } else {
          pass++;
        }
      } else {
        pass++;
      }
    }
  } catch (e) {
    fail++;
    details.push({ raw: rawFormula.substring(0, 60), error: e.message.substring(0, 80) });
  }
}

console.log(`\nResults: ${pass} pass, ${fail} fail out of ${pass + fail}`);
if (fail > 0) {
  console.log('\nFailures:');
  for (const d of details) {
    console.log(`  - Raw: ${d.raw}`);
    if (d.processed) console.log(`    Processed: ${d.processed}`);
    if (d.html) console.log(`    HTML snippet: ${d.html}`);
    if (d.error) console.log(`    Error: ${d.error}`);
    if (d.issue) console.log(`    Issue: ${d.issue}`);
  }
} else {
  console.log('All formulas pass through the complete rendering pipeline!');
}
