import { EditFigureFeature } from "@/features/figures";
import { PermissionGate } from "@/features/shared";
import { getServerAccessToken } from "@/features/auth/utils/serverTokenStorage";
import { fetchSingleFigure } from "@/features/figures/api/figures";
import { notFound } from "next/navigation";
import React from "react";

const EditFigureByIdPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  if (!id) notFound();
  const token = await getServerAccessToken();
  try {
    const initial = await fetchSingleFigure(token, id);
    return (
      <PermissionGate permission="edit_figure">
        <EditFigureFeature initial={initial} />
      </PermissionGate>
    );
  } catch {
    notFound();
  }
};

export default EditFigureByIdPage;
