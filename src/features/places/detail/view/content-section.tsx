import { Place, SingleAccordionEntry, SourcesView } from "@/features/shared";
import React from "react";

const ContentSection = ({ content }: { content: Place }) => {
  return (
    <div className=" flex flex-col col-span-3 px-8 py-6 gap-4 bg-gray-txt-100 rounded-md w-full">
      <p>{content.summary}</p>

      {content.history.length > 0 && (
        <div className="flex flex-col w-full gap-4">
          {content.history.map((item, idx) => (
            <SingleAccordionEntry key={idx} entry={item} />
          ))}
        </div>
      )}

      <SourcesView sources={content.sources} />
    </div>
  );
};

export default ContentSection;
