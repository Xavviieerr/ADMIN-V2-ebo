"use client";

import React, { useState } from "react";
import { SingleWord } from "@/features/dictionary/lib";
import { PenBox } from "lucide-react";
import { useSingleWordView } from "@/features/dictionary/word-detail/hooks/useSingleWordView";
import PermissionGate from "@/features/shared/permission-gate";
import { TranslationForm } from "./forms";
import TranslationCard from "./translation-card";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const TranslationList = ({ data }: { data: SingleWord }) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const { lang } = useSingleWordView();
  const [view, setView] = useState<"view" | "add">("view");
  const [selected, setSelected] = useState<SingleWord["efaEng"][number]>();
  const [transIndex, setTransIndex] = useState<number>();

  const getTranslations = () => {
    if (lang === "Korean") return data.efaKor;
    return data.efaEng;
  };

  if (view === "add" || (selected && transIndex != undefined)) {
    return (
      <TranslationForm
        selected={selected}
        type={selected ? "edit" : "add"}
        transIndex={transIndex}
        sense={data.oho.find((s) => s.kere === transIndex)}
        ota={data.ota}
        onClose={() => {
          setSelected(undefined);
          setView("view");
          setTransIndex(undefined);
        }}
      />
    );
  }

  const items = [];

  for (let transIndex = 0; transIndex < data.oho.length; transIndex++) {
    const translation = getTranslations().find(
      (translation) => translation.kere === transIndex + 1,
    );

    if (!translation || !translation.otaWord) {
      items.push(
        <div
          key={transIndex}
          className="flex flex-col items-center justify-center input py-7 gap-4 my-10"
        >
          <p>
            {t("common.dictionary.noTranslations", `No ${lang} translations found for “${data.oho[transIndex]?.oto || `Kere ${transIndex + 1}`}”`).replace("{lang}", lang).replace("{kere}", String(transIndex + 1)).replace("{sense}", data.oho[transIndex]?.oto || `Kere ${transIndex + 1}`)}
          </p>
          <PermissionGate permission="add_word">
            <button
              onClick={() => {
                if (!translation) {
                  setTransIndex(transIndex + 1);
                  setView("add");
                  return;
                }

                setSelected(translation);
                setTransIndex(transIndex + 1);
              }}
              className="secondary-btn px-10 flex items-center gap-3 py-2"
            >
              <PenBox width={16} /> {t("common.add", "Add")}
            </button>
          </PermissionGate>
        </div>,
      );
    } else {
      items.push(
        <TranslationCard
          key={transIndex}
          translation={translation}
          transIndex={transIndex}
          lang={lang}
          sense={
            data.oho.find((s) => s.kere === translation.kere) ??
            data.oho[transIndex]
          }
          ota={data.ota}
          onEdit={() => {
            setSelected(translation);
            setTransIndex(transIndex + 1);
          }}
        />,
      );
    }
  }

  return <>{items}</>;
};

export default TranslationList;
