import { handleFetchError } from "@/features/shared/utils/handle-fetch-error";
import { FigurePayload } from "../types";
import { BASE_URL } from "@/utils/constants";
import { toast } from "sonner";

export const editFigure = async ({
  id,
  token,
  payload,
}: {
  id: string;
  token: string;
  payload: FigurePayload;
}) => {
  try {
    const res = await fetch(`${BASE_URL}/figures/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw Error(err.message ?? "Failed to update figure");
    }

    toast.success("Figure updated successfully!");
    return true;
  } catch (error) {
    const err = error as Error;
    toast.error(err.message);
    handleFetchError(err, `/guonopedia/figures/edit?id=${id}`);
    return false;
  }
};
