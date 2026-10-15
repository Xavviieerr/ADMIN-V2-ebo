"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { ErrorWidget, PermissionGate } from "@/features/shared";
import ModalLayout from "@/features/shared/modal-layout";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";
import type { PlaceReview } from "../model/types";
import { deleteReview, fetchReviews } from "../api/places";
import { getPlaceErrorMessage } from "../api/errors";

// Reviews for a business-profiled place. Display-only except deletion,
// which is gated (verified: full-grant admins can delete; owner responses
// are owner-only and never exposed as admin actions here).
const ReviewsSection = ({
  placeId,
  hasProfile,
}: {
  placeId: string;
  hasProfile: boolean;
}) => {
  const router = useRouter();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const [reviews, setReviews] = useState<PlaceReview[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<PlaceReview | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const page = await fetchReviews(placeId, { limit: 20 }, tokenStorage.getAccessToken());
      setReviews(page.items ?? []);
    } catch (err) {
      const msg = getPlaceErrorMessage(err, "Failed to load reviews");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (hasProfile) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeId, hasProfile]);

  const handleDelete = async () => {
    if (!confirmDelete || busy) return;
    setError("");
    setBusy(true);
    try {
      await deleteReview(placeId, confirmDelete.id, tokenStorage.getAccessToken());
      // Re-fetch and verify the review is actually gone.
      const page = await fetchReviews(placeId, { limit: 20 }, tokenStorage.getAccessToken());
      const remaining = page.items ?? [];
      if (remaining.some((r) => r.id === confirmDelete.id)) {
        setError(t("places.actions.reviewDeleteFailed", "Failed to delete review"));
        return;
      }
      setReviews(remaining);
      router.refresh();
      toast.success(t("places.actions.reviewDeleted", "Review deleted successfully"));
      setConfirmDelete(null);
    } catch (err) {
      const msg = getPlaceErrorMessage(err, t("places.actions.reviewDeleteFailed", "Failed to delete review"));
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  if (!hasProfile) return null;

  return (
    <div className="flex flex-col md:px-8 px-4 py-6 gap-4 bg-gray-txt-100 rounded-md w-full">
      <div className="flex items-center gap-3 text-base font-medium">
        <div className="h-3 w-3 rounded-full bg-yellow-600" />
        <h2>
          {t("places.detail.reviewsTitle", "Reviews")}
        </h2>
      </div>

      <ErrorWidget message={error} action={() => setError("")} />

      {loading || reviews === null ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-gray-400">
          {t("places.detail.noReviews", "No reviews yet")}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="flex flex-col gap-2 border border-white/10 rounded-lg px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">★ {review.rating}/5</span>
                  <span className="text-xs text-gray-400">
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                  </span>
                </div>
                <PermissionGate permission="delete_place">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(review)}
                    aria-label={t("places.actions.reviewDeleteTitle", "Delete Review")}
                    className="text-base-red cursor-pointer shrink-0"
                  >
                    <Trash2 size={18} strokeWidth={1.5} />
                  </button>
                </PermissionGate>
              </div>
              <p className="text-sm">{review.comment}</p>
              {review.ownerResponse && (
                <div className="bg-secondary-bg rounded-md px-3 py-2">
                  <p className="text-xs text-gray-400">
                    {t("places.detail.ownerResponseLabel", "Owner response")}
                  </p>
                  <p className="text-sm italic">{review.ownerResponse}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {confirmDelete && (
        <ModalLayout size="xl">
          <div className="flex flex-col items-center w-full gap-6">
            <h1 className="font-medium md:text-2xl text-xl">
              {t("places.actions.reviewDeleteTitle", "Delete Review")}
            </h1>
            <p className="font-medium text-center max-md:text-sm">
              {t(
                "places.actions.reviewDeleteBody",
                "Are you sure you want to delete this review? You can't undo this action.",
              )}
            </p>
            <div className="flex items-center gap-4 w-full font-medium max-sm:flex-col">
              <button onClick={() => setConfirmDelete(null)} className="secondary-btn w-full">
                {t("common.cancel", "Cancel")}
              </button>
              <button
                onClick={handleDelete}
                disabled={busy}
                className="primary-btn bg-base-red hover:bg-red-700 text-white w-full flex justify-center disabled:opacity-50"
              >
                {t("common.delete", "Delete")}
              </button>
            </div>
          </div>
        </ModalLayout>
      )}
    </div>
  );
};

export default ReviewsSection;
