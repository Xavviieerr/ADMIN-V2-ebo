"use client";

import React, { useEffect, useState } from "react";
import { SingleWord } from "@/features/dictionary/lib";
import DeleteImageButton from "./delete-image";
import SenseImageUploader from "./sense-image-uploader";
import PermissionGate from "@/features/shared/permission-gate";
import Image from "next/image";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const SenseImageManager = ({
  oho,
  senseIndex,
}: {
  oho: SingleWord["oho"][number];
  senseIndex: number;
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [url, setUrl] = useState("");
  const [imageType, setImageType] = useState("");

  useEffect(() => {
    if (!oho.oma || oho.oma.length == 0) return setUrl("");

    setUrl(oho.oma[0].url);
    setImageType(oho.oma[0].type);
  }, [oho]);

  return (
    <div className="flex flex-col gap-2 rounded-full max-md:w-full">
      {url && (
        <div
          className={`h-40 md:w-40 w-full shrink-0 flex items-center justify-center bg-gray-txt-50/10 rounded-md relative hover:border border-gray-txt-50/40`}
        >
          <Image src={url} fill alt={t("common.dictionary.figureImage", "Figure Image")} className="rounded-md" />
        </div>
      )}

      <div
        className={`flex ${url ? "items-center justify-between gap-4" : "flex-col gap-2"} `}
      >
        {url && <p className="text-sm font-medium">{t("common.dictionary.imageLabel", "Image:")}</p>}

        <div className="flex items-center gap-4">
          <PermissionGate permission="add_media">
            <SenseImageUploader
              payload={{
                senseId: oho.id,
                senseIndex,
              }}
              large={!Boolean(url)}
            />
          </PermissionGate>
          {url && (
            <PermissionGate permission="delete_media">
            <DeleteImageButton
              payload={{
                senseId: oho.id,
                senseIndex,
                url,
                imageType,
              }}
              size={url ? 20 : 24}
            />
            </PermissionGate>
          )}
        </div>
      </div>
    </div>
  );
};

export default SenseImageManager;
