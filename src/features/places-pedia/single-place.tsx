import { GoBackButton, ImageGallery } from "@/features/shared";
import React, { Fragment } from "react";
import { content } from "./content";
import { ButtonRow, ContentSection } from "./components/view";

const SinglePlaceFeature = () => {
  return (
    <>
      <GoBackButton />

      <div className="dark-box w-full text-white">
        <div className="flex max-md:flex-col md:items-center justify-between gap-4">
          <h2 className="text-white font-medium text-lg">
            {content.basic.name}
          </h2>

          <ButtonRow />
        </div>

        <div className="grid md:grid-cols-5 grid-cols-1 w-full md:gap-6 gap-y-6 mt-8 text-white">
          <ContentSection content={content} />

          <div className=" flex flex-col col-span-2 md:px-4 md:py-6 bg-gray-txt-100 rounded-md w-full h-fit md:gap-5 gap-3">
            <div className="w-full h-60 bg-secondary-bg rounded-md relative">
              <iframe
                src={`https://maps.google.com/maps?q=${content.basic.lat},${content.basic.long}&z=15&output=embed`}
                className="rounded-md border-none h-full w-full"
                loading="lazy"
              ></iframe>
            </div>

            <ImageGallery gallery={content.gallery} />

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
    </>
  );
};

export default SinglePlaceFeature;
