import { useState } from "react";
import { useParams } from "next/navigation";
import { getPOS } from "@/helpers";
import { SingleWord } from "@/features/dictionary/lib";

export type SenseFormInitial = {
  kere?: number;
  ekerota: string[];
  upho: string;
  oto: string;
  idje: {
    sentence: string;
    audioUrl: string;
  }[];
  uphoesio: string;
  okpo: {
    ota: string;
    egba: string;
  }[];
  orhan: string[];
  ibuebu: string[];
  ekaeruo: string[];
  odeUfue: string[];
  erevwe: string;
  senseIndex?: number;
  senseId?: string;
};

export function useSenseForm({
  type,
  selected,
  senseIndex,
  nextKere,
}: {
  type: "add" | "edit";
  selected?: SingleWord["oho"][number];
  senseIndex?: number;
  nextKere?: number;
}) {
  const params = useParams();
  const id = (params.id as string) ?? "";

  const defaultInitialValue: SenseFormInitial = {
    kere: nextKere,
    ekerota: [] as string[],
    oto: "",
    idje: [{ sentence: "", audioUrl: "" }],
    upho: "",
    okpo: [] as { ota: string; egba: string }[],
    orhan: [] as string[],
    ibuebu: [] as string[],
    ekaeruo: [] as string[],
    uphoesio: "",
    odeUfue: [""] as string[],
    erevwe: "Abgarho",
  };

  const [form, setForm] = useState<SenseFormInitial>(() => {
    if (type === "edit" && selected) {
      return {
        ekerota: selected.ekerota,
        oto: selected.oto ?? "",
        idje: selected.idje ?? [{ sentence: "", audioUrl: "" }],
        okpo: selected.okpo ?? [],
        orhan: selected.orhan ?? [],
        ibuebu: selected.ibuebu ?? [],
        ekaeruo: selected.ekaeruo ?? [],
        upho: selected.upho ?? "",
        uphoesio: selected.uphoesio ?? "",
        odeUfue: selected.odeUfue ?? [],
        erevwe: selected.erevwe ?? "",
        senseIndex: senseIndex,
        senseId: selected.id,
      };
    }
    return defaultInitialValue;
  });

  const pos = getPOS("urh");

  return { id, form, setForm, pos };
}
