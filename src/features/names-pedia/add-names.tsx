import { GoBackButton } from "@/features/shared";
import React from "react";
import { AddNameForm } from "./components";
import { getServerAccessToken } from "@/features/auth/utils/serverTokenStorage";
import { fetchDialects } from "./lib/api";



const AddNameFeature = async () => {
  const token = await getServerAccessToken();
  const dialects = await fetchDialects({ token: token as string });

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 text-white">
      <GoBackButton link="/guonopedia/names" />

      <AddNameForm dialects={dialects} />
    </div>
  );
};

export default AddNameFeature;
