"use client";
import React from "react";
import { Figure } from "../../lib";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import { deleteFigure } from "../../lib/api/delete-figure";
import { useState } from "react";

const DeleteBtn = ({ data }: { data: Figure }) => {
  const [deleting, setDeleting] = useState(false);
  const [show, setShow] = useState(false);
  const router = useRouter();
  const token = getAccessToken();

  const handleDelete = () => {
    setDeleting(true);

    deleteFigure({ id: data.id, token })
      .then((v) => {
        if (v) {
          router.refresh();
          router.push("/guonopedia/figures");
        }
      })
      .finally(() => setDeleting(false));
  };

  if (data.status === "pending") return null;

  return (
    <div className="relative w-fit">
      <button
        onClick={() => setShow(!show)}
        disabled={deleting}
        className="flex items-center justify-center gap-2 secondary-btn bg-base-red text-white border-transparent w-full"
      >
        {deleting ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <>
            <Trash2 size={18} className="max-md:hidden" />
            Delete
          </>
        )}
      </button>
      {show && (
        <div className="space-y-2 z-50 px-5 py-2 text-sm absolute top-14 right-0 w-64 md:w-80 shadow-xl bg-secondary-bg border border-gray-txt-50/50 rounded-xl">
          <p>Are you sure your want to delete this figure?</p>
          <div className="flex gap-2 justify-end">
            <button
              disabled={deleting}
              onClick={handleDelete}
              className="primary-btn py-2 text-sm"
            >
              {deleting ? <Loader2 size={16} /> : "Yes"}
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

export default DeleteBtn;
