import { handleFetchError } from "@/features/shared/utils/handle-fetch-error";
import { BASE_URL } from "@/utils/constants";

export const fetchSingleWord = async ({
  token,
  id,
}: {
  token: string;
  id: string;
}) => {
  try {
    const url = `${BASE_URL}/word/${id}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const { message } = await response.json();
      throw new Error(message || "Failed to fetch words");
    }

    const { data } = await response.json();

    return { msg: "success", data };
  } catch (error) {
    const err = error as Error;
    handleFetchError(err, `/guonopedia/dictionary/${id}`);
    return { msg: "failed", data: null };
  }
};
