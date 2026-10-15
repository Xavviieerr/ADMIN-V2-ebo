// Client-side validation for the Figures create/edit flows.
// Returns i18n KEYS (callers translate at toast time via t(key, fallback)).

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export const FIGURE_VALIDATION_EN: Record<string, string> = {
  "figures.validation.nameRequired": "Full name is required",
  "figures.validation.nameMin": "Full name must be at least 2 characters",
  "figures.validation.shortBioRequired": "Short bio is required",
  "figures.validation.introRequired": "Introduction is required",
  "figures.validation.occupationRequired": "Occupation is required",
  "figures.validation.genderInvalid": "Gender must be male, female, or other",
  "figures.validation.dateInvalid": "Date must be YYYY-MM-DD, a BC date string, or omitted",
  "figures.validation.reasonRequired": "A reason is required",
  "figures.validation.bioRequired": "Add at least one biography entry",
  "figures.validation.genericRequired": "Please fill in all required fields",
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidFigureDate(value: string | null | undefined): boolean {
  if (value === undefined || value === null || value.trim() === "") return true;
  const v = value.trim();
  if (DATE_RE.test(v)) return true;
  if (/bc/i.test(v)) return true;
  return false;
}

export type FigureBasicInput = {
  fullName?: string;
  shortBio?: string;
  introBio?: string;
  occupation?: string;
  gender?: string;
  dateOfBirth?: string | null;
  dateOfDeath?: string | null;
};

export function validateFigureBasic(data: FigureBasicInput): ValidationErrors<Record<string, string>> {
  const errors: ValidationErrors<Record<string, string>> = {};
  if (!data.fullName?.trim()) errors.fullName = "figures.validation.nameRequired";
  else if (data.fullName.trim().length < 2) errors.fullName = "figures.validation.nameMin";
  if (!data.shortBio?.trim()) errors.shortBio = "figures.validation.shortBioRequired";
  if (!data.introBio?.trim()) errors.introBio = "figures.validation.introRequired";
  if (!data.occupation?.trim()) errors.occupation = "figures.validation.occupationRequired";
  if (data.gender && !["male", "female", "other"].includes(data.gender))
    errors.gender = "figures.validation.genderInvalid";
  if (!isValidFigureDate(data.dateOfBirth ?? undefined))
    errors.dateOfBirth = "figures.validation.dateInvalid";
  if (!isValidFigureDate(data.dateOfDeath ?? undefined))
    errors.dateOfDeath = "figures.validation.dateInvalid";
  return errors;
}

export function validateFigureBiography(entries: { title?: string; content?: string }[] | undefined): string | null {
  if (!entries || entries.length === 0) return "figures.validation.bioRequired";
  return null;
}

export function validateReason(reason: string | undefined): string | null {
  if (!reason?.trim()) return "figures.validation.reasonRequired";
  return null;
}
