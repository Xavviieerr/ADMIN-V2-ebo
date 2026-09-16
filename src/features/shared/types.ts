// Re-export users-specific types from their canonical location
export type { AdminData, UserData, ContributorApplicationStage } from "@/features/users/types";

export type FigureInfoStage =
  | "basicInfo"
  | "biography"
  | "familyMembers"
  | "metadata"
  | "preview";

export type PlaceInfoStage = "basicInfo" | "history" | "metadata" | "preview";

// Re-export users-specific types from their canonical location
export type { UserStats } from "@/features/users/types";

export type SingleName = {
  id: string;
  name: string;
  pronunciation: string;
  meaning: string;
  culturalSignificance: string;
  gender: string;
  syllableCount: number;
  source: string;
  abbreviations: never[];
  nameOriginStory: string;
  regionOfUse: string;
  alternativeSpellings: never[];
  relatedNames: never[];
  notableBearers: never[];
  nicknames: never[];
  nameComposition: never[];
  nameType: string;
  popularityRank: number;
  historicalUsage: string;
  modernUsage: string;
  astrologicalAssociations: never[];
  commonMisspellings: never[];
  linguisticNotes: string;
  culturalNotes: string;
  otherNotes: string;
  status: string;
  createdById: string;
  rejectionReason: null;
  rejectedBy: null;
  approvedBy: null;
  translations: {
    id: string;
    nameId: string;
    targetLanguage: string;
    translatedMeaning: string;
    equivalentName: string;
    priority: number;
    isPrimary: boolean;
    notes: string;
    createdById: string;
    createdAt: string;
    updatedAt: string;
    rowVersion: number;
  }[];
  rowVersion: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
};

export type NameRecord = {
  items: {
    id: string;
    name: string;
    meaning: string;
    culturalSignificance: string;
    gender: string;
    source: string;
    nameType: string;
    status: string;
    translations: any[];
    createdBy: {
      id: string;
      username: string;
      firstName: string;
      lastName: string;
    };
  }[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type NameFormDataType = {
  nameType: string;
  name: string;
  regionOfUse: string;
  gender: string;
  culturalSignificance: string;
  pronunciation: string;
  syllableCount: number;
  nameComposition: string[];
  translations: {
    id: string;
    translation: string;
    notes: string;
  }[];
  abbreviations: string[];
  notableBearers: string[];
  alternativeSpellings: string[];
  relatedNames: string[];
  nicknames: string[];
};

export type Figure = {
  personal: {
    "Full Name": string;
    "Other Names": string;
    "Date Of Birth": string;
    "Place Of Birth": string;
    "Date Of Death": string | null;
    "Place Of Death": string | null;
    "Cause Of Death": string | null;
    Gender: string;
    Category: string;
    father: string;
    mother: string;
    grandparents: string[];
    siblings: string[];
    spouses: string[];
    children: string[];
    extendedFamily: string[];
  };
  gallery: {
    image: string;
    caption?: string;
  }[];
  summary: string;
  biography: {
    title: string;
    body: string;
  }[];
  sources: {
    id: string;
    type: "article" | "book" | "interview" | "oral history" | "website";

    //articles & books
    title: string;
    author?: string;
    publishedBy?: string;
    publishedOn?: string;

    //for websites
    url?: string;
    accessDate?: string;

    //for interviews & oral history
    speaker?: string;
    date?: string;

    context: string;
  }[];
};

export type Place = {
  basic: {
    name: string;
    "Other Names": string;
    type: string;
    founded: string;
    founders: string[];
    "Notable Figures": string[];
    ruler: string;
    state: string;
    LGA: string;
    lat: number;
    long: number;
    province: string;
  };
  gallery: {
    image: string;
    caption: string;
  }[];
  summary: string;
  history: {
    id: string;
    title: string;
    body: string;
  }[];
  sources: {
    id: string;
    type: "article" | "book" | "interview" | "oral history" | "website";

    //articles & books
    title: string;
    author?: string;
    publishedBy?: string;
    publishedOn?: string;

    //for websites
    url?: string;
    accessDate?: string;

    //for interviews & oral history
    speaker?: string;
    date?: string;

    context: string;
  }[];
};
