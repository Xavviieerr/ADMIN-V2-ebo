import { SingleNameFeature } from "@/features/names-pedia";
import React from "react";

const SingleNamePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;
  return <SingleNameFeature id={id} />;
};

export default SingleNamePage;
