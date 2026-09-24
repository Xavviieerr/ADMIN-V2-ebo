import React from "react";
import {
  DictionaryAnalytics,
  EntriesList,
  SortDropdown,
  StatusDropdown,
  Tabs,
  WordsFilter,
} from "./browse";
import BrowsePagination from "./browse/browse-pagination";
import { fetchWords } from "./lib/browse/fetch-all-words";
import { getServerAccessToken } from "@/features/auth/utils/serverTokenStorage";
import { SingleWord, WordPagination } from "./lib";
import { DICTIONARY_LIST_LIMIT } from "./browse/constants";

const DictionaryFeature = async ({
  query,
}: {
  query: {
    page?: string;
    search?: string;
    status?: string;
    type?: string;
    createdBy?: string;
    sortBy?: string;
    sortDir?: string;
  };
}) => {
  const token = (await getServerAccessToken()) ?? "";

  const {
    page = "1",
    search = "",
    type = "",
    status = "",
    createdBy = "",
    sortBy = "ota",
    sortDir = "ASC",
  } = query;

  const {
    data,
    pagination,
    error,
  }: {
    data: SingleWord[];
    pagination: WordPagination;
    error?: string;
  } = await fetchWords({
    token,
    page,
    search,
    type,
    status,
    createdBy,
    sortBy,
    sortDir,
  });

  const parsedPage = Number(page);
  const currentPage = Number.isNaN(parsedPage)
    ? pagination.page
    : Math.max(1, parsedPage);

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 bg-[#18191f] text-white font-plus-sans mb-20">
      <DictionaryAnalytics data={pagination.statusCounts} />

      <div className="md:bg-secondary-bg rounded-2xl md:px-8 md:py-8 my-8">
        <div className="flex max-md:flex-col items-end justify-between w-full gap-4 mb-8">
          <Tabs />

          <div className="flex max-sm:flex-col flex-wrap gap-4 md:w-fit w-full shrink-0">
            <WordsFilter filter={type || "all"} />
            <StatusDropdown />
            <SortDropdown />
          </div>
        </div>

        {error && (
          <div className="mb-6 w-full rounded-md border border-dashed border-base-red bg-red-500/10 px-5 py-3 text-center text-sm text-base-red">
            {error}
          </div>
        )}

        <EntriesList data={data} />
      </div>

      <BrowsePagination
        currentPage={currentPage}
        totalPages={pagination.totalPages || 1}
        totalItems={pagination.totalItems}
        limit={DICTIONARY_LIST_LIMIT}
      />
    </div>
  );
};

export default DictionaryFeature;
