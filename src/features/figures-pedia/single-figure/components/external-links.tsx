"use client";

import { ChevronDown, ExternalLink } from "lucide-react";
import React, { useState } from "react";
import { Figure } from "../../lib";

const ExternalLinks = ({ sources }: { sources: Figure["externalLinks"] }) => {
  const getYear = (date: string | undefined) => {
    if (!date) return "n/a";
    return new Date(date).getFullYear();
  };

  const [open, setOpen] = useState(true);

  if (!sources || sources.length == 0) return null;

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

      {open && (
        <ul className="w-full mt-5">
          {sources.map((source, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between w-full group pb-3 relative text-sm"
            >
              <p className="flex items-start  gap-3 text-gray-txt-500">
                <span className="font-medium text-base">{idx + 1}.</span>
                <span className="">
                  "{source.title}".{" "}
                  <span className="italic capitalize">{source.type},</span>{" "}
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      className="underline underline-offset-4 italic group-hover:text-blue-500"
                    >
                      {source.url}.
                    </a>
                  )}
                  {source.date && (
                    <>
                      {" Accessed "}
                      {getYear(source.date)}.
                    </>
                  )}
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
      )}
    </div>
  );
};

export default ExternalLinks;
