// Single ownership area for Names domain types.
// Verified against live backend responses (see audit lifecycle probes).
// Backend envelopes: success { data, message }; validation 400 { message: string[], error, statusCode }.

export type NameType = "given name" | "surname" | "nickname" | "other";

export type NameGender = "male" | "female" | "neutral";

export type NameStatus = "pending" | "approved" | "rejected";

export type NameTranslation = {
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
};

export type NameCreator = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
};

// List item shape: subset of SingleName returned by GET /names.
export type NameListItem = {
  id: string;
  name: string;
  pronunciation: string;
  meaning: string;
  culturalSignificance: string;
  gender: string;
  source: string | null;
  nameType: string;
  status: string;
  createdBy: NameCreator;
  translations: NameTranslation[];
  createdAt: string;
  updatedAt: string;
};

export type NameRecord = {
  items: NameListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

// Full detail shape returned by GET /names/:id and write responses.
export type SingleName = {
  id: string;
  name: string;
  pronunciation: string;
  meaning: string;
  culturalSignificance: string;
  gender: string;
  syllableCount: number;
  source: string | null;
  abbreviations: string[];
  nameOriginStory: string;
  regionOfUse: string;
  alternativeSpellings: string[];
  relatedNames: string[];
  notableBearers: string[];
  nicknames: string[];
  nameComposition: string[];
  nameType: string;
  popularityRank: number;
  historicalUsage: string;
  modernUsage: string;
  astrologicalAssociations: string[];
  commonMisspellings: string[];
  linguisticNotes: string;
  culturalNotes: string;
  otherNotes: string;
  status: string;
  metadata: unknown[];
  createdById: string;
  rejectionReason: string | null;
  rejectedBy: string | null;
  approvedBy: string | null;
  translations: NameTranslation[];
  rowVersion: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type NamesStats = {
  count: number;
  approved: number;
  pending: number;
  nicknames: number;
  givenNames: number;
  surnames: number;
};

// List URL-filter contract (client toolbar + server feature read the same keys).
export type ToolbarFilters = {
  search: string;
  nameType: string;
  status: string;
  sortDir: string;
};

// Route contract for /guonopedia/names searchParams.
export type NamesSearchParams = {
  page?: string;
  search?: string;
  nameType?: string;
  status?: string;
  sortBy?: string;
  sortDir?: string;
  /** Legacy pre-Phase-3 filter (?type=all|first|last). Superseded by nameType. */
  type?: string;
};

// Client-side form shape (translations use local { translation, notes } draft fields;
// server translation ids are adopted from POST responses, never fabricated).
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

// API envelopes.
export type ApiEnvelope<T> = {
  data: T;
  message: string;
};

export type ApiValidationError = {
  message: string[];
  error: "Bad Request";
  statusCode: 400;
};

export type ApiBusinessError = {
  message: string;
  error: string;
  statusCode: number;
};
