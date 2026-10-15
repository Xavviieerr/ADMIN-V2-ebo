import React from "react";
import { GoBackButton, PlaceInfoStage } from "@/features/shared";
import AddPlaceProvider from "./context";
import BasicInfoStage from "./basic-info";
import HistoryStage from "./history-stage";
import MetadataStage from "./metadata-stage";
import PreviewPlace from "./preview-place";
import StagesTable from "./stages-table";

const AddPlaceFeature = ({ stage }: { stage: PlaceInfoStage }) => {
  return (
    <AddPlaceProvider>
      <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 text-white">
        <GoBackButton />

        <StagesTable stage={stage} />

        <BasicInfoStage stage={stage} />

        <HistoryStage stage={stage} />

        <MetadataStage stage={stage} />

        <PreviewPlace stage={stage} />
      </div>
    </AddPlaceProvider>
  );
};

export default AddPlaceFeature;
