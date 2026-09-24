"use client";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useKeyboard } from "./keyboard-context";

const BaseInput = ({
  label,
  value,
  setValue,
  placeholder,
  type = "text",
}: {
  label?: string;
  value: string;
  setValue: (value: string | number) => void;
  placeholder?: string;
  type?: string;
}) => {
  const valueRef = useRef(value);
  const cursorRef = useRef(0);
  const pendingCaretRef = useRef<number | null>(null);
  const inputElRef = useRef<HTMLInputElement>(null);
  const { setActiveField } = useKeyboard();

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useLayoutEffect(() => {
    if (pendingCaretRef.current !== null && inputElRef.current) {
      const pos = pendingCaretRef.current;
      pendingCaretRef.current = null;
      inputElRef.current.focus();
      inputElRef.current.setSelectionRange(pos, pos);
      cursorRef.current = pos;
    }
  }, [value]);

  return (
    <div className="flex flex-col gap-2 w-full flex-1">
      {label && <label htmlFor={label}>{label}</label>}
      <input
        ref={inputElRef}
        type={type}
        id={label}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onSelect={(e) => {
          cursorRef.current = e.currentTarget.selectionStart ?? value.length;
        }}
        onFocus={(e) => {
          cursorRef.current = e.currentTarget.selectionStart ?? value.length;
          setActiveField({
            getValue: () => valueRef.current,
            setValue: (v) => setValue(v),
            getCursorPos: () => cursorRef.current,
            setCursorPos: (pos) => {
              pendingCaretRef.current = pos;
            },
          });
        }}
        // onBlur={() => setActiveField(null)}
        className="input"
      />
    </div>
  );
};

export default BaseInput;
