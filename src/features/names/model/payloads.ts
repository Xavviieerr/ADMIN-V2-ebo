// Single home for Names write payloads (2 consumers: AddNameForm, EditNameForm).
// Rules encoded here (all verified live):
// - (targetLanguage + priority) must be unique → explicit index+1 priorities.
// - Main PATCH must never carry `translations` (backend 400) — the
//   UpdateNameInput type makes that a compile error, not a runtime surprise.
// - syllableCount is clamped to a finite >= 0 number (number inputs yield NaN).

import type { CreateNameInput, UpdateNameInput } from "../api/names";
import type { NameFormDataType, SingleName } from "./types";

const BASE_EXTRAS = {
  nameOriginStory: "",
  popularityRank: 0,
  historicalUsage: "",
  modernUsage: "",
  astrologicalAssociations: [],
  commonMisspellings: [],
  linguisticNotes: "",
  culturalNotes: "",
  otherNotes: "",
};

export function clampSyllableCount(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function buildCreatePayload(formData: NameFormDataType): CreateNameInput {
  return {
    ...BASE_EXTRAS,
    meaning: "",
    ...formData,
    syllableCount: clampSyllableCount(formData.syllableCount),
    translations: formData.translations.map((item, index) => ({
      targetLanguage: "english",
      equivalentName: "",
      translatedMeaning: item.translation,
      priority: index + 1,
      isPrimary: index === 0,
      notes: item.notes,
    })),
  };
}

export function buildUpdatePayload(
  formData: NameFormDataType,
  name: SingleName,
): UpdateNameInput {
  const { translations: _translations, ...rest } = formData;
  return {
    ...BASE_EXTRAS,
    ...rest,
    syllableCount: clampSyllableCount(rest.syllableCount),
    // No meaning input exists in the form; preserve server state.
    meaning: name.meaning ?? "",
    nameOriginStory: name.nameOriginStory ?? "",
    popularityRank: name.popularityRank ?? 0,
    historicalUsage: name.historicalUsage ?? "",
    modernUsage: name.modernUsage ?? "",
    astrologicalAssociations: name.astrologicalAssociations ?? [],
    commonMisspellings: name.commonMisspellings ?? [],
    linguisticNotes: name.linguisticNotes ?? "",
    culturalNotes: name.culturalNotes ?? "",
    otherNotes: name.otherNotes ?? "",
  };
}
