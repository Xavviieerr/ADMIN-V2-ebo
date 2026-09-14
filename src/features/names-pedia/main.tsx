import { BASE_URL } from "@/utils/constants";
import { NamesAnalytics, NamesTable } from "./components";
import { getServerAccessToken } from "@/features/auth/utils/serverTokenStorage";
import { PaginationWidget } from "../shared";

const fetchNamesStats = async ({ token }: { token: string }) => {
  try {
    const url = `${BASE_URL}/names/stats`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch names");
    }

    const { data } = await response.json();

    return data;
  } catch (error) {
    return [];
  }
};

const fetchNames = async ({
  token,
  page,
  search,
  type,
}: {
  token: string;
  page: string;
  search: string;
  type: string;
}) => {
  try {
    const url = `${BASE_URL}/names?search=${search}&page=${page}&limit=10&sortBy=name`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch names");
    }

    const { data } = await response.json();

    return data;
  } catch (error) {
    return [];
  }
};

const GuonopediaNamesFeature = async ({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; type?: string };
}) => {
  const { page = "1", search = "", type = "" } = searchParams;

  const token = await getServerAccessToken();
  const stats = await fetchNamesStats({ token: token as string });
  const data = await fetchNames({ token: token as string, page, search, type });

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 bg-[#18191f] text-white pb-20">
      <NamesAnalytics stats={stats} />

      <NamesTable data={data} page={Number(page)} />

      {data.totalPages > 1 && (
        <div className="w-full mt-10">
          <PaginationWidget
            currentPage={Number(page)}
            totalPages={Number(data.totalPages)}
          />
        </div>
      )}
    </div>
  );
};

export default GuonopediaNamesFeature;
