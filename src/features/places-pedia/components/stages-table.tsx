"use client";

import { PlaceInfoStage, LocaleWrapper } from "@/features/shared";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const STAGES: PlaceInfoStage[] = [
  "basicInfo",
  "history",
  "metadata",
  "preview",
];

const StagesTable = ({ stage }: { stage: PlaceInfoStage }) => {
  const router = useRouter();
  return (
    <>
      {!STAGES.includes(stage) && (
        <div className="dark-box w-full">
          <div className="flex items-center justify-between gap-4">
            <Link href={`?status=4`}>
              <h2 className="text-white font-medium text-lg">
                Review Place Information
              </h2>
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href={`/guonopedia/places/add?stage=preview`}
                className="primary-btn px-10"
              >
                Preview
              </Link>
            </div>
          </div>

          <div className=" flex flex-col p-3 bg-gray-txt-100 rounded-md w-full mt-8">
            <table className="w-full min-w-[640px]">
              <thead className="bg-base-bg-50  border-b border-white/10 text-sm sm:text-base font-medium">
                <tr>
                  <th className="p-5 text-left font-medium text-white rounded-l-md">
                    <LocaleWrapper item="common.items" />
                  </th>
                  <th className="p-5  text-left font-medium text-white">
                    <LocaleWrapper item="common.status" />
                  </th>
                  <th className="p-5 text-center font-medium text-white rounded-r-md">
                    <LocaleWrapper item="common.actions" />
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {[
                  {
                    label: "Basic Information",
                    status: "Not Started",
                    value: "basicInfo",
                  },
                  {
                    label: "History",
                    status: "Not Started",
                    value: "history",
                  },
                  {
                    label: "Sources & Links",
                    status: "Not Started",
                    value: "metadata",
                  },
                ].map((item) => (
                  <tr
                    key={item.value}
                    onClick={() => router.push(`?stage=${item.value}`)}
                    className="hover:bg-[#2a2a2a]/50 transition-colors cursor-pointer capitalize"
                  >
                    <td className="p-6 text-sm text-white font-medium">
                      {item.label}
                    </td>
                    <td
                      className={`p-6 text-sm text-gray-300 ${
                        item.status.toLowerCase() === "completed"
                          ? "text-green-600"
                          : item.status.toLowerCase() === "in progress"
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {item.status}
                    </td>
                    <td className="p-6 underline text-center cursor-pointer hover:text-gray-txt-50 hover:font-medium transition-all text-sm text-gray-300">
                      Edit Details
                    </td>
                  </tr>
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
