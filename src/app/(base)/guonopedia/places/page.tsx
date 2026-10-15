import { GuonopediaPlacesFeature, type PlacesSearchParams } from "@/features/places";
import React from "react";

const GuonopediaPlacesPage = async ({
  searchParams,
}: {
  searchParams: Promise<PlacesSearchParams>;
}) => {
  const query = await searchParams;
  return <GuonopediaPlacesFeature searchParams={query} />;
};

export default GuonopediaPlacesPage;
