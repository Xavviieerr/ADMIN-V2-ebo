"use client";

import React from "react";
import { AddEditSenseForm } from "../forms";
import { useSingleWordContext } from "../context";

const SenseListWrapper = ({ children }: { children: React.ReactNode }) => {
  const {
    tab,
    selectedSense,
    setSelectedSense,
    senseView,
    setSenseView,
    sensesLength,
  } = useSingleWordContext();

  if (tab !== "senses") return null;

  if (senseView === "add" || selectedSense) {
    return (
      <AddEditSenseForm
        selected={selectedSense}
        type={selectedSense ? "edit" : "add"}
        senseIndex={selectedSense?.index}
        nextKere={sensesLength}
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
