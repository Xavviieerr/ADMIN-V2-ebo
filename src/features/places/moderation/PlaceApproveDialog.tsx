import ModalLayout from "@/features/shared/modal-layout";
import { CheckCheck, Loader } from "lucide-react";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";
import React, { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { approvePlace } from "../api/places";
import { getPlaceErrorMessage } from "../api/errors";

const PlaceApproveDialog = ({
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

  const handleApprove = async () => {
    setLoading(true);
    try {
      // Verified: pending → approved (200); repeated approve surfaces below.
      await approvePlace(placeId, tokenStorage.getAccessToken());
      toast.success(t("places.actions.approvedSuccess", "Place approved successfully"));
      setShow(false);
      router.refresh();
    } catch (error) {
      toast.error(getPlaceErrorMessage(error, t("places.actions.approveFailed", "Failed to approve place")));
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;
  return (
    <ModalLayout size="2xl">
      <div className="flex flex-col items-center w-full gap-6">
        <h1 className="font-medium md:text-2xl text-xl">
          {t("places.actions.approveTitle", "Approve This Place")}
        </h1>

        <CheckCheck size={72} className="text-gray-txt-50 max-md:hidden" />
        <CheckCheck size={52} className="text-gray-txt-50 md:hidden" />

        <p className="font-medium text-center max-md:text-sm">
          {t(
            "places.actions.approveBody",
            "Are you sure you want to approve this place? Kindly confirm before proceeding.",
          )}
        </p>

        <div className="flex items-center gap-4 w-full font-medium max-sm:flex-col">
          <button
            onClick={() => setShow(false)}
            className="secondary-btn w-full"
          >
            {t("common.cancel", "Cancel")}
          </button>
          <button
            onClick={handleApprove}
            className="primary-btn bg-base-green text-white w-full flex justify-center"
            disabled={loading}
          >
            {loading ? (
              <Loader className="animate-spin" />
            ) : (
              <>
                {t("places.actions.approve", "Approve")}{" "}
                <span className="max-md:hidden">{t("places.placeLabel", "Place")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default PlaceApproveDialog;
