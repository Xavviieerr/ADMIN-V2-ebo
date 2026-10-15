// Filter/sort vocabulary for the figures list. Values are backend contract literals.

export type FilterOption = {
  labelKey?: string;
  label: string;
  value: string;
};

export const FIGURE_OCCUPATION_OPTIONS: FilterOption[] = [
  { labelKey: "common.all", label: "All", value: "" },
  { label: "Ọseghe", value: "ọseghe" },
  { label: "Ọdụjonẹ", value: "ọdụjonẹ" },
  { label: "Ọsoine", value: "ọsoine" },
  { label: "Ọboine", value: "ọboine" },
  { label: "Ọyona", value: "ọyona" },
  { label: "Activist", value: "activist" },
  { label: "Ọchueki", value: "ọchueki" },
  { label: "Academia", value: "academia" },
  { label: "Religious", value: "religious" },
  { label: "Military", value: "military" },
  { label: "Ovie Iku", value: "ovie iku" },
  { label: "Ovie", value: "ovie" },
  { label: "Ọfa", value: "ọfa" },
];

export const FIGURE_STATUS_OPTIONS: FilterOption[] = [
  { labelKey: "common.all", label: "All", value: "" },
  { labelKey: "common.dictionary.pending", label: "Pending", value: "pending" },
  { labelKey: "common.approved", label: "Approved", value: "approved" },
  { labelKey: "common.dictionary.rejected", label: "Rejected", value: "rejected" },
];

export const FIGURE_SORT_FIELD_OPTIONS: FilterOption[] = [
  { labelKey: "figures.sortByName", label: "Name", value: "fullName" },
  { labelKey: "figures.sortByUpdated", label: "Recently updated", value: "updatedAt" },
];

export const FIGURE_SORT_DIR_OPTIONS: FilterOption[] = [
  { labelKey: "figures.sortAsc", label: "Ascending", value: "ASC" },
  { labelKey: "figures.sortDesc", label: "Descending", value: "DESC" },
];

export const FIGURE_GENDER_OPTIONS: FilterOption[] = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

export const FIGURE_RELATIONSHIP_OPTIONS: FilterOption[] = [
  { label: "Parent", value: "parent" },
  { label: "Spouse", value: "spouse" },
  { label: "Ex-spouse", value: "ex_spouse" },
  { label: "Child", value: "child" },
  { label: "Sibling", value: "sibling" },
  { label: "Relative", value: "relative" },
  { label: "Other", value: "other" },
];

export function figureOccupationLabel(value: string | null | undefined): string {
  if (!value) return "—";
  return value;
}
