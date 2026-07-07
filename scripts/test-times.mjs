import katex from 'katex';

// Test specific \times rendering
const testFormulas = [
  'a \\times t',
  'S = \\frac{1}{2} \\times (vf - vi)',
  'F \\times d',
  '(vf - vi) \\times t',
  '\\times',
  'S = \\frac{1}{2}(vi + vf) \\times t',
];

for (const f of testFormulas) {
  try {
    const html = katex.renderToString(f, { throwOnError: true, errorColor: '#cc0000' });
    const hasTimesSymbol = html.includes('\u00D7'); // Unicode ×
    const hasTimesText = html.includes('times');
    const hasError = html.includes('color:#cc0000');
    
    console.log(`Formula: "${f}"`);
    console.log(`  Has × symbol: ${hasTimesSymbol}`);
    console.log(`  Has 'times' text: ${hasTimesText}`);
    console.log(`  Has error: ${hasError}`);
    console.log(`  HTML (first 200): ${html.substring(0, 200)}`);
    console.log();
  } catch(e) {
    console.log(`Formula: "${f}" → ERROR: ${e.message}`);
    console.log();
  }
}
