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
