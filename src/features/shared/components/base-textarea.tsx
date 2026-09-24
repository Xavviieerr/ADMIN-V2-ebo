"use client";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useKeyboard } from "./keyboard-context";

const BaseTextArea = ({
  label,
  value,
  setValue,
  placeholder,
  maxLength,
  rows = 4,
  styling,
}: {
  label?: string;
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  styling?: string;
}) => {
  const valueRef = useRef(value);
  const cursorRef = useRef(0);
  const pendingCaretRef = useRef<number | null>(null);
  const textareaElRef = useRef<HTMLTextAreaElement>(null);
  const { setActiveField } = useKeyboard();

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useLayoutEffect(() => {
    if (pendingCaretRef.current !== null && textareaElRef.current) {
      const pos = pendingCaretRef.current;
      pendingCaretRef.current = null;
      textareaElRef.current.focus();
      textareaElRef.current.setSelectionRange(pos, pos);
      cursorRef.current = pos;
    }
  }, [value]);

  return (
    <div className={`flex flex-col gap-2 w-full ${styling}`}>
      {label && <label htmlFor={label}>{label}</label>}
      <textarea
        ref={textareaElRef}
        id={label}
        placeholder={placeholder}
        rows={rows}
        value={value}
        maxLength={maxLength}
        onChange={(e) => setValue(e.target.value)}
        onSelect={(e) => {
          cursorRef.current = e.currentTarget.selectionStart ?? value.length;
        }}
        onFocus={(e) => {
          cursorRef.current = e.currentTarget.selectionStart ?? value.length;
            setActiveField({
              getValue: () => valueRef.current,
              setValue,
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

export default BaseTextArea;
