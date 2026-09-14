"use client";

import { SingleWord } from "@/features/dictionary/lib";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import { reviewWord } from "@/features/dictionary/lib/api/update-word";
import { Loader2 } from "lucide-react";

const ReviewWordBtn = ({ data }: { data: SingleWord }) => {
  const [loading, setLoading] = useState(false);
  const token = getAccessToken();
  const router = useRouter();

  const handleSubmit = () => {
    setLoading(true);
    reviewWord({ id: data.id, token })
      .then((v) => {
        if (v) {
          router.refresh();
        }
      })
      .finally(() => setLoading(false));
  };
  if (data.status.toLowerCase() !== "pending") return null;

  return (
    <button
      onClick={handleSubmit}
      disabled={loading}
      className="primary-btn text-sm"
    >
      {loading ? <Loader2 className="animate-spin" /> : "Set in Review"}
    </button>
  );
};

export default ReviewWordBtn;
