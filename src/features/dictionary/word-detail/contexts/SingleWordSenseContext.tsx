"use client";

import { createContext, useContext, useState } from "react";
import { SingleWord } from "../../lib";

type SelectedSense = SingleWord["oho"][number] & {
  index: number;
};

type SingleWordSenseContextValue = {
  selectedSense: SelectedSense | undefined;
  setSelectedSense: React.Dispatch<
    React.SetStateAction<SelectedSense | undefined>
  >;
  senseView: "view" | "add";
  setSenseView: React.Dispatch<React.SetStateAction<"view" | "add">>;
};

const defaultValue: SingleWordSenseContextValue = {
  selectedSense: undefined,
  setSelectedSense: () => {},
  senseView: "view",
  setSenseView: () => {},
};

const SingleWordSenseContext = createContext(defaultValue);

export const SingleWordSenseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedSense, setSelectedSense] = useState<SelectedSense>();
  const [senseView, setSenseView] = useState<"view" | "add">("view");

  return (
    <SingleWordSenseContext.Provider
      value={{ selectedSense, setSelectedSense, senseView, setSenseView }}
    >
      {children}
    </SingleWordSenseContext.Provider>
  );
};

export const useSingleWordSenseContext = () =>
  useContext(SingleWordSenseContext);
