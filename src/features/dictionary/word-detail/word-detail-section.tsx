"use client";

import React from "react";
import { ApproveWordButton, EditWordButton, RejectWordButton } from "./buttons";
import { SetInReviewButton } from "./buttons";
import DeleteAudioButton from "./delete-audio";
import AudioUploader from "./audio-uploader";
import PlayAudioButton from "./play-audio";
import {
  KeyValueParagraph,
  PermissionGate,
  StatusCard,
} from "@/features/shared";
import { SingleWord } from "../lib";
import { Info } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const WordDetailSection = ({
  data,
  dialects,
}: {
  data: SingleWord;
  dialects: {
    id: string;
    name: string;
  }[];
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex max-md:flex-col items-start justify-between gap-4 pb-5 border-b border-gray-txt-50/20">
        <div className="flex flex-col gap-2 max-md:w-full">
          <div className="flex max-md:justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-white font-medium text-2xl">
                {data.ota.toLowerCase()}
              </h2>

              {data.otaOkpopko && (
                <Link
                  href={"#creation-reason"}
                  className="flex items-center group justify-center p-1 relative"
                >
                  <Info className="text-gray-txt-50" />

                  <p className="md:group-hover:flex hidden absolute top-10 rounded-lg px-3 py-1 text-sm left-0 w-100 text-start  bg-secondary-bg shadow border border-gray-txt-50/50">
                    {data.creationReason}
                  </p>
                </Link>
              )}
            </div>

            <div className="flex items-center gap-4">
              <StatusCard status={data.status} />

              <PermissionGate permission="edit_word">
                <EditWordButton data={data} dialects={dialects} />
              </PermissionGate>
            </div>
          </div>

          <>
            <div className="flex items-center gap-4">
              <KeyValueParagraph
                item={t("common.dictionary.sensesHeader", "Senses")}
                value={data.oho.length}
                isDense
              />
              <KeyValueParagraph item={t("common.dictionary.dialectLabel", "Dialect")} value={data.erevwe} isDense />
            </div>

            <KeyValueParagraph
              item={t("common.dictionary.addedBy", "Added By")}
              value={`${data.createdBy.username} on ${moment(data.createdAt).format("DD/MM/YYYY")}`}
              isDense
            />
          </>

          {data.oho.length > 0 && (
            <div className="flex max-md:justify-between max-md:items-center gap-2 rounded-full max-md:w-full">
              <p className="text-sm font-medium">{t("common.dictionary.audioLabel", "Audio:")}</p>

              <div className="flex items-center gap-4">
                {data.oho[0].omra?.length > 0 && (
                  <PlayAudioButton audioUrl={data.oho[0].omra[0]} size={24} />
                )}

                {(!data.oho[0].omra || data.oho[0].omra.length == 0) && (
                  <AudioUploader
                    type="sense"
                    payload={{
                      senseId: data.oho[0].id,
                      senseIndex: data.oho[0].kere,
                    }}
                  />
                )}

              {data.oho[0].omra?.length > 0 && (
                <DeleteAudioButton
                  type="sense"
                  payload={{
                    senseId: data.oho[0].id,
                    senseIndex: data.oho[0].kere,
                    url: data.oho[0].omra[0],
                  }}
                />
              )}
              </div>
            </div>
          )}
        </div>

        <div className="flex md:flex-col flex-wrap gap-3 w-fit max-w-full shrink-0">
          <ApproveWordButton data={data} />

          <SetInReviewButton data={data} />

          <RejectWordButton data={data} />
        </div>
      </div>

      {data.status == "rejected" && (
        <div className="flex flex-col gap-2 px-5 py-3 text-gray-txt-50 text-sm border border-base-red bg-base-red/5 border-dashed rounded-md">
          <p className="">{t("common.dictionary.rejectionReasonTitle", "Rejection Reason")}</p>
          <p>{data.rejectionReason}</p>
        </div>
      )}
    </div>
  );
};

export default WordDetailSection;
