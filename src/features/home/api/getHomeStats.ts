import { BASE_URL } from "@/utils/constants";
import { getServerAccessToken } from "@/features/auth/utils/serverTokenStorage";
import { HOME_API } from "../constants";

export async function getHomeStats() {
  try {
    const token = await getServerAccessToken();
    const res = await fetch(`${BASE_URL}${HOME_API.STATS}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return { data: undefined, error: `Failed to fetch dashboard data: ${res.status}` };
    }
    const data = await res.json();
    return data;
  } catch {
    return { data: undefined, error: "Failed to fetch dashboard data" };
  }
}
