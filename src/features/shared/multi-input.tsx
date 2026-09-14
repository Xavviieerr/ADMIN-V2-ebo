"use client";

import { Plus, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useKeyboard } from "./components/keyboard-context";

const MultiInput = ({
  values,
  addValue,
  removeValue,
  label,
  placeholder,
}: {
  values: string[];
  addValue: (v: string) => void;
  removeValue: (v: string) => void;
  label?: string;
  placeholder: string;
}) => {
  const [input, setInput] = useState("");
  const valueRef = useRef(input);
  const cursorRef = useRef(0);
  const inputElRef = useRef<HTMLInputElement>(null);
  const { setActiveField } = useKeyboard();

  useEffect(() => {
    valueRef.current = input;
  }, [input]);

  const handleAdd = () => {
    if (!input.trim() || values.includes(input.trim().toLowerCase()))
      return setInput("");

    addValue(input.trim().toLowerCase());
    setInput("");
  };

  const handleRemove = (value: string) => {
    removeValue(value);
    setInput("");
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
          <input
            ref={inputElRef}
            type="text"
            id={label}
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
            onSelect={(e) => {
              cursorRef.current = e.currentTarget.selectionStart ?? input.length;
            }}
            onFocus={(e) => {
              cursorRef.current = e.currentTarget.selectionStart ?? input.length;
              setActiveField({
                getValue: () => valueRef.current,
                setValue: setInput,
                getCursorPos: () => cursorRef.current,
                setCursorPos: (pos) => {
                  inputElRef.current?.focus();
                  inputElRef.current?.setSelectionRange(pos, pos);
                  cursorRef.current = pos;
                },
              });
            }}
            onBlur={() => setActiveField(null)}
            className="input"
          />

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

export default MultiInput;
