import PlacesAnalytics from "./analytics";
import PlacesTable from "./PlacesTable";
import PlacesToolbar from "./PlacesToolbar";
import PlacesPagination from "./PlacesPagination";
import { LocaleWrapper } from "../../shared";
import { getServerAccessToken } from "@/features/auth/utils/serverTokenStorage";
import { fetchPlacesList, fetchPlacesStats } from "../api/places";
import { getPlaceErrorMessage, PlaceApiError } from "../api/errors";
import type { PlacesPage, PlacesSearchParams, PlaceStats } from "../model/types";
import { redirect } from "next/navigation";

const PlacesListFeature = async ({
  searchParams,
}: {
  searchParams: PlacesSearchParams;
}) => {
  const {
    search = "",
    type = "",
    status = "",
    createdBy = "",
  } = searchParams;

  // Sanitize sort params. Unknown sortBy is silently ignored by the backend,
  // but unknown sortDir 400s — and `in-review` status 500s, so the toolbar
  // never offers it and unknown values are dropped here instead of sent.
  const sortBy = ["createdAt", "name"].includes(searchParams.sortBy ?? "")
    ? (searchParams.sortBy as string)
    : "createdAt";
  const sortDir = ["ASC", "DESC", "asc", "desc"].includes(searchParams.sortDir ?? "")
    ? (searchParams.sortDir as string)
    : "ASC";
  const safeStatus = ["", "pending", "approved", "rejected"].includes(status)
    ? status
    : "";

  // Validate the page up front: non-numeric values 400 on the backend, so
  // normalize here instead of rendering impossible states.
  const parsed = Number.parseInt(searchParams.page ?? "1", 10);
  const requestedPage = Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : 1;

  const token = await getServerAccessToken();

  // Stats must not take the list down with them.
  let stats: PlaceStats | null = null;
  try {
    stats = await fetchPlacesStats(token);
  } catch {
    stats = null;
  }

  let data: PlacesPage | null = null;
  let listError: unknown = null;
  try {
    data = await fetchPlacesList(
      {
        page: requestedPage,
        search,
        sortBy,
        sortDir,
        type: type || undefined,
        status: safeStatus || undefined,
        createdBy: createdBy || undefined,
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
    if (type) params.set("type", type);
    if (safeStatus) params.set("status", safeStatus);
    if (createdBy) params.set("createdBy", createdBy);
    params.set("page", String(data.totalPages));
    redirect(`/guonopedia/places?${params.toString()}`);
  }

  // The toolbar stays mounted in every state (loading data, empty, error) so
  // filters never disappear.
  if (!data) {
    return (
      <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 bg-[#18191f] text-white pb-20 font-plus-sans">
        <PlacesAnalytics stats={stats} />
        <PlacesToolbar />
        <div
          role="alert"
          className="w-full mt-8 p-6 rounded-md bg-gray-txt-100 flex flex-col items-center gap-3 text-center"
        >
          <p className="font-medium">
            <LocaleWrapper item="places.list.loadFailed" fallback="Failed to load places" />
          </p>
          <p className="text-sm text-gray-300">
            {getPlaceErrorMessage(listError, "An unexpected error occurred")}
          </p>
          {listError instanceof PlaceApiError && listError.isValidation && (
            <p className="text-sm text-gray-400">
              <LocaleWrapper
                item="places.list.validationHint"
                fallback="Try clearing the active filters above."
              />
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 bg-[#18191f] text-white pb-20 font-plus-sans">
      <PlacesAnalytics stats={stats} />

      <PlacesToolbar />

      <PlacesTable data={data.items ?? []} />

      {data.totalPages >= 1 && (
        <PlacesPagination
          currentPage={Number(data.page) || requestedPage}
          totalPages={Number(data.totalPages)}
          totalItems={Number(data.total)}
          limit={Number(data.limit) || 10}
        />
      )}
    </div>
  );
};

export default PlacesListFeature;
