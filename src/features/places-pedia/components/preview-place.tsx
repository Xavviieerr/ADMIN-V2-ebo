"use client";

import {
  PlaceInfoStage,
  SingleAccordionEntry,
  SourcesView,
} from "@/features/shared";
import React, { Fragment, useState } from "react";
import Image from "next/image";
import { CheckCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { content } from "../content";

const PreviewFigure = ({ stage }: { stage: PlaceInfoStage }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const params = useSearchParams();
  const status = params.get("status");

  return (
    <>
      {stage === "preview" && (
        <div className="dark-box w-full">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-white font-medium text-lg">
              Preview Place Information
            </h2>

            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white cursor-pointer font-medium text-base rounded-md transition-colors">
                <CheckCheck size={18} />
                Submit for Review
              </button>
            </div>
          </div>

          <div className="grid grid-cols-5 w-full gap-6  mt-8">
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

            <div className=" flex flex-col col-span-2 px-4 py-6 bg-gray-txt-100 rounded-md w-full h-fit gap-5">
              <div className="w-full h-60 bg-secondary-bg rounded-md relative">
                <iframe
                  src={`https://maps.google.com/maps?q=${content.basic.lat},${content.basic.long}&z=15&output=embed`}
                  className="rounded-md border-none h-full w-full"
                  loading="lazy"
                ></iframe>
              </div>

              <div className="w-full h-60 bg-secondary-bg rounded-md relative">
                {content.gallery.length > 0 && (
                  <Image
                    src={content.gallery[selectedImage].image}
                    alt={content.gallery[selectedImage].caption}
                    fill
                    unoptimized
                    className="rounded-md"
                  />
                )}
              </div>
              <p className="text-gray-txt-500 text-sm italic text-center">
                {content.gallery[selectedImage].caption}
              </p>

              {content.gallery.length > 0 && (
                <div className="flex w-full overflow-x-auto gap-2 pb-4">
                  {content.gallery.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className="w-28 h-24 rounded-md border-secondary-bg bg-secondary-bg relative shrink-0"
                    >
                      <Image
                        src={item.image}
                        alt={item.caption}
                        fill
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className="bg-secondary-bg p-4 rounded-md text-sm">
                {Object.entries(content.basic).map(([key, value]) => {
                  if (!value || (Array.isArray(value) && value.length < 1))
                    return <Fragment key={key} />;

                  return (
                    <div
                      key={key}
                      className="flex items-start gap-4 justify-between py-2"
                    >
                      <p className="capitalize">{key}:</p>
                      {Array.isArray(value) ? (
                        <p className="text-right">{value.join(", ")}</p>
                      ) : (
                        <p className="text-right">{value}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PreviewFigure;
