import { EditNameFeature } from "@/features/names";

const EditNamesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) => {
  const params = await searchParams;
  return <EditNameFeature nameId={params.id} />;
};

export default EditNamesPage;
