import { GuonopediaNamesFeature } from "@/features/names-pedia";

const GuonopediaNamesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    type?: string;
  }>;
}) => {
  const params = await searchParams;
  return <GuonopediaNamesFeature searchParams={params} />;
};

export default GuonopediaNamesPage;
