import { AddFiguresFeature } from "@/features/figures-pedia/add-figures";
import React from "react";

const AddFiguresPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ stage: string; status: string }>;
}) => {
  const { stage = "", status } = await searchParams;
  return <AddFiguresFeature stage={stage} status={status} />;
};

export default AddFiguresPage;
