"use client";

import React, { createContext, useContext, useState } from "react";
import { PayloadData, sample, Senses } from "@/features/dictionary/lib";

const payloadData: PayloadData = {
  ota: "",
  oka: 1,
  otaOkpopko: false,
  creationReason: "",
  erevwe: "Agbarho",
  image: "",
  // "https://res.cloudinary.com/dd1etltud/image/upload/c_limit,h_800,w_800/f_webp,q_auto/v1/word-images/zwugea0usvi9biuzh9tl?_a=BAMAOGfi0",
  oho: [],
};

type WordCTXType = {
  data: PayloadData;
  setData: React.Dispatch<React.SetStateAction<PayloadData>>;
  senses: Senses[];
  setSenses: React.Dispatch<React.SetStateAction<Senses[]>>;
  page: "details" | "senses" | "preview";
  setPage: React.Dispatch<
    React.SetStateAction<"details" | "senses" | "preview">
  >;
  clearForm: () => void;
};

const defaultValue: WordCTXType = {
  data: payloadData,
  setData: () => {},
  senses: [],
  setSenses: () => {},
  page: "details",
  setPage: () => {},
  clearForm: () => {},
};
const WordContext = createContext(defaultValue);

export const AddWordProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [data, setData] = useState<PayloadData>(payloadData);
  const [senses, setSenses] = useState<Senses[]>([]);
  const [page, setPage] = useState<"details" | "senses" | "preview">("details");
  const clearForm = () => {
    setData(payloadData);
    setSenses([]);
    setPage("details");
  };

  return (
    <WordContext.Provider
      value={{ data, setData, senses, setSenses, page, setPage, clearForm }}
    >
      {children}
    </WordContext.Provider>
  );
};

export const useWordContext = () => useContext(WordContext);
