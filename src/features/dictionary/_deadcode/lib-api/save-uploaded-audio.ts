import { handleFetchError } from "@/features/shared/utils/handle-fetch-error";
import { BASE_URL } from "@/utils/constants";
import { toast } from "sonner";

export const saveSenseAudio = async ({
  id,
  token,
  payload,
}: {
  token: string;
  payload: string;
  id: string;
}) => {
  try {
    const res = await fetch(`${BASE_URL}/word/${id}/sense-audio`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: payload,
    });

    if (!res.ok) {
      const err = await res.json();
      throw Error(err.message ?? "Failed to save audio");
    }

    toast.success("Audio uploaded successfully");
  } catch (error) {
    const err = error as Error;
    toast.error(err.message);
    handleFetchError(err, `/guonopedia/dictionary/${id}`);
    return undefined;
  }
};

export const saveSenseExampleAudio = async ({
  id,
  token,
  payload,
}: {
  token: string;
  payload: string;
  id: string;
}) => {
  try {
    const res = await fetch(
      `${BASE_URL}/word/${id}/sense-example-sentence-audio`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: payload,
      },
    );

    if (!res.ok) {
      const err = await res.json();
      throw Error(err.message ?? "Failed to save example sentence audio");
    }

    toast.success("Audio uploaded successfully");
  } catch (error) {
    const err = error as Error;
    toast.error(err.message);
    handleFetchError(err, `/guonopedia/dictionary/${id}`);
    return undefined;
  }
};

export const saveTranslationAudio = async ({
  id,
  token,
  payload,
}: {
  token: string;
  payload: string;
  id: string;
}) => {
  try {
    const res = await fetch(`${BASE_URL}/word/${id}/translation-audio`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: payload,
    });

    if (!res.ok) {
      const err = await res.json();
      throw Error(err.message ?? "Failed to save example sentence audio");
    }

    toast.success("Audio uploaded successfully");
  } catch (error) {
    const err = error as Error;
    toast.error(err.message);
    handleFetchError(err, `/guonopedia/dictionary/${id}`);
    return undefined;
  }
};

export const saveTranslationExampleAudio = async ({
  id,
  token,
  payload,
}: {
  token: string;
  payload: string;
  id: string;
}) => {
  try {
    const res = await fetch(
      `${BASE_URL}/word/${id}/translation-example-sentence-audio`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: payload,
      },
    );

    if (!res.ok) {
      const err = await res.json();
      throw Error(err.message ?? "Failed to save example sentence audio");
    }

    toast.success("Audio uploaded successfully");
  } catch (error) {
    const err = error as Error;
    toast.error(err.message);
    handleFetchError(err, `/guonopedia/dictionary/${id}`);
    return undefined;
  }
};
