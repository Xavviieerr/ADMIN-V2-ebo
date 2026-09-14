"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const SimpleAccordion = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex flex-col w-full">
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between gap-4 border-b border-gray-500/40 py-4 cursor-pointer max-md:test-sm"
      >
        <p className="capitalize">{title}</p>

        <ChevronDown
          strokeWidth={1.4}
          className={`transition-all duration-300 ${open ? "rotate-180" : ""}`}
        />
      </div>

      {open && (
        <p className="w-full text-sm text-justify max-md:pt-4 mt-5 whitespace-pre-wrap">
          {content}
        </p>
      )}
    </div>
  );
};

export default SimpleAccordion;
