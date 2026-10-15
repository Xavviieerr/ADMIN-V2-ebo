import React from "react";
import PlacesAnalytics from "./analytics";
import PlacesTable from "./places-table";

const PlacesListFeature = () => {
  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 bg-[#18191f] text-white">
      <PlacesAnalytics />
      <PlacesTable />
    </div>
  );
};

export default PlacesListFeature;
