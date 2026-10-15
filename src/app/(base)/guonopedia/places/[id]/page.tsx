import { SinglePlaceFeature } from "@/features/places";
import React from "react";

const SinglePlacePage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) => {
  const { id } = await params;
  const { tab } = await searchParams;
  return <SinglePlaceFeature id={id} tab={tab} />;
};

export default SinglePlacePage;
