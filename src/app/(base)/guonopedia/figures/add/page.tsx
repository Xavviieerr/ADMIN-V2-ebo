import { AddFigureFeature } from "@/features/figures";
import { PermissionGate } from "@/features/shared";
import React from "react";

const AddFigurePage = () => {
  return (
    <PermissionGate permission="create_figure">
      <AddFigureFeature />
    </PermissionGate>
  );
};

export default AddFigurePage;
