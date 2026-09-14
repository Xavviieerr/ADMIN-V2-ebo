import React from "react";
import { GoBackButton } from "@/features/shared";
import { Figure } from "../lib";
import ContentSection from "./components/content-section";
import { ButtonRow, InfoSection } from "./components";
import moment from "moment";

const SingleFigure = async ({ data }: { data: Promise<{ data: Figure }> }) => {
  const { data: figure } = await data;

  if (!figure) return <p className="text-white">No matching figure found</p>;

  return (
    <div className="max-w-screen md:p-6 pb-20 font-plus-sans">
      <div className="flex flex-col dark-box w-full">
        <GoBackButton />

        <ButtonRow data={figure} />

        {figure.status == "rejected" && (
          <div className="flex flex-col gap-2 px-5 py-3 mt-5 text-gray-txt-50 text-sm border border-base-red bg-base-red/5 border-dashed rounded-md whitespace-pre-wrap">
            <div className="flex flex-col gap-1">
              <p className="">Rejection Reason</p>
              <p>{figure.rejectionReason}</p>
            </div>

            <div className="flex flex-col gap-1 mt-2">
              <p className="">Rejected By</p>
              <p>
                {figure.rejectedBy} on{" "}
                {moment(figure.rejectedAt).format("DD/MM/YYYY")}
              </p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-5 grid-cols-1 w-full md:gap-6 gap-y-6 mt-5 text-white">
          <ContentSection data={figure} />

          <InfoSection data={figure} />
        </div>
      </div>
    </div>
  );
};

export default SingleFigure;
