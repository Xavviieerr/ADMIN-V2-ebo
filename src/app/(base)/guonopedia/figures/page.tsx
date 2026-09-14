import { GuonopediaFiguresFeature } from "@/features/figures-pedia";
import React from "react";

const GuonopediaFiguresPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    category?: string;
    createdBy?: string;
  }>;
}) => {
  const query = await searchParams;
  return <GuonopediaFiguresFeature query={query} />;
};

export default GuonopediaFiguresPage;
