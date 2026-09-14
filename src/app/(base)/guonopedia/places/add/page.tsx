import { AddPlaceFeature } from "@/features/places-pedia";
import { PlaceInfoStage } from "@/features/shared";
import React from "react";

const AddPlacePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ stage: string }>;
}) => {
  const { stage = "" } = await searchParams;
  return <AddPlaceFeature stage={stage as PlaceInfoStage} />;
};

export default AddPlacePage;
