import { getPOS } from "@/helpers";
import { useSingleWordView } from "@/features/dictionary/word-detail/hooks/useSingleWordView";

export function useTranslationLanguage() {
  const { lang } = useSingleWordView();

  const formatLang = () => {
    const lowLang = lang.toLowerCase();
    if (lowLang === "english") return "eng";
    if (lowLang === "korean") return "kor";
    return "urh";
  };

  const pos = getPOS(formatLang());
  const isKorean = lang.toLowerCase() === "korean";

  return {
    lang,
    pos,
    title: isKorean ? "Korean Translation" : "English Translation",
    examplesTitle: isKorean ? "Korean Examples" : "English Examples",
  };
}
