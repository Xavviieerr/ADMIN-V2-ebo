import React, { Suspense } from "react";
import { FiguresAnalytics, FiguresTable } from "./components";
import { fetchFigures } from "./lib/api/fetch-all-figures";
import { getServerAccessToken } from "@/features/auth/utils/serverTokenStorage";
import { FiguresPagination, MiniFigures } from "./lib";
import FiguresFilter from "./components/figures-filter";
import { fetchAnalytics } from "./lib/api/fetch-analytics";
import { Loader2 } from "lucide-react";

const FiguresPediaFeature = async ({
  query,
}: {
  query: {
    page?: string;
    search?: string;
    status?: string;
    category?: string;
    createdBy?: string;
  };
}) => {
  const token = (await getServerAccessToken()) ?? "";

  const {
    page = "1",
    search = "",
    category = "",
    status = "",
    createdBy = "",
  } = query;

  const data: Promise<FiguresPagination & { items: MiniFigures[] }> =
    fetchFigures({
      token,
      page,
      search,
      category,
      status,
      createdBy,
    });

  const stats: Promise<{
    data: {
      count: number;
      approved: number;
      pending: number;
      rejected: number;
    };
  }> = fetchAnalytics({ token });

  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 bg-[#18191f] text-white pb-20 font-plus-sans">
          <Loader2 size={48} className="animate-spin text-foreground-50" />
        </div>
      }
    >
      <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 bg-[#18191f] text-white pb-20 font-plus-sans">
        <FiguresAnalytics data={stats} />

        <FiguresFilter filter={category} />

        <FiguresTable figures={data} page={page} />
      </div>
    </Suspense>
  );
};

export default FiguresPediaFeature;
