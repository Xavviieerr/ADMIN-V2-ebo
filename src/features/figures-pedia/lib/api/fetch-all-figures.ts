import { handleFetchError } from "@/features/shared/utils/handle-fetch-error";
import { BASE_URL } from "@/utils/constants";

export const fetchFigures = async ({
  token,
  page,
  search,
  category,
  status,
  createdBy,
}: {
  token: string;
  page: string;
  search: string;
  category: string;
  status: string;
  createdBy?: string;
}) => {
  try {
    let url = `${BASE_URL}/figures?search=${search}&page=${page}&limit=10&sortBy=fullName&sortDir=ASC${status ? `&status=${status}` : ""}${category ? `&occupation=${category}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message ?? "Failed to fetch wors");
    }

    const { data } = await response.json();

    return data;
  } catch (error) {
    const err = error as Error;
    handleFetchError(err, "/guonopedia/figures");
    return;
    return {
      data: [],
      pagination: {
        totalItems: 0,
        page: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
        statusCounts: {
          approved: 0,
          pending: 0,
          rejected: 0,
          "in-review": 0,
        },
      },
    };
  }
};
