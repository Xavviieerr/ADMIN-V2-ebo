import { LocaleWrapper } from "@/features/shared";
import type { ContributorApplicationStage } from "../types";
import { ContributorCTA, SingleStageRow } from "./components";

const STAGES: ContributorApplicationStage[] = [
  "accountInfo",
  "rightsRoles",
  "uploadedTracks",
  "monetizationSettings",
];

const StagesTable = ({ stage }: { stage: ContributorApplicationStage }) => {
  return (
    <>
      {!STAGES.includes(stage) && (
        <div className="dark-box w-full">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-white font-medium text-lg">
              Review Contributor Application
            </h2>

            <ContributorCTA />
          </div>

          <div className=" flex flex-col p-3 bg-gray-txt-100 rounded-md w-full mt-8">
            <table className="w-full min-w-[640px]">
              <caption className="sr-only">Contributor application stages</caption>
              <thead className="bg-base-bg-50  border-b border-white/10 text-sm sm:text-base font-medium">
                <tr>
                  <th scope="col" className="p-5 text-left font-medium text-white rounded-l-md">
                    <LocaleWrapper item="common.firstName" />
                  </th>
                  <th scope="col" className="p-5  text-left font-medium text-white">
                    <LocaleWrapper item="common.status" />
                  </th>
                  <th scope="col" className="p-5 text-center font-medium text-white rounded-r-md">
                    <LocaleWrapper item="common.actions" />
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {[
                  {
                    label: "Artist & Account Info",
                    status: "Completed",
                    value: "accountInfo",
                  },
                  {
                    label: "Roles & Copyrights",
                    status: "In Progress",
                    value: "rightsRoles",
                  },
                  {
                    label: "Uploaded Tracks & Lyrics",
                    status: "Not Started",
                    value: "uploadedTracks",
                  },
                  {
                    label: "Monetization Settings",
                    status: "Not Started",
                    value: "monetizationSettings",
                  },
                ].map((item) => (
                  <SingleStageRow key={item.value} item={item} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default StagesTable;
