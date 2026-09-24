"use client";

import React from "react";
import { useSingleWordSenseContext } from "../contexts/SingleWordSenseContext";
import { SingleWord } from "@/features/dictionary/lib";

const EditSense = ({
  sense,
  index,
}: {
  sense: SingleWord["oho"][number];
  index: number;
}) => {
  const { setSelectedSense } = useSingleWordSenseContext();
  return (
    <button
      title="Edit Sense"
      onClick={() => {
        setSelectedSense({ ...sense, index });
      }}
      className="secondary-btn py-2 text-sm cursor-pointer rounded-md"
    >
      Edit Sense
    </button>
  );
};

export default EditSense;
