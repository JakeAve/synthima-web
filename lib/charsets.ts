// lib/charsets.ts

export interface CharSetPreset {
  name: string;
  charSet: string;
}

// ── Latin – Basic ─────────────────────────────────────────────────────────────

export const PRESET_UPPERCASE: CharSetPreset = {
  name: "Uppercase (A–Z)",
  charSet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
};

export const PRESET_LOWERCASE: CharSetPreset = {
  name: "Lowercase (a–z)",
  charSet: "abcdefghijklmnopqrstuvwxyz",
};

export const PRESET_NUMBERS: CharSetPreset = {
  name: "Numbers (0–9)",
  charSet: "0123456789",
};

export const PRESET_SPECIAL: CharSetPreset = {
  name: "Special (!@#$%^&*)",
  charSet: "!@#$%^&*",
};

// ── Latin – Extended by language ──────────────────────────────────────────────

const PRESET_GERMAN_UPPER: CharSetPreset = {
  name: "German uppercase",
  charSet: PRESET_UPPERCASE.charSet + "ÄÖÜ",
};

const PRESET_GERMAN_LOWER: CharSetPreset = {
  name: "German lowercase",
  charSet: PRESET_LOWERCASE.charSet + "äöüß",
};

const PRESET_FRENCH_UPPER: CharSetPreset = {
  name: "French uppercase",
  charSet: PRESET_UPPERCASE.charSet + "ÀÂÆÇÈÉÊËÎÏÔŒÙÛÜ",
};

const PRESET_FRENCH_LOWER: CharSetPreset = {
  name: "French lowercase",
  charSet: PRESET_LOWERCASE.charSet + "àâæçèéêëîïôœùûü",
};

const PRESET_SPANISH: CharSetPreset = {
  name: "Spanish",
  charSet: PRESET_UPPERCASE.charSet + PRESET_LOWERCASE.charSet + "ñÑ¿¡",
};

const PRESET_NORDIC_UPPER: CharSetPreset = {
  name: "Nordic uppercase",
  charSet: PRESET_UPPERCASE.charSet + "ÅÆØÐÞ",
};

const PRESET_NORDIC_LOWER: CharSetPreset = {
  name: "Nordic lowercase",
  charSet: PRESET_LOWERCASE.charSet + "åæøðþ",
};

const PRESET_CENTRAL_EU_UPPER: CharSetPreset = {
  name: "Central European uppercase",
  charSet: PRESET_UPPERCASE.charSet + "ČŠŽŘÝŮĚŇŤĎĄĆĘŁŃÓŚŹŻ",
};

const PRESET_CENTRAL_EU_LOWER: CharSetPreset = {
  name: "Central European lowercase",
  charSet: PRESET_LOWERCASE.charSet + "čšžřýůěňťďąćęłńóśźż",
};

const PRESET_ROMANIAN_UPPER: CharSetPreset = {
  name: "Romanian uppercase",
  charSet: PRESET_UPPERCASE.charSet + "ĂÂÎȘȚ",
};

const PRESET_ROMANIAN_LOWER: CharSetPreset = {
  name: "Romanian lowercase",
  charSet: PRESET_LOWERCASE.charSet + "ăâîșț",
};

const PRESET_TURKISH_UPPER: CharSetPreset = {
  name: "Turkish uppercase",
  charSet: PRESET_UPPERCASE.charSet + "ÇĞİŞÖÜ",
};

const PRESET_TURKISH_LOWER: CharSetPreset = {
  name: "Turkish lowercase",
  charSet: PRESET_LOWERCASE.charSet + "çğışöü",
};

const PRESET_PORTUGUESE_UPPER: CharSetPreset = {
  name: "Portuguese uppercase",
  charSet: PRESET_UPPERCASE.charSet + "ÃÕÁÉÍÓÚÂÊÎÔÛÀÇ",
};

const PRESET_PORTUGUESE_LOWER: CharSetPreset = {
  name: "Portuguese lowercase",
  charSet: PRESET_LOWERCASE.charSet + "ãõáéíóúâêîôûàç",
};

const PRESET_LATIN_EXTENDED: CharSetPreset = {
  name: "Latin Extended (all)",
  charSet: PRESET_UPPERCASE.charSet + PRESET_LOWERCASE.charSet +
    "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿĀāĂăĄąĆćČčĎďĐđĘęĚěĞğİıŁłŃńŇňŒœŘřŚśŞşŠšŢţŤťŮůŹźŻżŽžÎîȘșȚț",
};

// ── Symbols ───────────────────────────────────────────────────────────────────

const PRESET_EXTENDED_SPECIAL: CharSetPreset = {
  name: "Extended special",
  charSet: `£€¥₹₽₩₪₿±×÷≠≈∞∑∏√∫«»„“”‘’…†‡§¶©®™°¿¡←→↑↓↔`,
};

const PRESET_CURRENCY: CharSetPreset = {
  name: "Currency symbols",
  charSet: "£€¥₹₽₩₪₿¢",
};

const PRESET_MATH: CharSetPreset = {
  name: "Math symbols",
  charSet: "±×÷≠≈∞∑∏√∫∂",
};

const PRESET_ARROWS: CharSetPreset = {
  name: "Arrows",
  charSet: "←→↑↓↔↗↘↙↖⇒⇐⇑⇓",
};

const PRESET_TYPOGRAPHIC: CharSetPreset = {
  name: "Typographic punctuation",
  charSet: `«»„""''…†‡§¶•`,
};

const PRESET_SUPERSCRIPTS: CharSetPreset = {
  name: "Superscripts",
  charSet: "⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ",
};

const PRESET_SUBSCRIPTS: CharSetPreset = {
  name: "Subscripts",
  charSet: "₀₁₂₃₄₅₆₇₈₉",
};

// ── Cyrillic ──────────────────────────────────────────────────────────────────

const PRESET_RUSSIAN: CharSetPreset = {
  name: "Russian",
  charSet: "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя",
};

const PRESET_UKRAINIAN: CharSetPreset = {
  name: "Ukrainian",
  charSet: "АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯабвгґдеєжзиіїйклмнопрстуфхцчшщьюя",
};

const PRESET_BULGARIAN: CharSetPreset = {
  name: "Bulgarian",
  charSet: "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЬЮЯабвгдежзийклмнопрстуфхцчшщъьюя",
};

const PRESET_SERBIAN: CharSetPreset = {
  name: "Serbian Cyrillic",
  charSet: "АБВГДЂЕЖЗИЈКЛЉМНЊОПРСТЋУФХЦЧЏШабвгдђежзијклљмнњопрстћуфхцчџш",
};

// ── Greek ─────────────────────────────────────────────────────────────────────

const PRESET_GREEK: CharSetPreset = {
  name: "Greek",
  charSet: "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρσςτυφχψω",
};

// ── Arabic ────────────────────────────────────────────────────────────────────

const PRESET_ARABIC_LETTERS: CharSetPreset = {
  name: "Arabic letters",
  charSet: "ابتثجحخدذرزسشصضطظعغفقكلمنهوي",
};

const PRESET_ARABIC_INDIC: CharSetPreset = {
  name: "Arabic-Indic digits",
  charSet: "٠١٢٣٤٥٦٧٨٩",
};

const PRESET_ARABIC_PUNCT: CharSetPreset = {
  name: "Arabic punctuation",
  charSet: "،؛؟",
};

// ── Hebrew ────────────────────────────────────────────────────────────────────

const PRESET_HEBREW: CharSetPreset = {
  name: "Hebrew letters",
  charSet: "אבגדהוזחטיכלמנסעפצקרשתךםןףץ",
};

// ── Devanagari ────────────────────────────────────────────────────────────────

const PRESET_HINDI_CONSONANTS: CharSetPreset = {
  name: "Hindi consonants",
  charSet: "कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह",
};

const PRESET_HINDI_VOWELS: CharSetPreset = {
  name: "Hindi vowels",
  charSet: "अआइईउऊएऐओऔ",
};

// ── East Asian ────────────────────────────────────────────────────────────────

const PRESET_CJK: CharSetPreset = {
  name: "Common CJK (Chinese/Japanese)",
  charSet: Array.from(
    { length: 3500 },
    (_, i) => String.fromCodePoint(0x4e00 + i),
  ).join(""),
};

const PRESET_HIRAGANA: CharSetPreset = {
  name: "Japanese Hiragana",
  charSet: Array.from(
    { length: 83 },
    (_, i) => String.fromCodePoint(0x3041 + i),
  ).join(""),
};

const PRESET_KATAKANA: CharSetPreset = {
  name: "Japanese Katakana",
  charSet: Array.from(
    { length: 87 },
    (_, i) => String.fromCodePoint(0x30a1 + i),
  ).join(""),
};

const PRESET_KOREAN_CONSONANTS: CharSetPreset = {
  name: "Korean Jamo consonants",
  charSet: Array.from(
    { length: 14 },
    (_, i) => String.fromCodePoint(0x3131 + i),
  ).join(""),
};

const PRESET_KOREAN_VOWELS: CharSetPreset = {
  name: "Korean Jamo vowels",
  charSet: Array.from(
    { length: 21 },
    (_, i) => String.fromCodePoint(0x314f + i),
  ).join(""),
};

// ── Other Scripts ─────────────────────────────────────────────────────────────

const PRESET_GEORGIAN: CharSetPreset = {
  name: "Georgian (Mkhedruli)",
  charSet: Array.from(
    { length: 33 },
    (_, i) => String.fromCodePoint(0x10d0 + i),
  ).join(""),
};

const PRESET_ARMENIAN: CharSetPreset = {
  name: "Armenian",
  charSet:
    Array.from({ length: 38 }, (_, i) => String.fromCodePoint(0x0531 + i)).join(
      "",
    ) +
    Array.from({ length: 38 }, (_, i) => String.fromCodePoint(0x0561 + i)).join(
      "",
    ),
};

const PRESET_THAI_CONSONANTS: CharSetPreset = {
  name: "Thai consonants",
  charSet: Array.from(
    { length: 44 },
    (_, i) => String.fromCodePoint(0x0e01 + i),
  ).join(""),
};

const PRESET_THAI_VOWELS: CharSetPreset = {
  name: "Thai vowels",
  charSet: "าิีึืุูเแโใไ็่้๊๋์",
};

// ── Master export ─────────────────────────────────────────────────────────────

export const CHAR_SET_PRESETS: CharSetPreset[] = [
  PRESET_UPPERCASE,
  PRESET_LOWERCASE,
  PRESET_NUMBERS,
  PRESET_SPECIAL,
  PRESET_GERMAN_UPPER,
  PRESET_GERMAN_LOWER,
  PRESET_FRENCH_UPPER,
  PRESET_FRENCH_LOWER,
  PRESET_SPANISH,
  PRESET_NORDIC_UPPER,
  PRESET_NORDIC_LOWER,
  PRESET_CENTRAL_EU_UPPER,
  PRESET_CENTRAL_EU_LOWER,
  PRESET_ROMANIAN_UPPER,
  PRESET_ROMANIAN_LOWER,
  PRESET_TURKISH_UPPER,
  PRESET_TURKISH_LOWER,
  PRESET_PORTUGUESE_UPPER,
  PRESET_PORTUGUESE_LOWER,
  PRESET_LATIN_EXTENDED,
  PRESET_EXTENDED_SPECIAL,
  PRESET_CURRENCY,
  PRESET_MATH,
  PRESET_ARROWS,
  PRESET_TYPOGRAPHIC,
  PRESET_SUPERSCRIPTS,
  PRESET_SUBSCRIPTS,
  PRESET_RUSSIAN,
  PRESET_UKRAINIAN,
  PRESET_BULGARIAN,
  PRESET_SERBIAN,
  PRESET_GREEK,
  PRESET_ARABIC_LETTERS,
  PRESET_ARABIC_INDIC,
  PRESET_ARABIC_PUNCT,
  PRESET_HEBREW,
  PRESET_HINDI_CONSONANTS,
  PRESET_HINDI_VOWELS,
  PRESET_CJK,
  PRESET_HIRAGANA,
  PRESET_KATAKANA,
  PRESET_KOREAN_CONSONANTS,
  PRESET_KOREAN_VOWELS,
  PRESET_GEORGIAN,
  PRESET_ARMENIAN,
  PRESET_THAI_CONSONANTS,
  PRESET_THAI_VOWELS,
];
