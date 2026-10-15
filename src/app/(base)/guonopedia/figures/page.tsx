import { FiguresListFeature } from "@/features/figures";
import React from "react";

const GuonopediaFiguresPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    occupation?: string;
    category?: string;
    createdBy?: string;
    sortBy?: string;
    sortDir?: string;
  }>;
}) => {
  const query = await searchParams;
  return <FiguresListFeature searchParams={query} />;
};

export default GuonopediaFiguresPage;
