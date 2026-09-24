export function getAllWordsTab({
  status,
  createdBy,
}: {
  status: string;
  createdBy: string;
}): string {
  if (status === "approved") return "approved";
  if (status === "in-review" || status === "pending") return "moderate";
  if (createdBy) return "mine";
  return "all";
}
