import { getPOS } from "@/helpers";
import { useSingleWordView } from "@/features/dictionary/word-detail/hooks/useSingleWordView";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

export function useTranslationLanguage() {
  const { lang } = useSingleWordView();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

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
    title: isKorean
      ? t("common.dictionary.koreanTranslation", "Korean Translation")
      : t("common.dictionary.englishTranslation", "English Translation"),
    examplesTitle: isKorean
      ? t("common.dictionary.koreanExamples", "Korean Examples")
      : t("common.dictionary.englishExamples", "English Examples"),
  };
}
