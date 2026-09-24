"use client";

import React from "react";
import { AddEditSenseForm } from "../forms";
import { useSingleWordView } from "@/features/dictionary/hooks/useSingleWordView";
import { useSingleWordSenseContext } from "../contexts/SingleWordSenseContext";

const SenseListWrapper = ({
  children,
  sensesCount,
}: {
  children: React.ReactNode;
  sensesCount: number;
}) => {
  const { tab } = useSingleWordView();
  const {
    selectedSense,
    setSelectedSense,
    senseView,
    setSenseView,
  } = useSingleWordSenseContext();

  if (tab !== "senses") return null;

  if (senseView === "add" || selectedSense) {
    return (
      <AddEditSenseForm
        selected={selectedSense}
        type={selectedSense ? "edit" : "add"}
        senseIndex={selectedSense?.index}
        nextKere={sensesCount + 1}
        onClose={() => {
          setSelectedSense(undefined);
          setSenseView("view");
        }}
      />
    );
  }
  return <div>{children}</div>;
};

export default SenseListWrapper;
