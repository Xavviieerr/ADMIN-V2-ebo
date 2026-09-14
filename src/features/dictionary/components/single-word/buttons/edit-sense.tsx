"use client";

import { PenBox } from "lucide-react";
import React from "react";
import { useSingleWordContext } from "../context";
import { SingleWord } from "@/features/dictionary/lib";

const EditSense = ({
  sense,
  index,
  nextKere,
}: {
  sense: SingleWord["oho"][number];
  index: number;
  nextKere?: number;
}) => {
  const { setSelectedSense, setSensesLength } = useSingleWordContext();
  return (
    <button
      title="Edit Sense"
      onClick={() => {
        setSelectedSense({ ...sense, index });
        setSensesLength(nextKere || 1);
      }}
      className="secondary-btn py-2 text-sm cursor-pointer rounded-md"
    >
      Edit Sense
    </button>
  );
};

export default EditSense;
