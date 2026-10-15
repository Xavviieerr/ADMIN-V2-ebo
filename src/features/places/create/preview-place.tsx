"use client";

import { ErrorWidget, KeyValueParagraph, PermissionGate, PlaceInfoStage } from "@/features/shared";
import React, { useState } from "react";
import Image from "next/image";
import { CheckCheck, ImageOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useAddPlaceDraft } from "./context";
import { buildPlaceCreatePayload } from "../model/payload";
import {
  PLACE_VALIDATION_EN,
  validateBusinessProfile,
  validatePlaceRecord,
} from "../model/validation";
import { createPlace } from "../api/places";
import { getPlaceErrorMessage } from "../api/errors";
import { placeTypeLabel } from "../model/filter-options";

// Preview renders the actual submission payload mapped from the draft.
// History entries and sources are draft-only (the backend has no fields for
// them) and are called out as such instead of being silently dropped.
const PreviewPlace = ({ stage }: { stage: PlaceInfoStage }) => {
  const { basic, location, profile, history, sources, resetDraft } = useAddPlaceDraft();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const payload = buildPlaceCreatePayload(basic, location, profile);

  const fail = (key: string) => {
    const msg = t(key, PLACE_VALIDATION_EN[key] ?? key);
    setError(msg);
    toast.error(msg);
  };

  const handleSubmit = async () => {
    setError("");
    const recordErrors = validatePlaceRecord({
      name: basic.name,
      description: basic.summary,
      type: basic.type,
      latitude: location.lat,
      longitude: location.long,
    });
    if (Object.keys(recordErrors).length > 0) {
      return fail(
        recordErrors[Object.keys(recordErrors)[0] as keyof typeof recordErrors] ??
          "places.validation.genericRequired",
      );
    }
    if (basic.type === "business" && profile) {
      const profileErrors = validateBusinessProfile(profile);
      if (Object.keys(profileErrors).length > 0) {
        return fail(
          profileErrors[Object.keys(profileErrors)[0] as keyof typeof profileErrors] ??
            "places.validation.genericRequired",
        );
      }
    }

    setLoading(true);
    try {
      const created = await createPlace(payload, tokenStorage.getAccessToken());
      resetDraft();
      toast.success(t("places.form.addedSuccess", "Place created successfully!"));
      router.replace(`/guonopedia/places/${created.id}`);
    } catch (err) {
      const msg = getPlaceErrorMessage(
        err,
        t("places.form.addFailed", "Failed to create place"),
      );
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const summaryRows: { key: string; value: string }[] = [
    { key: "Name", value: basic.name || "—" },
    { key: "Type", value: basic.type ? placeTypeLabel(basic.type) : "—" },
    { key: "Description", value: basic.summary || "—" },
    {
      key: "Location",
      value:
        [location.city, location.state, location.country].filter(Boolean).join(", ") || "—",
    },
    { key: "Tags", value: basic.tags.join(", ") || "—" },
  ];

  const gallery = [
    ...(payload.coverImage ? [payload.coverImage] : []),
    ...(payload.images ?? []),
  ];

  return (
    <>
      {stage === "preview" && (
        <div className="dark-box max-md:px-0 w-full">
          <div className="flex items-center justify-between gap-4 max-md:px-3">
            <h2 className="text-white font-medium text-lg">
              {t("places.form.previewTitle", "Preview Place")}
            </h2>

            <div className="flex items-center gap-4">
              <PermissionGate permission="create_place">
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
                      <span>{t("places.form.submitPlace", "Submit Place")}</span>
                    </>
                  )}
                </button>
              </PermissionGate>
            </div>
          </div>

          <ErrorWidget message={error} action={() => setError("")} />

          <div className="grid md:grid-cols-5 grid-cols-1 w-full gap-6 mt-8">
            <div className="flex flex-col whitespace-pre-wrap md:col-span-3 max-md:order-1 md:px-8 px-3 py-6 gap-4 md:bg-gray-txt-100/50 rounded-md w-full">
              <p>{basic.summary || "—"}</p>

              {(history.length > 0 || sources.length > 0) && (
                <p className="text-xs text-gray-400 italic">
                  {t(
                    "places.form.draftOnlyNote",
                    "History entries and sources are kept in this draft only — not sent to the server.",
                  )}{" "}
                  ({history.length} entries, {sources.length} sources)
                </p>
              )}

              {profile && basic.type === "business" && (
                <div className="flex flex-col gap-2 text-sm">
                  <p className="font-medium">
                    {t("places.form.profileTitle", "Business Profile (optional)")}
                  </p>
                  <KeyValueParagraph item="Category" value={profile.category || "—"} />
                  {profile.phoneNumber.trim() && (
                    <KeyValueParagraph item="Phone" value={profile.phoneNumber} />
                  )}
                  {profile.email.trim() && (
                    <KeyValueParagraph item="Email" value={profile.email} />
                  )}
                  {profile.website.trim() && (
                    <KeyValueParagraph item="Website" value={profile.website} />
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col md:col-span-2 md:px-4 px-0 md:py-6 md:bg-gray-txt-100/50 rounded-md w-full h-fit md:sticky top-0 gap-5">
              <div className="w-full md:h-68 h-40 bg-secondary-bg rounded-md max-md:mb-5">
                <div className="relative w-full max-h-full h-full aspect-video max-md:border border-gray-50/50 border-dashed rounded-md">
                  {gallery.length > 0 && (
                    <Image
                      src={gallery[0]}
                      alt={basic.name}
                      fill
                      unoptimized
                      className="object-contain rounded-md"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  )}
                </div>

                {gallery.length === 0 && (
                  <div className="flex flex-col justify-center items-center gap-5 w-full h-full border border-gray-50/50 border-dashed rounded-md">
                    <ImageOff size={28} strokeWidth={1.2} />
                    <p>{t("places.detail.noImages", "No images")}</p>
                  </div>
                )}
              </div>

              <div className="bg-secondary-bg p-4 rounded-md text-sm">
                {summaryRows.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 justify-between py-4 border-b border-gray-50/5"
                  >
                    <p className="capitalize">{item.key}:</p>
                    <p className="text-right">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PreviewPlace;
