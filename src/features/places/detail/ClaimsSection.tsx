"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BaseTextArea, ErrorWidget, PermissionGate } from "@/features/shared";
import ModalLayout from "@/features/shared/modal-layout";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";
import type { OwnershipClaim } from "../model/types";
import { approveClaim, fetchClaims, rejectClaim } from "../api/places";
import { getPlaceErrorMessage } from "../api/errors";
import { PLACE_VALIDATION_EN, validateReason } from "../model/validation";

// Ownership-claims queue scoped to one business profile. Claims attach to
// profiles (verified), so this section only renders with a profile id and
// filters the supported status listings down to this profile.
const CLAIM_STATUSES = ["pending", "approved", "rejected"] as const;

const ClaimsSection = ({
  profileId,
  hasProfile,
}: {
  profileId: string | null;
  hasProfile: boolean;
}) => {
  const router = useRouter();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const [claims, setClaims] = useState<OwnershipClaim[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmApprove, setConfirmApprove] = useState<OwnershipClaim | null>(null);
  const [rejecting, setRejecting] = useState<OwnershipClaim | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    if (!profileId) return;
    setLoading(true);
    setError("");
    try {
      const token = tokenStorage.getAccessToken();
      const pages = await Promise.all(
        CLAIM_STATUSES.map((status) => fetchClaims({ status, limit: 50 }, token)),
      );
      const mine = pages
        .flatMap((page) => page.items ?? [])
        .filter((claim) => claim.businessProfileId === profileId);
      // De-duplicate across listings by claim id.
      const seen = new Set<string>();
      setClaims(mine.filter((claim) => (seen.has(claim.id) ? false : (seen.add(claim.id), true))));
    } catch (err) {
      setError(getPlaceErrorMessage(err, "Failed to load claims"));
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (hasProfile && profileId) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId, hasProfile]);

  const handleApprove = async () => {
    if (!confirmApprove || busy) return;
    setError("");
    setBusy(true);
    try {
      // Verified live: approval assigns ownership (ownerId/isClaimed).
      await approveClaim(confirmApprove.id, tokenStorage.getAccessToken());
      toast.success(t("places.actions.claimApproved", "Claim approved successfully"));
      setConfirmApprove(null);
      await load();
      router.refresh();
    } catch (err) {
      const msg = getPlaceErrorMessage(err, t("places.actions.claimApproveFailed", "Failed to approve claim"));
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async () => {
    if (!rejecting || busy) return;
    const reasonError = validateReason(reason);
    if (reasonError) {
      setError(t(reasonError, PLACE_VALIDATION_EN[reasonError] ?? reasonError));
      return;
    }
    setError("");
    setBusy(true);
    try {
      await rejectClaim(rejecting.id, reason.trim(), tokenStorage.getAccessToken());
      toast.success(t("places.actions.claimRejected", "Claim rejected successfully"));
      setRejecting(null);
      setReason("");
      await load();
      router.refresh();
    } catch (err) {
      const msg = getPlaceErrorMessage(err, t("places.actions.claimRejectFailed", "Failed to reject claim"));
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  if (!hasProfile || !profileId) return null;

  return (
    <div className="flex flex-col md:px-8 px-4 py-6 gap-4 bg-gray-txt-100 rounded-md w-full">
      <div className="flex items-center gap-3 text-base font-medium">
        <div className="h-3 w-3 rounded-full bg-yellow-600" />
        <h2>
          {t("places.detail.claimsTitle", "Ownership Claims")}
        </h2>
      </div>

      <ErrorWidget message={error} action={() => setError("")} />

      {loading || claims === null ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : claims.length === 0 ? (
        <p className="text-sm text-gray-400">
          {t("places.detail.noClaims", "No ownership claims")}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {claims.map((claim) => (
            <li
              key={claim.id}
              className="flex flex-col gap-2 border border-white/10 rounded-lg px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1 min-w-0">
                  <p className="text-sm font-medium">
                    {claim.user?.username ?? claim.user?.email ?? claim.userId}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">Status: {claim.status}</p>
                </div>
                {claim.status === "pending" && (
                  <div className="flex items-center gap-2 shrink-0">
                    <PermissionGate permission="moderate_place">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setConfirmApprove(claim)}
                        className="secondary-btn py-1.5 px-4 text-sm disabled:opacity-50"
                      >
                        {t("places.actions.approve", "Approve")}
                      </button>
                    </PermissionGate>
                    <PermissionGate permission="moderate_place">
                      <button
                        type="button"
                        onClick={() => {
                          setRejecting(claim);
                          setReason("");
                        }}
                        className="secondary-btn py-1.5 px-4 text-sm hover:border-base-red! hover:text-base-red!"
                      >
                        {t("places.actions.reject", "Reject")}
                      </button>
                    </PermissionGate>
                  </div>
                )}
              </div>
              {claim.note && <p className="text-sm text-gray-300">{claim.note}</p>}
              {(claim.proofDocuments ?? []).length > 0 && (
                <p className="text-xs text-gray-400">
                  Proofs: {claim.proofDocuments!.join(", ")}
                </p>
              )}
              {claim.rejectionReason && (
                <p className="text-xs text-red-400">Rejected: {claim.rejectionReason}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      {rejecting && (
        <ModalLayout size="xl">
          <div className="flex flex-col items-center w-full gap-6">
            <h1 className="font-medium md:text-2xl text-xl">
              {t("places.actions.claimRejectTitle", "Reject Ownership Claim")}
            </h1>
            <p className="font-medium text-center max-md:text-sm">
              {t("places.actions.claimRejectBody", "Reject this claim? A reason is required.")}
            </p>
            <div className="w-full">
              <BaseTextArea
                label={t("places.actions.reasonLabel", "Reason")}
                rows={3}
                placeholder={t("places.actions.reasonPlaceholder", "Enter reason for rejecting")}
                value={reason}
                setValue={(v) => setReason(v)}
              />
            </div>
            <div className="flex items-center gap-4 w-full font-medium max-sm:flex-col">
              <button
                onClick={() => {
                  setRejecting(null);
                  setReason("");
                }}
                className="secondary-btn w-full"
              >
                {t("common.cancel", "Cancel")}
              </button>
              <button
                onClick={handleReject}
                disabled={busy}
                className="primary-btn bg-base-red hover:bg-red-700 text-white w-full flex justify-center disabled:opacity-50"
              >
                {t("places.actions.reject", "Reject")}
              </button>
            </div>
          </div>
        </ModalLayout>
      )}

      {confirmApprove && (
        <ModalLayout size="xl">
          <div className="flex flex-col items-center w-full gap-6">
            <h1 className="font-medium md:text-2xl text-xl">
              {t("places.actions.claimApproveTitle", "Approve Ownership Claim")}
            </h1>
            <p className="font-medium text-center max-md:text-sm">
              {t(
                "places.actions.claimApproveBody",
                "Approve this claim? Ownership of the business profile will be assigned to the claimant.",
              )}
            </p>
            <div className="flex items-center gap-4 w-full font-medium max-sm:flex-col">
              <button onClick={() => setConfirmApprove(null)} className="secondary-btn w-full">
                {t("common.cancel", "Cancel")}
              </button>
              <button
                onClick={handleApprove}
                disabled={busy}
                className="primary-btn w-full flex justify-center disabled:opacity-50"
              >
                {t("places.actions.approve", "Approve")}
              </button>
            </div>
          </div>
        </ModalLayout>
      )}
    </div>
  );
};

export default ClaimsSection;
