import { GuonopediaNamesFeature, type NamesSearchParams } from "@/features/names";

const GuonopediaNamesPage = async ({
  searchParams,
}: {
  searchParams: Promise<NamesSearchParams>;
}) => {
  const params = await searchParams;
  return <GuonopediaNamesFeature searchParams={params} />;
};

export default GuonopediaNamesPage;
