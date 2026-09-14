import Image from "next/image";
import React, { Fragment } from "react";
import { Figure } from "../../lib";
import { ImageOff } from "lucide-react";
import { formatCamelCase } from "@/helpers";
import { SimpleAccordion } from "@/features/shared";

const InfoSection = ({ data }: { data: Figure }) => {
  const keyValuePairs = Object.entries(data).map(([key, value]) => {
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
        "createdById",
        "approvedBy",
        "approvedAt",
        "createdAt",
        "updatedAt",
        "rejectedBy",
        "rejectedAt",
        "rejectionReason",
      ].includes(key)
    )
      return null;

    return { key, value };
  });
  return (
    <div className=" flex flex-col col-span-2 md:px-4 md:py-6 md:bg-gray-txt-100 rounded-md w-full h-fit md:gap-5 gap-3">
      <div className="w-full md:h-68 h-40 bg-secondary-bg rounded-md max-md:mb-5">
        <div className="relative w-full max-h-full h-full aspect-video max-md:border border-gray-50/50 border-dashed rounded-md">
          {data.profilePhoto && (
            <Image
              src={data.profilePhoto}
              alt={data.fullName}
              fill
              unoptimized
              className="object-contain rounded-md"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
        </div>

        {!data.profilePhoto && (
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
                <p className="text-right capitalize">{item.value.join(", ")}</p>
              ) : (
                <p className="text-right capitalize">{item.value}</p>
              )}
            </div>
          );
        })}
      </div>

      {data.family && data.family.length > 0 && (
        <div className="bg-secondary-bg p-4 rounded-md text-sm">
          <p className="text-base pb-2">Family Members</p>

          {data.family.map((family, idx) => {
            const content = `${family.dateOfBirth ? `Born: ${family.dateOfBirth}\n` : ""}${family.dateOfDeath ? `Died: ${family.dateOfDeath}\n` : ""}${family.marriageYear ? `Marriage Year: ${family.marriageYear}\n` : ""}${family.divorceYear ? `Divorce Year: ${family.divorceYear}\n` : ""}${family.bio}`;
            return (
              <SimpleAccordion
                key={idx}
                title={`${family.name} (${family.relationship})`}
                content={content}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InfoSection;
