import {
  ContributorApplicationStage,
  GoBackButton,
  LocaleWrapper,
} from "@/features/shared";
import { ArrowLeft } from "lucide-react";
import React from "react";
import StagesTable from "./stages-table";
import AccountInfoStage from "./account-info-stage";
import RightsRolesStage from "./rights-roles-stage";
import UploadedTracksStage from "./uploaded-tracks";
import MonetizationSettingsStage from "./monetization-settings";

const UserApplicationFeature = ({
  userId,
  stage,
}: {
  userId: string;
  stage: string;
}) => {
  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 text-white">
      <GoBackButton />

      <StagesTable stage={stage as ContributorApplicationStage} />

      <AccountInfoStage
        stage={stage as ContributorApplicationStage}
        userId={userId}
      />

      <RightsRolesStage
        stage={stage as ContributorApplicationStage}
        userId={userId}
      />

      <UploadedTracksStage
        stage={stage as ContributorApplicationStage}
        userId={userId}
      />

      <MonetizationSettingsStage
        stage={stage as ContributorApplicationStage}
        userId={userId}
      />
    </div>
  );
};

export default UserApplicationFeature;
