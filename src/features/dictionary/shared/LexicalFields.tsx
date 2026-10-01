import { MultiInput } from "@/features/shared";
import SynonymInput from "./synonym-input";
import TranslatingFrom from "@/features/dictionary/word-detail/forms/shared/TranslatingFrom";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

export type LexicalValues = {
  ibuebu: string[];
  okpo: { ota: string; egba: string }[];
  orhan: string[];
  ekaeruo: string[];
};

export type LexicalSource = {
  ibuebu?: string;
  okpo?: string;
  orhan?: string;
  ekaeruo?: string;
};

const LexicalFields = ({
  values,
  onChange,
  lang,
  source,
}: {
  values: LexicalValues;
  onChange: (patch: Partial<LexicalValues>) => void;
  lang?: "urh" | "eng" | "kor";
  source?: LexicalSource;
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  return (
    <>
      <div className="flex flex-col gap-2 w-full">
        <TranslatingFrom value={source?.ibuebu} />
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
      </div>

      <div className="flex flex-col gap-2 w-full">
        <TranslatingFrom value={source?.okpo} />
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
      </div>

      <div className="flex flex-col gap-2 w-full">
        <TranslatingFrom value={source?.orhan} />
      <MultiInput
        placeholder={t("common.dictionary.antonyms", "Antonyms of the word")}
        selectedLabel={t("common.dictionary.selectedAntonyms", "Selected antonyms")}
        values={values.orhan}
        removeValue={(value) =>
          onChange({ orhan: values.orhan.filter((t) => t !== value) })
        }
        addValue={(value) => onChange({ orhan: [...values.orhan, value] })}
      />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <TranslatingFrom value={source?.ekaeruo} />
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
      </div>
    </>
  );
};

export default LexicalFields;
