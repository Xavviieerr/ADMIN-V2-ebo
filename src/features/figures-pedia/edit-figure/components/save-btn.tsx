"use client";
import React, { useState } from "react";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import { useEditFigureContext } from "./context";
import { editFigure } from "../../lib";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const SaveBtn = ({ id }: { id: string }) => {
  const { getFigurePayload } = useEditFigureContext();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const token = getAccessToken();

  const handleClick = () => {
    setLoading(true);
    const payload = getFigurePayload();

    editFigure({
      id,
      token,
      payload,
    })
      .then((v) => {
        if (v) {
          router.replace(`/guonopedia/figures/${id}`);
        }
        setLoading(false);
      })
      .finally(() => setLoading(false));
  };
  return (
    <button
      disabled={loading}
      onClick={handleClick}
      className="primary-btn px-10 text-sm mb-6"
    >
      {loading ? <Loader2 className="animate-spin" /> : "Save Changes"}
    </button>
  );
};

export default SaveBtn;
