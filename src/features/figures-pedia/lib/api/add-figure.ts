import { handleFetchError } from "@/features/shared/utils/handle-fetch-error";
import { FigurePayload } from "../types";
import { BASE_URL } from "@/utils/constants";
import { toast } from "sonner";

export const addFigure = async ({
  token,
  payload,
}: {
  token: string;
  payload: FigurePayload;
}) => {
  try {
    const res = await fetch(`${BASE_URL}/figures`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw Error(err.message ?? "Failed to add figure");
    }

    const data = await res.json();

    console.log(data);
    toast.success("Figure added successfully!");
    return { status: true, data };
  } catch (error) {
    const err = error as Error;
    toast.error(err.message ?? "Failed to add figure");
    handleFetchError(err, `/guonopedia/figures/add`);
    return { status: false };
  }
};
