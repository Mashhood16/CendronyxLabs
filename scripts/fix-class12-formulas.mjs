import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/data/class12Theorems.tsx';
let content = readFileSync(filePath, 'utf8');

const lines = content.split('\n');
const result = [];

function fixFormulas(line) {
  if (!line.includes('formula:')) {
    return line;
  }

  let fixed = line;

  // Simple sequential replacements - only on formula lines
  // Each regex matches the bare word (word boundary before and after)
  
  // frac -> \\frac (but not if already has backslash before it)
  fixed = fixed.replace(/(?<!\\)\bfrac\b/g, '\\\\frac');
  
  // sqrt{ -> \\sqrt{ (not if already escaped)
  fixed = fixed.replace(/(?<!\\)\bsqrt\b(?={)/g, '\\\\sqrt');
  
  // lim -> \\lim
  fixed = fixed.replace(/(?<!\\)\blim\b/g, '\\\\lim');
  
  // to -> \\to (only when used as LaTeX arrow, e.g., "h to 0")
  // We match " to " surrounded by spaces, preceded by _ or math context
  fixed = fixed.replace(/(?<!\\)\bto\b(?=\s)/g, (match, offset) => {
    // Check if this 'to' is in a math context (preceded by underscore or math word)
    const before = line.substring(Math.max(0, offset - 20), offset);
    if (before.includes('lim') || before.includes('_')) {
      return '\\\\to';
    }
    return match;
  });
  
  // rightarrow -> \\rightarrow
  fixed = fixed.replace(/(?<!\\)\brightarrow\b/g, '\\\\rightarrow');
  
  // Rightarrow -> \\Rightarrow
  fixed = fixed.replace(/(?<!\\)\bRightarrow\b/g, '\\\\Rightarrow');
  
  // text{ -> \\text{ 
  fixed = fixed.replace(/(?<!\\)\btext\b(?={)/g, '\\\\text');
  
  // left when followed by ( [ | { etc -> \\left
  fixed = fixed.replace(/(?<!\\)\bleft\b(?=[\(\[\|\{])/g, '\\\\left');
  
  // right when followed by ) ] | } etc -> \\right
  fixed = fixed.replace(/(?<!\\)\bright\b(?=[\)\]\|\}])/g, '\\\\right');
  
  // mid -> \\mid
  fixed = fixed.replace(/(?<!\\)\bmid\b/g, '\\\\mid');
  
  // quad -> \\quad
  fixed = fixed.replace(/(?<!\\)\bquad\b/g, '\\\\quad');
  
  // cdots -> \\cdots
  fixed = fixed.replace(/(?<!\\)\bcdots\b/g, '\\\\cdots');
  
  // infty -> \\infty
  fixed = fixed.replace(/(?<!\\)\binfty\b/g, '\\\\infty');
  
  // subset -> \\subset
  fixed = fixed.replace(/(?<!\\)\bsubset\b/g, '\\\\subset');
  
  // supset -> \\supset
  fixed = fixed.replace(/(?<!\\)\bsupset\b/g, '\\\\supset');
  
  // cap -> \\cap
  fixed = fixed.replace(/(?<!\\)\bcap\b/g, '\\\\cap');
  
  // cup -> \\cup
  fixed = fixed.replace(/(?<!\\)\bcup\b/g, '\\\\cup');
  
  // ne -> \\ne
  fixed = fixed.replace(/(?<!\\)\bne\b/g, '\\\\ne');
  
  // ge -> \\ge
  fixed = fixed.replace(/(?<!\\)\bge\b/g, '\\\\ge');
  
  // le -> \\le
  fixed = fixed.replace(/(?<!\\)\ble\b/g, '\\\\le');
  
  // perp -> \\perp
  fixed = fixed.replace(/(?<!\\)\bperp\b/g, '\\\\perp');
  
  // cong -> \\cong
  fixed = fixed.replace(/(?<!\\)\bcong\b/g, '\\\\cong');
  
  // approx -> \\approx
  fixed = fixed.replace(/(?<!\\)\bapprox\b/g, '\\\\approx');
  
  // angle -> \\angle
  fixed = fixed.replace(/(?<!\\)\bangle\b/g, '\\\\angle');
  
  // triangle -> \\triangle
  fixed = fixed.replace(/(?<!\\)\btriangle\b/g, '\\\\triangle');
  
  // int -> \\int (only as whole word)
  fixed = fixed.replace(/(?<!\\)\bint\b(?!\w)/g, '\\\\int');
  
  // sum -> \\sum (only as whole word)
  fixed = fixed.replace(/(?<!\\)\bsum\b(?!\w)/g, '\\\\sum');

  return fixed;
}

for (const line of lines) {
  result.push(fixFormulas(line));
}

const newContent = result.join('\n');
writeFileSync(filePath, newContent, 'utf8');

let changes = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i] !== result[i]) {
    changes++;
    const orig = lines[i].replace(/\s+/g, ' ').trim().substring(0, 90);
    const fixed = result[i].replace(/\s+/g, ' ').trim().substring(0, 90);
    console.log(`Line ${i + 1}: ${orig.substring(0, 80)} → ${fixed.substring(0, 80)}`);
  }
}
console.log(`\nTotal lines changed: ${changes}`);
