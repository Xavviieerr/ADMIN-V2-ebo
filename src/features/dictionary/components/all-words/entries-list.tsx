import React from "react";
import { SingleWord } from "../../lib";
import { Stars, StatusCard } from "@/features/shared";
import moment from "moment";
import Link from "next/link";

const EntriesList = ({ data }: { data: SingleWord[] }) => {
  if (!data || data.length == 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 my-10">
        <p>No matches found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="md:space-y-5 space-y-3">
        {data.map((entry) => {
          return (
            <Link
              key={entry.ota}
              className="flex items-center justify-between px-5 py-3 text-sm border transition-colors duration-300 input border-gray-txt-50/10 shadow max-md:bg-secondary-bg hover:border-foreground text-white rounded-2xl cursor-pointer"
              href={`/guonopedia/dictionary/${entry.id}`}
            >
              <div className="flex flex-col max-md:gap-4 gap-2 max-md:w-full">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-lg leading-none">
                      {entry.ota.toLowerCase()}
                    </h3>
                    <span className="text-gray-txt-50 text-sm">
                      {entry.oho.length} sense(s) | {entry.oho[0].ekerota}
                    </span>
                  </div>

                  <div className="md:hidden">
                    <Stars rating={Math.floor(entry.averageRating)} />
                  </div>
                </div>

                {/* Mobile Status and Date */}
                <div className="flex items-center w-full justify-between md:hidden gap-4">
                  <StatusCard status={entry.status} />

                  <p className=" text-white/90 italic">
                    {entry.createdBy.username}
                  </p>

                  <p className="text-gray-txt-50 italic">
                    {moment(entry.createdAt).format("DD-MM-yyyy")}
                  </p>
                </div>

                <div className="flex w-full items-center gap-6 text-sm text-gray-txt-50 max-md:hidden">
                  <p className=" text-white/90">
                    Created By: {entry.createdBy.username}
                  </p>

                  <span className="text-gray-txt-50 ">
                    {moment(entry.createdAt).format("DD-MM-yyyy")}
                  </span>

                  <Stars rating={Math.floor(entry.averageRating)} />
                </div>

                {/* Mobile Preview BTN */}
                {/* <div className="secondary-btn text-center w-full md:hidden">
                  View word
                </div> */}
              </div>

              <div className="flex items-center gap-2 max-md:hidden">
                <StatusCard size="md" status={entry.status} />

                <div className="secondary-btn rounded-full py-2 text-sm w-fit shrink-0">
                  View
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default EntriesList;
