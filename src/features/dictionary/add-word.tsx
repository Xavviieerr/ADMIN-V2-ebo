import React from "react";
import PageSwitcher from "./add-word/page-switcher";
import { getServerAccessToken } from "@/features/auth/utils/serverTokenStorage";
import { fetchDialects } from "@/features/shared/api";
import { AddWordWizardProvider } from "./add-word/contexts/AddWordWizardContext";

const AddWordFeature = async () => {
  const token = await getServerAccessToken();
  const dialects = await fetchDialects({ token: token as string });

  return (
    <AddWordWizardProvider>
      <PageSwitcher dialects={dialects} />
    </AddWordWizardProvider>
  );
};

export default AddWordFeature;
