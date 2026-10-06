import { BASE_URL } from "@/utils/constants";

export const fetchSingleName = async ({ token, id }: { token: string, id: string }) => {
    try {
        const url = `${BASE_URL}/names/${id}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch names");
        }

        const { data } = await response.json();
        // console.log(data);

        return data;
    } catch (_error) {
        return [];
    }
}