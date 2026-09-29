"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { BaseInput, BaseTextArea } from "@/features/shared";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

export type MetaValues = {
  ekerota: string[];
  upho: string;
  uphoesio: string;
  odeUfue: string[];
  oto: string;
};

const FormMetaFields = ({
  values,
  onChange,
  posOptions,
}: {
  values: MetaValues;
  onChange: (patch: Partial<MetaValues>) => void;
  posOptions: string[];
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const posDropdownRef = useRef<HTMLDivElement>(null);
  const [showPosOptions, setShowPosOptions] = useState(false);

  useEffect(() => {
    if (!showPosOptions) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        posDropdownRef.current &&
        !posDropdownRef.current.contains(event.target as Node)
      ) {
        setShowPosOptions(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showPosOptions]);

  return (
    <>
      <div
        ref={posDropdownRef}
        role="button"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={showPosOptions}
        aria-label={t("common.dictionary.partOfSpeech", "Part of speech")}
        onClick={() => setShowPosOptions(!showPosOptions)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setShowPosOptions(!showPosOptions);
          }
          if (e.key === "Escape") {
            setShowPosOptions(false);
          }
        }}
        className="flex items-center justify-between gap-4 min-w-30 w-full relative bg-gray-txt-100 focus:ring-1 ring-foreground-50 px-5 py-3 rounded-lg outline-none cursor-pointer"
      >
        <p className={values.ekerota[0] ? "capitalize" : "text-gray-txt-50"}>
          {values.ekerota[0] ||
            t("common.dictionary.partOfSpeech", "Part of speech")}
        </p>
        <ChevronDown
          className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform ${showPosOptions ? "rotate-180" : ""}`}
        />

        {showPosOptions && (
          <div
            role="listbox"
            aria-label={t("common.dictionary.partOfSpeech", "Part of speech")}
            className="absolute top-full left-0 mt-2 w-full min-w-52 max-h-72 overflow-y-auto custom-scrollbar z-20 transition-all ease-in-out bg-secondary-bg rounded-lg shadow-lg"
          >
            <button
              type="button"
              role="option"
              aria-selected={!values.ekerota[0]}
              onClick={() => {
                onChange({ ekerota: [] });
                setShowPosOptions(false);
              }}
              className={`w-full text-left px-5 py-3 hover:bg-gray-txt-100 cursor-pointer text-gray-txt-50 ${!values.ekerota[0] ? "text-foreground-50 font-medium" : ""}`}
            >
              {t("common.dictionary.partOfSpeech", "Part of speech")}
            </button>
            {posOptions.map((pos) => (
              <button
                key={pos}
                type="button"
                role="option"
                aria-selected={values.ekerota[0] === pos}
                onClick={() => {
                  onChange({ ekerota: [pos] });
                  setShowPosOptions(false);
                }}
                className={`w-full text-left px-5 py-3 hover:bg-gray-txt-100 cursor-pointer capitalize ${values.ekerota[0] === pos ? "text-foreground-50 font-medium" : ""}`}
              >
                {pos}
              </button>
            ))}
          </div>
        )}
      </div>

      <BaseInput
        placeholder={t("common.dictionary.pronunciation", "Pronunciation")}
        value={values.upho}
        setValue={(value) => onChange({ upho: value as string })}
      />

      <BaseInput
        placeholder={t("common.dictionary.ipa", "IPA")}
        value={values.uphoesio}
        setValue={(value) => onChange({ uphoesio: value as string })}
      />

      <BaseInput
        placeholder={t("common.dictionary.scientificName", "Scientific Name")}
        value={values.odeUfue[0] ?? ""}
        setValue={(value) => onChange({ odeUfue: [value as string] })}
      />

      <BaseTextArea
        placeholder={t("common.dictionary.meaning", "Meaning of the word")}
        rows={3}
        value={values.oto}
        setValue={(value) => onChange({ oto: value })}
        styling="md:col-span-2"
      />
    </>
  );
};

export default FormMetaFields;
