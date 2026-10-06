// Feature-owned UI mappings. Backend enums are authoritative; these are labels only.
// Verified: nameType must be exactly "given name" | "surname" | "nickname" | "other".

export type FilterOption = {
  labelKey?: string;
  label: string;
  value: string;
};

export const NAME_TYPE_OPTIONS: FilterOption[] = [
  { labelKey: "common.all", label: "All", value: "" },
  { labelKey: "names.filter.firstNames", label: "given name", value: "given name" },
  { labelKey: "names.filter.lastNames", label: "surname", value: "surname" },
  { labelKey: "names.filter.nicknames", label: "nickname", value: "nickname" },
];

// Legacy `?type=all|first|last` URLs (pre-Phase-3 filter) map to backend values.
// New code must write `nameType`, never `type`.
export function legacyTypeToNameType(type: string | null | undefined): string {
  if (type === "first") return "given name";
  if (type === "last") return "surname";
  return "";
}

// NOTE: the list endpoint rejects `other` (verified 400) even though create
// accepts it — so the list offers nicknames but no "Other" option.
export const STATUS_FILTER_OPTIONS: FilterOption[] = [
  { labelKey: "common.all", label: "All", value: "" },
  { labelKey: "common.dictionary.pending", label: "Pending", value: "pending" },
  { labelKey: "common.approved", label: "Approved", value: "approved" },
  { labelKey: "common.dictionary.rejected", label: "Rejected", value: "rejected" },
];

export const SORT_DIR_OPTIONS: FilterOption[] = [
  { label: "A – Z", value: "ASC" },
  { label: "Z – A", value: "DESC" },
];
