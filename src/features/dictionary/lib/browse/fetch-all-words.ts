import { handleFetchError } from "@/features/shared/utils/handle-fetch-error";
import { BASE_URL } from "@/utils/constants";

export const fetchWords = async ({
	token,
	page,
	search,
	type,
	status,
	createdBy,
}: {
	token: string;
	page: string;
	search: string;
	type: string;
	status: string;
	createdBy: string;
}) => {
	try {
		let url = `${BASE_URL}/word?search=${encodeURIComponent(search)}&page=${encodeURIComponent(page)}&limit=10&sortBy=ota&sortDir=ASC${status ? `&status=${encodeURIComponent(status)}` : ""}${createdBy ? `&createdBy=${encodeURIComponent(createdBy)}` : ""}`;

		if (type === "hasAudio") {
			url += "&hasAudio=true";
		}

		if (type === "noAudio") {
			url += "&hasAudio=false";
		}

		if (type === "hasImage") {
			url += "&hasImage=true";
		}

		if (type === "noImage") {
			url += "&hasImage=false";
		}

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
		//toast.error(err.message);
		handleFetchError(err, "/guonopedia/dictionary");
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
