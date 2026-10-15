// Single ownership area for Figures domain types.
// Verified contracts: envelope {data,message}; validation 400 {message:string[]};
// genders male|female|other; status pending|approved|rejected; sortDir ASC|DESC|asc|desc;
// occupation enum below; relationship ex_spouse (underscore); date-only/BC/null ok,
// empty-string/full-datetime rejected; DELETE 204 then 404; image 201 raw sizes.

export type FigureGender = "male" | "female" | "other";

export type FigureStatus = "pending" | "approved" | "rejected";

export type FigureOccupation =
  | "ọseghe"
  | "ọdụjonẹ"
  | "ọsoine"
  | "ọboine"
  | "ọyona"
  | "activist"
  | "ọchueki"
  | "academia"
  | "religious"
  | "military"
  | "ovie iku"
  | "ovie"
  | "ọfa";

export type FigureRelationship =
  | "parent"
  | "spouse"
  | "ex_spouse"
  | "child"
  | "sibling"
  | "relative"
  | "other";

export type BiographyEntry = {
  id?: string;
  title: string;
  content: string;
  order: number;
  photos?: string[];
  translations?: BiographyEntryTranslation[];
};

export type BiographyEntryTranslation = {
  language: string;
  title: string;
  content: string;
};

export type BiographySectionTranslation = {
  language: string;
  title: string;
  overview: string;
};

export type BiographySection = {
  id?: string;
  title: string;
  overview: string;
  order: number;
  entries: BiographyEntry[];
  translations?: BiographySectionTranslation[];
};

export type TimelineEvent = {
  id?: string;
  year: string;
  title: string;
  description: string;
  order: number;
  translations?: TimelineTranslation[];
};

export type TimelineTranslation = {
  language: string;
  title: string;
  description: string;
  order: number;
};

export type FamilyMember = {
  id?: string;
  name: string;
  relationship: string;
  occupation?: string;
  bio?: string;
  photo?: string | null;
  photos?: string[];
  dateOfBirth?: string | null;
  dateOfDeath?: string | null;
  marriageYear?: string | null;
  divorceYear?: string | null;
  linkedFigureId?: string | null;
};

export type FigureExternalLink = {
  id?: string;
  title: string;
  type: string;
  url?: string | null;
  date?: string | null;
  source?: string | null;
  creator?: string | null;
  description?: string | null;
};

export type FigureTranslation = {
  language: string;
  shortBio: string;
  introBio: string;
};

export type RelatedFigureEntry = {
  id: string;
  figureId?: string;
  relatedFigureId: string;
  relationNote?: string | null;
  createdAt?: string;
  relatedFigure?: FigureListItem | null;
};

export type FigureListItem = {
  id: string;
  fullName: string;
  slug?: string;
  profilePhoto?: string | null;
  shortBio?: string | null;
  introBio?: string | null;
  dateOfBirth?: string | null;
  dateOfDeath?: string | null;
  placeOfBirth?: string | null;
  nationality?: string | null;
  ethnicity?: string | null;
  religion?: string | null;
  occupation?: string | null;
  era?: string | null;
  region?: string | null;
  status: string;
  submissionType?: string | null;
  createdBy?: { id: string; username?: string } | null;
  createdAt: string;
  updatedAt?: string;
};

export type FiguresPage = {
  items: FigureListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type FigureDetail = FigureListItem & {
  otherNames?: string[];
  gender?: string | null;
  tags?: string[];
  notableAchievements?: string[];
  suggestionNote?: string | null;
  era?: string | null;
  region?: string | null;
  translation?: FigureTranslation | null;
  biography?: BiographySection[];
  timeline?: TimelineEvent[];
  education?: FigureEducation[];
  family?: FamilyMember[];
  externalLinks?: FigureExternalLink[];
  relatedFigures?: RelatedFigureEntry[];
  rejectedBy?: string | null;
  rejectedAt?: string | null;
  rejectionReason?: string | null;
  approvedBy?: string | null;
};

export type FigureEducation = {
  id?: string;
  institution: string;
  degree?: string | null;
  field?: string | null;
  startYear?: string | null;
  endYear?: string | null;
  description?: string | null;
};

export type FigureStats = {
  count: number;
  total?: number;
  approved: number;
  pending: number;
  rejected: number;
};

export type FiguresToolbarFilters = {
  search: string;
  occupation: string;
  status: string;
  sortBy: string;
  sortDir: string;
};

export type FiguresSearchParams = {
  page?: string;
  search?: string;
  occupation?: string;
  category?: string;
  status?: string;
  sortBy?: string;
  sortDir?: string;
  createdBy?: string;
};
