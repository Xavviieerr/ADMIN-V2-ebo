import { handleFetchError } from "@/features/shared/utils/handle-fetch-error";
import { BASE_URL } from "@/utils/constants";
import { toast } from "sonner";

export const approveWord = async ({
  id,
  token,
}: {
  token: string;
  id: string;
}) => {
  try {
    const res = await fetch(`${BASE_URL}/word/${id}/approve`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json();
      throw Error(err.message ?? "Failed to approve word");
    }

    toast.success("Word approved successfully!");
    return true;
  } catch (error) {
    const err = error as Error;
    toast.error(err.message);
    handleFetchError(err, `/guonopedia/dictionary/${id}`);
    return false;
  }
};

export const deleteWord = async ({
  id,
  token,
}: {
  token: string;
  id: string;
}) => {
  try {
    const res = await fetch(`${BASE_URL}/word/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json();
      throw Error(err.message ?? "Failed to delete word");
    }

    toast.success("Word deleted successfully!");
    return true;
  } catch (error) {
    const err = error as Error;
    toast.error(err.message);
    handleFetchError(err, `/guonopedia/dictionary/${id}`);
    return false;
  }
};

export const editWord = async ({
  id,
  token,
  payload,
}: {
  token: string;
  id: string;
  payload: {
    ota: string;
    otaOkpopko: boolean;
    creationReason: string;
    erevwe: string;
  };
}) => {
  try {
    const res = await fetch(`${BASE_URL}/word/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw Error(err.message ?? "Failed to update word");
    }

    toast.success("Word updated successfully!");
    return true;
  } catch (error) {
    const err = error as Error;
    toast.error(err.message);
    handleFetchError(err, `/guonopedia/dictionary/${id}`);
    return false;
  }
};

export const reviewWord = async ({
  id,
  token,
}: {
  token: string;
  id: string;
}) => {
  try {
    const res = await fetch(`${BASE_URL}/word/${id}/review`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json();
      throw Error(err.message ?? "Failed to set word in review");
    }

    toast.success("Word set in review successfully!");
    return true;
  } catch (error) {
    const err = error as Error;
    toast.error(err.message);
    handleFetchError(err, `/guonopedia/dictionary/${id}`);
    return false;
  }
};

export const rejectWord = async ({
  id,
  token,
  payload,
}: {
  token: string;
  id: string;
  payload: { rejectionReason: string };
}) => {
  try {
    const res = await fetch(`${BASE_URL}/word/${id}/reject`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw Error(err.message ?? "Failed to reject word");
    }

    toast.success("Word rejected successfully!");
    return true;
  } catch (error) {
    const err = error as Error;
    toast.error(err.message);
    handleFetchError(err, `/guonopedia/dictionary/${id}`);
    return false;
  }
};
