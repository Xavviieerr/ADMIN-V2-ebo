const engPos = [
  "Noun",
  "Pronoun",
  "Adjective",
  "Verb",
  "Gerund",
  "Adverb",
  "Preposition",
  "Conjunction",
  "Interjection",
  "Numeral",
];
const urhPos = [
  "Odẹ",
  "ẹdiodẹ",
  "Odjephia",
  "Eruo",
  "Eruodẹ",
  "Eruoga",
  "Odjedia",
  "Ọrhuọ",
  "Ukperi",
  "Ubi",
];
const korPos = [
  "명사",
  "대명사",
  "형용사",
  "동사",
  "동명사",
  "부사",
  "조사",
  "접속사",
  "감탄사",
  "수사",
];

export const getPOS = (lang: "eng" | "urh" | "kor") => {
  if (lang === "eng") {
    return engPos;
  }
  if (lang === "kor") {
    return korPos;
  }
  return urhPos;
};
