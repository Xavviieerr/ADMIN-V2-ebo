"use client";

import { SingleWord } from "@/features/dictionary/lib";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDeleteWordMutation } from "@/slice/requestSlice";
import { runDictionaryMutation } from "@/features/dictionary/lib/run-dictionary-mutation";
import { ConfirmPopover } from "@/features/dictionary/word-detail/shared";
import { Loader2 } from "lucide-react";

const DeleteWordButton = ({ data }: { data: SingleWord }) => {
  const [deleteWord, { isLoading: loading }] = useDeleteWordMutation();
  const [show, setShow] = useState(false);

  const router = useRouter();

  const handleSubmit = () => {
    runDictionaryMutation({
      run: () => deleteWord({ id: data.id }).unwrap(),
      successMessage: "Word deleted successfully!",
      errorMessage: "Failed to delete word",
      onSuccess: () => {
        router.replace("/guonopedia/dictionary");
      },
    });
  };

  return (
    <div className="w-fit relative">
      <button
        onClick={() => setShow(!show)}
        disabled={loading}
        type="button"
        className="primary-btn bg-base-red text-white text-sm"
      >
        {loading ? <Loader2 className="animate-spin" /> : "Delete Word"}
      </button>

      <ConfirmPopover
        open={show}
        message="Are you sure your want to delete this word?"
        loading={loading}
        className="top-14 text-start"
        onConfirm={handleSubmit}
        onCancel={() => setShow(false)}
      />
    </div>
  );
};

export default DeleteWordButton;
