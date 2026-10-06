import React from "react";
import NameActions from "./NameActions";
import NameTranslationCarousel from "./NameTranslationCarousel";
import { GoBackButton, LocaleWrapper } from "../../shared";
import type { SingleName } from "../model/types";
import { NameStatusBadge } from "../shared/NameStatusBadge";
import { getServerAccessToken } from "@/features/auth/utils/serverTokenStorage";
import { fetchSingleName } from "../api";
import { getNamesErrorMessage, NamesApiError } from "../api/errors";
import { notFound } from "next/navigation";

function PillList({ titleKey, titleFallback, items }: { titleKey: string; titleFallback: string; items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <p className="font-medium">
        <LocaleWrapper item={titleKey} fallback={titleFallback} />
      </p>
      <div className="flex flex-wrap items-center gap-3 w-full">
        {items.map((item) => (
          <span
            key={item}
            className="px-5 py-3 rounded-full text-sm border w-fit"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

const SingleNameFeature = async ({ id }: { id: string }) => {
  if (!id || typeof id !== "string") notFound();

  const token = await getServerAccessToken();

  let data: SingleName | null = null;
  try {
    data = await fetchSingleName(token, id);
  } catch (error) {
    if (error instanceof NamesApiError && error.isNotFound) notFound();
    if (error instanceof Error && error.message.startsWith("Missing access token")) throw error;
    return (
      <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 text-white">
        <GoBackButton link="/guonopedia/names" />
        <div
          role="alert"
          className="dark-box px-4 w-full py-10 flex flex-col items-center gap-3 text-center"
        >
          <p className="font-medium">
            <LocaleWrapper item="names.detail.loadFailed" fallback="Failed to load name" />
          </p>
          <p className="text-sm text-gray-300">
            {getNamesErrorMessage(error, "An unexpected error occurred")}
          </p>
        </div>
      </div>
    );
  }

  if (!data) notFound();

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 text-white">
      <GoBackButton link="/guonopedia/names" />

      <div className="dark-box px-4 w-full space-y-6 pb-20">
        <div className="flex max-md:flex-col md:items-center justify-between gap-4">
          <div className="flex flex-col ">
            <p className="font-medium">
              <LocaleWrapper item="common.name" fallback="Name" />
            </p>
            <h3 className="text-2xl font-medium capitalize">{data.name}</h3>
          </div>

          <NameActions status={data.status} nameId={data.id} />
        </div>

        {data.rejectionReason && (
          <div className="flex flex-col md:px-8 px-4 py-6 bg-gray-txt-100 rounded-md w-full gap-3">
            <p className="text-red-400">
              <LocaleWrapper
                item="common.dictionary.rejectionReasonTitle"
                fallback="Reason For Rejection"
              />
            </p>
            <p className="font-normal">{data.rejectionReason}</p>
          </div>
        )}

        <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-10">
          {/* Details */}
          <div className=" flex flex-col md:px-8 px-4 py-6 bg-gray-txt-100 rounded-md w-full gap-5">
            <div className="flex items-center gap-3 text-base font-medium">
              <div className="h-3 w-3 rounded-full bg-yellow-600" />
              <h2>
                <LocaleWrapper item="names.form.detailsHeading" fallback="Name Details" />
              </h2>
            </div>

            {/* Source, Type & Gender */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-5">
              <div className="flex flex-col gap-2">
                <p className="font-medium">
                  <LocaleWrapper item="common.type" fallback="Type" />
                </p>
                <p className="text-gray-txt-50 font-normal">
                  {data.nameType}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-medium">
                  <LocaleWrapper item="common.gender" fallback="Gender" />
                </p>
                <p className="capitalize text-gray-txt-50 font-normal">
                  {data.gender}
                </p>
              </div>

              {data.regionOfUse && (
                <div className="flex flex-col gap-2">
                  <p className="font-medium">
                    <LocaleWrapper item="common.dialect" fallback="Dialect" />
                  </p>
                  <p className="text-gray-txt-50 font-normal capitalize">
                    {data.regionOfUse}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <p className="font-medium">
                  <LocaleWrapper item="common.status" fallback="Status" />
                </p>
                <NameStatusBadge status={data.status} className="font-normal" />
              </div>

              {data.pronunciation && (
                <div className="flex flex-col gap-2">
                  <p className="font-medium">
                    <LocaleWrapper
                      item="names.detail.pronunciationLabel"
                      fallback="Pronunciation"
                    />
                  </p>
                  <p className="text-gray-txt-50 font-normal">
                    /{data.pronunciation}/
                  </p>
                </div>
              )}

              {data.syllableCount > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="font-medium">
                    <LocaleWrapper
                      item="names.detail.syllableCount"
                      fallback="Syllable Count"
                    />
                  </p>
                  <p className="text-gray-txt-50 font-normal">
                    {data.syllableCount}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-medium">
                <LocaleWrapper item="names.detail.summary" fallback="Summary" />
              </p>
              <p className="text-gray-txt-50 font-normal">
                {data.culturalSignificance}
              </p>
            </div>

            <PillList titleKey="names.detail.composition" titleFallback="Name Composition" items={data.nameComposition ?? []} />
            <PillList titleKey="names.detail.nicknames" titleFallback="Nick Names" items={data.nicknames ?? []} />
            <PillList titleKey="names.detail.bearers" titleFallback="Notable Bearers" items={data.notableBearers ?? []} />
          </div>

          {/* Translations */}
          <NameTranslationCarousel data={data.translations ?? []} />
        </div>
      </div>
    </div>
  );
};

export default SingleNameFeature;
