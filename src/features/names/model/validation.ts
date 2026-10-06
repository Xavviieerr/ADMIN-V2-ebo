// Single validation source for the Names create/edit forms.
// Returns i18n KEYS (callers translate at toast time); backend enum values
// stay verbatim inside messages since they are contract literals.
// Mirrors VERIFIED backend rules only (live probes):
// - name: non-empty string
// - nameType ∈ given name | surname | nickname | other
// - gender ∈ male | female | neutral (backend rejects unknown)
// - nameComposition: must be an array (product requires ≥1 entry)
// - translations: OPTIONAL (backend accepts []) — never block empty
// - translatedMeaning ≥ 2 chars when a translation is provided
// - PATCH rejects unknown props; main PATCH rejects `translations`

import type { NameFormDataType } from "./types";

// English fallbacks for validation keys (used as `t(key, fallback)` so a
// missing/slow locale never surfaces a raw key in a toast).
export const VALIDATION_EN: Record<string, string> = {
  "names.validation.nameTypeRequired": "Name type is required",
  "names.validation.nameTypeEnum": "Name type must be one of: given name, surname, nickname, other",
  "names.validation.nameRequired": "Name is required",
  "names.validation.genderRequired": "Gender is required",
  "names.validation.genderEnum": "Gender must be one of: male, female, neutral",
  "names.validation.descriptionRequired": "Description is required",
  "names.validation.dialectRequired": "Dialect is required",
  "names.validation.compositionRequired": "Composition is required",
  "names.validation.translationsMin": "Translations must be at least 2 characters",
  "names.validation.draftRequired": "Translation is required",
  "names.validation.draftMin": "Translation must be at least 2 characters",
};

export function validateNameForm(formData: NameFormDataType): string[] {
  const errors: string[] = [];
  if (!formData.nameType.trim()) errors.push("names.validation.nameTypeRequired");
  else if (!["given name", "surname", "nickname", "other"].includes(formData.nameType.trim())) {
    errors.push("names.validation.nameTypeEnum");
  }
  if (!formData.name.trim()) errors.push("names.validation.nameRequired");
  if (!formData.gender.trim()) errors.push("names.validation.genderRequired");
  else if (!["male", "female", "neutral"].includes(formData.gender.trim())) {
    errors.push("names.validation.genderEnum");
  }
  if (!formData.culturalSignificance.trim()) errors.push("names.validation.descriptionRequired");
  if (!formData.regionOfUse.trim()) errors.push("names.validation.dialectRequired");
  if (!Array.isArray(formData.nameComposition) || formData.nameComposition.length === 0) {
    errors.push("names.validation.compositionRequired");
  }
  for (const item of formData.translations) {
    if (item.translation.trim().length > 0 && item.translation.trim().length < 2) {
      errors.push("names.validation.translationsMin");
      break;
    }
  }
  return errors;
}

export function validateTranslationDraft(translation: string): string | null {
  if (translation.trim() === "") return "names.validation.draftRequired";
  if (translation.trim().length < 2) return "names.validation.draftMin";
  return null;
}
