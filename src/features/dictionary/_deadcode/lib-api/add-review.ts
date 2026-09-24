import { handleFetchError } from "@/features/shared/utils/handle-fetch-error";
import { BASE_URL } from "@/utils/constants";
import { toast } from "sonner";

export const addReview = async ({
  id,
  token,
  payload,
}: {
  token: string;
  payload: { rating: number; review: string };
  id: string;
}) => {
  try {
    const res = await fetch(`${BASE_URL}/words/${id}/review`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw Error(err.message ?? "Failed to add word review");
    }

    toast.success("Word review added successfully!");
    return true;
  } catch (error) {
    const err = error as Error;
    toast.error(err.message);
    handleFetchError(err, `/guonopedia/dictionary/${id}`);
    return false;
  }
};

export const replyReview = async ({
  token,
  payload,
}: {
  token: string;
  payload: {
    review: string;
    parentId: string;
    wordId: string;
  };
}) => {
  try {
    const res = await fetch(`${BASE_URL}/words/review/reply`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw Error(err.message ?? "Failed to add word review");
    }

    toast.success("Word review added successfully!");
    return true;
  } catch (error) {
    const err = error as Error;
    toast.error(err.message);
    handleFetchError(err, `/guonopedia/dictionary/${payload.wordId}`);
    return false;
  }
};
