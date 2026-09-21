"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";
import { Figure } from "../../lib";

export type Tab = "personal" | "biography" | "family" | "metadata";

type EditCTX = {
  tab: Tab;
  setTab: (value: Tab) => void;
  figureData: Figure;
  setFigureData: React.Dispatch<React.SetStateAction<Figure>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getFigurePayload: () => any;
};

const defaultValue: EditCTX = {
  tab: "personal",
  setTab: (_value: Tab) => {},
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    ..._rest
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
    id: _id,
    status: _status,
    fullName: _fullName,
    otherNames: _otherNames,
    dateOfBirth: _dateOfBirth,
    dateOfDeath: _dateOfDeath,
    placeOfBirth: _placeOfBirth,
    gender: _gender,
    introBio: _introBio,
    profilePhoto: _profilePhoto,
    // category,
    shortBio: _shortBio,
    nationality: _nationality,
    region: _region,
    era: _era,
    ethnicity: _ethnicity,
    occupation: _occupation,
    religion: _religion,
    suggestionNote: _suggestionNote,
    tags: _tags,
    notableAchievements: _notableAchievements,
    biography: _biography,
    externalLinks: _externalLinks,
    timeline: _timeline,
    family: _family,
    relatedFigures: _relatedFigures,
    ..._rest
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const family = figureData.family.map((item: any) => {
      const { createdAt: _createdAt, createdBy: _createdBy, updatedAt: _updatedAt, id: _id, figureId: _figureId, order: _order, ...rest } =
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
