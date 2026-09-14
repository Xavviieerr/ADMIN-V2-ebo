"use client";

import { SingleWord } from "@/features/dictionary/lib";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import { deleteWord } from "@/features/dictionary/lib/api/update-word";
import { Loader2 } from "lucide-react";

const DeleteWordBtn = ({ data }: { data: SingleWord }) => {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const token = getAccessToken();
  const router = useRouter();

  const handleSubmit = () => {
    setLoading(true);
    deleteWord({ id: data.id, token })
      .then((v) => {
        if (v) {
          router.replace("/guonopedia/dictionary");
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <div
      onClick={() => setShow(!show)}
      className="primary-btn bg-base-red text-white text-sm relative"
    >
      {loading ? <Loader2 className="animate-spin" /> : "Delete Word"}

      {show && (
        <div className="space-y-2 z-50 px-5 py-2 text-sm absolute top-14 text-start right-0 w-64 md:w-80 shadow-xl bg-secondary-bg border border-gray-txt-50/50 rounded-xl">
          <p>Are you sure your want to delete this word?</p>
          <div className="flex gap-2 justify-end">
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="primary-btn bg-base-red text-white py-2 text-sm"
            >
              {loading ? <Loader2 size={16} /> : "Yes"}
            </button>
            <button
              onClick={() => setShow(false)}
              className="secondary-btn py-2 text-sm"
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteWordBtn;
