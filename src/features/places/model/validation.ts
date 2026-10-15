// Client-side validation for the Places create/edit flows.
// Returns i18n KEYS (callers translate at toast time via t(key, fallback)).
// Rules mirror the VERIFIED backend contracts. The backend validates
// strictly (whitelist DTO: unknown keys 400), so the client mirrors it.

import { WEEK_DAYS } from "./filter-options";

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

// English fallbacks for validation keys (used as `t(key, fallback)` so a
// missing/slow locale never surfaces a raw key).
export const PLACE_VALIDATION_EN: Record<string, string> = {
  "places.validation.nameRequired": "Place name is required",
  "places.validation.nameMin": "Place name must be at least 2 characters",
  "places.validation.descriptionRequired": "Description is required",
  "places.validation.descriptionMin": "Description must be at least 10 characters",
  "places.validation.typeRequired": "Place type is required",
  "places.validation.categoryRequired": "Business category is required when a profile is provided",
  "places.validation.emailInvalid": "Business email must be a valid email address",
  "places.validation.websiteInvalid": "Website must be a valid URL",
  "places.validation.latInvalid": "Latitude must be a valid number",
  "places.validation.longInvalid": "Longitude must be a valid number",
  "places.validation.timeInvalid": "Opening hours must use HH:MM time format",
  "places.validation.dayInvalid": "Opening hours contains an invalid day",
  "places.validation.hoursIncomplete": "Each open day needs both opening and closing times",
  "places.validation.reasonRequired": "A reason is required",
  "places.validation.genericRequired": "Please fill in all required fields",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Backend rejects empty strings for email/website but accepts nulls/omission,
// so the client must omit rather than send "".
const URL_RE = /^https?:\/\/.+\..+/i;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export type PlaceRecordInput = {
  name?: string;
  description?: string;
  type?: string;
  latitude?: string;
  longitude?: string;
};

export function validatePlaceRecord(data: PlaceRecordInput): ValidationErrors<Record<string, string>> {
  const errors: ValidationErrors<Record<string, string>> = {};
  if (!data.name?.trim()) errors.name = "places.validation.nameRequired";
  else if (data.name.trim().length < 2) errors.name = "places.validation.nameMin";
  if (!data.description?.trim()) errors.description = "places.validation.descriptionRequired";
  else if (data.description.trim().length < 10)
    errors.description = "places.validation.descriptionMin";
  if (!data.type?.trim()) errors.type = "places.validation.typeRequired";
  if (data.latitude !== undefined && data.latitude.trim() !== "" && Number.isNaN(Number(data.latitude)))
    errors.latitude = "places.validation.latInvalid";
  if (data.longitude !== undefined && data.longitude.trim() !== "" && Number.isNaN(Number(data.longitude)))
    errors.longitude = "places.validation.longInvalid";
  return errors;
}

export type BusinessProfileInput = {
  phoneNumber?: string | null;
  email?: string | null;
  website?: string | null;
  category?: string;
  logo?: string | null;
  openingHours?: Record<string, { open?: string; close?: string; closed?: boolean }> | null;
};

export function validateBusinessProfile(
  data: BusinessProfileInput | null | undefined,
): ValidationErrors<Record<string, string>> {
  // Profile is optional; when absent there is nothing to validate.
  if (!data) return {};
  const errors: ValidationErrors<Record<string, string>> = {};
  if (!data.category?.trim()) errors.category = "places.validation.categoryRequired";
  // Backend rejects "" for email/website: only validate non-empty values and
  // let the payload builder omit empties.
  if (data.email !== undefined && data.email !== null && data.email.trim() !== "" && !EMAIL_RE.test(data.email.trim()))
    errors.email = "places.validation.emailInvalid";
  if (data.website !== undefined && data.website !== null && data.website.trim() !== "" && !URL_RE.test(data.website.trim()))
    errors.website = "places.validation.websiteInvalid";
  if (data.openingHours) {
    for (const [day, hours] of Object.entries(data.openingHours)) {
      if (!(WEEK_DAYS as readonly string[]).includes(day)) {
        errors.openingHours = "places.validation.dayInvalid";
        break;
      }
      if (!hours || typeof hours !== "object") {
        errors.openingHours = "places.validation.hoursIncomplete";
        break;
      }
      if (hours.closed) continue;
      const { open, close } = hours;
      if (!open || !close) {
        errors.openingHours = "places.validation.hoursIncomplete";
        break;
      }
      if (!TIME_RE.test(open) || !TIME_RE.test(close)) {
        errors.openingHours = "places.validation.timeInvalid";
        break;
      }
    }
  }
  return errors;
}

export function validateReason(reason: string | undefined): string | null {
  if (!reason?.trim()) return "places.validation.reasonRequired";
  return null;
}
