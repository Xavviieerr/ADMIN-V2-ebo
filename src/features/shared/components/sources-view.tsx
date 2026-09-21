"use client";

import { ChevronDown, ExternalLink } from "lucide-react";
import React, { useState } from "react";

type Source = {
  id: string;
  type: "article" | "book" | "interview" | "oral history" | "website";

  //articles & books
  title: string;
  author?: string;
  publishedBy?: string;
  publishedOn?: string;

  //for websites
  url?: string;
  accessDate?: string;

  //for interviews & oral history
  speaker?: string;
  date?: string;

  context: string;
};

const SourcesView = ({ sources }: { sources: Source[] }) => {
  const breakAuthors = (author: string | undefined) => {
    if (!author) return "";
    const authors = author.split(",").map((author) => author.trim());
    if (authors.length == 1) return authors[0];
    return authors[0] + " et al";
  };

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

      {open && (
        <ul className="w-full mt-5">
          {sources.map((source, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between w-full group pb-3 relative text-sm"
            >
              <p className="flex items-start  gap-3 text-gray-txt-500">
                <span className="font-medium text-base">{idx + 1}.</span>
                {(source.type === "article" || source.type === "book") && (
                  <span className="">
                    {breakAuthors(source.author)}. &quot;{source.title}&quot;.{" "}
                    {source.publishedBy}, {getYear(source.publishedOn)}.
                  </span>
                )}
                {source.type === "website" && (
                  <span className="">
                    &quot;{source.title}&quot;.{" website, "}
                    <a
                      href={source.url}
                      target="_blank"
                      className="underline underline-offset-4 italic group-hover:text-blue-500"
                    >
                      {source.url}
                    </a>
                    .{" Accessed "}
                    {getYear(source.accessDate)}.
                  </span>
                )}
                {source.type === "interview" && (
                  <span className="">
                    &quot;{source.title}&quot;.{" Interview of "}
                    {source.speaker}.{" Conducted "}
                    {getYear(source.date)}.
                  </span>
                )}
                {source.type === "oral history" && (
                  <span className="">
                    &quot;{source.title}&quot;.{" Narrated by "}
                    {source.speaker}.{" Narrated "}
                    {getYear(source.date)}.
                  </span>
                )}
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

export default SourcesView;
