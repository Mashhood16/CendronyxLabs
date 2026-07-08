import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const LABS_DIR = 'src/components';
const files = readdirSync(LABS_DIR)
  .filter(f => f.startsWith('Lab') && f.endsWith('.tsx'))
  .sort();

let updated = 0;
let skipped = 0;
let errors = [];

for (const file of files) {
  const filePath = join(LABS_DIR, file);
  let content = readFileSync(filePath, 'utf-8');

  // Skip if already has useLab import (already processed)
  if (content.includes("import { useLab } from '../store'")) {
    skipped++;
    continue;
  }

  // Check if file has recordData or handleRecordData
  const hasRecordData = content.includes('const recordData') || content.includes('const handleRecordData');
  if (!hasRecordData) {
    skipped++;
    continue;
  }

  try {
    // 1. Add useLab import after the last '../' import
    const importLines = content.match(/^import .+ from ['"].+['"];$/gm);
    if (!importLines) { errors.push(`${file}: no imports found`); continue; }
    
    const lastImportLine = importLines[importLines.length - 1];
    const importEnd = content.lastIndexOf(lastImportLine) + lastImportLine.length;
    
    // Only add if not already added (double-check)
    if (!content.includes("import { useLab } from '../store'")) {
      content = content.slice(0, importEnd) + "\nimport { useLab } from '../store';" + content.slice(importEnd);
    }

    // 2. Add `const { recordLabData } = useLab();` inside the component function
    // Find the function body start after `export default function LabXxx({...}) {`
    const funcMatch = content.match(/export default function Lab\w+\s*\([^)]*\)\s*\{/);
    if (!funcMatch) { errors.push(`${file}: no component function`); continue; }
    
    const funcBodyStart = funcMatch.index + funcMatch[0].length;
    
    // Find the first line of the function body (usually `const { t } = useTranslate();`)
    // Add recordLabData hook right after
    const firstLineMatch = content.slice(funcBodyStart).match(/^\s+.*\n/);
    if (!firstLineMatch) { errors.push(`${file}: no body content`); continue; }
    
    const firstLineEnd = funcBodyStart + firstLineMatch.index + firstLineMatch[0].length;
    
    // Insert `const { recordLabData } = useLab();` after the first line
    const indent = firstLineMatch[0].match(/^(\s+)/)?.[1] || '  ';
    content = content.slice(0, firstLineEnd) + `${indent}const { recordLabData } = useLab();\n` + content.slice(firstLineEnd);

    // 3. Find the recordData function and add recordLabData() call
    // Match: const recordData = () => { OR const handleRecordData = () => {
    const recordFnMatch = content.match(/const (?:recordData|handleRecordData)\s*=\s*\(\)\s*=>\s*{/);
    if (!recordFnMatch) { errors.push(`${file}: no recordData function`); continue; }
    
    const fnBodyStart = recordFnMatch.index + recordFnMatch[0].length;
    
    // Inside the recordData function, find the data object from setXxx(prev => [...prev, { ... }])
    const fnBody = content.slice(fnBodyStart);
    
    // Match object inside: setXxx(prev => [...prev, { ... }])
    // Match both patterns: setXxx((prev) => [...prev, { ... }]) and setXxx(prev => [...prev, { ... }])
    const dataMatch = fnBody.match(/set\w+\(\(?\s*prev\s*\)?\s*=>\s*\[\.\.\.(?:prev|\w+)\s*,\s*(\{[^}]*\})\]\s*\)\s*;?/);
    
    if (dataMatch) {
      // Extract the data object and add recordLabData call after it
      const dataObjStr = dataMatch[1];
      const stmtEnd = dataMatch.index + dataMatch[0].length;
      
      // Check if recordLabData is already called in this function
      const beforeStmt = fnBody.slice(0, stmtEnd);
      if (beforeStmt.includes('recordLabData(')) {
        // Already has recordLabData (shouldn't happen since we skip useLab imports)
        continue;
      }
      
      // Escape backticks in the data object string to avoid template literal issues
      const safeData = dataObjStr.replace(/`/g, '\\`');
      
      // Insert recordLabData call after the setData/setLogs line
      const insertAfter = fnBodyStart + stmtEnd;
      const beforeInsert = content.slice(0, insertAfter);
      const afterInsert = content.slice(insertAfter);
      
      // Determine indentation from the setData line
      const setDataLineMatch = fnBody.slice(0, dataMatch.index + dataMatch[0].length).match(/\n(\s+)set\w+/);
      const dataIndent = setDataLineMatch ? setDataLineMatch[1] + '  ' : '    ';
      
      // Build the recordLabData call - use the same data object but remove 'id: Date.now()' since we add timestamp
      let cleanedData = safeData.replace(/id:\s*Date\.now\(\),?\s*/g, '');
      // If the cleaned data object is empty (just {}), add timestamp
      if (cleanedData.trim() === '{}' || cleanedData.trim() === '{' || cleanedData.trim() === '{}') {
        cleanedData = `{ timestamp: Date.now() }`;
      } else if (!cleanedData.includes('timestamp')) {
        // Add timestamp to existing object
        cleanedData = cleanedData.replace(/^\{/, '{ timestamp: Date.now(), ');
      }
      
      const recordLabDataLine = `\n${dataIndent}recordLabData(${cleanedData});`;
      content = beforeInsert + recordLabDataLine + afterInsert;
    } else {
      // No setData/setLogs pattern found - add a basic timestamp call at the end
      // But only if the function has content
      if (fnBody.trim().length > 1) {
        // Find where the recordData function ends (matching braces)
        let braceCount = 0;
        let fnEnd = 0;
        for (let i = 0; i < fnBody.length; i++) {
          if (fnBody[i] === '{') braceCount++;
          if (fnBody[i] === '}') braceCount--;
          if (braceCount === -1) { fnEnd = i; break; }
        }
        
        if (fnEnd > 0) {
          // Insert before the closing brace
          const insertAt = fnBodyStart + fnEnd;
          const beforeInsert = content.slice(0, insertAt);
          const afterInsert = content.slice(insertAt);
          content = beforeInsert + `\n  recordLabData({ timestamp: Date.now() });\n` + afterInsert;
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
console.log(`Updated: ${updated}, Skipped (already done or no recordData): ${skipped}, Errors: ${errors.length}`);
if (errors.length > 0) {
  console.log('\nErrors:');
  errors.forEach(e => console.log(`  ${e}`));
}
