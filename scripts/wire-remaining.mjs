import { readFileSync, writeFileSync } from 'fs';

const files = [
  'LabC10AceticAcidCarbonate', 'LabC10AceticAcidMetal',
  'LabC10AqueousElectrolysis', 'LabC10ConcentrationRate',
  'LabC10CopperRefining', 'LabC10DanielCell',
  'LabC10DownsCell', 'LabC10Electroplating',
  'LabC10FuelCell', 'LabC10MoltenLeadChloride',
  'LabC10SaturatedUnsaturated', 'LabC10SurfaceAreaRate',
  'LabB12Cardiorespiratory', 'LabB12Digestive',
  'LabB12Urinary', 'LabB9PlantPhysiology',
];

for (const name of files) {
  const filePath = `src/components/${name}.tsx`;
  let content = readFileSync(filePath, 'utf-8');

  // Skip if already done
  if (content.includes("import { useLab } from '../store'")) {
    console.log(`⏭️  ${name}.tsx (already done)`);
    continue;
  }

  // Add import after last import line
  const importLines = [...content.matchAll(/^import .+ from ['"].+['"];$/gm)];
  const lastImport = importLines[importLines.length - 1];
  const importEnd = lastImport.index + lastImport[0].length;
  
  const beforeImport = content.slice(0, importEnd);
  const afterImport = content.slice(importEnd);
  content = beforeImport + "\nimport { useLab } from '../store';" + afterImport;

  // Find the component function body - it's the first `{` of the function declaration
  // Match: export default function LabXxx(...) {
  // We need to find the matching `{` by counting parentheses
  const funcDeclMatch = content.match(/export default function Lab\w+\s*\(/);
  if (!funcDeclMatch) { console.log(`❌ ${name}: no function decl`); continue; }
  
  // Find the opening `{` of the function body
  let parenCount = 0;
  let bracePos = funcDeclMatch.index + funcDeclMatch[0].length;
  for (let i = bracePos; i < content.length; i++) {
    if (content[i] === '(') parenCount++;
    if (content[i] === ')') parenCount--;
    if (content[i] === '{' && parenCount === 0) {
      bracePos = i + 1; // position after `{`
      break;
    }
  }
  
  // Find the first line in the function body and insert useLab after it
  const afterBrace = content.slice(bracePos);
  const firstLineMatch = afterBrace.match(/^(\s*)(?:const |let |var |useState|useEffect|useRef|useMemo|useCallback|interface )/m);
  if (!firstLineMatch) {
    // Just insert at the start of the function body
    content = content.slice(0, bracePos) + '\n  const { recordLabData } = useLab();\n' + content.slice(bracePos);
  } else {
    // Insert after the first state/hook line
    const lineStart = firstLineMatch.index;
    const lineEnd = afterBrace.indexOf('\n', lineStart);
    const insertPos = bracePos + lineEnd + 1;
    content = content.slice(0, insertPos) + '  const { recordLabData } = useLab();\n' + content.slice(insertPos);
  }

  // Find the recordData function and add recordLabData call
  const recordFnMatch = content.match(/const (?:recordData|handleRecordData)\s*=\s*\(\)\s*=>\s*\{/);
  if (!recordFnMatch) { console.log(`❌ ${name}: no recordData`); continue; }

  const fnBodyStart = recordFnMatch.index + recordFnMatch[0].length;
  const fnBody = content.slice(fnBodyStart);

  // Find the data object from setXxx(prev => [...prev, { ... }])
  const dataMatch = fnBody.match(/set\w+\(\(?\s*prev\s*\)?\s*=>\s*\[\.\.\.(?:prev|\w+)\s*,\s*(\{(?:[^{}]|(?:\{[^{}]*\}))*\})\]\s*\)\s*;?/);
  
  if (dataMatch) {
    const dataObjStr = dataMatch[1];
    const stmtEnd = dataMatch.index + dataMatch[0].length;
    
    // Skip if already has recordLabData
    if (fnBody.slice(0, stmtEnd).includes('recordLabData(')) continue;
    
    // Clean out id: Date.now() since we add timestamp
    let cleaned = dataObjStr.replace(/id:\s*Date\.now\(\),?\s*/g, '');
    if (!cleaned.includes('timestamp')) {
      cleaned = cleaned.replace(/^\{/, '{ timestamp: Date.now(), ');
    }
    
    const insertAt = fnBodyStart + stmtEnd;
    const indent = fnBody.match(/\n(\s*)set\w+/)?.[1] || '    ';
    const extraIndent = indent + '  ';
    
    content = content.slice(0, insertAt) + `\n${extraIndent}recordLabData(${cleaned});` + content.slice(insertAt);
  } else {
    // No setData pattern - just add recordLabData at end
    let braceCount = 0;
    let fnEnd = 0;
    for (let i = 0; i < fnBody.length; i++) {
      if (fnBody[i] === '{') braceCount++;
      if (fnBody[i] === '}') braceCount--;
      if (braceCount === -1) { fnEnd = i; break; }
    }
    if (fnEnd > 0) {
      const insertAt = fnBodyStart + fnEnd;
      content = content.slice(0, insertAt) + '\n  recordLabData({ timestamp: Date.now() });\n' + content.slice(insertAt);
    }
  }

  writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ ${name}.tsx`);
}

console.log('\nDone!');
