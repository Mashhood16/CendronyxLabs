import fs from 'fs';

const RU_FILE = 'src/locales/roman-urdu/translation.json';
const ru = JSON.parse(fs.readFileSync(RU_FILE, 'utf8'));

// Character-level transliteration map: Urdu Nastaliq → Latin script
const CHAR_MAP = {
  '\u0627': 'a', // ا alif
  '\u0622': 'a', // آ alif madd
  '\u0628': 'b', // ب be
  '\u067E': 'p', // پ pe
  '\u062A': 't', // ت te
  '\u0679': 't', // ٹ ṭe
  '\u062B': 's', // ث se
  '\u062C': 'j', // ج jīm
  '\u0686': 'ch', // چ che
  '\u062D': 'h', // ح he
  '\u062E': 'kh', // خ khe
  '\u062F': 'd', // د dāl
  '\u0688': 'd', // ڈ ḍāl
  '\u0630': 'z', // ذ zāl
  '\u0631': 'r', // ر re
  '\u0691': 'r', // ڑ ṛe
  '\u0632': 'z', // ز ze
  '\u0698': 'zh', // ژ zhe
  '\u0633': 's', // س sīn
  '\u0634': 'sh', // ش shīn
  '\u0635': 's', // ص su'ād
  '\u0636': 'z', // ض zu'ād
  '\u0637': 't', //ط to'e
  '\u0638': 'z', // ظ zo'e
  '\u0639': '',  // ع 'ain (omitted in Urdu transliteration)
  '\u063A': 'gh', // غ ghain
  '\u0641': 'f', // ف fe
  '\u0642': 'q', // ق qāf
  '\u06A9': 'k', // ک kāf
  '\u06AF': 'g', // گ gāf
  '\u0644': 'l', // ل lām
  '\u0645': 'm', // م mīm
  '\u0646': 'n', // ن nūn
  '\u06BA': 'n', // ں nūn ghunna
  '\u0648': 'o', // و wā'o (often 'o' or 'u' in Urdu)
  '\u06C1': 'h', // ہ he
  '\u06BE': 'h', // ھ he (do chashmi)
  '\u0621': '',  // ء hamza
  '\u0624': 'u', // ؤ wā'o with hamza
  '\u0626': 'i', // ئ ye with hamza
  '\u06CC': 'y', // ی ye (often 'y' or 'i')
  '\u06D2': 'e', // ے ye barree
  '\u06D3': 'e', // ۓ ye barree with hamza

  // Digits
  '\u06F0': '0',
  '\u06F1': '1',
  '\u06F2': '2',
  '\u06F3': '3',
  '\u06F4': '4',
  '\u06F5': '5',
  '\u06F6': '6',
  '\u06F7': '7',
  '\u06F8': '8',
  '\u06F9': '9',

  // Punctuation
  '\u060C': ',', // ،
  '\u061F': '?', // ؟
  '\u061B': ';', // ؛
};

// Full-word overrides for common English loanwords written in Nastaliq
// These are the most common Nastaliq → Latin mappings for English loanwords
const WORD_OVERRIDES = [
  ['لیب', 'Lab'],
  ['لاب', 'Lab'],
  ['لب', 'Lab'],
  ['نظریہ', 'Nazriya'],
  ['تھیوری', 'Theory'],
  ['ثیوری', 'Theory'],
  ['چیک کریں', 'Check karein'],
  ['ڈیٹا اور تجزیہ', 'Data aur Analysis'],
  ['ڈیٹا اور تجزا و تجزیہ', 'Data aur Tajzia aur Analysis'],
  ['انٹرایکٹو سمیولیٹر', 'Interactive Simulator'],
  ['ڈیٹا لاگنگ', 'Data Logging'],
  ['سیٹ اپ', 'Setup'],
  ['تھیوری اور سیٹ اپ', 'Theory aur Setup'],
  ['ثیوری اور سیٹ اپ', 'Theory aur Setup'],
  ['تحلیل', 'Analysis'],
  ['تحلیلی جائزہ', 'Analysis Review'],
  ['جانچ کریں', 'Janch karein'],
  ['مواد', 'Mawad'],
  ['غلط۔ دوبارہ کوشش کریں۔', 'Ghalat. Dobarah koshish karein.'],
  ['مثلاً', 'Maslan'],
  ['علمی جانچ', 'Ilmi Janch'],
  ['ابھی تک کوئی ڈیٹا ریکارڈ نہیں کیا گیا۔', 'Abhi tak koi data record nahi kiya gaya.'],
  ['ابھی تک کوئی ڈیٹا ریکارڈ نہیں کیا گیا', 'Abhi tak koi data record nahi kiya gaya'],
  ['سیٹ اپ پیرامیٹرز', 'Setup Parameters'],
  ['لیبارٹری', 'Laboratory'],
  ['ڈیٹا لاگر', 'Data Logger'],
  ['ڈیٹا کا تجزیہ', 'Data ka Analysis'],
  ['ان پٹ', 'Input'],
  ['آؤٹ پٹ', 'Output'],
  ['ری سیٹ کریں', 'Reset karein'],
  ['کنٹرولز', 'Controls'],
  ['تجزیہ', 'Analysis'],
  ['ڈیٹا ریکارڈنگ', 'Data Recording'],
  ['ڈیٹا لاگ', 'Data Log'],
  ['درجہ حرارت میں تبدیلی (ΔT)', 'Darja hararat mein tabdeeli (ΔT)'],
  ['سمولیشن', 'Simulation'],
  ['کوئی ڈیٹا ریکارڈ نہیں کیا گیا۔', 'Koi data record nahi kiya gaya.'],
  ['کوئی ڈیٹا ریکارڈ نہیں کیا گیا', 'Koi data record nahi kiya gaya'],
  ['انٹرایکٹو سمولیٹر', 'Interactive Simulator'],
  ['کلاس', 'Class'],
  ['سائن آؤٹ', 'Sign Out'],
  ['لاگ ان', 'Log In'],
  ['سیمولیشن', 'Simulation'],
  ['آؤٹ پٹ', 'Output'],
  ['سپرنگز', 'Springs'],
  ['عمل', 'Amal'],
  ['تجرباتی سیٹ اپ', 'Experimental Setup'],
  ['ریکارڈ کریں', 'Record karein'],
  ['تھیوری', 'Theory'],
  ['ثیوری', 'Theory'],
  ['تھیم', 'Theme'],
  ['فونٹ سائز', 'Font Size'],
  ['سیکشن', 'Section'],
  ['رجسٹر', 'Register'],
  ['سسٹم آن لائن', 'System Online'],
  ['سسٹم آف لائن', 'System Offline'],
  ['کیلکولیٹر', 'Calculator'],
  ['ماخوذ', 'Derivation'],
  ['اخذ', 'Derivation'],
  ['مرحلہ', 'Step'],
  ['ایمیٹر', 'Emitter'],
  ['اسسمنٹ', 'Assessment'],
  ['سکور', 'Score'],
  ['سمولیٹر', 'Simulator'],
  ['سمیولیٹر', 'Simulator'],
  ['سملیٹر', 'Simulator'],
  ['سمیولیشن', 'Simulation'],
  ['سیمولییشن', 'Simulation'],
  ['لائیو سملیٹر', 'Live Simulator'],
  ['جائزہ', 'Review'],
  ['امتحان', 'Imtihan'],
  ['امتحانات', 'Imtihanat'],
  ['تجزیہ', 'Analysis'],
  ['تجزا و تجزیہ', 'Tajzia aur Analysis'],
  ['تحلیل', 'Analysis'],
  ['تحلیلی جائزہ', 'Analysis Review'],
  ['تحلیل کا کام', 'Analysis Work'],
  ['تحقیقاتی عمل', 'Tahqeeqati Amal'],
  ['چیک', 'Check'],
  ['چیک کریں', 'Check karein'],
  ['ری سیٹ کریں', 'Reset karein'],
  ['دوبارہ ترتیب دیں', 'Dobarah tarteeb dein'],
  ['دوبارہ کوشش کریں', 'Dobarah koshish karein'],
  ['غلط', 'Ghalat'],
  ['صحیح', 'Sahi'],
  ['صحیح ہے', 'Sahi hai'],
  ['درست ہے', 'Durust hai'],
  ['کوشش کریں', 'Koshish karein'],
  ['جواب', 'Jawab'],
  ['نتیجہ', 'Natija'],
  ['مشاہدہ', 'Mushahida'],
  ['پیمائش', 'Paimaish'],
  ['مربع', 'Murabba'],
  ['دباؤ', 'Dabao'],
  ['مائع', 'Mai'],
  ['درجہ حرارت', 'Darja Hararat'],
  ['حرارت', 'Hararat'],
  ['توانائی', 'Tawanai'],
  ['قوت', 'Quwwat'],
  ['طاقت', 'Taaqat'],
  ['حرکت', 'Harkat'],
  ['فاصلہ', 'Fasla'],
  ['وقت', 'Waqt'],
  ['لمبائی', 'Lambai'],
  ['اونچائی', 'Oonchai'],
  ['چوڑائی', 'Chorai'],
  ['موٹائی', 'Motai'],
  ['گہرائی', 'Gahrai'],
  ['مقدار', 'Miqdar'],
  ['قدر', 'Qadar'],
  ['قانون', 'Qanoon'],
  ['اصول', 'Usool'],
  ['فارمولا', 'Formula'],
  ['مساوات', 'Musawat'],
  ['رفتار', 'Raftaar'],
  ['شرح', 'Sharh'],
  ['درجہ', 'Darja'],
  ['حجم', 'Hajam'],
  ['رقبہ', 'Raqba'],
  ['کثافت', 'Kasafat'],
  ['Mass', 'Mass'],
  ['ما', 'Ma'],
  ['نیوٹن', 'Newton'],
  ['جول', 'Joule'],
  ['وولٹ', 'Volt'],
  ['ایمپئر', 'Ampere'],
  ['اوہم', 'Ohm'],
  ['ہرٹز', 'Hertz'],
  ['ٹیسلا', 'Tesla'],
  ['فیصد', 'Percent'],
  ['فی', 'Per'],
  ['اور', 'aur'],
  ['کا', 'ka'],
  ['کی', 'ki'],
  ['کے', 'ke'],
  ['سے', 'se'],
  ['میں', 'mein'],
  ['پر', 'par'],
  ['کو', 'ko'],
  ['ہے', 'hai'],
  ['ہیں', 'hain'],
  ['تھا', 'tha'],
  ['تھے', 'thay'],
  ['نہیں', 'nahi'],
  ['ایک', 'ek'],
  ['دو', 'do'],
  ['تین', 'teen'],
  ['چار', 'chaar'],
  ['پانچ', 'paanch'],
  ['چھ', 'chay'],
  ['سات', 'saat'],
  ['آٹھ', 'aath'],
  ['نو', 'nau'],
  ['دس', 'das'],
  ['یہ', 'yeh'],
  ['وہ', 'woh'],
  ['اس', 'is'],
  ['ان', 'in'],
  ['ان کا', 'un ka'],
  ['ان کی', 'un ki'],
  ['ان کے', 'un ke'],
  ['جن', 'jin'],
  ['جس', 'jis'],
  ['جب', 'jab'],
  ['پھر', 'phir'],
  ['تو', 'to'],
  ['اگر', 'agar'],
  ['لیکن', 'lekin'],
  ['بلکہ', 'balke'],
  ['کیونکہ', 'kyunke'],
  ['اور', 'aur'],
  ['لیے', 'liye'],
  ['ساتھ', 'saath'],
  ['مثلاً', 'maslan'],
  ['فرض کریں', 'farz karein'],
  ['یقینی بنائیں', 'yaqeeni banayein'],
  ['استعمال', 'istamal'],
  ['استعمال کریں', 'istamal karein'],
  ['تلاش کریں', 'talash karein'],
  ['حاصل کریں', 'hasil karein'],
  ['رکھیں', 'rakhein'],
  ['دیں', 'dein'],
  ['لکھیں', 'likhein'],
  ['دیکھیں', 'dekhein'],
  ['کریں', 'karein'],
  ['کیجیے', 'kijiye'],
  ['جائیے', 'jaiye'],
  ['آپ', 'aap'],
  ['ہم', 'hum'],
  ['وہ', 'woh'],
  ['میں', 'mein'],
  ['تک', 'tak'],
  ['بعد', 'baad'],
  ['پہلے', 'pehle'],
  ['بہت', 'bohat'],
  ['زیادہ', 'zyada'],
  ['کم', 'kam'],
  ['بڑا', 'bara'],
  ['چھوٹا', 'chota'],
  ['نیا', 'naya'],
  ['پرانا', 'purana'],
  ['اچھا', 'acha'],
  ['برا', 'bura'],
  ['ٹھیک', 'theek'],
  ['غلط', 'ghalat'],
  ['سہی', 'sahi'],
  ['صحیح', 'sahi'],
  ['غلطی', 'ghalti'],
  ['درست', 'durust'],
  ['غلط', 'ghalat'],
  ['نیچے', 'neeche'],
  ['اوپر', 'oopar'],
  ['اندر', 'andar'],
  ['باہر', 'bahar'],
  ['قریب', 'qareeb'],
  ['دور', 'door'],
  ['آگے', 'aage'],
  ['پیچھے', 'peeche'],
  ['سامنے', 'saamne'],
  ['شامل', 'shamil'],
  ['مختلف', 'mukhtalif'],
  ['خاص', 'khaas'],
  ['عام', 'aam'],
  ['بنیادی', 'bunyadi'],
  ['اساسی', 'asasi'],
  ['مکمل', 'mukammal'],
  ['ناقص', 'naqis'],
  ['آسان', 'asaan'],
  ['مشکل', 'mushkil'],
  ['ممکن', 'mumkin'],
  ['ناممکن', 'na-mumkin'],
  ['ضروری', 'zaroori'],
  ['لازمی', 'lazmi'],
  ['اہم', 'ahem'],
  ['بہترین', 'behtareen'],
  ['زبَر دست', 'zabardast'],
  ['عمدہ', 'umdah'],
  ['نمبر', 'nambar'],
  ['فیصد', 'fi sadd'],
  ['نظریہ', 'nazriya'],
  ['عملی', 'amli'],
  ['تجربہ', 'tajurba'],
  ['مشق', 'mashq'],
  ['کامیاب', 'kamyab'],
  ['ناکام', 'na-kam'],
  ['آزاد', 'azad'],
  ['الگ', 'alag'],
  ['جدا', 'juda'],
  ['ملی', 'milli'],
  ['سینٹی', 'senti'],
  ['ملی میٹر', 'milli metre'],
  ['سینٹی میٹر', 'senti metre'],
  ['کلو میٹر', 'kilo metre'],
  ['کلوگرام', 'kilogram'],
  ['مربع میٹر', 'murabba metre'],
];

const isNastaliq = (s) => /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(s);

function convertToLatin(text) {
  if (!text || typeof text !== 'string') return text;
  if (!isNastaliq(text)) return text;

  let result = text;

  // Pass 1: Apply whole-word overrides (longest first)
  const sortedWords = [...WORD_OVERRIDES].sort((a, b) => b[0].length - a[0].length);
  for (const [search, replace] of sortedWords) {
    // Use word-boundary replacement for clean word substitution
    result = result.replace(new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replace);
  }

  // Pass 2: Character-level transliteration for any remaining Nastaliq characters
  let transliterated = '';
  for (const ch of result) {
    if (CHAR_MAP[ch] !== undefined) {
      transliterated += CHAR_MAP[ch];
    } else {
      transliterated += ch;
    }
  }

  // Clean up: fix common transliteration artifacts
  let cleaned = transliterated;

  // "y" at end of words that should be "i" or "ee" in Urdu context
  // This is a rough heuristic
  cleaned = cleaned.replace(/\by\b/g, ''); // Remove isolated 'y'

  // Fix double spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // Capitalize first letter if the original was probably a title
  if (text.length > 0 && text[0] >= '\u0600' && text[0] <= '\u06FF') {
    // Most Nastaliq entries are UI labels — clean them up
    // Remove leading article remnants
    cleaned = cleaned.replace(/^ek /i, '');
  }

  return cleaned;
}

// Apply to all RU values
let converted = 0;
let unchanged = 0;
Object.keys(ru).forEach(k => {
  const v = ru[k];
  if (!v || typeof v !== 'string') return;
  if (!isNastaliq(v)) return;
  
  const latin = convertToLatin(v);
  if (latin !== v) {
    ru[k] = latin;
    converted++;
  } else {
    unchanged++;
  }
});

// Write the file
fs.writeFileSync(RU_FILE, JSON.stringify(ru, null, 2));

console.log(`Converted: ${converted} Nastaliq values to Latin script`);
console.log(`Unchanged (still Nastaliq): ${unchanged}`);
console.log(`Total RU keys: ${Object.keys(ru).length}`);

// Show some sample conversions
console.log('\n=== SAMPLE CONVERSIONS ===');
const sampleKeys = [];
Object.keys(ru).forEach(k => {
  const v = ru[k];
  if (!v || typeof v !== 'string') return;
  if (sampleKeys.length < 10 && !isNastaliq(v)) {
    // Find a key that was converted (no longer Nastaliq)
    sampleKeys.push({k: k.substring(0, 50), v});
  }
});
sampleKeys.forEach(({k, v}) => console.log(`${k}: ${v.substring(0, 100)}`));
