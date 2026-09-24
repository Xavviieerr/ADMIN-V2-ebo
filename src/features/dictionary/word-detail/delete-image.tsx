"use client";
import { Loader2, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDeleteSenseImageMutation } from "@/slice/requestSlice";
import { runDictionaryMutation } from "@/features/dictionary/hooks/runDictionaryMutation";
import { DeleteSenseImagePayload } from "@/features/dictionary/lib";
import { ConfirmPopover } from "@/features/dictionary/shared";

const DeleteImageButton = ({
  payload,
  size = 18,
}: {
  payload: DeleteSenseImagePayload;
  size?: number;
}) => {
  const [show, setShow] = useState(false);
  const [deleteSenseImage, { isLoading: loading }] =
    useDeleteSenseImageMutation();

  const router = useRouter();

  const id = useParams()?.id as string;
  const handleDelete = async () => {
    await runDictionaryMutation({
      run: () =>
        deleteSenseImage({
          wordId: id,
          senseId: payload.senseId,
          senseIndex: payload.senseIndex,
          url: payload.url,
          imageType: payload.imageType,
        }).unwrap(),
      successMessage: "Image deleted successfully",
      errorMessage: "Failed to delete image",
      onSuccess: () => {
        router.refresh();
      },
    });
    setShow(false);
  };

  return (
    <div className="w-fit relative">
      <button
        onClick={() => setShow(!show)}
        type="button"
        disabled={loading}
        title="Delete Image"
        className="cursor-pointer font-medium text-base-red"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={size} />
        ) : (
          <Trash2 size={size} />
        )}
      </button>

      <ConfirmPopover
        open={show}
        message="Are you sure your want to delete this image?"
        loading={loading}
        className="top-7"
        onConfirm={handleDelete}
        onCancel={() => setShow(false)}
      />
    </div>
  );
};

export default DeleteImageButton;
