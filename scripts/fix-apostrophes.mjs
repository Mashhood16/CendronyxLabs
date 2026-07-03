import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const fixes = {
  "You re ": "You're ",
  "You re,": "You're,",
  "You re.": "You're.",
  "You re\u2014": "You're\u2014",  
  "You re!": "You're!",
  " don t ": " don't ",
  " can t ": " can't ",
  " won t ": " won't ",
  " doesn t ": " doesn't ",
  " isn t ": " isn't ",
  " that s ": " that's ",
  "That s ": "That's ",
  " it s ": " it's ",
  "It s ": "It's ",
  " there s ": " there's ",
  " here s ": " here's ",
  "Let s ": "Let's ",
  "What s ": "What's ",
  "Who s ": "Who's ",
  "How s ": "How's ",
  " material electrical ": " material's electrical ",
  " car gas tank": " car's gas tank",
  " is what causes": " is what's causes",
  " been dated": " been dated",
};

const derivationFiles = glob.sync('src/components/LabP10Derivation*.tsx');

for (const filepath of derivationFiles) {
  let content = readFileSync(filepath, 'utf-8');
  let changed = false;
  
  // Apply all text replacements
  for (const [oldStr, newStr] of Object.entries(fixes)) {
    if (content.includes(oldStr)) {
      content = content.replaceAll(oldStr, newStr);
      changed = true;
    }
  }
  
  if (changed) {
    writeFileSync(filepath, content, 'utf-8');
    console.log(`Fixed ${filepath.split(/[/\\]/).pop()}`);
  }
}

console.log('\nApostrophe fixes applied!');
