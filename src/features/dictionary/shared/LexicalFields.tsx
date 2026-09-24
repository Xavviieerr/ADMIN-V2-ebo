import { MultiInput } from "@/features/shared";
import SynonymInput from "./synonym-input";

export type LexicalValues = {
  ibuebu: string[];
  okpo: { ota: string; egba: string }[];
  orhan: string[];
  ekaeruo: string[];
};

const LexicalFields = ({
  values,
  onChange,
}: {
  values: LexicalValues;
  onChange: (patch: Partial<LexicalValues>) => void;
}) => {
  return (
    <>
      <MultiInput
        placeholder="Plural forms of the word"
        values={values.ibuebu}
        removeValue={(value) =>
          onChange({ ibuebu: values.ibuebu.filter((t) => t !== value) })
        }
        addValue={(value) =>
          onChange({ ibuebu: [...values.ibuebu, value] })
        }
      />

      <SynonymInput
        placeholder="Synonyms of the word"
        values={values.okpo.map((t) => t.ota)}
        removeValue={(value) =>
          onChange({ okpo: values.okpo.filter((t) => t.ota !== value) })
        }
        addValue={(value) => onChange({ okpo: [...values.okpo, value] })}
      />

      <MultiInput
        placeholder="Antonyms of the word"
        values={values.orhan}
        removeValue={(value) =>
          onChange({ orhan: values.orhan.filter((t) => t !== value) })
        }
        addValue={(value) => onChange({ orhan: [...values.orhan, value] })}
      />

      <MultiInput
        placeholder="Related words"
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
