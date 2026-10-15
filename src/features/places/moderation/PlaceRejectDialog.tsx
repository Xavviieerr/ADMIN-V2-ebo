import ModalLayout from "@/features/shared/modal-layout";
import { Loader } from "lucide-react";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";
import React, { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { rejectPlace } from "../api/places";
import { getPlaceErrorMessage } from "../api/errors";

const PlaceRejectDialog = ({
  show,
  setShow,
  placeId,
}: {
  show: boolean;
  setShow: (value: boolean) => void;
  placeId: string;
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const [rejectReason, setRejectReason] = useState("");

  const handleReject = async () => {
    // Backend requires a non-empty reason (verified 400 on {}) — no
    // invented length rule.
    if (rejectReason.trim() === "") {
      toast.error(t("places.actions.reasonRequired", "A reason is required"));
      return;
    }
    setLoading(true);
    try {
      await rejectPlace(placeId, rejectReason.trim(), tokenStorage.getAccessToken());
      toast.success(t("places.actions.rejectedSuccess", "Place rejected successfully"));
      setShow(false);
      router.refresh();
    } catch (error) {
      toast.error(getPlaceErrorMessage(error, t("places.actions.rejectFailed", "Failed to reject place")));
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;
  return (
    <ModalLayout size="2xl">
      <div className="flex flex-col items-center w-full">
        <h1 className="font-semibold md:text-2xl text-xl">
          {t("places.actions.rejectTitle", "Reject This Place")}
        </h1>
        <p className="font-medium mt-3 text-center max-md:text-sm">
          {t(
            "places.actions.rejectBody",
            "Are you sure you want to reject this place? You can't undo this action.",
          )}
        </p>

        <div className="mt-5 w-full">
          <label htmlFor="place-reject-reason" className="block text-sm font-medium mb-2">
            {t("places.actions.reasonLabel", "Reason")}
          </label>
          <textarea
            id="place-reject-reason"
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder={t("places.actions.reasonPlaceholder", "Enter reason for rejecting")}
            className="input resize-none w-full"
          />
        </div>

        <div className="flex items-center gap-4 w-full font-medium max-sm:flex-col mt-6">
          <button
            onClick={() => setShow(false)}
            className="secondary-btn w-full"
          >
            {t("common.cancel", "Cancel")}
          </button>
          <button
            onClick={handleReject}
            className="primary-btn bg-base-red text-white w-full flex justify-center"
            disabled={loading}
          >
            {loading ? (
              <Loader className="animate-spin" />
            ) : (
              t("places.actions.reject", "Reject")
            )}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default PlaceRejectDialog;
