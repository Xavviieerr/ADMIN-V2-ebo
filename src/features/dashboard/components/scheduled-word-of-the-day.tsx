import { MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import moment from "moment";
import { DashboardStats } from "../types";
import { PermissionGate } from "@/features/shared";

const ScheduledWordOfTheDay = ({
  data,
}: {
  data: DashboardStats["scheduledWords"] | undefined;
}) => {
  return (
    <div className="md:w-1/2 w-full container px-0 h-auto">
      <div className="flex items-center justify-between pb-4 mb-2 border-b border-gray-txt-50/30 px-5">
        <h2 className="max-md:text-lg max-md:font-medium text-xl font-semibold text-white">
          Scheduled Words
        </h2>
        <PermissionGate permission="add_word">
          <Link
            href={"/home?page=newWord"}
            className="primary-btn flex items-center gap-2 text-sm font-medium cursor-pointer"
          >
            <Plus size={18} />
            <span>Add New</span>
          </Link>
        </PermissionGate>
      </div>

      {data && (
        <ul className="space-y-4 px-5 mt-5 overflow-y-scroll max-h-100 custom-scrollbar">
          {data.map((word) => (
            <li
              key={word.id}
              className={`flex items-center justify-between py-3 border-b border-[#23232a] last:border-b-0  px-5 rounded-md`}
            >
              <div className="flex items-center gap-4">
                <div className={`rounded-full  w-3 h-3 bg-amber-600`} />

                <div className="flex flex-col gap-1">
                  <span className="text-white text-sm">
                    {moment(word.scheduledDate).format("DD MMM, yyyy")}
                  </span>
                  <span className="text-white font-medium capitalize">
                    {word.word.ota}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 text-gray-txt">
                <span className="text-gray-txt-50 text-xs italic">
                  {word.isPublished ? "Publish" : "Not Published"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {(!data || data.length === 0) && (
        <p className="px-5 max-md:pt-4 md:py-9 w-full text-center text-gray-txt-50">
          Nothing to see here.
        </p>
      )}
    </div>
  );
};

export default ScheduledWordOfTheDay;
