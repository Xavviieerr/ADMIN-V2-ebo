import React from "react";
import {
  DictionaryAnalytics,
  EntriesList,
  Tabs,
  WordsFilter,
} from "./browse";
import { fetchWords } from "./lib/browse/fetch-all-words";
import { getServerAccessToken } from "@/features/auth/utils/serverTokenStorage";
import { SingleWord, WordPagination } from "./lib";
import { PaginationWidget } from "../shared";

const DictionaryFeature = async ({
  query,
}: {
  query: {
    page?: string;
    search?: string;
    status?: string;
    type?: string;
    createdBy?: string;
  };
}) => {
  const token = (await getServerAccessToken()) ?? "";

  const {
    page = "1",
    search = "",
    type = "",
    status = "",
    createdBy = "",
  } = query;

  const {
    data,
    pagination,
  }: { data: SingleWord[]; pagination: WordPagination } = await fetchWords({
    token,
    page,
    search,
    type,
    status,
    createdBy,
  });

  const parsedPage = Number(page);
  const currentPage = Number.isNaN(parsedPage) ? pagination.page : parsedPage;

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 bg-[#18191f] text-white font-plus-sans mb-20">
      <DictionaryAnalytics data={pagination.statusCounts} />

      <div className="md:bg-secondary-bg rounded-2xl md:px-8 md:py-8 my-8">
        <div className="flex max-md:flex-col items-end justify-between w-full gap-4 mb-8">
          <Tabs />

          <WordsFilter filter={type || "all"} />
        </div>

        <EntriesList data={data} />
      </div>

      <PaginationWidget
        totalPages={pagination.totalPages || 1}
        currentPage={currentPage}
      />
    </div>
  );
};

export default DictionaryFeature;
