// Filter/sort vocabulary for the places list. Values are backend contract
// literals (verified live); only the shown labels localize.

export type FilterOption = {
  labelKey?: string;
  label: string;
  value: string;
};

export const PLACE_TYPE_OPTIONS: FilterOption[] = [
  { labelKey: "common.all", label: "All", value: "" },
  { labelKey: "places.types.business", label: "Business", value: "business" },
  { labelKey: "places.types.landmark", label: "Landmark", value: "landmark" },
  { labelKey: "places.types.school", label: "School", value: "school" },
  { labelKey: "places.types.hospital", label: "Hospital", value: "hospital" },
  { labelKey: "places.types.church", label: "Church", value: "church" },
  { labelKey: "places.types.governmentOffice", label: "Government office", value: "government_office" },
  { labelKey: "places.types.historicalSite", label: "Historical site", value: "historical_site" },
  { labelKey: "places.types.culturalInstitution", label: "Cultural institution", value: "cultural_institution" },
  { labelKey: "places.types.community", label: "Community", value: "community" },
  { labelKey: "places.types.village", label: "Village", value: "village" },
  { labelKey: "places.types.city", label: "City", value: "city" },
  { labelKey: "places.types.river", label: "River", value: "river" },
  { labelKey: "places.types.park", label: "Park", value: "park" },
  { labelKey: "places.types.mountain", label: "Mountain", value: "mountain" },
  { labelKey: "places.types.beach", label: "Beach", value: "beach" },
  { labelKey: "places.types.island", label: "Island", value: "island" },
  { labelKey: "places.types.other", label: "Other", value: "other" },
];

/** Status whitelist (verified live). `in-review` is accepted by validation
 *  but currently 500s on the backend, so it is deliberately not offered. */
export const PLACE_STATUS_OPTIONS: FilterOption[] = [
  { labelKey: "common.all", label: "All", value: "" },
  { labelKey: "common.dictionary.pending", label: "Pending", value: "pending" },
  { labelKey: "common.approved", label: "Approved", value: "approved" },
  { labelKey: "common.dictionary.rejected", label: "Rejected", value: "rejected" },
];

/** sortDir whitelist (verified live: anything else 400s). Orders by creation date. */
export const PLACE_SORT_DIR_OPTIONS: FilterOption[] = [
  { labelKey: "places.sortOldestFirst", label: "Oldest first", value: "ASC" },
  { labelKey: "places.sortNewestFirst", label: "Newest first", value: "DESC" },
];

export const BUSINESS_CATEGORY_OPTIONS: FilterOption[] = [
  { label: "Restaurant", value: "restaurant" },
  { label: "Hotel", value: "hotel" },
  { label: "Pharmacy", value: "pharmacy" },
  { label: "Store", value: "store" },
  { label: "Company", value: "company" },
  { label: "Clinic", value: "clinic" },
  { label: "Bank", value: "bank" },
  { label: "School", value: "school" },
  { label: "Hospital", value: "hospital" },
  { label: "Salon", value: "salon" },
  { label: "Other", value: "other" },
];

/** Accepted verification statuses (verified live). */
export const VERIFICATION_STATUS_OPTIONS: FilterOption[] = [
  { label: "Unverified", value: "unverified" },
  { label: "Community verified", value: "community_verified" },
  { label: "Guono verified", value: "guono_verified" },
];

/** Day keys accepted for openingHours (client-side; backend stores verbatim). */
export const WEEK_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export function placeTypeLabel(value: string | null | undefined): string {
  if (!value) return "—";
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
