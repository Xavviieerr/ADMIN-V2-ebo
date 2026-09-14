import { FigureInfoStage, GoBackButton } from "@/features/shared";
import React from "react";
import {
  BasicInfoStage,
  BiographyStage,
  FamilyMemberStage,
  MetadataStage,
  PreviewStage,
  StagesTable,
} from "./components";
import AddFigureProvider from "./components/context";

const AddFigureFeature = ({
  stage,
  status,
}: {
  stage: string;
  status: string;
}) => {
  const shouldGoToFigures = ![
    "basicInfo",
    "biography",
    "familyMembers",
    "metadata",
    "preview",
  ].includes(stage);

  return (
    <AddFigureProvider>
      <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 text-white font-plus-sans pb-20">
        {shouldGoToFigures ? (
          <GoBackButton link="/guonopedia/figures" />
        ) : (
          <GoBackButton />
        )}

        <StagesTable stage={stage as FigureInfoStage} status={status} />

        <BasicInfoStage stage={stage as FigureInfoStage} />

        <BiographyStage stage={stage as FigureInfoStage} />

        <FamilyMemberStage stage={stage as FigureInfoStage} />

        <MetadataStage stage={stage as FigureInfoStage} />

        <PreviewStage stage={stage as FigureInfoStage} />
      </div>
    </AddFigureProvider>
  );
};

export default AddFigureFeature;
