"use client";
import { createContext, SetStateAction, useContext, useState } from "react";
import { FigurePayload } from "@/features/figures-pedia/lib";

const defaultPayload: FigurePayload = {
  fullName: "",
  // otherNames: [] as string[],
  otherNames: [],
  dateOfBirth: "",
  dateOfDeath: null,
  placeOfBirth: "",
  gender: "male",
  // placeOfDeath: "",
  // causeOfDeath: "",
  introBio: "",
  profilePhoto: "",
  // category: "academic",
  shortBio: "This is a placeholder",
  nationality: "",
  region: "",
  era: "",
  ethnicity: "",
  occupation: "academia",
  religion: "",
  suggestionNote: "",
  tags: [] as string[],
  notableAchievements: [] as string[],
  biography: [],
  externalLinks: [],
  timeline: [],
  family: [],
  relatedFigures: [],
};

const defaultValue: {
  basicInfo: FigurePayload;
  setBasicInfo: React.Dispatch<SetStateAction<FigurePayload>>;
  getFormattedPayload: () => FigurePayload;
  saveToLocal: (data?: FigurePayload) => void;
  clearFromLocal: () => void;
} = {
  basicInfo: defaultPayload,
  setBasicInfo: () => {},
  getFormattedPayload: () => defaultPayload,
  saveToLocal: () => {},
  clearFromLocal: () => {},
};

const AddFigureContext = createContext(defaultValue);

const AddFigureProvider = ({ children }: { children: React.ReactNode }) => {
  const [basicInfo, setBasicInfo] = useState<FigurePayload>(() => {
    const savedFigure = localStorage.getItem("figure_draft");
    return savedFigure ? JSON.parse(savedFigure) : defaultValue["basicInfo"];
  });

  const saveToLocal = (data?: FigurePayload) => {
    console.log(data ?? basicInfo);
    localStorage.setItem("figure_draft", JSON.stringify(data ?? basicInfo));
  };

  const clearFromLocal = () => {
    localStorage.removeItem("figure_draft");
  };

  const getFormattedPayload: () => any = () => {
    return {
      ...basicInfo,
      externalLinks: basicInfo.externalLinks.map(({ id, ...rest }) => ({
        ...rest,
        url: rest.url || null,
      })),
      family: basicInfo.family.map(({ id, ...rest }) => rest),
    };
  };

  return (
    <AddFigureContext.Provider
      value={{
        basicInfo,
        setBasicInfo,
        getFormattedPayload,
        saveToLocal,
        clearFromLocal,
      }}
    >
      {children}
    </AddFigureContext.Provider>
  );
};

export const useAddFigureCTX = () => useContext(AddFigureContext);
export default AddFigureProvider;
