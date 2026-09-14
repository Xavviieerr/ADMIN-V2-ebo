import { BASE_URL } from "@/utils/constants";
import { getServerAccessToken } from "@/features/auth/utils/serverTokenStorage";
import { DASHBOARD_API } from "../constants";

export async function getDashboardStats() {
  try {
    const token = await getServerAccessToken();
    const res = await fetch(`${BASE_URL}${DASHBOARD_API.STATS}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch dashboard data");
      return { data: undefined };
    }
    const data = await res.json();
    return data;
  } catch (error) {
    return { data: undefined };
  }
}
