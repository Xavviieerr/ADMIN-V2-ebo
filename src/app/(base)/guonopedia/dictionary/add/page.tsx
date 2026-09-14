import { AddWordFeature } from "@/features/dictionary";
import { PermissionGate } from "@/features/shared";
import React from "react";

const AddWordPage = () => {
  return (
    <PermissionGate permission="add_word">
      <AddWordFeature />
    </PermissionGate>
  );
};

export default AddWordPage;
