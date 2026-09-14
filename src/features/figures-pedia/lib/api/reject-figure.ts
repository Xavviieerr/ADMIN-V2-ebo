import { handleFetchError } from "@/features/shared/utils/handle-fetch-error";
import { BASE_URL } from "@/utils/constants";
import { toast } from "sonner";

export const rejectFigure = async ({
  token,
  id,
  payload,
}: {
  token: string;
  id: string;
  payload: { reason: string };
}) => {
  try {
    const res = await fetch(`${BASE_URL}/figures/${id}/reject`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw Error(err.message ?? "Failed to reject figure");
    }

    toast.success("Figure rejected successfully!");
    return true;
  } catch (error) {
    const err = error as Error;
    toast.error(err.message);
    handleFetchError(err, `/guonopedia/figures/${id}`);
    return false;
  }
};
