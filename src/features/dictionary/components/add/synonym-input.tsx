"use client";

import { useKeyboard } from "@/features/shared/components/keyboard-context";
import { Plus, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const SynonymInput = ({
  values,
  addValue,
  removeValue,
  label,
  placeholder,
}: {
  values: string[];
  addValue: (v: { ota: string; egba: string }) => void;
  removeValue: (v: string) => void;
  label?: string;
  placeholder: string;
}) => {
  const [input, setInput] = useState({
    ota: "",
    egba: "gan",
  });

  const valueRef = useRef(input.ota);
  const cursorRef = useRef(0);
  const inputElRef = useRef<HTMLInputElement>(null);
  const { setActiveField } = useKeyboard();

  useEffect(() => {
    valueRef.current = input.ota;
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
                    setInput({ ...input, ota: value }),
                  getCursorPos: () => cursorRef.current,
                  setCursorPos: (pos) => {
                    inputElRef.current?.focus();
                    inputElRef.current?.setSelectionRange(pos, pos);
                    cursorRef.current = pos;
                  },
                });
              }}
              // onBlur={() => setActiveField(null)}
              className="input"
            />

            <div className="absolute top-1 right-1">
              <select
                value={input.egba}
                onChange={(e) => setInput({ ...input, egba: e.target.value })}
                id="dialect"
                className="input h-10 py-2 bg-secondary-bg text-sm capitalize"
              >
                {["guo", "gan"].map((pos) => (
                  <option
                    key={pos}
                    value={pos}
                    className="text-white bg-secondary-bg capitalize"
                  >
                    {pos}
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
