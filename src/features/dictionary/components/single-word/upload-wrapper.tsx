"use client";

import React, { useEffect, useState } from "react";
import { SingleWord } from "@/features/dictionary/lib";
import DeleteImageButton from "./delete-image";
import IconImageUploader from "./icon-image-uploader";
import Image from "next/image";

const UploadWrapper = ({ oho }: { oho: SingleWord["oho"][number] }) => {
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
          <Image src={url} fill alt="Figure Image" className="rounded-md" />
        </div>
      )}

      <div
        className={`flex ${url ? "items-center justify-between gap-4" : "flex-col gap-2"} `}
      >
        {url && <p className="text-sm font-medium">Image:</p>}

        <div className="flex items-center gap-4">
          <IconImageUploader
            payload={{
              senseId: oho.id,
              senseIndex: 1,
            }}
            large={!Boolean(url)}
          />
          {url && (
            <DeleteImageButton
              payload={JSON.stringify({
                senseId: oho.id,
                senseIndex: 1,
                url,
                imageType,
              })}
              size={url ? 20 : 24}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadWrapper;
