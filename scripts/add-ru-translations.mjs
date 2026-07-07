import fs from 'fs';

const RU_FILE = 'src/locales/roman-urdu/translation.json';
const ru = JSON.parse(fs.readFileSync(RU_FILE, 'utf8'));

const ruTranslations = {
  'lab.derivation': 'Ikhtiraqi',
  'lab.simulation': 'Simulation',
  'lab.derivation_step_by_step': 'Qadam ba qadam ikhtiraq',
  'lab.derivation_step_desc': 'Formula hasil karne ke liye mantiqi tarteeb par amal karein',
  'lab.final_formula': 'Aakhri Formula',
  'lab.derivation_in_action': 'Ikhtiraq Amal Mein Dekhein',
  'lab.derivation_adjust_desc': 'Aqdar ko badal kar dekhain ke ikhtiraq asli adadon ke saath kaise zinda hota hai.',
  'lab.derivation_trace': 'Ikhtiraq ka Suragh',
  'lab.result': 'Natija',
  'lab.real_life_application': 'Asli Zindagi Mein Istamal',
  'lab.derivation_default_insight': 'Har qadam sade tasawwurat par mabni hai jo taaqatwar fiziki talluq zahir karte hain.',
  'lab.practice_apply_derivation': 'Mashq: Ikhtiraq ka Istamal Karein',
  'lab.practice_find_answer': 'Ikhtiraq shuda formula se jawab talash karein.',
  'lab.practice_placeholder': 'Apna jawab darj karein...',
  'lab.check': 'Janchiye',
  'lab.correct': 'Sahi!',
  'lab.not_quite': 'Kuch kami hai.',
  'lab.calculator_hint_prefix': 'Hisab ki zaroorat?',
  'lab.calculator': 'Calculator',
  'lab.calculator_hint_suffix': 'header mein hai',
  'lab.theorem_proof': 'Suboot',
  'lab.theorem_interactive': 'Interactivi',
  'lab.proof_step_by_step': 'Qadam ba qadam suboot',
  'lab.proof_step_desc': 'Mantiqi suboot par qadam ba qadam amal karein',
  'lab.theorem_statement': 'Theorema Ka Bayan',
  'lab.try_it_yourself': 'Khud Azmaen',
  'lab.theorem_interactive_desc': 'Theorem ko adjustable controls ke saath interactivi tor par daryaft karein.',
  'lab.practice_apply_theorem': 'Mashq: Theorem ka Istamal Karein',
  'lab.practice_solve_theorem': 'Theorem ke zariye hal karein.',
};

let updated = 0;
Object.entries(ruTranslations).forEach(([k, v]) => {
  if (ru[k]) {
    ru[k] = v;
    updated++;
  }
});

fs.writeFileSync(RU_FILE, JSON.stringify(ru, null, 2));
console.log(`Updated ${updated} RU keys with proper Roman Urdu translations`);
