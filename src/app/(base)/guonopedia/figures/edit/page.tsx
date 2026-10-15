import { notFound, redirect } from "next/navigation";

// Legacy query-param route: /guonopedia/figures/edit?id=...
// Preserved for old links; canonical edit lives at /guonopedia/figures/[id]/edit.
const LegacyEditFigurePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) => {
  const { id } = await searchParams;
  if (!id) notFound();
  const trimmed = id.trim();
  if (!trimmed) notFound();
  redirect(`/guonopedia/figures/${trimmed}/edit`);
};

export default LegacyEditFigurePage;
