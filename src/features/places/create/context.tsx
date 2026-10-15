"use client";

import { createContext, useContext, useState } from "react";

// Shared draft ownership for the four-stage create wizard
// (basicInfo → history → metadata → preview). Stage-local editing state
// (e.g. the entry currently being typed) stays in each stage; everything
// that must survive stage navigation lives here.

export type PlaceBasicDraft = {
  name: string;
  alternativeNames: string[];
  type: string;
  foundedOn: string;
  founders: string[];
  figures: string[];
  ruler: string;
  summary: string;
};

export type PlaceLocationDraft = {
  state: string;
  LGA: string;
  lat: string;
  long: string;
  googleMap: string;
  province: string;
};

export type PlaceHistoryEntry = {
  id: string;
  title: string;
  body: string;
};

export type PlaceSourceType =
  | "article"
  | "book"
  | "interview"
  | "oral history"
  | "website";

export type PlaceSource = {
  id: string;
  type: PlaceSourceType;
  title: string;
  author: string;
  publishedBy: string;
  publishedOn: string;
  url: string;
  accessDate: string;
  speaker: string;
  date: string;
  context: string;
};

const defaultBasic: PlaceBasicDraft = {
  name: "",
  alternativeNames: [],
  type: "",
  foundedOn: "",
  founders: [],
  figures: [],
  ruler: "",
  summary: "",
};

const defaultLocation: PlaceLocationDraft = {
  state: "",
  LGA: "",
  lat: "",
  long: "",
  googleMap: "",
  province: "",
};

type PlaceDraftContextValue = {
  basic: PlaceBasicDraft;
  setBasic: React.Dispatch<React.SetStateAction<PlaceBasicDraft>>;
  location: PlaceLocationDraft;
  setLocation: React.Dispatch<React.SetStateAction<PlaceLocationDraft>>;
  history: PlaceHistoryEntry[];
  setHistory: React.Dispatch<React.SetStateAction<PlaceHistoryEntry[]>>;
  sources: PlaceSource[];
  setSources: React.Dispatch<React.SetStateAction<PlaceSource[]>>;
  resetDraft: () => void;
};

const defaultValue: PlaceDraftContextValue = {
  basic: defaultBasic,
  setBasic: () => {},
  location: defaultLocation,
  setLocation: () => {},
  history: [],
  setHistory: () => {},
  sources: [],
  setSources: () => {},
  resetDraft: () => {},
};

const AddPlaceContext = createContext(defaultValue);

const freshBasic = (): PlaceBasicDraft => ({
  ...defaultBasic,
  alternativeNames: [],
  founders: [],
  figures: [],
});

const AddPlaceProvider = ({ children }: { children: React.ReactNode }) => {
  const [basic, setBasic] = useState<PlaceBasicDraft>(freshBasic);
  const [location, setLocation] =
    useState<PlaceLocationDraft>(defaultLocation);
  const [history, setHistory] = useState<PlaceHistoryEntry[]>([]);
  const [sources, setSources] = useState<PlaceSource[]>([]);

  const resetDraft = () => {
    setBasic(freshBasic());
    setLocation(defaultLocation);
    setHistory([]);
    setSources([]);
  };

  return (
    <AddPlaceContext.Provider
      value={{
        basic,
        setBasic,
        location,
        setLocation,
        history,
        setHistory,
        sources,
        setSources,
        resetDraft,
      }}
    >
      {children}
    </AddPlaceContext.Provider>
  );
};

export const useAddPlaceDraft = () => useContext(AddPlaceContext);
export default AddPlaceProvider;
