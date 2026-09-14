import { handleFetchError } from "@/features/shared/utils/handle-fetch-error";
import { BASE_URL } from "@/utils/constants";

export const fetchAnalytics = async ({ token }: { token: string }) => {
  try {
    const res = await fetch(`${BASE_URL}/figures/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json();
      throw Error(err.message ?? "Failed to fetch analytics");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    const err = error as Error;
    handleFetchError(err, `/guonopedia/figures`);
    return { data: null };
  }
};
