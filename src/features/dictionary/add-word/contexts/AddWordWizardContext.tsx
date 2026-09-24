"use client";

import React, { createContext, useContext, useState } from "react";
import { PayloadData, Senses } from "@/features/dictionary/lib";

const payloadData: PayloadData = {
  ota: "",
  oka: 1,
  otaOkpopko: false,
  creationReason: "",
  erevwe: "Agbarho",
  image: "",
  oho: [],
};

type AddWordWizardContextValue = {
  data: PayloadData;
  setData: React.Dispatch<React.SetStateAction<PayloadData>>;
  senses: Senses[];
  setSenses: React.Dispatch<React.SetStateAction<Senses[]>>;
  clearForm: () => void;
};

const defaultValue: AddWordWizardContextValue = {
  data: payloadData,
  setData: () => {},
  senses: [],
  setSenses: () => {},
  clearForm: () => {},
};

const AddWordWizardContext = createContext(defaultValue);

export const AddWordWizardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [data, setData] = useState<PayloadData>(payloadData);
  const [senses, setSenses] = useState<Senses[]>([]);
  const clearForm = () => {
    setData(payloadData);
    setSenses([]);
  };

  return (
    <AddWordWizardContext.Provider value={{ data, setData, senses, setSenses, clearForm }}>
      {children}
    </AddWordWizardContext.Provider>
  );
};

export const useAddWordWizard = () => useContext(AddWordWizardContext);
