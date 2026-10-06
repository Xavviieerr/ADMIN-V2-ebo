import NamesAnalytics from "./NamesAnalytics";
import NamesTable from "./NamesTable";
import NamesToolbar from "./NamesToolbar";
import NamesPagination from "./NamesPagination";
import { LocaleWrapper } from "../../shared";
import { getServerAccessToken } from "@/features/auth/utils/serverTokenStorage";
import { fetchNames, fetchNamesStats } from "../api/names";
import { getNamesErrorMessage, NamesApiError } from "../api/errors";
import { legacyTypeToNameType } from "../model/constants";
import type { NameRecord, NamesSearchParams, NamesStats } from "../model/types";
import { redirect } from "next/navigation";

const GuonopediaNamesFeature = async ({
  searchParams,
}: {
  searchParams: NamesSearchParams;
}) => {
  const {
    search = "",
    sortBy = "name",
    sortDir = "ASC",
    status = "",
  } = searchParams;
  // nameType wins; legacy `type` only fills the gap for old bookmarks.
  const nameType = searchParams.nameType ?? legacyTypeToNameType(searchParams.type);

  // Validate the page up front: non-numeric/negative values can never render
  // (mirrors the /users clamp so "Page NaN" states are unrepresentable).
  const parsed = Number.parseInt(searchParams.page ?? "1", 10);
  const requestedPage = Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : 1;

  const token = await getServerAccessToken();

  // Stats must not take the list down with them.
  let stats: NamesStats | null = null;
  try {
    stats = await fetchNamesStats(token);
  } catch {
    stats = null;
  }

  let data: NameRecord | null = null;
  let listError: unknown = null;
  try {
    data = await fetchNames(
      {
        page: requestedPage,
        search,
        sortBy,
        sortDir,
        nameType: nameType || undefined,
        status: status || undefined,
      },
      token,
    );
  } catch (error) {
    // Missing token surfaces as a login redirect signal, not a list error.
    if (error instanceof Error && error.message.startsWith("Missing access token")) throw error;
    listError = error;
  }

  // Clamp stale pages (manual URL, back/forward) back into range instead of
  // rendering impossible states like "Showing 45–52 of 30".
  if (data && data.totalPages >= 1 && requestedPage > data.totalPages) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (nameType) params.set("nameType", nameType);
    if (status) params.set("status", status);
    if (sortDir) params.set("sortDir", sortDir);
    params.set("page", String(data.totalPages));
    redirect(`/guonopedia/names?${params.toString()}`);
  }

  // The toolbar stays mounted in every state (loading data, empty, error) so
  // filters never disappear — including on backend 400s such as an
  // unsupported nameType value.
  if (!data) {
    return (
      <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 bg-[#18191f] text-white pb-20">
        <NamesAnalytics stats={stats} />
        <NamesToolbar />
        <div
          role="alert"
          className="w-full mt-8 p-6 rounded-md bg-gray-txt-100 flex flex-col items-center gap-3 text-center"
        >
          <p className="font-medium">
            <LocaleWrapper item="names.list.loadFailed" fallback="Failed to load names" />
          </p>
          <p className="text-sm text-gray-300">
            {getNamesErrorMessage(listError, "An unexpected error occurred")}
          </p>
          {listError instanceof NamesApiError && listError.isValidation && (
            <p className="text-sm text-gray-400">
              <LocaleWrapper
                item="names.list.validationHint"
                fallback="Try clearing the active filters above."
              />
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 bg-[#18191f] text-white pb-20">
      <NamesAnalytics stats={stats} />

      <NamesToolbar />

      <NamesTable data={data} />

      {data.totalPages >= 1 && (
        <NamesPagination
          currentPage={data.page || requestedPage}
          totalPages={Number(data.totalPages)}
          totalItems={Number(data.total)}
          limit={Number(data.limit) || 10}
        />
      )}
    </div>
  );
};

export default GuonopediaNamesFeature;
