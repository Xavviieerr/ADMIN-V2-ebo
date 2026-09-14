"use client";
import { PenBox } from "lucide-react";
import React, { useEffect, useState } from "react";
import { EditWordDetails } from "../forms";
import { SingleWord } from "@/features/dictionary/lib";

const EditWord = ({
  data,
  dialects,
}: {
  data: SingleWord;
  dialects: { id: string; name: string }[];
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
    }
  }, [open]);

  return (
    <>
      <button
        title="Edit Details"
        onClick={() => setOpen(true)}
        className="text-foreground-50 cursor-pointer"
      >
        <PenBox />
      </button>

      {open && (
        <EditWordDetails
          dialects={dialects}
          word={data}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default EditWord;
