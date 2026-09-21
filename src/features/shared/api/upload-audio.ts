import { BASE_URL } from "@/utils/constants";
import { toast } from "sonner";

export const uploadAudio = async ({
  token,
  formData,
}: {
  token: string;
  formData: FormData;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/word/audio/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    return data;
  } catch (_error) {
    toast.error("Failed to upload audio");
    return undefined;
  }
};
