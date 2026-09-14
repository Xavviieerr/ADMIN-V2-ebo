"use client";

import { FigureInfoStage } from "@/features/shared";
import React, { Fragment, useState } from "react";
import Image from "next/image";
import { CheckCheck, ImageOff, Loader2 } from "lucide-react";
import SingleEntry from "./single-preview-entry";
import { useAddFigureCTX } from "./context";
import SourcesPreview from "./sources";
import { addFigure } from "@/features/figures-pedia/lib";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import { formatCamelCase } from "@/helpers";

const PreviewStage = ({ stage }: { stage: FigureInfoStage }) => {
  const { getFormattedPayload, clearFromLocal } = useAddFigureCTX();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const token = getAccessToken();

  const basicInfo = getFormattedPayload();

  const biographies =
    basicInfo.biography && basicInfo.biography.length > 0
      ? basicInfo.biography[0].entries
      : [];

  const handleSubmit = () => {
    setLoading(true);
    addFigure({
      token,
      payload: basicInfo,
    })
      .then((res) => {
        if (res.status) {
          router.replace(`/guonopedia/figures/${res.data.data.id}`);
        }
      })
      .finally(() => {
        clearFromLocal();
        setLoading(false);
      });
  };

  const keyValuePairs = Object.entries(basicInfo).map(([key, value]) => {
    if (
      !value ||
      typeof value !== "string" ||
      (Array.isArray(value) && value.length < 1)
    )
      return null;

    if (
      [
        "id",
        "slug",
        "profilePhoto",
        "shortBio",
        "introBio",
        "externalLinks",
        "status",
        "submissionType",
      ].includes(key)
    )
      return null;

    return { key, value };
  });

  return (
    <>
      {stage === "preview" && (
        <div className="dark-box max-md:px-0 w-full">
          <div className="flex items-center justify-between gap-4 max-md:px-3">
            <h2 className="text-white font-medium text-lg">Preview Figure</h2>

            <div className="flex items-center gap-4">
              <button
                disabled={loading}
                onClick={handleSubmit}
                className="flex items-center gap-2 px-5 md:py-3 py-2 bg-green-600 text-white cursor-pointer font-medium text-base rounded-md transition-colors disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <CheckCheck size={18} />
                    <span>Submit</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-5 grid-cols-1 w-full gap-6  mt-8">
            <div className=" flex flex-col whitespace-pre-wrap md:col-span-3 max-md:order-1 md:px-8 px-3 py-6 gap-4 md:bg-gray-txt-100/50 rounded-md w-full">
              <p>{basicInfo.introBio}</p>

              {biographies.length > 0 && (
                <div className="flex flex-col w-full">
                  {biographies.map((item, idx) => (
                    <SingleEntry key={idx} entry={item} />
                  ))}
                </div>
              )}

              <SourcesPreview sources={basicInfo.externalLinks as any} />
            </div>

            <div className=" flex flex-col md:col-span-2 md:px-4 px-0 md:py-6  md:bg-gray-txt-100/50 rounded-md w-full h-fit md:sticky top-0 gap-5">
              <div className="w-full md:h-68 h-40 bg-secondary-bg rounded-md max-md:mb-5">
                <div className="relative w-full max-h-full h-full aspect-video max-md:border border-gray-50/50 border-dashed rounded-md">
                  {basicInfo.profilePhoto && (
                    <Image
                      src={basicInfo.profilePhoto}
                      alt={basicInfo.fullName}
                      fill
                      unoptimized
                      className="object-contain rounded-md"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  )}
                </div>

                {!basicInfo.profilePhoto && (
                  <div className="flex flex-col justify-center items-center gap-5 w-full h-full border border-gray-50/50 border-dashed rounded-md">
                    <ImageOff size={28} strokeWidth={1.2} />
                    <p>No Profile Photo</p>
                  </div>
                )}
              </div>

              <div className="bg-secondary-bg p-4 rounded-md text-sm">
                {keyValuePairs.map((item, idx) => {
                  if (!item) return <Fragment key={idx} />;

                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-4 justify-between py-4 border-b border-gray-50/5"
                    >
                      <p className="capitalize">{formatCamelCase(item.key)}:</p>
                      {Array.isArray(item.value) ? (
                        <p className="text-right">{item.value.join(", ")}</p>
                      ) : (
                        <p className="text-right">{item.value}</p>
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

export default PreviewStage;
