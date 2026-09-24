import { handleFetchError } from "@/features/shared/utils/handle-fetch-error";
import { BASE_URL } from "@/utils/constants";
import { DICTIONARY_LIST_LIMIT } from "../../browse/constants";

const VALID_STATUSES = ["pending", "approved", "rejected", "in-review"];
const VALID_SORT_BY = ["ota", "updatedAt", "createdAt"];
const VALID_SORT_DIRS = ["ASC", "DESC", "asc", "desc"];

export const fetchWords = async ({
	token,
	page,
	search,
	type,
	status,
	createdBy,
	sortBy = "ota",
	sortDir = "ASC",
}: {
	token: string;
	page: string;
	search: string;
	type: string;
	status: string;
	createdBy: string;
	sortBy?: string;
	sortDir?: string;
}) => {
	try {
		const safeStatus = VALID_STATUSES.includes(status) ? status : "";
		const safeSortBy = VALID_SORT_BY.includes(sortBy) ? sortBy : "ota";
		const safeSortDir = VALID_SORT_DIRS.includes(sortDir) ? sortDir : "ASC";
		let url = `${BASE_URL}/word?search=${encodeURIComponent(search)}&page=${encodeURIComponent(page)}&limit=${DICTIONARY_LIST_LIMIT}&sortBy=${safeSortBy}&sortDir=${safeSortDir}${safeStatus ? `&status=${encodeURIComponent(safeStatus)}` : ""}${createdBy ? `&createdBy=${encodeURIComponent(createdBy)}` : ""}`;

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
			const data = await response.json().catch(() => null);
			const message = Array.isArray(data?.message)
				? data.message.join(", ")
				: (data?.message ?? "Failed to fetch words");
			const error = new Error(message) as Error & { status?: number };
			error.status = response.status;
			throw error;
		}

		const { data } = await response.json();

		return { ...data, error: undefined };
	} catch (error) {
		const err = error as Error & { status?: number };
		//toast.error(err.message);
		handleFetchError(err, "/guonopedia/dictionary");
		return {
			data: [],
			error:
				err.status && err.status !== 401 ? err.message : undefined,
			pagination: {
				totalItems: 0,
				page: 1,
				limit: DICTIONARY_LIST_LIMIT,
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
