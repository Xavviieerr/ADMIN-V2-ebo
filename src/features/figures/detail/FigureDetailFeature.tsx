import React from "react";
import { GoBackButton, LocaleWrapper, StatusCard } from "../../shared";
import type { FigureDetail } from "../model/types";
import { getServerAccessToken } from "@/features/auth/utils/serverTokenStorage";
import { fetchSingleFigure } from "../api/figures";
import { getFigureErrorMessage, FigureApiError } from "../api/errors";
import { notFound } from "next/navigation";
import FigureActions from "./FigureActions";
import FigureDetailTabs, { type FigureDetailTab } from "./DetailTabs";

export type { FigureDetailTab };

const VALID_TABS: FigureDetailTab[] = ["overview", "biography", "family", "links"];

const FigureDetailFeature = async ({ id, tab }: { id: string; tab?: string }) => {
  if (!id || typeof id !== "string") notFound();

  const activeTab: FigureDetailTab = VALID_TABS.includes(tab as FigureDetailTab)
    ? (tab as FigureDetailTab)
    : "overview";

  const token = await getServerAccessToken();

  let data: FigureDetail | null = null;
  try {
    data = await fetchSingleFigure(token, id);
  } catch (error) {
    if (error instanceof FigureApiError && error.isNotFound) notFound();
    if (error instanceof Error && error.message.startsWith("Missing access token")) throw error;
    return (
      <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 text-white">
        <GoBackButton link="/guonopedia/figures" />
        <div
          role="alert"
          className="dark-box px-4 w-full py-10 flex flex-col items-center gap-3 text-center"
        >
          <p className="font-medium">
            <LocaleWrapper item="figures.detail.loadFailed" fallback="Failed to load figure" />
          </p>
          <p className="text-sm text-gray-300">
            {getFigureErrorMessage(error, "An unexpected error occurred")}
          </p>
        </div>
      </div>
    );
  }

  if (!data) notFound();

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 text-white">
      <GoBackButton link="/guonopedia/figures" />

      <div className="dark-box px-4 w-full space-y-6 pb-20">
        <div className="flex max-md:flex-col md:items-center justify-between gap-4">
          <div className="flex flex-col">
            <p className="font-medium">
              <LocaleWrapper item="figures.occupation" fallback="Occupation" />
              {data.occupation ? `: ${data.occupation}` : ""}
            </p>
            <h3 className="text-2xl font-medium capitalize">{data.fullName}</h3>
            <div className="mt-2 flex items-center gap-2">
              <StatusCard status={data.status} />
            </div>
          </div>

          <FigureActions status={data.status} figureId={data.id} />
        </div>

        {data.status === "rejected" && data.rejectionReason && (
          <div className="flex flex-col md:px-8 px-4 py-6 bg-gray-txt-100 rounded-md w-full gap-3">
            <p className="text-red-400">
              <LocaleWrapper item="figures.rejectionHeading" fallback="Reason For Rejection" />
            </p>
            <p className="font-normal">{data.rejectionReason}</p>
          </div>
        )}

        <FigureDetailTabs active={activeTab} figureId={data.id} />

        {activeTab === "overview" && (
          <div className="w-full grid md:grid-cols-5 grid-cols-1 gap-6">
            <div className="flex flex-col gap-6 md:col-span-3">
              <div className="flex flex-col md:px-8 px-4 py-6 gap-3 bg-gray-txt-100 rounded-md w-full">
                <p className="whitespace-pre-wrap">{data.shortBio || data.introBio || "N/A"}</p>
                {data.introBio && data.shortBio && (
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{data.introBio}</p>
                )}
                {(data.tags ?? []).length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    {(data.tags ?? []).map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-1.5 rounded-full text-xs border border-white/15"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col md:px-8 px-4 py-6 gap-3 bg-gray-txt-100 rounded-md w-full">
                <DetailRow label="Gender" value={data.gender} />
                <DetailRow label="Date of birth" value={data.dateOfBirth} />
                <DetailRow label="Date of death" value={data.dateOfDeath} />
                <DetailRow label="Place of birth" value={data.placeOfBirth} />
                <DetailRow label="Nationality" value={data.nationality} />
                <DetailRow label="Ethnicity" value={data.ethnicity} />
                <DetailRow label="Religion" value={data.religion} />
                <DetailRow label="Era" value={data.era} />
                <DetailRow label="Region" value={data.region} />
                <DetailRow label="Occupation" value={data.occupation} />
              </div>

              {data.translation && (
                <div className="flex flex-col md:px-8 px-4 py-6 gap-3 bg-gray-txt-100 rounded-md w-full">
                  <h2 className="font-medium">
                    <LocaleWrapper item="figures.detail.translationTitle" fallback="Translation" />
                    {` (${data.translation.language})`}
                  </h2>
                  <p className="text-sm whitespace-pre-wrap">{data.translation.shortBio}</p>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{data.translation.introBio}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-6 md:col-span-2">
              <div className="flex flex-col px-4 py-6 gap-3 bg-gray-txt-100 rounded-md w-full">
                <h2 className="font-medium">Profile</h2>
                {data.profilePhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.profilePhoto}
                    alt={data.fullName}
                    className="w-full h-60 object-cover rounded-md"
                  />
                ) : (
                  <p className="text-sm text-gray-400">No image</p>
                )}
              </div>

              <div className="bg-secondary-bg p-4 rounded-md text-sm flex flex-col gap-2">
                <DetailRow label="Status" value={data.status} />
                <DetailRow
                  label="Created"
                  value={data.createdAt ? new Date(data.createdAt).toLocaleDateString() : undefined}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "biography" && (
          <div className="flex flex-col gap-4">
            {(data.biography ?? []).length === 0 && (
              <p className="text-sm text-gray-400">
                <LocaleWrapper item="figures.detail.noBiography" fallback="No biography yet" />
              </p>
            )}
            {(data.biography ?? [])
              .slice()
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((section, idx) => (
                <div
                  key={section.id ?? `${section.title}-${idx}`}
                  className="flex flex-col md:px-8 px-4 py-6 gap-3 bg-gray-txt-100 rounded-md w-full"
                >
                  <h2 className="font-medium">{section.title}</h2>
                  {section.overview && (
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{section.overview}</p>
                  )}
                  {(section.entries ?? [])
                    .slice()
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    .map((entry, eIdx) => (
                      <div key={entry.id ?? `${entry.title}-${eIdx}`} className="flex flex-col gap-2 border-t border-white/10 pt-3">
                        <h3 className="text-sm font-medium">{entry.title}</h3>
                        <p className="text-sm whitespace-pre-wrap">{entry.content}</p>
                        {(entry.photos ?? []).length > 0 && (
                          <div className="flex w-full overflow-x-auto gap-2 pb-2 custom-scrollbar">
                            {(entry.photos ?? []).map((url) => (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                key={url}
                                src={url}
                                alt={entry.title}
                                className="w-24 h-24 rounded-md object-cover shrink-0"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ))}
            {(data.timeline ?? []).length > 0 && (
              <div className="flex flex-col md:px-8 px-4 py-6 gap-3 bg-gray-txt-100 rounded-md w-full">
                <h2 className="font-medium">
                  <LocaleWrapper item="figures.detail.timelineTitle" fallback="Timeline" />
                </h2>
                {(data.timeline ?? []).map((ev, idx) => (
                  <div key={ev.id ?? `${ev.year}-${idx}`} className="flex flex-col gap-1 border-t border-white/10 pt-3">
                    <p className="text-sm font-medium">
                      {ev.year} — {ev.title}
                    </p>
                    <p className="text-sm text-gray-300">{ev.description}</p>
                  </div>
                ))}
              </div>
            )}
            {(data.education ?? []).length > 0 && (
              <div className="flex flex-col md:px-8 px-4 py-6 gap-3 bg-gray-txt-100 rounded-md w-full">
                <h2 className="font-medium">
                  <LocaleWrapper item="figures.detail.educationTitle" fallback="Education" />
                </h2>
                {(data.education ?? []).map((ed, idx) => (
                  <p key={ed.id ?? `${ed.institution}-${idx}`} className="text-sm">
                    {ed.institution}
                    {ed.degree ? ` — ${ed.degree}` : ""}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "family" && (
          <div className="flex flex-col gap-4">
            {(data.family ?? []).length === 0 && (
              <p className="text-sm text-gray-400">
                <LocaleWrapper item="figures.detail.noFamily" fallback="No family members yet" />
              </p>
            )}
            {(data.family ?? []).map((member) => (
              <div
                key={member.id ?? member.name}
                className="flex flex-col md:px-8 px-4 py-6 gap-2 bg-gray-txt-100 rounded-md w-full"
              >
                <p className="font-medium capitalize">{member.name}</p>
                <DetailRow label="Relationship" value={member.relationship} />
                <DetailRow label="Occupation" value={member.occupation} />
                <DetailRow label="Bio" value={member.bio} />
              </div>
            ))}
          </div>
        )}

        {activeTab === "links" && (
          <div className="flex flex-col gap-4">
            {(data.externalLinks ?? []).length === 0 && (
              <p className="text-sm text-gray-400">
                <LocaleWrapper item="figures.detail.noLinks" fallback="No external links yet" />
              </p>
            )}
            {(data.externalLinks ?? []).map((link, idx) => (
              <div
                key={link.id ?? `${link.title}-${idx}`}
                className="flex flex-col md:px-8 px-4 py-6 gap-2 bg-gray-txt-100 rounded-md w-full"
              >
                <p className="font-medium">{link.title}</p>
                <DetailRow label="Type" value={link.type} />
                <DetailRow label="URL" value={link.url} />
                <DetailRow label="Source" value={link.source} />
                <DetailRow label="Creator" value={link.creator} />
              </div>
            ))}
            {(data.relatedFigures ?? []).length > 0 && (
              <div className="flex flex-col md:px-8 px-4 py-6 gap-2 bg-gray-txt-100 rounded-md w-full">
                <h2 className="font-medium">
                  <LocaleWrapper item="figures.detail.relatedTitle" fallback="Related Figures" />
                </h2>
                {(data.relatedFigures ?? []).map((rel) => (
                  <p key={rel.id} className="text-sm">
                    {rel.relatedFigure?.fullName ?? rel.relatedFigureId}
                    {rel.relationNote ? ` — ${rel.relationNote}` : ""}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

function DetailRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <p className="flex flex-wrap gap-2 max-md:text-sm">
      <span className="shrink-0">{label}:</span>{" "}
      <span className="text-gray-txt-50 break-words min-w-0">{value ?? "N/A"}</span>
    </p>
  );
}

export default FigureDetailFeature;
