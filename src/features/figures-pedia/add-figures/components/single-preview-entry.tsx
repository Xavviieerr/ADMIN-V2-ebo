"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FigurePayload } from "../../lib";
import Image from "next/image";

const SingleEntry = ({
  entry,
}: {
  entry: FigurePayload["biography"][number]["entries"][number];
}) => {
  const [open, setOpen] = useState(true);

  const [mainImage, ...restImages] = entry.photos;

  return (
    <div className="flex flex-col w-full">
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between gap-4 border-b border-gray-500/40 py-4 cursor-pointer"
      >
        <p>{entry.title}</p>

        <ChevronDown
          strokeWidth={1.4}
          className={`transition-all duration-300 ${open ? "rotate-180" : ""}`}
        />
      </div>

      {open && (
        <div className="w-full mt-5">
          {mainImage && (
            <div className="flex flex-col float-left mr-5 gap-y-3">
              <Image
                src={mainImage}
                alt={entry.title}
                width={256}
                height={320}
                unoptimized
                className="rounded-md w-full h-auto"
              />
            </div>
          )}
          <p className="w-full px-4 text-sm">{entry.content}</p>

          {restImages.length > 0 && (
            <section className="bg-secondary-bg rounded-md mt-4 px-4 pt-2">
              <p className="text-sm mb-2">More Images</p>
              <div className="flex gap-4 pb-2 max-w-full overflow-scroll">
                {restImages.map((image, idx) => (
                  <figure
                    key={idx}
                    className="w-40 h-28 bg-gray-txt-50/50 rounded-md relative shrink-0"
                  >
                    <Image
                      src={image}
                      alt={entry.title}
                      fill
                      unoptimized
                      className="rounded-md"
                    />
                  </figure>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default SingleEntry;
