import { HomeFeature } from "@/features/home";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  const query = await searchParams;
  return <HomeFeature query={query} />;
}
