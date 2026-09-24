import { useState } from "react";
import { useParams } from "next/navigation";
import { SingleWord } from "@/features/dictionary/lib";

export type TranslationFormInitial = {
  ota: string;
  ekerota: string[];
  oto: string;
  idje: {
    sentence: string;
    audioUrl: string;
  }[];
  upho: string;
  okpo: {
    ota: string;
    egba: string;
  }[];
  orhan: string[];
  ibuebu: string[];
  ekaeruo: string[];
  uphoesio: string;
  odeUfue: string[];
  languageType: string;
  translationIndex?: number;
  translationId?: string;
};

export function useTranslationForm({
  type,
  selected,
  transIndex,
  lang,
}: {
  type: "add" | "edit";
  selected?: SingleWord["efaEng"][number];
  transIndex?: number;
  lang: string;
}) {
  const params = useParams();
  const id = (params.id as string) ?? "";

  const defaultInitialValue: TranslationFormInitial = {
    ota: "",
    ekerota: [] as string[],
    oto: "",
    idje: [{ sentence: "", audioUrl: "" }],
    upho: "",
    okpo: [] as { ota: string; egba: string }[],
    orhan: [] as string[],
    ibuebu: [] as string[],
    ekaeruo: [] as string[],
    uphoesio: "",
    odeUfue: [] as string[],
    languageType: lang.toLowerCase(),
  };

  const [form, setForm] = useState<TranslationFormInitial>(() => {
    if (type === "edit" && selected && selected.details) {
      const details = selected.details;
      const idje = details.idje;
      return {
        ota: selected.otaWord ?? "",
        ekerota: details.ekerota ?? [],
        oto: details.oto ?? "",
        idje: idje && idje.length > 0 ? idje : [{ sentence: "", audioUrl: "" }],
        upho: details.upho ?? "",
        okpo: details.okpo ?? [],
        orhan: details.orhan ?? [],
        ibuebu: details.ibuebu ?? [],
        ekaeruo: details.ekaeruo ?? [],
        uphoesio: details.uphoesio ?? "",
        odeUfue: details.odeUfue ?? [],
        languageType: lang.toLowerCase(),
        translationIndex: transIndex,
        translationId: selected.id,
      };
    }
    return defaultInitialValue;
  });

  return { id, form, setForm };
}
