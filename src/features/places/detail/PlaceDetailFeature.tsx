import React from "react";
import { GoBackButton, LocaleWrapper, StatusCard } from "../../shared";
import type { PlaceDetail } from "../model/types";
import { placeTypeLabel } from "../model/filter-options";
import { getServerAccessToken } from "@/features/auth/utils/serverTokenStorage";
import { fetchSinglePlace } from "../api/places";
import { getPlaceErrorMessage, PlaceApiError } from "../api/errors";
import { notFound } from "next/navigation";
import PlaceActions from "./PlaceActions";
import DetailTabs, { type DetailTab } from "./DetailTabs";
import BusinessProfileSection from "./BusinessProfileSection";
import RelatedSection from "./RelatedSection";
import ReviewsSection from "./ReviewsSection";
import ClaimsSection from "./ClaimsSection";

export type { DetailTab };

const VALID_TABS: DetailTab[] = ["overview", "related", "reviews", "claims"];

const PlaceDetailFeature = async ({ id, tab }: { id: string; tab?: string }) => {
  if (!id || typeof id !== "string") notFound();

  const activeTab: DetailTab = VALID_TABS.includes(tab as DetailTab)
    ? (tab as DetailTab)
    : "overview";

  const token = await getServerAccessToken();

  let data: PlaceDetail | null = null;
  try {
    data = await fetchSinglePlace(token, id);
  } catch (error) {
    if (error instanceof PlaceApiError && error.isNotFound) notFound();
    if (error instanceof Error && error.message.startsWith("Missing access token")) throw error;
    // Malformed ids can 500 on the backend — present a clean error, not a leak.
    return (
      <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 text-white">
        <GoBackButton link="/guonopedia/places" />
        <div
          role="alert"
          className="dark-box px-4 w-full py-10 flex flex-col items-center gap-3 text-center"
        >
          <p className="font-medium">
            <LocaleWrapper item="places.detail.loadFailed" fallback="Failed to load place" />
          </p>
          <p className="text-sm text-gray-300">
            {getPlaceErrorMessage(error, "An unexpected error occurred")}
          </p>
        </div>
      </div>
    );
  }

  if (!data) notFound();

  const hasProfile = data.businessProfile != null;
  const location = data.location;
  const locationText = [location?.city, location?.state, location?.country]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 text-white">
      <GoBackButton link="/guonopedia/places" />

      <div className="dark-box px-4 w-full space-y-6 pb-20">
        <div className="flex max-md:flex-col md:items-center justify-between gap-4">
          <div className="flex flex-col">
            <p className="font-medium">
              <LocaleWrapper item="places.placeLabel" fallback="Place" />
            </p>
            <h3 className="text-2xl font-medium capitalize">{data.name}</h3>
            <div className="mt-2 flex items-center gap-2">
              <StatusCard status={data.status} />
              {data.verificationStatus && (
                <span className="text-xs text-gray-400 capitalize">
                  {data.verificationStatus.replaceAll("_", " ")}
                </span>
              )}
            </div>
          </div>

          <PlaceActions status={data.status} placeId={data.id} verificationStatus={data.verificationStatus} />
        </div>

        {data.status === "rejected" && data.rejectionReason && (
          <div className="flex flex-col md:px-8 px-4 py-6 bg-gray-txt-100 rounded-md w-full gap-3">
            <p className="text-red-400">
              <LocaleWrapper item="places.rejectionHeading" fallback="Reason For Rejection" />
            </p>
            <p className="font-normal">{data.rejectionReason}</p>
          </div>
        )}

        <DetailTabs active={activeTab} placeId={data.id} hasProfile={hasProfile} />

        {activeTab === "overview" && (
          <div className="w-full grid md:grid-cols-5 grid-cols-1 gap-6">
            <div className="flex flex-col gap-6 md:col-span-3">
              <div className="flex flex-col md:px-8 px-4 py-6 gap-3 bg-gray-txt-100 rounded-md w-full">
                <p className="whitespace-pre-wrap">{data.description || "N/A"}</p>
                <p className="text-sm text-gray-300 capitalize">
                  {placeTypeLabel(data.type)}
                </p>
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
                {typeof data.viewCount === "number" && (
                  <p className="text-xs text-gray-400">Views: {data.viewCount}</p>
                )}
              </div>

              <div className="flex flex-col md:px-8 px-4 py-6 gap-3 bg-gray-txt-100 rounded-md w-full">
                <div className="flex items-center gap-3 text-base font-medium">
                  <div className="h-3 w-3 rounded-full bg-yellow-600" />
                  <h2>
                    <LocaleWrapper item="places.detail.locationTitle" fallback="Location" />
                  </h2>
                </div>
                {location ? (
                  <>
                    <DetailRow label="Address" value={location.address} />
                    <DetailRow label="City" value={location.city} />
                    <DetailRow label="State" value={location.state} />
                    <DetailRow label="Country" value={location.country} />
                    <DetailRow label="Latitude" value={formatCoord(location.latitude)} />
                    <DetailRow label="Longitude" value={formatCoord(location.longitude)} />
                  </>
                ) : (
                  <p className="text-sm text-gray-400">
                    <LocaleWrapper item="places.detail.noLocation" fallback="No location information" />
                  </p>
                )}
              </div>

              <BusinessProfileSection profile={data.businessProfile ?? null} />
            </div>

            <div className="flex flex-col gap-6 md:col-span-2">
              <div className="flex flex-col px-4 py-6 gap-3 bg-gray-txt-100 rounded-md w-full">
                <div className="flex items-center gap-3 text-base font-medium">
                  <div className="h-3 w-3 rounded-full bg-yellow-600" />
                  <h2>
                    <LocaleWrapper item="places.detail.imagesTitle" fallback="Images" />
                  </h2>
                </div>
                {data.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.coverImage}
                    alt={data.name}
                    className="w-full h-60 object-cover rounded-md"
                  />
                ) : (
                  <p className="text-sm text-gray-400">
                    <LocaleWrapper item="places.detail.noImages" fallback="No images" />
                  </p>
                )}
                {(data.images ?? []).length > 0 && (
                  <div className="flex w-full overflow-x-auto gap-2 pb-2 custom-scrollbar">
                    {(data.images ?? []).map((url) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={url}
                        src={url}
                        alt={data.name}
                        className="w-24 h-24 rounded-md object-cover shrink-0"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-secondary-bg p-4 rounded-md text-sm flex flex-col gap-2">
                <DetailRow label="Location" value={locationText || undefined} />
                <DetailRow label="Status" value={data.status} />
                <DetailRow
                  label="Created"
                  value={data.createdAt ? new Date(data.createdAt).toLocaleDateString() : undefined}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "related" && (
          <RelatedSection placeId={data.id} initial={data.relatedPlaces ?? []} />
        )}

        {activeTab === "reviews" && (
          <ReviewsSection placeId={data.id} hasProfile={hasProfile} />
        )}

        {activeTab === "claims" && (
          <ClaimsSection
            profileId={data.businessProfile?.id ?? null}
            hasProfile={hasProfile}
          />
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

function formatCoord(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "N/A";
  return String(value);
}

export default PlaceDetailFeature;
