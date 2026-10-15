import { FigureDetailFeature } from "@/features/figures";
import React from "react";

const SingleFigurePage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) => {
  const { id } = await params;
  const { tab } = await searchParams;
  return <FigureDetailFeature id={id} tab={tab} />;
};

export default SingleFigurePage;
