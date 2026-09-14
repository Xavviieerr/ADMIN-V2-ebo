import { getServerAccessToken } from "@/features/auth/utils/serverTokenStorage";
import { BASE_URL } from "@/utils/constants";
import type { UserStats } from "../types";

export async function fetchUserStats(): Promise<UserStats | null> {
  try {
    const token = await getServerAccessToken();
    const res = await fetch(`${BASE_URL}/admin/users/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data?.data ?? null;
  } catch (error) {
    console.warn("Failed to fetch user stats:", error);
    return null;
  }
}
