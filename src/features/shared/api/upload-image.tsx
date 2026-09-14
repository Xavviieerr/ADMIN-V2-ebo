import { BASE_URL } from "@/utils/constants";
import { toast } from "sonner";
import { handleFetchError } from "../utils/handle-fetch-error";

export const uploadImage = async ({
  token,
  formData,
  type = "word",
}: {
  token: string;
  formData: FormData;
  type?: "word" | "figures";
}) => {
  try {
    const response = await fetch(`${BASE_URL}/${type}/image/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    return { msg: "success", data: data.original };
  } catch (error) {
    const err = error as Error;
    toast.error(err.message);
    handleFetchError(err);
    return { msg: "failed", data: null };
  }
};
