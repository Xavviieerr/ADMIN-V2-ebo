import EditPlaceFeature from "@/features/places/edit/EditPlaceFeature";
import React from "react";

const EditPlacePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <EditPlaceFeature placeId={id} />;
};

export default EditPlacePage;
