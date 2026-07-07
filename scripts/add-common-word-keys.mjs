import fs from 'fs';

const RU_FILE = 'src/locales/roman-urdu/translation.json';
const ru = JSON.parse(fs.readFileSync(RU_FILE, 'utf8'));

// Common English words that appear in lab descriptions but DON'T have lab.verb.* keys.
// Adding these so translateLabDesc() in labContent.ts can replace them.
const COMMON_WORDS = {
  // Conjunctions
  'and': 'aur',
  'or': 'ya',
  'but': 'lekin',
  'so': 'toh',
  'because': 'kyunke',
  'if': 'agar',
  'then': 'phir',
  'when': 'jab',
  'where': 'jahan',
  'while': 'jabke',
  'although': 'agarche',
  'though': 'halanke',
  'unless': 'jab tak nahi',
  'since': 'jab se',
  'until': 'jab tak',
  'as': 'jaise',
  'than': 'se',
  'yet': 'phir bhi',
  'nor': 'aur nahi',
  'once': 'ek baar',

  // Prepositions
  'with': 'ke saath',
  'of': 'ka',
  'for': 'ke liye',
  'by': 'ke zariye',
  'from': 'se',
  'through': 'ke zariye',
  'into': 'mein',
  'onto': 'par',
  'upon': 'par',
  'within': 'ke andar',
  'without': 'baghair',
  'across': 'ke across',
  'around': 'ke around',
  'about': 'ke baare mein',
  'above': 'ke oopar',
  'below': 'ke neeche',
  'before': 'se pehle',
  'after': 'ke baad',
  'during': 'ke doran',
  'between': 'ke darmiyan',
  'among': 'ke darmiyan',
  'against': 'ke khilaf',
  'along': 'ke saath',
  'behind': 'ke peeche',
  'towards': 'ki taraf',
  'under': 'ke neeche',
  'over': 'ke oopar',

  // Common verb forms used in descriptions
  'using': 'istamal karte hue',
  'including': 'shamil karte hue',
  'based': 'bunyad par',
  'compared': 'mawazne mein',
  'according': 'ke mutabiq',
  'regarding': 'ke mutabiq',
  'following': 'mandarja zeel',

  // Common adjectives in descriptions
  'different': 'mukhtalif',
  'various': 'mukhtalif',
  'several': 'kayi',
  'multiple': 'kayi',
  'various': 'mukhtalif',
  'both': 'dono',
  'each': 'har',
  'every': 'har',
  'other': 'doosra',
  'another': 'doosra',
  'same': 'ek jaisa',
  'such': 'aisa',
  'own': 'apna',
  'very': 'bohat',
  'many': 'bohat saare',
  'much': 'bohat',
  'more': 'zyada',
  'most': 'sab se zyada',
  'less': 'kam',
  'least': 'sab se kam',
  'also': 'bhi',
  'even': 'yahan tak',
  'just': 'bas',
  'only': 'sirf',
  'still': 'abhi tak',
  'already': 'pehle se',
  'always': 'hamesha',
  'never': 'kabhi nahi',
  'often': 'aksar',
  'usually': 'amuman',
  'sometimes': 'kabhi kabhi',
  'now': 'ab',
  'then': 'phir',
  'here': 'yahan',
  'there': 'wahan',

  // Numbers as words
  'first': 'pehla',
  'second': 'doosra',
  'third': 'teesra',
  'last': 'aakhri',
  'next': 'agla',
  'one': 'ek',
  'two': 'do',
  'three': 'teen',
  'four': 'chaar',
  'five': 'paanch',
};

// Add missing keys
let added = 0;
Object.entries(COMMON_WORDS).forEach(([word, translation]) => {
  const key = `lab.verb.${word}`;
  if (!ru[key]) {
    ru[key] = translation;
    added++;
  }
});

fs.writeFileSync(RU_FILE, JSON.stringify(ru, null, 2));
console.log(`Added ${added} new lab.verb.* keys`);
console.log(`Total lab.verb keys: ${Object.keys(ru).filter(k => k.startsWith('lab.verb.')).length}`);
console.log('Done!');
