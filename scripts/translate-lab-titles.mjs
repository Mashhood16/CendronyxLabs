import fs from 'fs';

const EN_FILE = 'src/locales/en/translation.json';
const RU_FILE = 'src/locales/roman-urdu/translation.json';

const en = JSON.parse(fs.readFileSync(EN_FILE, 'utf8'));
const ru = JSON.parse(fs.readFileSync(RU_FILE, 'utf8'));

// Comprehensive subtitle phrase translations
// Each pattern is [regex, replacement] — matched in order, first match wins
const PHRASE_MAP = [
  // Investigate/Explore patterns
  [/^Investigate the relationship between (.+)$/, '$1 ke darmiyan talluq ka jaiza lein'],
  [/^Investigate how (.+) using (.+)$/, '$2 istamal karte hue dekhein ke $1 kaise'],
  [/^Investigate how (.+)$/, 'Dekhein ke $1 kaise'],
  [/^Investigate (.+) using (.+)$/, '$2 se $1 ka jaiza lein'],
  [/^Investigate (.+) of (.+)$/, '$1 $2 ka jaiza lein'],
  [/^Investigate (.+) to (.+)$/, '$1 ka jaiza lein aur $2'],
  [/^Investigate the (.+)$/, '$1 ka jaiza lein'],
  [/^Investigate (.+)$/, '$1 ka jaiza lein'],
  [/^Explore how (.+)$/, 'Dekhein ke $1 kaise'],
  [/^Explore the (.+)$/, '$1 ko daryaft karein'],

  // Observe/Visualize patterns
  [/^Observe how (.+)$/, 'Mushahida karein ke $1 kaise'],
  [/^Observe an? (.+)$/, 'Ek $1 ka mushahida karein'],
  [/^Observe the (.+)$/, '$1 ka mushahida karein'],
  [/^Observe (.+)$/, '$1 ka mushahida karein'],
  [/^Visualize (.+)$/, '$1 ko dekhein'],
  [/^Visualizing (.+)$/, '$1 ko dekhte hue'],

  // Measure/Calculate/Determine patterns
  [/^Measure how (.+) and (.+)$/, 'Measure karein ke $1 aur $2 kaise'],
  [/^Measure how (.+)$/, 'Measure karein ke $1 kaise'],
  [/^Measure the (.+) of (.+)$/, '$2 ki $1 measure karein'],
  [/^Measure (.+) using (.+)$/, '$2 se $1 measure karein'],
  [/^Measure (.+)$/, '$1 measure karein'],
  [/^Calculate the (.+)$/, '$1 ka hisab lagayein'],
  [/^Calculate (.+)$/, '$1 ka hisab lagayein'],
  [/^Determine the (.+)$/, '$1 maloom karein'],
  [/^Determine (.+)$/, '$1 maloom karein'],

  // Test/Analyze/Compare patterns
  [/^Test (.+?) with (.+)$/, '$1 ko $2 se test karein'],
  [/^Test (.+?) for (.+)$/, '$1 mein $2 test karein'],
  [/^Test (.+)$/, '$1 test karein'],
  [/^Analyze (.+)$/, '$1 ka tajzia karein'],
  [/^Compare (.+)$/, '$1 ka mawazna karein'],
  [/^Examine (.+)$/, '$1 ka jaiza lein'],

  // Building/Creating patterns
  [/^Build an? (.+)$/, 'Ek $1 banayein'],
  [/^Build a (.+)$/, 'Ek $1 banayein'],
  [/^Build (.+)$/, '$1 banayein'],
  [/^Construct an? (.+)$/, 'Ek $1 tameer karein'],
  [/^Construct (.+)$/, '$1 tameer karein'],
  [/^Create (.+)$/, '$1 banayein'],
  [/^Design an? (.+)$/, 'Ek $1 design karein'],
  [/^Design a (.+)$/, 'Ek $1 design karein'],
  [/^Design (.+)$/, '$1 design karein'],
  [/^Prepare (.+)$/, '$1 tayyar karein'],
  [/^Draft (.+)$/, '$1 ka masuda banayein'],
  [/^Formulate (.+)$/, '$1 formulate karein'],
  [/^Generate (.+)$/, '$1 paida karein'],
  [/^Produce (.+)$/, '$1 paida karein'],

  // Practice/Perform patterns
  [/^Practice (.+)$/, '$1 ki mashq karein'],
  [/^Perform (.+)$/, '$1 anjaam dein'],
  [/^Demonstrate (.+)$/, '$1 zahir karein'],
  [/^Simulate (.+)$/, '$1 simulate karein'],
  [/^Model (.+)$/, '$1 ka model banayein'],
  [/^Map (.+)$/, '$1 ka naqsha banayein'],
  [/^Trace (.+)$/, '$1 ka suragh lagayein'],
  [/^Track (.+)$/, '$1 track karein'],
  [/^Sort (.+)$/, '$1 ko tarteeb dein'],
  [/^Organize (.+)$/, '$1 muntazim karein'],
  [/^Classify (.+)$/, '$1 ki darja bandi karein'],

  // Identification patterns
  [/^Identify (.+) and (.+)$/, '$1 aur $2 ki pehchan karein'],
  [/^Identify (.+)$/, '$1 ki pehchan karein'],
  [/^Locate (.+)$/, '$1 talash karein'],
  [/^Select (.+)$/, '$1 muntakhab karein'],
  [/^Choose (.+)$/, '$1 chunein'],
  [/^Name (.+)$/, '$1 ke naam batayein'],
  [/^List (.+)$/, '$1 ki fehrist banayein'],
  [/^Label (.+)$/, '$1 par label lagayein'],
  [/^Count (.+)$/, '$1 ginen'],

  // Separation/Extraction patterns
  [/^Separate (.+)$/, '$1 alehda karein'],
  [/^Extract (.+)$/, '$1 nikaaliye'],
  [/^Filter (.+)$/, '$1 filter karein'],
  [/^Convert (.+)$/, '$1 tabdeel karein'],
  [/^Mix (.+)$/, '$1 mix karein'],
  [/^React (.+)$/, '$1 react karein'],
  [/^Neutralize (.+)$/, '$1 neutralize karein'],

  // Verification/Completion patterns
  [/^Verify (.+)$/, '$1 ki tasdeeq karein'],
  [/^Confirm (.+)$/, '$1 ki tasdeeq karein'],
  [/^Complete (.+)$/, '$1 mukammal karein'],
  [/^Fill (.+)$/, '$1 par karein'],
  [/^Match (.+)$/, '$1 ka milap karein'],
  [/^Distinguish (.+)$/, '$1 mein farq karein'],
  [/^Differentiate (.+)$/, '$1 mein imtiaz karein'],

  // Communication patterns
  [/^Discuss (.+)$/, '$1 par bahes karein'],
  [/^Explain (.+)$/, '$1 ki wazahat karein'],
  [/^Describe (.+)$/, '$1 bayaan karein'],
  [/^Define (.+)$/, '$1 ki tareef karein'],
  [/^Summarize (.+)$/, '$1 ka khulasa karein'],
  [/^Outline (.+)$/, '$1 ka khaka pesh karein'],
  [/^State (.+)$/, '$1 bayaan karein'],
  [/^Mention (.+)$/, '$1 ka zikr karein'],
  [/^Give (.+)$/, '$1 dein'],
  [/^Justify (.+)$/, '$1 ka suboot dein'],
  [/^Interpret (.+)$/, '$1 ki tabeer karein'],
  [/^Evaluate (.+)$/, '$1 ka jaiza lein'],
  [/^Review (.+)$/, '$1 ka jaiza lein'],
  [/^Answer (.+)$/, '$1 ka jawab dein'],
  [/^Write (.+)$/, '$1 likhein'],
  [/^Read (.+)$/, '$1 parhein'],
  [/^Draw (.+)$/, '$1 banayein'],
  [/^Sketch (.+)$/, '$1 ka khaka banayein'],
  [/^Show (.+)$/, '$1 dikhayein'],
  [/^Prove (.+)$/, '$1 sabit karein'],
  [/^Apply (.+)$/, '$1 apply karein'],
  [/^Understand (.+)$/, '$1 samjhein'],

  // Specific physics lab subtitles
  [/^Drill holes in (.+) to (.+)$/, '$1 mein hole drill karein taake $2'],
  [/^Hang (.+) to (.+)$/, '$1 latkayein taake $2'],
  [/^Plot (.+) using (.+)$/, '$2 istamal karte hue $1 plot karein'],
  [/^Induce (.+) via (.+)$/, '$2 ke zariye $1 induce karein'],
  [/^Drop (.+) to (.+)$/, '$1 giraayein taake $2'],
  [/^Strike (.+) to (.+)$/, '$1 maarein taake $2'],
  [/^Push (.+) to (.+)$/, '$1 dhakelain taake $2'],
  [/^Pull (.+) to (.+)$/, '$1 khenchein taake $2'],
  [/^Turn (.+) to (.+)$/, '$1 ghumayein taake $2'],
  [/^Lift (.+) to (.+)$/, '$1 uthayein taake $2'],
  [/^Place (.+) to (.+)$/, '$1 rakhein taake $2'],
  [/^Connect (.+) to (.+)$/, '$1 $2 se jorein'],
  [/^Wrap (.+) to (.+)$/, '$1 lapetain taake $2'],
  [/^Thread (.+) to (.+)$/, '$1 mein dhaaga daalein taake $2'],
  [/^Rub (.+) to (.+)$/, '$1 ragadein taake $2'],
  [/^Thrust (.+) into (.+)$/, '$1 $2 mein dhakelain'],
  [/^Spin (.+) to (.+)$/, '$1 ghumayein taake $2'],
  [/^Heat (.+) to (.+)$/, '$1 garam karein taake $2'],
  [/^Pluck (.+) to (.+)$/, '$1 khenchein taake $2'],
  [/^Sprinkle (.+) to (.+)$/, '$1 chirakain taake $2'],
  [/^Navigate (.+) to (.+)$/, '$1 navigate karein taake $2'],

  // Remaining patterns
  [/^Assemble (.+)$/, '$1 jama karein'],
  [/^Use (.+) to (.+)$/, '$1 istamal karte hue $2'],
  [/^Run (.+)$/, '$1 chalayein'],
  [/^Operate (.+)$/, '$1 chalayein'],
  [/^Prepare an? (.+) based (.+)$/, '$1 $2 ki bunyad par tayyar karein'],
  [/^Arrange (.+)$/, '$1 tarteeb dein'],
  [/^Step-by-step (.+)$/, '$1 qadam-ba-qadam'],
];

function translateSubtitle(text) {
  let result = text;
  for (const [pattern, replacement] of PHRASE_MAP) {
    const newResult = result.replace(pattern, replacement);
    if (newResult !== result) return newResult;
  }
  return result;
}

// Apply translations
let translated = 0;

// 1. Lab subtitle keys
Object.keys(en).forEach(k => {
  if (!k.startsWith('lab.subtitle')) return;
  const enVal = en[k];
  if (!enVal || enVal.length < 5) return;
  if (ru[k] && ru[k] !== en[k]) return;
  ru[k] = translateSubtitle(enVal);
  translated++;
});

// 2. Lab title keys (ending with _lab)
Object.keys(en).forEach(k => {
  if (!k.endsWith('_lab')) return;
  const enVal = en[k];
  if (!enVal || enVal.length < 3) return;
  if (ru[k] && ru[k] !== en[k]) return;
  // For unit titles like "Unit 5: Liquid Pressure", "Unit" stays as English
  // (it's commonly used in Roman Urdu context)
  ru[k] = enVal;
  translated++;
});

// 3. Lab-specific header title keys (not generic keys)
Object.keys(en).forEach(k => {
  if (!k.startsWith('lab.') || k.endsWith('_lab') || k.startsWith('lab.subtitle') || k.startsWith('lab.tab.') || k.startsWith('lab.verb.') || k.startsWith('lab.title.')) return;
  // Skip if already translated
  if (ru[k] && ru[k] !== en[k]) return;
  // Only process keys that look like header/descriptive text (longer strings)
  const enVal = en[k];
  if (!enVal || enVal.length < 10) return;
  // Don't translate pure technical terms (math formulas, short labels)
  if (enVal.match(/^[A-Z][a-z]?\d/) || enVal.startsWith('$$') || enVal.includes('\\\\')) return;
  // Apply the same phrase translation
  ru[k] = translateSubtitle(enVal);
  translated++;
});

fs.writeFileSync(RU_FILE, JSON.stringify(ru, null, 2));
console.log(`Translated ${translated} additional keys`);
console.log(`Total RU keys: ${Object.keys(ru).length}`);
