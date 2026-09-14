import { handleFetchError } from "@/features/shared/utils/handle-fetch-error";
import { BASE_URL } from "@/utils/constants";
import { toast } from "sonner";

export const deleteFigure = async ({
  token,
  id,
}: {
  token: string;
  id: string;
}) => {
  try {
    const res = await fetch(`${BASE_URL}/figures/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json();
      throw Error(err.message ?? "Failed to delete figure");
    }

    toast.success("Figure deleted successfully!");
    return true;
  } catch (error) {
    const err = error as Error;
    toast.error(err.message ?? "Failed to delete figure");
    handleFetchError(err, `/guonopedia/figures/${id}`);
    return false;
  }
};
