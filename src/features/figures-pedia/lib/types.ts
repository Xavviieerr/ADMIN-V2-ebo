export type Figure = {
  id: string;
  fullName: string;
  // category: string;
  shortBio: string;
  introBio: string;
  status: string;
  nationality: string;
  ethnicity: string;
  occupation: string;
  suggestionNote: string;
  profilePhoto: string;
  otherNames: string[];
  gender: string;
  dateOfBirth: string;
  dateOfDeath: string | null;
  placeOfBirth: string;
  religion: string;
  tags: string[];
  notableAchievements: string[];
  externalLinks: {
    type: string;
    title: string;
    url: string;
    creator: string;
    source: string;
    date: string;
  }[];
  era: string;
  region: string;
  translation?: {
    language: string;
    shortBio: string;
    introBio: string;
  };
  biography: {
    title: string;
    overview: string;
    order: number;
    entries: BiographyEntry[];
    translations?: BiographySectionTranslation[];
  }[];
  timeline?: TimelineEvent[];
  family: FamilyMember[];
  relatedFigures?: RelatedFigure[];
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
};

export type FigurePayload = {
  fullName: string;
  // category: string;
  shortBio: string;
  introBio: string;
  nationality: string;
  ethnicity: string;
  occupation: string;
  suggestionNote: string;
  profilePhoto: string;
  otherNames: string[];
  gender: string;
  dateOfBirth: string;
  dateOfDeath: string | null;
  placeOfBirth: string;
  religion: string;
  tags: string[];
  notableAchievements: string[];
  externalLinks: {
    id?: string;
    title: string;
    type: string;
    url?: string;
    date: string;
    source?: string;
    creator?: string;
    description?: string;
  }[];
  era: string;
  region: string;
  translation?: {
    language: string;
    shortBio: string;
    introBio: string;
  };
  biography: {
    title: string;
    overview: string;
    order: number;
    entries: BiographyEntry[];
    translations?: BiographySectionTranslation[];
  }[];
  timeline?: TimelineEvent[];
  family: FamilyMember[];
  relatedFigures?: RelatedFigure[];
};

type BiographyEntry = {
  title: string;
  content: string;
  order: number;
  photos: string[];
  translations?: BiographyEntryTranslation[];
};

type BiographyEntryTranslation = {
  language: string;
  title: string;
  content: string;
};

type BiographySectionTranslation = {
  language: string;
  title: string;
  overview: string;
};

type TimelineEvent = {
  year: string;
  title: string;
  description: string;
  order: number;
  translations: TimelineTranslation[];
};

type TimelineTranslation = {
  language: string;
  title: string;
  description: string;
  order: number;
};

type FamilyMember = {
  id: string;
  name: string;
  relationship: string;
  occupation: string;
  bio: string;
  photo: string;
  photos: string[];
  dateOfBirth: string | null;
  dateOfDeath?: string | null;
  marriageYear?: string | null;
  divorceYear?: string | null;
  linkedFigureId?: string | null;
};

type RelatedFigure = {
  // Define fields here once the structure is known.
  [key: string]: unknown;
};

export type MiniFigures = {
  id: string;
  fullName: string;
  slug: string;
  profilePhoto: null;
  shortBio: string;
  introBio: string;
  dateOfBirth: null;
  dateOfDeath: null;
  placeOfBirth: null;
  nationality: string;
  ethnicity: string;
  religion: null;
  occupation: string;
  era: null;
  region: null;
  status: string;
  submissionType: string;
  createdBy: null;
  createdAt: string;
};

export type FiguresPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
