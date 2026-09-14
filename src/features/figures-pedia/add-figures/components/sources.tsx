"use client";

import { ChevronDown, ExternalLink } from "lucide-react";
import React, { useState } from "react";
import { FigurePayload } from "../../lib";

const SourcesPreview = ({
  sources,
}: {
  sources: FigurePayload["externalLinks"];
}) => {
  const getYear = (date: string | undefined) => {
    if (!date) return "n/a";
    return new Date(date).getFullYear();
  };

  const [open, setOpen] = useState(true);

  return (
    <div className="flex flex-col w-full">
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between gap-4 border-b border-gray-500/40 py-4 cursor-pointer"
      >
        <p>Sources & External Links</p>

        <ChevronDown
          strokeWidth={1.4}
          className={`transition-all duration-300 ${open ? "rotate-180" : ""}`}
        />
      </div>

      {open &&
        (sources.length > 0 ? (
          <ul className="w-full mt-5">
            {sources.map((source, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between w-full group pb-3 relative text-sm"
              >
                <p className="flex items-start  gap-3 text-gray-txt-500">
                  <span className="font-medium text-base">{idx + 1}.</span>
                  <span className="">
                    "{source.title}".
                    <span className="capitalize"> {source.type}, </span>
                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        className="underline underline-offset-4 italic group-hover:text-blue-500"
                      >
                        {source.url}.
                      </a>
                    )}
                    {" Accessed "}
                    {getYear(source.date)}.
                  </span>
                </p>

                {source.url && (
                  <ExternalLink
                    size={18}
                    strokeWidth={1.3}
                    className="group-hover:flex hidden"
                  />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm mt-4 text-center">Nothing to see here</p>
        ))}
    </div>
  );
};

export default SourcesPreview;
