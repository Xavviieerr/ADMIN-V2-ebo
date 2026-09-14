"use client";

import { createContext, useContext, useState } from "react";
import { SingleWord } from "../../lib";

type SelectedSense = SingleWord["oho"][number] & {
  index: number;
};

type SingleWordCTX = {
  tab: "senses" | "translations" | "reviews";
  setTab: React.Dispatch<
    React.SetStateAction<"senses" | "translations" | "reviews">
  >;
  lang: "English" | "Korean";
  setLang: React.Dispatch<React.SetStateAction<"English" | "Korean">>;
  selectedSense: SelectedSense | undefined;
  setSelectedSense: React.Dispatch<
    React.SetStateAction<SelectedSense | undefined>
  >;
  senseView: "view" | "add";
  setSenseView: React.Dispatch<React.SetStateAction<"view" | "add">>;
  sensesLength: number;
  setSensesLength: React.Dispatch<React.SetStateAction<number>>;
  reviewView: "view" | "add";
  setReviewView: React.Dispatch<React.SetStateAction<"view" | "add">>;
};

const defaultValue: SingleWordCTX = {
  tab: "senses",
  setTab: () => {},
  lang: "English",
  setLang: () => {},
  selectedSense: undefined,
  setSelectedSense: () => {},
  senseView: "view",
  setSenseView: () => {},
  sensesLength: 1,
  setSensesLength: () => {},
  reviewView: "view",
  setReviewView: () => {},
};

const SingleWordContext = createContext(defaultValue);

const SingleWordProvider = ({ children }: { children: React.ReactNode }) => {
  const [tab, setTab] = useState<"senses" | "translations" | "reviews">(
    "senses",
  );
  const [lang, setLang] = useState<"English" | "Korean">("English");

  const [selectedSense, setSelectedSense] = useState<SelectedSense>();
  const [senseView, setSenseView] = useState<"view" | "add">("view");
  const [sensesLength, setSensesLength] = useState<number>(1);
  const [reviewView, setReviewView] = useState<"view" | "add">("view");
  return (
    <SingleWordContext.Provider
      value={{
        tab,
        setTab,
        lang,
        setLang,
        selectedSense,
        setSelectedSense,
        senseView,
        setSenseView,
        sensesLength,
        setSensesLength,
        reviewView,
        setReviewView,
      }}
    >
      {children}
    </SingleWordContext.Provider>
  );
};

export default SingleWordProvider;

export const useSingleWordContext = () => useContext(SingleWordContext);
