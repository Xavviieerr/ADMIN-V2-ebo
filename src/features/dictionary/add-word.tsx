import React from "react";
import { PageSwitcher } from "./components/add";
import { getServerAccessToken } from "@/features/auth/utils/serverTokenStorage";
import { fetchDialects } from "@/features/shared/api";
import { AddWordProvider } from "./components/add";

const AddWordFeature = async () => {
  const token = await getServerAccessToken();
  const dialects = await fetchDialects({ token: token as string });

  return (
    <AddWordProvider>
      <PageSwitcher dialects={dialects} />
    </AddWordProvider>
  );
};

export default AddWordFeature;
