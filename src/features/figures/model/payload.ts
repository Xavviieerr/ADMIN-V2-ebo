// Payload mapping: form draft → verified POST/PATCH /figures contract.
// Only backend-supported fields are emitted. Empty strings for dates are
// omitted (backend rejects them); date-only/BC/null are passed through.

export type FigureCreateInput = {
  fullName: string;
  shortBio: string;
  introBio: string;
  nationality?: string | null;
  ethnicity?: string | null;
  occupation: string;
  suggestionNote?: string | null;
  profilePhoto?: string | null;
  otherNames?: string[];
  gender?: string | null;
  dateOfBirth?: string | null;
  dateOfDeath?: string | null;
  placeOfBirth?: string | null;
  religion?: string | null;
  tags?: string[];
  notableAchievements?: string[];
  era?: string | null;
  region?: string | null;
  translation?: { language: string; shortBio: string; introBio: string } | null;
  biography?: {
    title: string;
    overview: string;
    order: number;
    entries: { title: string; content: string; order: number; photos?: string[] }[];
  }[];
  timeline?: { year: string; title: string; description: string; order: number }[];
  family?: {
    name: string;
    relationship: string;
    occupation?: string;
    bio?: string;
    photo?: string | null;
    dateOfBirth?: string | null;
    dateOfDeath?: string | null;
  }[];
  externalLinks?: {
    title: string;
    type: string;
    url?: string | null;
    date?: string | null;
    source?: string | null;
    creator?: string | null;
  }[];
};

function cleanOptional(value: string | undefined | null): string | null | undefined {
  if (value === undefined) return undefined;
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return trimmed;
}

function cleanDate(value: string | undefined | null): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed;
}

export type FigureDraftLike = {
  fullName: string;
  shortBio: string;
  introBio: string;
  occupation: string;
  gender?: string;
  nationality?: string;
  ethnicity?: string;
  placeOfBirth?: string;
  religion?: string;
  era?: string;
  region?: string;
  suggestionNote?: string;
  profilePhoto?: string;
  otherNames?: string[];
  tags?: string[];
  notableAchievements?: string[];
  dateOfBirth?: string | null;
  dateOfDeath?: string | null;
};

export function buildFigureCreatePayload(draft: FigureDraftLike): FigureCreateInput {
  const payload: FigureCreateInput = {
    fullName: draft.fullName.trim(),
    shortBio: draft.shortBio.trim(),
    introBio: draft.introBio.trim(),
    occupation: draft.occupation.trim(),
  };
  const gender = draft.gender?.trim();
  if (gender) payload.gender = gender;
  const dob = cleanDate(draft.dateOfBirth ?? undefined);
  if (dob !== undefined) payload.dateOfBirth = dob;
  const dod = cleanDate(draft.dateOfDeath ?? undefined);
  if (dod !== undefined) payload.dateOfDeath = dod;
  const nationality = cleanOptional(draft.nationality);
  if (nationality !== undefined) payload.nationality = nationality;
  const ethnicity = cleanOptional(draft.ethnicity);
  if (ethnicity !== undefined) payload.ethnicity = ethnicity;
  const pob = cleanOptional(draft.placeOfBirth);
  if (pob !== undefined) payload.placeOfBirth = pob;
  const religion = cleanOptional(draft.religion);
  if (religion !== undefined) payload.religion = religion;
  const era = cleanOptional(draft.era);
  if (era !== undefined) payload.era = era;
  const region = cleanOptional(draft.region);
  if (region !== undefined) payload.region = region;
  const note = cleanOptional(draft.suggestionNote);
  if (note !== undefined) payload.suggestionNote = note;
  const photo = cleanOptional(draft.profilePhoto);
  if (photo !== undefined) payload.profilePhoto = photo;
  if (draft.otherNames && draft.otherNames.length > 0)
    payload.otherNames = draft.otherNames.map((s) => s.trim()).filter(Boolean);
  if (draft.tags && draft.tags.length > 0)
    payload.tags = draft.tags.map((s) => s.trim()).filter(Boolean);
  if (draft.notableAchievements && draft.notableAchievements.length > 0)
    payload.notableAchievements = draft.notableAchievements.map((s) => s.trim()).filter(Boolean);
  return payload;
}
