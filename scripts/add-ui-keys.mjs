import fs from 'fs';

const EN_FILE = 'src/locales/en/translation.json';
const RU_FILE = 'src/locales/roman-urdu/translation.json';

const en = JSON.parse(fs.readFileSync(EN_FILE, 'utf8'));
const ru = JSON.parse(fs.readFileSync(RU_FILE, 'utf8'));

const neededKeys = {
  // Derivation UI
  'lab.derivation': 'Derivation',
  'lab.simulation': 'Simulation',
  'lab.derivation_step_by_step': 'Step-by-Step Derivation',
  'lab.derivation_step_desc': 'Follow the logical progression to derive the formula',
  'lab.final_formula': 'Final Formula',
  'lab.derivation_in_action': 'See the Derivation in Action',
  'lab.derivation_adjust_desc': 'Adjust values to see the derivation come alive with real numbers.',
  'lab.derivation_trace': 'Derivation Trace',
  'lab.result': 'Result',
  'lab.real_life_application': 'Real-Life Application',
  'lab.derivation_default_insight': 'Each step builds on simple concepts to reveal powerful physics relationships.',
  'lab.practice_apply_derivation': 'Practice: Apply the Derivation',
  'lab.practice_find_answer': 'Find the answer using the derived formula.',
  'lab.practice_placeholder': 'Enter your answer...',
  'lab.check': 'Check',
  'lab.correct': 'Correct!',
  'lab.not_quite': 'Not quite.',
  'lab.calculator_hint_prefix': 'Need to crunch numbers?',
  'lab.calculator': 'Calculator',
  'lab.calculator_hint_suffix': 'is in the header',

  // Theorem UI
  'lab.theorem_proof': 'Proof',
  'lab.theorem_interactive': 'Interactive',
  'lab.proof_step_by_step': 'Step-by-Step Proof',
  'lab.proof_step_desc': 'Follow the logical proof step by step',
  'lab.theorem_statement': 'Theorem Statement',
  'lab.try_it_yourself': 'Try It Yourself',
  'lab.theorem_interactive_desc': 'Explore the theorem interactively with adjustable controls.',
  'lab.practice_apply_theorem': 'Practice: Apply the Theorem',
  'lab.practice_solve_theorem': 'Solve using the theorem.',
};

// Add to EN file if missing
let enAdded = 0;
Object.entries(neededKeys).forEach(([k, v]) => {
  if (!en[k]) { en[k] = v; enAdded++; }
});

// Add to RU file if missing
let ruAdded = 0;
Object.entries(neededKeys).forEach(([k, v]) => {
  if (!ru[k]) { ru[k] = v; ruAdded++; }
});

fs.writeFileSync(EN_FILE, JSON.stringify(en, null, 2));
fs.writeFileSync(RU_FILE, JSON.stringify(ru, null, 2));
console.log(`EN: added ${enAdded} keys (total: ${Object.keys(en).length})`);
console.log(`RU: added ${ruAdded} keys (total: ${Object.keys(ru).length})`);
