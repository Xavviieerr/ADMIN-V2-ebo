"use client";

import {
  createContext,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";

// type ActiveField = {
//   value: string;
//   setValue: (value: string) => void;
// } | null;

type ActiveField = {
  getValue: () => string;
  setValue: (value: string) => void;
  getCursorPos: () => number;
  setCursorPos: (pos: number) => void;
} | null;

type KeyboardContextType = {
  activeField: ActiveField;
  setActiveField: (field: ActiveField) => void;
  showKeyboard: boolean;
  setShowKeyboard: React.Dispatch<SetStateAction<boolean>>;
};

const defaultValue: KeyboardContextType = {
  activeField: null,
  setActiveField: () => {},
  showKeyboard: false,
  setShowKeyboard: () => {},
};

const KeyboardContext = createContext(defaultValue);

const KeyboardProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeField, setActiveField] = useState<ActiveField>(
    defaultValue.activeField,
  );
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false);

  const value = useMemo(
    () => ({
      activeField,
      setActiveField,
      showKeyboard,
      setShowKeyboard,
    }),
    [activeField, showKeyboard],
  );

  return (
    <KeyboardContext.Provider value={value}>
      {children}
    </KeyboardContext.Provider>
  );
};

export const useKeyboard = () => useContext(KeyboardContext);

export default KeyboardProvider;
