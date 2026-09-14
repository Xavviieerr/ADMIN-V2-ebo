"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";
import { Figure } from "../../lib";

export type Tab = "personal" | "biography" | "family" | "metadata";

type EditCTX = {
  tab: Tab;
  setTab: (value: Tab) => void;
  figureData: Figure;
  setFigureData: React.Dispatch<React.SetStateAction<Figure>>;
  getFigurePayload: () => any;
};

const defaultValue: EditCTX = {
  tab: "personal",
  setTab: (value: Tab) => {},
  figureData: {
    id: "",
    status: "",
    fullName: "",
    otherNames: [],
    dateOfBirth: "",
    dateOfDeath: null,
    placeOfBirth: "",
    gender: "male",
    // placeOfDeath: "",
    // causeOfDeath: "",
    introBio: "",
    profilePhoto: "",
    // category: "",
    shortBio: "This is a placeholder",
    nationality: "",
    region: "",
    era: "",
    ethnicity: "",
    occupation: "",
    religion: "",
    suggestionNote: "",
    tags: [] as string[],
    notableAchievements: [] as string[],
    biography: [],
    externalLinks: [],
    timeline: [],
    family: [],
    relatedFigures: [],
  } as Figure,
  setFigureData: () => {},
  getFigurePayload: () => {},
};

const EditFigureContext = createContext(defaultValue);

const cleanUpFigure: (figure: Figure) => any = (figure: Figure) => {
  const {
    fullName,
    otherNames,
    dateOfBirth,
    dateOfDeath,
    placeOfBirth,
    gender,
    introBio,
    profilePhoto,
    // category,
    shortBio,
    nationality,
    region,
    era,
    ethnicity,
    occupation,
    religion,
    suggestionNote,
    tags,
    notableAchievements,
    biography,
    externalLinks,
    timeline,
    family,
    relatedFigures,
    ...rest
  } = figure;

  return {
    fullName,
    otherNames,
    dateOfBirth,
    dateOfDeath,
    placeOfBirth,
    gender,
    introBio,
    profilePhoto,
    // category,
    shortBio,
    nationality,
    region,
    era,
    ethnicity,
    occupation,
    religion,
    suggestionNote,
    tags,
    notableAchievements,
    biography,
    externalLinks,
    timeline,
    family,
    relatedFigures,
  };
};

const EditFigureProvider = ({
  children,
  figure,
}: {
  children: ReactNode;
  figure: Figure;
}) => {
  const {
    id,
    status,
    fullName,
    otherNames,
    dateOfBirth,
    dateOfDeath,
    placeOfBirth,
    gender,
    introBio,
    profilePhoto,
    // category,
    shortBio,
    nationality,
    region,
    era,
    ethnicity,
    occupation,
    religion,
    suggestionNote,
    tags,
    notableAchievements,
    biography,
    externalLinks,
    timeline,
    family,
    relatedFigures,
    ...rest
  } = figure;
  const [figureData, setFigureData] = useState(cleanUpFigure(figure));
  const [tab, setTab] = useState<Tab>("personal");

  const getFigurePayload = () => {
    const bio = [
      {
        overview: "n/a",
        title: "biography",
        entries: figureData.biography[0].entries.map(
          (item: Figure["biography"][number]["entries"][number]) => ({
            title: item.title,
            content: item.content,
            order: item.order,
            photos: item.photos,
          }),
        ),
      },
    ];

    const family = figureData.family.map((item: any) => {
      const { createdAt, createdBy, updatedAt, id, figureId, order, ...rest } =
        item;

      return rest;
    });

    return { ...figureData, biography: bio, family };
  };

  return (
    <EditFigureContext.Provider
      value={{ tab, setTab, figureData, setFigureData, getFigurePayload }}
    >
      {children}
    </EditFigureContext.Provider>
  );
};

export const useEditFigureContext = () => useContext(EditFigureContext);

export default EditFigureProvider;
