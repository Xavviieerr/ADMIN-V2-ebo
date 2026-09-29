import { MultiInput } from "@/features/shared";
import SynonymInput from "./synonym-input";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

export type LexicalValues = {
  ibuebu: string[];
  okpo: { ota: string; egba: string }[];
  orhan: string[];
  ekaeruo: string[];
};

const LexicalFields = ({
  values,
  onChange,
  lang,
}: {
  values: LexicalValues;
  onChange: (patch: Partial<LexicalValues>) => void;
  lang?: "urh" | "eng" | "kor";
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  return (
    <>
      <MultiInput
        placeholder={t("common.dictionary.plurals", "Plural forms of the word")}
        selectedLabel={t("common.dictionary.selectedPlurals", "Selected plurals")}
        values={values.ibuebu}
        removeValue={(value) =>
          onChange({ ibuebu: values.ibuebu.filter((t) => t !== value) })
        }
        addValue={(value) =>
          onChange({ ibuebu: [...values.ibuebu, value] })
        }
      />

      <SynonymInput
        placeholder={t("common.dictionary.synonyms", "Synonyms of the word")}
        lang={lang}
        selectedLabel={t("common.dictionary.selectedSynonyms", "Selected synonyms")}
        values={values.okpo.map((t) => t.ota)}
        removeValue={(value) =>
          onChange({ okpo: values.okpo.filter((t) => t.ota !== value) })
        }
        addValue={(value) => onChange({ okpo: [...values.okpo, value] })}
      />

      <MultiInput
        placeholder={t("common.dictionary.antonyms", "Antonyms of the word")}
        selectedLabel={t("common.dictionary.selectedAntonyms", "Selected antonyms")}
        values={values.orhan}
        removeValue={(value) =>
          onChange({ orhan: values.orhan.filter((t) => t !== value) })
        }
        addValue={(value) => onChange({ orhan: [...values.orhan, value] })}
      />

      <MultiInput
        placeholder={t("common.dictionary.relatedWords", "Related words")}
        selectedLabel={t("common.dictionary.selectedRelated", "Selected related words")}
        values={values.ekaeruo}
        removeValue={(value) =>
          onChange({ ekaeruo: values.ekaeruo.filter((t) => t !== value) })
        }
        addValue={(value) =>
          onChange({ ekaeruo: [...values.ekaeruo, value] })
        }
      />
    </>
  );
};

export default LexicalFields;
