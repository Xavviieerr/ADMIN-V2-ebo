"use client";
import React, { useState } from "react";

const DashboardAnalyticsWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [hidden, setHidden] = useState(false);
  return (
    <section className="w-full flex flex-col gap-4">
      <div className="w-full flex items-center justify-between max-md:pb-3 max-md:border-b border-gray-txt-50/20">
        <h2 className="text-2xl font-semibold text-white">Overview</h2>

        <button
          className="secondary-btn cursor-pointer md:hidden"
          onClick={() => setHidden((prev) => !prev)}
        >
          {hidden ? "Show" : "Hide"} Stats
        </button>
      </div>

      {!hidden && children}
    </section>
  );
};

export default DashboardAnalyticsWrapper;
