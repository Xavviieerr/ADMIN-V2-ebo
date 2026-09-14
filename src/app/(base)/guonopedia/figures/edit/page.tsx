import EditFigureFeature from "@/features/figures-pedia/edit-figure/main";
import { Figure } from "@/features/figures-pedia/lib";
import { fetchSingleFigure } from "@/features/figures-pedia/lib/api/fetch-single-figure";
import { Loader2 } from "lucide-react";
import { getServerAccessToken } from "@/features/auth/utils/serverTokenStorage";
import React, { Suspense } from "react";

const EditFigurePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) => {
  const resolvedParams = await searchParams;
  const token = (await getServerAccessToken()) ?? "";

  const response: Promise<{ data: Figure }> = fetchSingleFigure({
    token,
    id: resolvedParams.id,
  });

  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 bg-[#18191f] text-white pb-20 font-plus-sans">
          <Loader2 size={48} className="animate-spin text-foreground-50" />
        </div>
      }
    >
      <EditFigureFeature data={response} />
    </Suspense>
  );
};

export default EditFigurePage;
