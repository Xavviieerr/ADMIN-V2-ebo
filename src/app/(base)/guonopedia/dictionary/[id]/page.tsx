import { SingleWordFeature } from "@/features/dictionary";
import { PermissionGate } from "@/features/shared";
import React from "react";

const SingleWordPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;
  return (
    <PermissionGate permission="view_word">
      <SingleWordFeature id={id} />
    </PermissionGate>
  );
};

export default SingleWordPage;
