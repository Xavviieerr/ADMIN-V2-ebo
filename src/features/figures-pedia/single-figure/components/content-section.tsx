import React from "react";
import { Figure } from "../../lib";
import BiographyEntry from "./biography-entry";
import ExternalLinks from "./external-links";

const ContentSection = ({ data }: { data: Figure }) => {
  const { biography, externalLinks, introBio } = data;

  const sortedEntries =
    biography.length > 0
      ? [...biography[0].entries].sort((a, b) => a.order - b.order)
      : [];

  return (
    <div className=" flex flex-col md:col-span-3 whitespace-pre-wrap h-fit col-span-1 max-md:order-1 md:px-8 px-4 py-6 gap-4 md:bg-gray-txt-100 md:rounded-md w-full">
      <p className="text-justify text-sm">{data.introBio}</p>

      {sortedEntries.length > 0 && (
        <div className="flex flex-col w-full">
          {sortedEntries.map((item, idx) => (
            <BiographyEntry key={idx} entry={item} />
          ))}
        </div>
      )}

      <ExternalLinks sources={externalLinks} />
    </div>
  );
};

export default ContentSection;
