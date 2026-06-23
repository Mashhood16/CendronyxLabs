const fs = require('fs');

function replaceFile(path, replacements) {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(/import React(?:, \{[^}]+\})? from 'react';\n?/g, (match) => {
     if (match.includes('{')) {
       const hooks = match.match(/\{([^}]+)\}/)[1];
       return `import { ${hooks.trim()} } from 'react';\n`;
     }
     return '';
  });
  
  for (const [search, replace] of replacements) {
    content = content.replace(search, replace);
  }
  fs.writeFileSync(path, content);
}

replaceFile('src/components/LabS8CrossingOver.tsx', [
  ["import { ArrowLeft, RefreshCw, Scissors, ArrowRightLeft } from 'lucide-react';", "import { ArrowLeft, RefreshCw, Scissors, ArrowRightLeft, Check } from 'lucide-react';"]
]);

replaceFile('src/components/LabS8ReflexTime.tsx', [
  ["import { ArrowLeft, RefreshCw, Hand, Info } from 'lucide-react';", "import { ArrowLeft, Hand, Info } from 'lucide-react';"],
  ["useRef<number>()", "useRef<number>(0)"]
]);

replaceFile('src/components/LabS8GreenhouseEffect.tsx', [
  ["import { Thermometer, Sun, Wind, ArrowLeft, ArrowRight, Play, Square, RefreshCw } from 'lucide-react';", "import { Thermometer, Sun, Wind, ArrowLeft, Play, Square, RefreshCw } from 'lucide-react';"]
]);

replaceFile('src/components/LabS8DNAExtraction.tsx', []);
replaceFile('src/components/LabS8HumanVariations.tsx', []);
replaceFile('src/components/LabS8KneeJerk.tsx', []);
replaceFile('src/components/LabS8StimulusResponse.tsx', []);
