import React from "react";
import { WordRecord } from "../types";
import { transformWordRecords } from "../utils/transformWordRecord";

const PendingEntries = ({ data }: { data: WordRecord[] }) => {
  const suggestions = transformWordRecords(data);

  return (
    <section className="w-full container max-md:px-0">
      <div className="flex items-center justify-between pb-4 mb-2">
        <h2 className="max-md:text-lg max-md:px-5 max-md:font-medium text-xl font-semibold text-white">
          Recent Entries
        </h2>
      </div>

      <ul className="space-y-5">
        {suggestions.map((entry) => (
          <li
            key={entry.ota}
            className="flex items-center justify-between p-4 md:p-5 border-2 transition-colors duration-300 border-[#dbdcde] hover:border-foreground text-white rounded-2xl md:bg-primary-bg cursor-pointer"
          >
            <div className="flex flex-col gap-3 max-md:w-full">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-2xl">{entry.ota}</h3>
                <span className="text-gray-txt-50 text-sm">
                  {entry.oho.length} sense(s)
                </span>
              </div>

              <div className="flex items-center  md:hidden gap-4">
                <span className="border border-amber-400 bg-amber-500/10 text-amber-400 rounded-md p-2 text-sm w-fit">
                  {entry.status}
                </span>
                <p className="text-gray-txt-50 italic">
                  Added: {entry.createdAt}
                </p>
              </div>

              <div className="flex gap-4 font-normal">
                <span>Pronunciation: [{entry.oho[0].upho}]</span>
                <span>IPA: /{entry.oho[0].uphoesio}/</span>
              </div>

              <p className="max-md:hidden">Date Added: {entry.createdAt}</p>

              <button className="primary-btn w-full md:hidden">
                Preview Word
              </button>
            </div>

            <div className="flex flex-col items-end gap-6 max-md:hidden">
              <span className="border border-amber-400 bg-amber-500/10 text-amber-400 rounded-md p-2 text-sm w-fit">
                {entry.status}
              </span>

              <button className="primary-btn w-fit shrink-0">
                Preview Word
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PendingEntries;
