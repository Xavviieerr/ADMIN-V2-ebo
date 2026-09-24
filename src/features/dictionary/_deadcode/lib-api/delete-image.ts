import { handleFetchError } from "@/features/shared/utils/handle-fetch-error";
import { BASE_URL } from "@/utils/constants";
import { toast } from "sonner";

export const deleteSenseImage = async ({
  id,
  token,
  payload,
}: {
  token: string;
  payload: string;
  id: string;
}) => {
  try {
    const res = await fetch(`${BASE_URL}/word/${id}/sense-image`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: payload,
    });

    if (!res.ok) {
      const err = await res.json();
      throw Error(err.message ?? "Failed to delete image");
    }

    toast.success("Image deleted successfully");
  } catch (error) {
    const err = error as Error;
    toast.error(err.message);
    handleFetchError(err, `/guonopedia/dictionary/${id}`);
    return undefined;
  }
};
