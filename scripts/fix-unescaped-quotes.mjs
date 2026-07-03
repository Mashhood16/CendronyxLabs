import { readFileSync, writeFileSync, readdirSync } from 'fs';

const files = [
  ...readdirSync('src/components').filter(f => f.startsWith('LabP10Derivation') && f.endsWith('.tsx')).map(f => `src/components/${f}`),
  ...readdirSync('src/components').filter(f => f.startsWith('LabP9Derivation') && f.endsWith('.tsx')).map(f => `src/components/${f}`),
];

let totalFixes = 0;

for (const file of files) {
  let content = readFileSync(file, 'utf-8');
  let original = content;

  // Find each "detail: '" occurrence and its matching closing quote
  let pos = 0;
  let fileFixes = 0;

  while (pos < content.length) {
    const detailStart = content.indexOf("detail: '", pos);
    if (detailStart === -1) break;

    const valueStart = detailStart + 9; // just past "detail: '"

    // Find the true closing quote: the last ' before }, or before ,\n or before \n  },
    // In a pattern like: detail: '...' }
    // The closing quote is followed by ',  }' or ', \n' or '\n  }'
    const afterValue = content.substring(valueStart);
    
    // Find the pattern: ' } or ',\n or '\n  }
    // Scan for positions where ' is followed by whitespace and }
    let bestEnd = -1;
    let searchFrom = 0;
    
    while (searchFrom < afterValue.length) {
      const qPos = afterValue.indexOf("'", searchFrom);
      if (qPos === -1) break;
      
      // Check what follows this quote
      const rest = afterValue.substring(qPos + 1).trimStart();
      if (rest.startsWith('}') || rest.startsWith(',') || rest.startsWith('\n')) {
        bestEnd = qPos;
        break; // first valid closing quote
      }
      
      // This quote is inside the content (an apostrophe) - skip past it
      searchFrom = qPos + 1;
    }

    if (bestEnd === -1) {
      pos = valueStart + 1;
      continue;
    }

    // Extract the raw detail content (including unescaped quotes)
    const detailContent = content.substring(valueStart, valueStart + bestEnd);
    
    // Escape all unescaped single quotes in the content
    let escapedContent = '';
    for (let i = 0; i < detailContent.length; i++) {
      if (detailContent[i] === "'" && (i === 0 || detailContent[i - 1] !== '\\')) {
        escapedContent += "\\'";
        fileFixes++;
      } else {
        escapedContent += detailContent[i];
      }
    }

    if (fileFixes > 0) {
      content = content.substring(0, valueStart) + escapedContent + content.substring(valueStart + bestEnd);
      pos = valueStart + escapedContent.length;
    } else {
      pos = valueStart + bestEnd + 1;
    }
  }

  if (fileFixes > 0) {
    writeFileSync(file, content);
    console.log(`Fixed ${file} (${fileFixes} unescaped quotes)`);
    totalFixes += fileFixes;
  }
}

if (totalFixes === 0) {
  console.log('No unescaped quotes found. Checking file contents directly...');
  // Debug: show the raw bytes of a problematic file
  const testFile = 'src/components/LabP10DerivationEcho.tsx';
  const testContent = readFileSync(testFile, 'utf-8');
  const idx = testContent.indexOf("detail: 'You");
  if (idx !== -1) {
    console.log(`Found at index ${idx}: ${testContent.substring(idx, idx + 50)}`);
  }
}

console.log(`\nTotal: ${totalFixes} fixes`);
