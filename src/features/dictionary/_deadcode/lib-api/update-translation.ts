import { handleFetchError } from "@/features/shared/utils/handle-fetch-error";
import { BASE_URL } from "@/utils/constants";
import { toast } from "sonner";

export const addTranslation = async ({
  id,
  token,
  payload,
}: {
  token: string;
  payload: string;
  id: string;
}) => {
  try {
    const res = await fetch(`${BASE_URL}/word/${id}/translation`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: payload,
    });

    if (!res.ok) {
      const err = await res.json();
      throw Error(err.message ?? "Failed to add word translation");
    }

    toast.success("Word translation added successfully!");
    return true;
  } catch (error) {
    const err = error as Error;
    toast.error(err.message);
    handleFetchError(err, `/guonopedia/dictionary/${id}`);
    return false;
  }
};

export const editTranslation = async ({
  id,
  token,
  payload,
}: {
  token: string;
  payload: string;
  id: string;
}) => {
  try {
    const res = await fetch(`${BASE_URL}/word/${id}/translation`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: payload,
    });

    if (!res.ok) {
      const err = await res.json();
      throw Error(err.message ?? "Failed to edit word translation");
    }

    toast.success("Word translation edited successfully!");
    return true;
  } catch (error) {
    const err = error as Error;
    toast.error(err.message);
    handleFetchError(err, `/guonopedia/dictionary/${id}`);
    return false;
  }
};
