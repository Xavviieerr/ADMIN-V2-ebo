import { DictionaryFeature } from "@/features/dictionary";
import { PermissionGate } from "@/features/shared";
import React from "react";

const DictionaryPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    type?: string;
    createdBy?: string;
    sortBy?: string;
    sortDir?: string;
  }>;
}) => {
  const query = await searchParams;

  return (
    <PermissionGate permission="view_word">
      <DictionaryFeature query={query} />
    </PermissionGate>
  );
};

export default DictionaryPage;
