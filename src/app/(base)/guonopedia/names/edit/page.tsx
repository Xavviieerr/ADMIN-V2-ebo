import { EditNameFeature } from "@/features/names-pedia";

const EditNamesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) => {
  const params = await searchParams;
  return <EditNameFeature nameId={params.id} />;
};

export default EditNamesPage;
