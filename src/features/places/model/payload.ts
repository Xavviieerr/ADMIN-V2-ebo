// Payload mapping: wizard draft → verified POST /places contract.
// Only backend-supported fields are emitted. Draft-only fields (founders,
// ruler, history entries, sources, LGA/province extras) are intentionally
// excluded — the backend has no fields for them.

import type { CreatePlaceInput } from "../api/places";
import type {
  PlaceBasicDraft,
  PlaceLocationDraft,
  PlaceProfileDraft,
} from "../create/context";

function cleanString(value: string | undefined | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function cleanNumber(value: string | undefined | null): number | undefined {
  if (value === undefined || value === null || value.trim() === "") return undefined;
  const num = Number(value);
  return Number.isNaN(num) ? undefined : num;
}

export function buildPlaceCreatePayload(
  basic: PlaceBasicDraft,
  location: PlaceLocationDraft,
  profile: PlaceProfileDraft | null,
): CreatePlaceInput {
  const payload: CreatePlaceInput = {
    name: basic.name.trim(),
    description: basic.summary.trim(),
    type: basic.type,
  };

  if (basic.coverImage.trim()) payload.coverImage = basic.coverImage.trim();
  if (basic.images.length > 0)
    payload.images = basic.images.map((url: string) => url.trim()).filter(Boolean);
  if (basic.tags.length > 0)
    payload.tags = basic.tags.map((tag: string) => tag.trim()).filter(Boolean);

  const loc = {
    city: cleanString(location.city),
    state: cleanString(location.state),
    country: cleanString(location.country),
    address: cleanString(location.address),
    latitude: cleanNumber(location.lat),
    longitude: cleanNumber(location.long),
  };
  if (Object.values(loc).some((v) => v !== undefined)) payload.location = loc;

  // Profiles only materialize for business places (verified: silently
  // ignored otherwise, and one ignored case poisoned a record). Never send
  // empty email/website strings — the backend rejects them; omit instead.
  if (basic.type === "business" && profile) {
    type DayHours = { open?: string; close?: string; closed?: boolean };
    const openingEntries = Object.entries(profile.openingHours ?? {}).filter(
      (entry): entry is [string, DayHours] => {
        const hours = entry[1] as DayHours | undefined;
        return (
          !!hours &&
          (hours.closed === true || (hours.open ?? "") !== "" || (hours.close ?? "") !== "")
        );
      },
    );
    payload.businessProfile = {
      category: profile.category,
      phoneNumber: cleanString(profile.phoneNumber) ?? null,
      email: cleanString(profile.email) ?? null,
      website: cleanString(profile.website) ?? null,
      logo: cleanString(profile.logo) ?? null,
      openingHours: openingEntries.length > 0 ? Object.fromEntries(openingEntries) : null,
    };
  }

  return payload;
}
