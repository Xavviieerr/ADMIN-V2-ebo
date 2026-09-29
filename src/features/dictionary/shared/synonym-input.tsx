"use client";

import { useKeyboard } from "@/features/shared/components/keyboard-context";
import { Plus, X } from "lucide-react";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const SynonymInput = ({
  values,
  addValue,
  removeValue,
  label,
  placeholder,
  selectedLabel,
  lang,
}: {
  values: string[];
  addValue: (v: { ota: string; egba: string }) => void;
  removeValue: (v: string) => void;
  label?: string;
  placeholder: string;
  selectedLabel?: string;
  lang?: "urh" | "eng" | "kor";
}) => {
  const [input, setInput] = useState({
    ota: "",
    egba: "gan",
  });

  const valueRef = useRef(input.ota);
  const cursorRef = useRef(0);
  const pendingCaretRef = useRef<number | null>(null);
  const inputElRef = useRef<HTMLInputElement>(null);
  const { setActiveField } = useKeyboard();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  useEffect(() => {
    valueRef.current = input.ota;
  }, [input.ota]);

  useLayoutEffect(() => {
    if (pendingCaretRef.current !== null && inputElRef.current) {
      const pos = pendingCaretRef.current;
      pendingCaretRef.current = null;
      inputElRef.current.focus();
      inputElRef.current.setSelectionRange(pos, pos);
      cursorRef.current = pos;
    }
  }, [input.ota]);

  const handleAdd = () => {
    if (!input.ota.trim() || values.includes(input.ota.trim().toLowerCase()))
      return setInput({ ota: "", egba: "gan" });

    addValue(input);
    setInput({ ota: "", egba: "gan" });
  };

  const handleRemove = (value: string) => {
    removeValue(value);
    setInput({ ota: "", egba: "gan" });
  };
  return (
    <div className="flex flex-col gap-4">
      {values.length > 0 && (
        <>
          {selectedLabel && (
            <p className="text-sm font-medium text-gray-txt-50">
              {selectedLabel}:
            </p>
          )}
          <div className="flex max-w-full overflow-x-scroll custom-scrollbar items-center gap-3 text-sm">
          {values.map((item, index) => (
            <div
              key={item + index}
              onClick={() => handleRemove(item)}
              className="px-5 py-2 border border-gray-txt-50 rounded-full flex items-center gap-2 group cursor-pointer capitalize"
            >
              {item}
              <X
                strokeWidth={1}
                size={16}
                className="group-hover:text-red-400"
              />
            </div>
          ))}
          </div>
        </>
      )}

      <div className="flex flex-col gap-2">
          {label && <label htmlFor={label}>{label}</label>}

        <div className="flex items-end gap-4">
          <div className="flex-1 relative">
            <input
              ref={inputElRef}
              type="text"
              id={label}
              placeholder={placeholder}
              value={input.ota}
              onChange={(e) => setInput({ ...input, ota: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              }}
              onSelect={(e) => {
                cursorRef.current = e.currentTarget.selectionStart ?? input.ota.length;
              }}
              onFocus={(e) => {
                cursorRef.current = e.currentTarget.selectionStart ?? input.ota.length;
                setActiveField({
                  getValue: () => valueRef.current,
                  setValue: (value: string) =>
                    setInput((prev) => ({ ...prev, ota: value })),
                  getCursorPos: () => cursorRef.current,
                  setCursorPos: (pos) => {
                    pendingCaretRef.current = pos;
                  },
                });
              }}
              // onBlur={() => setActiveField(null)}
              className="input min-h-[84px] pr-32"
            />

            <div className="absolute top-1 right-1 flex flex-col gap-1">
              <label htmlFor="synonym-variety" className="text-xs text-gray-txt-50">
                {t("common.dictionary.synonymStrength", "Synonym strength")}
                {lang === "urh"
                  ? ` (${t("common.dictionary.urhoboLang", "Urhobo")})`
                  : lang === "kor"
                    ? ` (${t("common.dictionary.koreanLang", "Korean")})`
                    : lang === "eng"
                      ? ` (${t("common.dictionary.englishLang", "English")})`
                      : ""}
              </label>
              <select
                value={input.egba}
                onChange={(e) => setInput({ ...input, egba: e.target.value })}
                id="synonym-variety"
                aria-label={t("common.dictionary.synonymVariety", "Synonym variety")}
                className="input h-10 py-2 bg-secondary-bg text-sm capitalize"
              >
                {[
                  {
                    value: "gan",
                    label:
                      lang === "urh"
                        ? "gan"
                        : lang === "kor"
                          ? t("common.dictionary.strongOptionKo", "강한")
                          : t("common.dictionary.strongOption", "strong"),
                  },
                  {
                    value: "guo",
                    label:
                      lang === "urh"
                        ? "guo"
                        : lang === "kor"
                          ? t("common.dictionary.weakOptionKo", "약한")
                          : t("common.dictionary.weakOption", "weak"),
                  },
                ].map((pos) => (
                  <option
                    key={pos.value}
                    value={pos.value}
                    className="text-white bg-secondary-bg capitalize"
                  >
                    {pos.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="secondary-btn font-medium"
          >
            <Plus strokeWidth={1.4} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SynonymInput;
