"use client";

import ModalLayout from "@/features/shared/modal-layout";
import { CheckCheck, Loader } from "lucide-react";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";
import React, { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { approveFigure } from "../api/figures";
import { getFigureErrorMessage } from "../api/errors";

const FigureApproveDialog = ({
  show,
  setShow,
  figureId,
}: {
  show: boolean;
  setShow: (value: boolean) => void;
  figureId: string;
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await approveFigure(figureId, tokenStorage.getAccessToken());
      toast.success(t("figures.actions.approvedSuccess", "Figure approved successfully"));
      setShow(false);
      router.refresh();
    } catch (error) {
      toast.error(getFigureErrorMessage(error, t("figures.actions.approveFailed", "Failed to approve figure")));
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;
  return (
    <ModalLayout size="2xl">
      <div className="flex flex-col items-center w-full gap-6">
        <h1 className="font-medium md:text-2xl text-xl">
          {t("figures.actions.approveTitle", "Approve This Figure")}
        </h1>

        <CheckCheck size={72} className="text-gray-txt-50 max-md:hidden" />
        <CheckCheck size={52} className="text-gray-txt-50 md:hidden" />

        <p className="font-medium text-center max-md:text-sm">
          {t(
            "figures.actions.approveBody",
            "Are you sure you want to approve this figure? Kindly confirm before proceeding.",
          )}
        </p>

        <div className="flex items-center gap-4 w-full font-medium max-sm:flex-col">
          <button onClick={() => setShow(false)} className="secondary-btn w-full">
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
              t("figures.actions.approve", "Approve")
            )}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default FigureApproveDialog;
