"use client";

import ModalLayout from "@/features/shared/modal-layout";
import { BaseTextArea } from "@/features/shared";
import { Loader, X } from "lucide-react";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";
import React, { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { rejectFigure } from "../api/figures";
import { getFigureErrorMessage } from "../api/errors";
import { validateReason } from "../model/validation";

const FigureRejectDialog = ({
  show,
  setShow,
  figureId,
}: {
  show: boolean;
  setShow: (value: boolean) => void;
  figureId: string;
}) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const handleReject = async () => {
    const key = validateReason(reason);
    if (key) {
      toast.error(t(key, "A reason is required"));
      return;
    }
    setLoading(true);
    try {
      await rejectFigure(figureId, reason.trim(), tokenStorage.getAccessToken());
      toast.success(t("figures.actions.rejectedSuccess", "Figure rejected successfully"));
      setShow(false);
      setReason("");
      router.refresh();
    } catch (error) {
      toast.error(getFigureErrorMessage(error, t("figures.actions.rejectFailed", "Failed to reject figure")));
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;
  return (
    <ModalLayout size="2xl">
      <div className="flex flex-col items-center w-full gap-6">
        <h1 className="font-medium md:text-2xl text-xl">
          {t("figures.actions.rejectTitle", "Reject This Figure")}
        </h1>

        <X size={72} className="text-gray-txt-50 max-md:hidden" />
        <X size={52} className="text-gray-txt-50 md:hidden" />

        <p className="font-medium text-center max-md:text-sm">
          {t(
            "figures.actions.rejectBody",
            "Are you sure you want to reject this figure? You can't undo this action.",
          )}
        </p>

        <div className="w-full">
          <BaseTextArea
            label={t("figures.actions.reasonLabel", "Reason")}
            placeholder={t("figures.actions.reasonPlaceholder", "Enter reason for rejecting")}
            value={reason}
            setValue={setReason}
          />
        </div>

        <div className="flex items-center gap-4 w-full font-medium max-sm:flex-col">
          <button onClick={() => setShow(false)} className="secondary-btn w-full">
            {t("common.cancel", "Cancel")}
          </button>
          <button
            onClick={handleReject}
            className="primary-btn bg-base-red text-white w-full flex justify-center"
            disabled={loading}
          >
            {loading ? <Loader className="animate-spin" /> : t("figures.actions.reject", "Reject")}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default FigureRejectDialog;
