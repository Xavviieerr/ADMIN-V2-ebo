import React from "react";
import { GoBackButton, PlaceInfoStage } from "../shared";
import {
  BasicInfoStage,
  HistoryStage,
  MetadataStage,
  PreviewPlace,
  StagesTable,
} from "./components";

const AddPlaceFeature = ({ stage }: { stage: PlaceInfoStage }) => {
  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 text-white">
      <GoBackButton />

      <StagesTable stage={stage} />

      <BasicInfoStage stage={stage} />

      <HistoryStage stage={stage} />

      <MetadataStage stage={stage} />

      <PreviewPlace stage={stage} />
    </div>
  );
};

export default AddPlaceFeature;
