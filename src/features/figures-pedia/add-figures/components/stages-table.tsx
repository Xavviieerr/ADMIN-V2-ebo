"use client";

import { FigureInfoStage, LocaleWrapper, MobileTable } from "@/features/shared";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAddFigureCTX } from "./context";
import { validateBasicInfo } from "../validate-forms";

const STAGES: FigureInfoStage[] = [
  "basicInfo",
  "biography",
  "familyMembers",
  "metadata",
  "preview",
];

const StagesTable = ({
  stage,
  status: _status,
}: {
  stage: FigureInfoStage;
  status: string;
}) => {
  const router = useRouter();
  const { basicInfo } = useAddFigureCTX();
  const basicErrors = validateBasicInfo(basicInfo);
  const basicValid = Object.keys(basicErrors).length === 0;
  const bioValid =
    basicInfo.biography &&
    basicInfo.biography.length > 0 &&
    basicInfo.biography[0].entries.length > 0;
  const familyValid = basicInfo.family && basicInfo.family.length > 0;
  const metadataValid =
    basicInfo.externalLinks && basicInfo.externalLinks.length > 0;

  const canPreview = basicValid && bioValid;
  return (
    <>
      {!STAGES.includes(stage) && (
        <div className="dark-box w-full">
          <div className="flex items-center justify-between gap-4">
            <Link href={`?status=4`}>
              <h2 className="text-white font-medium text-lg">Figure Info.</h2>
            </Link>

            {canPreview && (
              <Link
                href={`/guonopedia/figures/add?stage=preview`}
                className="primary-btn md:px-10 py-2"
              >
                Continue
              </Link>
            )}
          </div>

          <div className=" flex flex-col p-3 bg-gray-txt-100 rounded-md w-full mt-8 max-md:hidden">
            <table className="w-full min-w-[640px] ">
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
                    status: basicValid ? "Completed" : "Incomplete",
                    value: "basicInfo",
                  },
                  {
                    label: "Biography",
                    status: bioValid ? "Completed" : "Incomplete",
                    value: "biography",
                  },
                  {
                    label: "Family Members",
                    status: familyValid ? "Completed" : "Optional",
                    value: "familyMembers",
                  },
                  {
                    label: "MetaData & Sources",
                    status: metadataValid ? "Completed" : "Optional",
                    value: "metadata",
                  },
                ].map((item, _index) => (
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
                          : item.status.toLowerCase() === "optional"
                            ? "text-gray-300"
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

          <div className="flex flex-col gap-4 mt-5">
            {[
              {
                label: "Basic Information",
                status: basicValid ? "Completed" : "Incomplete",
                value: "basicInfo",
              },
              {
                label: "Biography",
                status: bioValid ? "Completed" : "Incomplete",
                value: "biography",
              },
              {
                label: "Family Members",
                status: familyValid ? "Completed" : "Optional",
                value: "familyMembers",
              },
              {
                label: "MetaData & Sources",
                status: metadataValid ? "Completed" : "Optional",
                value: "metadata",
              },
            ].map((item, index) => (
              <MobileTable
                key={index}
                link={`/guonopedia/figures/add?stage=${item.value}`}
                items={[
                  { title: "common.step", body: item.label },
                  // { title: "common.status", body: item.status },
                  // { title: "common.dob", body: item.dob },
                ]}
                status={item.status}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default StagesTable;
