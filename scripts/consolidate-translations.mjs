import fs from 'fs';

const EN_FILE = 'src/locales/en/translation.json';
const RU_FILE = 'src/locales/roman-urdu/translation.json';

const en = JSON.parse(fs.readFileSync(EN_FILE, 'utf8'));
const ru = JSON.parse(fs.readFileSync(RU_FILE, 'utf8'));

// Verb patterns from labContent.ts — add as translation keys
// Format: lab.verb.<verb> = English / Roman Urdu
const VERB_PATTERNS = [
  ['Assemble', 'Assemble', 'Jama karein'],
  ['Identify', 'Identify', 'Pehchaniye'],
  ['Use', 'Use', 'Istemaal karein'],
  ['Observe', 'Observe', 'Mushahida karein'],
  ['Test', 'Test', 'Test karein'],
  ['Calculate', 'Calculate', 'Hisab karein'],
  ['Explore', 'Explore', 'Daryaft karein'],
  ['Build', 'Build', 'Banayein'],
  ['Design', 'Design', 'Design karein'],
  ['Construct', 'Construct', 'Tameer karein'],
  ['Compare', 'Compare', 'Mawazna karein'],
  ['Investigate', 'Investigate', 'Tehqeeq karein'],
  ['Measure', 'Measure', 'Naapiye'],
  ['Demonstrate', 'Demonstrate', 'Zahir karein'],
  ['Visualize', 'Visualize', 'Tasawur karein'],
  ['Simulate', 'Simulate', 'Simulate karein'],
  ['Practice', 'Practice', 'Mashq karein'],
  ['Draft', 'Draft', 'Masuda banayein'],
  ['Trace', 'Trace', 'Suragh lagayein'],
  ['Track', 'Track', 'Track karein'],
  ['Map', 'Map', 'Naqsha banayein'],
  ['Model', 'Model', 'Model banayein'],
  ['Prepare', 'Prepare', 'Tayyar karein'],
  ['Formulate', 'Formulate', 'Formulate karein'],
  ['Separate', 'Separate', 'Alehda karein'],
  ['Perform', 'Perform', 'Anjaam dein'],
  ['Run', 'Run', 'Chalayein'],
  ['Operate', 'Operate', 'Chalayein'],
  ['React', 'React', 'React karein'],
  ['Mix', 'Mix', 'Mix karein'],
  ['Extract', 'Extract', 'Nikaaliye'],
  ['Filter', 'Filter', 'Filter karein'],
  ['Neutralize', 'Neutralize', 'Neutralize karein'],
  ['Convert', 'Convert', 'Tabdeel karein'],
  ['Generate', 'Generate', 'Paida karein'],
  ['Produce', 'Produce', 'Paida karein'],
  ['Create', 'Create', 'Takhleeq karein'],
  ['Determine', 'Determine', 'Maloom karein'],
  ['Verify', 'Verify', 'Tasdeeq karein'],
  ['Analyze', 'Analyze', 'Tajzia karein'],
  ['Predict', 'Predict', 'Pesh-goi karein'],
  ['Show', 'Show', 'Dikhayein'],
  ['Count', 'Count', 'Ginen'],
  ['Drop', 'Drop', 'Daalein'],
  ['Heat', 'Heat', 'Garam karein'],
  ['Pluck', 'Pluck', 'Khenchein'],
  ['Sprinkle', 'Sprinkle', 'Chirakain'],
  ['Strike', 'Strike', 'Maarein'],
  ['Thread', 'Thread', 'Dhaaga daalein'],
  ['Wrap', 'Wrap', 'Lapetain'],
  ['Rub', 'Rub', 'Ragadein'],
  ['Thrust', 'Thrust', 'Dhakelain'],
  ['Spin', 'Spin', 'Ghumayein'],
  ['Sort', 'Sort', 'Tarteeb dein'],
  ['Organize', 'Organize', 'Muntazim karein'],
  ['Navigate', 'Navigate', 'Navigate karein'],
  ['Arrange', 'Arrange', 'Tarteeb dein'],
  ['Step-by-step', 'Step-by-step', 'Qadam-ba-qadam'],
  ['Prove', 'Prove', 'Saabit karein'],
  ['Apply', 'Apply', 'Apply karein'],
  ['Understand', 'Understand', 'Samjhein'],
  ['Sketch', 'Sketch', 'Khaka banayein'],
  ['Locate', 'Locate', 'Talash karein'],
  ['Place', 'Place', 'Rakhein'],
  ['Connect', 'Connect', 'Jorein'],
  ['Turn', 'Turn', 'Ghumayein'],
  ['Lift', 'Lift', 'Uthayein'],
  ['Push', 'Push', 'Dhakelain'],
  ['Pull', 'Pull', 'Khenchein'],
  ['Draw', 'Draw', 'Banayein'],
  ['Write', 'Write', 'Likhein'],
  ['Read', 'Read', 'Parhein'],
  ['Answer', 'Answer', 'Jawab dein'],
  ['Explain', 'Explain', 'Wazahat karein'],
  ['Describe', 'Describe', 'Bayaan karein'],
  ['Define', 'Define', 'Tareef karein'],
  ['List', 'List', 'Fehrist banayein'],
  ['Label', 'Label', 'Label lagayein'],
  ['Classify', 'Classify', 'Darja bandi karein'],
  ['Distinguish', 'Distinguish', 'Farq karein'],
  ['Differentiate', 'Differentiate', 'Imtiaz karein'],
  ['State', 'State', 'Bayaan karein'],
  ['Mention', 'Mention', 'Zikr karein'],
  ['Give', 'Give', 'Dein'],
  ['Name', 'Name', 'Naam batayein'],
  ['Discuss', 'Discuss', 'Bahes karein'],
  ['Interpret', 'Interpret', 'Tabeer karein'],
  ['Evaluate', 'Evaluate', 'Janchein'],
  ['Justify', 'Justify', 'Suboot dein'],
  ['Summarize', 'Summarize', 'Khulasa karein'],
  ['Outline', 'Outline', 'Khaka pesh karein'],
  ['Review', 'Review', 'Jaiza lein'],
  ['Select', 'Select', 'Muntakhab karein'],
  ['Choose', 'Choose', 'Chunein'],
  ['Complete', 'Complete', 'Mukammal karein'],
  ['Fill', 'Fill', 'Par karein'],
  ['Match', 'Match', 'Milap karein'],
];

// Title translations from labContent.ts
const TITLE_TRANSLATIONS = [
  ['p9_deriv_force_momentum', 'Derivation: Force & Momentum'],
  ['p9_deriv_recoil', 'Derivation: Recoil Velocity'],
  ['p9_deriv_orbital', 'Derivation: Orbital Velocity'],
  ['p9_deriv_liquid_pressure', 'Derivation: Liquid Pressure'],
  ['p9_deriv_hydraulic', 'Derivation: Hydraulic Lift'],
  ['p9_deriv_ke', 'Derivation: Kinetic Energy'],
  ['p9_deriv_gpe', 'Derivation: Gravitational Potential Energy'],
  ['p10_deriv_specific_heat_mixtures', 'Derivation: Specific Heat (Mixtures)'],
  ['p10_deriv_wave_equation', 'Derivation: Wave Equation v = fλ'],
];

// Add verb patterns
let enAdded = 0;
let ruAdded = 0;
for (const [key, enVal, ruVal] of VERB_PATTERNS) {
  const k = `lab.verb.${key.toLowerCase()}`;
  if (!en[k]) { en[k] = enVal; enAdded++; }
  if (!ru[k]) { ru[k] = ruVal; ruAdded++; }
}

// Add title translations
for (const [moduleId, title] of TITLE_TRANSLATIONS) {
  const k = `lab.title.${moduleId}`;
  if (!en[k]) { en[k] = title; enAdded++; }
  if (!ru[k]) { ru[k] = title; ruAdded++; } // Same in both (proper names)
}

// Write updated files
fs.writeFileSync(EN_FILE, JSON.stringify(en, null, 2));
fs.writeFileSync(RU_FILE, JSON.stringify(ru, null, 2));

console.log(`Added ${enAdded} keys to en/translation.json (total: ${Object.keys(en).length})`);
console.log(`Added ${ruAdded} keys to roman-urdu/translation.json (total: ${Object.keys(ru).length})`);
