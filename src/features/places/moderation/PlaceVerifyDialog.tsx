import ModalLayout from "@/features/shared/modal-layout";
import { BadgeCheck, Loader } from "lucide-react";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";
import React, { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { verifyPlace } from "../api/places";
import { getPlaceErrorMessage } from "../api/errors";
import { VERIFICATION_STATUS_OPTIONS } from "../model/filter-options";

const PlaceVerifyDialog = ({
  show,
  setShow,
  placeId,
  current,
}: {
  show: boolean;
  setShow: (value: boolean) => void;
  placeId: string;
  current?: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(current ?? "unverified");
  const router = useRouter();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const handleVerify = async () => {
    setLoading(true);
    try {
      // Verified enum: unverified, community_verified, guono_verified.
      await verifyPlace(placeId, status, tokenStorage.getAccessToken());
      toast.success(t("places.actions.verifiedSuccess", "Place verification updated"));
      setShow(false);
      router.refresh();
    } catch (error) {
      toast.error(getPlaceErrorMessage(error, t("places.actions.verifyFailed", "Failed to verify place")));
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;
  return (
    <ModalLayout size="2xl">
      <div className="flex flex-col items-center w-full gap-6">
        <h1 className="font-medium md:text-2xl text-xl">
          {t("places.actions.verifyTitle", "Verify This Place")}
        </h1>

        <BadgeCheck size={72} className="text-gray-txt-50 max-md:hidden" />
        <BadgeCheck size={52} className="text-gray-txt-50 md:hidden" />

        <p className="font-medium text-center max-md:text-sm">
          {t("places.actions.verifyBody", "Select the verification level for this place.")}
        </p>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="place-verify-status">Verification level</label>
          <select
            id="place-verify-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input h-12 capitalize"
          >
            {VERIFICATION_STATUS_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="text-white bg-secondary-bg"
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4 w-full font-medium max-sm:flex-col">
          <button
            onClick={() => setShow(false)}
            className="secondary-btn w-full"
          >
            {t("common.cancel", "Cancel")}
          </button>
          <button
            onClick={handleVerify}
            className="primary-btn bg-base-green text-white w-full flex justify-center"
            disabled={loading}
          >
            {loading ? (
              <Loader className="animate-spin" />
            ) : (
              t("places.actions.verify", "Verify")
            )}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default PlaceVerifyDialog;
