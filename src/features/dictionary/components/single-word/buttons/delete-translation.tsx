"use client";
import { Loader2, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import { useParams, useRouter } from "next/navigation";
import { deleteTranslation } from "@/features/dictionary/lib/api";

const DeleteTranslationButton = ({
  payload,
  size = 18,
}: {
  payload: {
    translationId: string;
    translationIndex: number;
    languageType: string;
  };
  size?: number;
}) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const token = getAccessToken();
  const id = useParams()?.id as string;
  const handleDelete = async () => {
    setLoading(true);
    await deleteTranslation({
      id,
      token,
      payload: JSON.stringify(payload),
    }).finally(() => {
      setLoading(false);
      setShow(false);
    });

    router.refresh();
  };

  return (
    <div className="w-fit relative">
      <button
        onClick={() => setShow(!show)}
        type="button"
        disabled={loading}
        title="Delete Image"
        className="cursor-pointer font-medium text-base-red px-2"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={size} />
        ) : (
          <Trash2 size={size} />
        )}
      </button>

      {show && (
        <div className="space-y-2 z-50 px-5 py-2 text-sm absolute top-10 right-0 w-64 md:w-80 shadow-xl bg-secondary-bg border border-gray-txt-50/50 rounded-xl">
          <p>Are you sure your want to delete this translation?</p>
          <div className="flex gap-2 justify-end">
            <button
              disabled={loading}
              onClick={handleDelete}
              className="primary-btn py-2 text-sm"
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

export default DeleteTranslationButton;
