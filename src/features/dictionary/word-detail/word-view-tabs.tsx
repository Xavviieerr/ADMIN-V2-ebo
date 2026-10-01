"use client";

import React from "react";
import { useSingleWordView } from "@/features/dictionary/word-detail/hooks/useSingleWordView";
import { useSingleWordSenseContext } from "./contexts/SingleWordSenseContext";
import { useSingleWordReviewContext } from "./contexts/SingleWordReviewContext";
import PermissionGate from "@/features/shared/permission-gate";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const Tabs = () => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const { tab, setTab, lang, setLang } = useSingleWordView();
  const { setSenseView } = useSingleWordSenseContext();
  const { setReviewView } = useSingleWordReviewContext();

  return (
    <div className="flex max-md:flex-col gap-4 items-center justify-between my-8">
      <div className="flex items-center border-b border-gray-txt-50 w-fit max-w-full overflow-x-auto no-scrollbar">
        {["senses", "translations", "reviews"].map((item) => (
          <button
            key={item}
            onClick={() => setTab(item as "senses" | "translations" | "reviews")}
            className={`px-5 ${tab === item ? "border-b-2 border-foreground-50" : ""} pb-2 cursor-pointer`}
          >
            <p className="capitalize">{t(`common.dictionary.${item}Tab`, item)}</p>
          </button>
        ))}
      </div>

      <PermissionGate permission="edit_word">
        {tab === "senses" && (
          <button
            onClick={() => setSenseView("add")}
            className="secondary-btn max-md:w-full py-3 text-sm"
          >
            {" "}
            {t("common.dictionary.addSense", "Add Sense")}
          </button>
        )}
      </PermissionGate>

      {tab === "translations" && (
        <div className="flex flex-col gap-2 max-md:w-full">
          <label htmlFor="translation-lang" className="text-sm">
            {t("common.dictionary.translationLanguage", "Translation language")}
          </label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as "English" | "Korean")}
            id="translation-lang"
            className="input h-12 w-fit text-sm capitalize bg-secondary-bg max-md:w-full"
          >
          {[
            { value: "English", label: t("common.dictionary.englishLang", "English") },
            { value: "Korean", label: t("common.dictionary.koreanLang", "Korean") },
          ].map((lang) => (
            <option
              key={lang.value}
              value={lang.value}
              className="text-white bg-secondary-bg capitalize"
            >
              {lang.label}
            </option>
          ))}
        </select>
        </div>
      )}

      {tab === "reviews" && (
        <button
          onClick={() => setReviewView("add")}
          className="secondary-btn max-md:w-full py-3 text-sm"
        >
          {t("common.dictionary.addReview", "Add Review")}
        </button>
      )}
    </div>
  );
};

export default Tabs;
