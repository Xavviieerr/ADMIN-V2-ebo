import { handleFetchError } from "@/features/shared/utils/handle-fetch-error";
import { BASE_URL } from "@/utils/constants";
import { toast } from "sonner";

export const saveSenseImage = async ({
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
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: payload,
    });

    if (!res.ok) {
      const err = await res.json();
      throw Error(err.message ?? "Failed to save image");
    }

    toast.success("Image uploaded successfully");
  } catch (error) {
    const err = error as Error;
    toast.error(err.message);
    handleFetchError(err, `/guonopedia/dictionary/${id}`);
    return undefined;
  }
};
