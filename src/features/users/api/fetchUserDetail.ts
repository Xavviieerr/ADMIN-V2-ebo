import { BASE_URL } from "@/utils/constants";
import { getServerAccessToken } from "@/features/auth/utils/serverTokenStorage";
import type { UserData, AdminData } from "../types";

async function serverFetch<T>(url: string): Promise<T | undefined> {
  try {
    const token = (await getServerAccessToken()) ?? "";
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return undefined;
    const { data } = await res.json();
    return data as T;
  } catch {
    return undefined;
  }
}

export async function fetchUserData(userId: string) {
  return serverFetch<UserData>(`${BASE_URL}/admin/users/${userId}`);
}

export async function fetchAdminData(userId: string) {
  return serverFetch<AdminData>(`${BASE_URL}/admin/${userId}`);
}

export async function fetchUserDetail(userId: string) {
  const [userData, adminData] = await Promise.all([
    fetchUserData(userId),
    fetchAdminData(userId),
  ]);
  return { userData: userData ?? null, adminData: adminData ?? null };
}
