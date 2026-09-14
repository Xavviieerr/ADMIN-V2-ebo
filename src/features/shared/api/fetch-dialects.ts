import { BASE_URL } from "@/utils/constants";

export const fetchDialects = async ({ token }: { token: string }) => {
  try {
    const url = `${BASE_URL}/provinces/all?page=1&limit=50`;

    const response = await fetch(url, {
      method: "GET",
      next: {
        revalidate: 3000,
      },
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
