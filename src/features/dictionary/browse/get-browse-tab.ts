export function getAllWordsTab({
  createdBy,
}: {
  createdBy: string;
}): string {
  if (createdBy) return "mine";
  return "all";
}
