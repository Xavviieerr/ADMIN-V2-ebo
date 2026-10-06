// Ownership for /names/:id translation sub-resource.
// Verified: POST returns the created translation (with server-generated id);
// PATCH returns the FULL updated name; (targetLanguage + priority) must be unique (409).
// There is currently NO backend DELETE translation endpoint (verified `Cannot DELETE`
// on singular, plural-nested, and top-level variants), so no delete request exists here.
// `removeTranslationUnavailable` isolates that gap: when the backend ships a route,
// wire it in this file only — no flow restructure needed.

import type { NameTranslation, SingleName } from "../model/types";
import { apiSend, type ApiToken } from "./request";
import type { CreateTranslationInput } from "./names";

export async function addTranslation(
  nameId: string,
  input: CreateTranslationInput,
  token: ApiToken,
): Promise<NameTranslation> {
  return apiSend<NameTranslation>(
    `/names/${nameId}/translations`,
    "POST",
    input,
    token,
    "Failed to add translation",
  );
}

export async function updateTranslation(
  nameId: string,
  translationId: string,
  input: CreateTranslationInput,
  token: ApiToken,
): Promise<SingleName> {
  return apiSend<SingleName>(
    `/names/${nameId}/translation/${translationId}`,
    "PATCH",
    input,
    token,
    "Failed to update translation",
  );
}

export function removeTranslationUnavailable(): never {
  throw new Error(
    "Translation deletion is unavailable: the backend currently exposes no DELETE translation endpoint.",
  );
}
