import { readFileSync, writeFileSync } from 'fs';

const files = [
  'Recoil', 'Orbital', 'LiquidPressure', 'Hydraulic', 'KE', 'GPE'
];

for (const file of files) {
  const path = `src/components/labs/class9/physics/LabP9Derivation${file}.tsx`;
  let c = readFileSync(path, 'utf-8');

  // Normalize to LF for consistent processing
  c = c.replace(/\r\n/g, '\n');

  const firstAT = c.indexOf("const [activeTab, setActiveTab] = useState<'learn'|'test'>('learn');");
  if (firstAT < 0) {
    console.log(`${file}: activeTab not found, skipping`);
    continue;
  }

  // Look for ` const testSteps=` (with leading space) after the first activeTab
  const testStepsIdx = c.indexOf('\nconst testSteps=', firstAT);
  // Also try with space prefix
  const testStepsIdx2 = c.indexOf('\n const testSteps=', firstAT);
  
  const idx = testStepsIdx >= 0 ? testStepsIdx : testStepsIdx2;
  
  if (idx < 0) {
    console.log(`${file}: testSteps not found after activeTab`);
    console.log(`  Content 200-400 chars after firstAT: ${JSON.stringify(c.substring(firstAT + 200, firstAT + 400))}`);
    continue;
  }

  // Clean progressive state block - keep the properly indented activeTab line
  const cleanState = 
    "     const [activeTab, setActiveTab] = useState<'learn'|'test'>('learn');\n" +
    " const [currentStep, setCurrentStep] = useState(0);\n" +
    " const [testInput, setTestInput] = useState('');\n" +
    " const [testStatus, setTestStatus] = useState<'idle'|'correct'|'incorrect'>('idle');\n" +
    " const [showTestHint, setShowTestHint] = useState(false);\n" +
    " const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});\n" +
    " const [testFullyCompleted, setTestFullyCompleted] = useState(false);\n";

  c = c.substring(0, firstAT) + cleanState + c.substring(idx + 1);

  // Restore CRLF
  c = c.replace(/\n/g, '\r\n');

  writeFileSync(path, c, 'utf-8');

  // Verify no remaining duplicates
  const atCount = (c.match(/const \[activeTab, setActiveTab\]/g) || []).length;
  const csCount = (c.match(/const \[currentStep, setCurrentStep\]/g) || []).length;
  console.log(`${file}: Fixed. Declarations: activeTab=${atCount}, currentStep=${csCount} (all should be 1)`);
}
