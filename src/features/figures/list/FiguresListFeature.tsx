import FiguresAnalytics from "./analytics";
import FiguresTable from "./FiguresTable";
import FiguresToolbar from "./FiguresToolbar";
import FiguresPagination from "./FiguresPagination";
import { LocaleWrapper } from "../../shared";
import { getServerAccessToken } from "@/features/auth/utils/serverTokenStorage";
import { fetchFiguresList, fetchFiguresStats } from "../api/figures";
import { getFigureErrorMessage, FigureApiError } from "../api/errors";
import type { FiguresPage, FiguresSearchParams, FigureStats } from "../model/types";
import { redirect } from "next/navigation";

const VALID_SORT_BY = ["fullName", "updatedAt", "createdAt", "name"];
const VALID_SORT_DIR = ["ASC", "DESC", "asc", "desc"];
const VALID_STATUS = ["", "pending", "approved", "rejected"];

const FiguresListFeature = async ({
  searchParams,
}: {
  searchParams: FiguresSearchParams;
}) => {
  const {
    search = "",
    status = "",
    createdBy = "",
  } = searchParams;
  const occupation = searchParams.occupation ?? searchParams.category ?? "";

  const sortBy = VALID_SORT_BY.includes(searchParams.sortBy ?? "")
    ? (searchParams.sortBy as string)
    : "fullName";
  const sortDir = VALID_SORT_DIR.includes(searchParams.sortDir ?? "")
    ? (searchParams.sortDir as string)
    : "ASC";
  const safeStatus = VALID_STATUS.includes(status) ? status : "";

  const parsed = Number.parseInt(searchParams.page ?? "1", 10);
  const requestedPage = Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : 1;

  const token = await getServerAccessToken();

  let stats: FigureStats | null = null;
  try {
    stats = await fetchFiguresStats(token);
  } catch {
    stats = null;
  }

  let data: FiguresPage | null = null;
  let listError: unknown = null;
  try {
    data = await fetchFiguresList(
      {
        page: requestedPage,
        search,
        sortBy,
        sortDir,
        occupation: occupation || undefined,
        status: safeStatus || undefined,
        createdBy: createdBy || undefined,
      },
      token,
    );
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Missing access token")) throw error;
    listError = error;
  }

  if (data && data.totalPages >= 1 && requestedPage > data.totalPages) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (occupation) params.set("occupation", occupation);
    if (safeStatus) params.set("status", safeStatus);
    if (createdBy) params.set("createdBy", createdBy);
    params.set("page", String(data.totalPages));
    redirect(`/guonopedia/figures?${params.toString()}`);
  }

  if (!data) {
    return (
      <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 bg-[#18191f] text-white pb-20 font-plus-sans">
        <FiguresAnalytics stats={stats} />
        <FiguresToolbar />
        <div
          role="alert"
          className="w-full mt-8 p-6 rounded-md bg-gray-txt-100 flex flex-col items-center gap-3 text-center"
        >
          <p className="font-medium">
            <LocaleWrapper item="figures.list.loadFailed" fallback="Failed to load figures" />
          </p>
          <p className="text-sm text-gray-300">
            {getFigureErrorMessage(listError, "An unexpected error occurred")}
          </p>
          {listError instanceof FigureApiError && listError.isValidation && (
            <p className="text-sm text-gray-400">
              <LocaleWrapper
                item="figures.list.validationHint"
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
      <FiguresAnalytics stats={stats} />

      <FiguresToolbar />

      <FiguresTable data={data.items ?? []} />

      {data.totalPages >= 1 && (
        <FiguresPagination
          currentPage={Number(data.page) || requestedPage}
          totalPages={Number(data.totalPages)}
          totalItems={Number(data.total)}
          limit={Number(data.limit) || 10}
        />
      )}
    </div>
  );
};

export default FiguresListFeature;
