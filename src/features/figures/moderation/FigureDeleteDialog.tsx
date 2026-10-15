"use client";

import ModalLayout from "@/features/shared/modal-layout";
import { Loader, Trash2 } from "lucide-react";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";
import React, { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteFigure } from "../api/figures";
import { getFigureErrorMessage } from "../api/errors";

const FigureDeleteDialog = ({
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

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteFigure(figureId, tokenStorage.getAccessToken());
      toast.success(t("figures.actions.deletedSuccess", "Figure deleted successfully"));
      setShow(false);
      router.push("/guonopedia/figures");
      router.refresh();
    } catch (error) {
      toast.error(getFigureErrorMessage(error, t("figures.actions.deleteFailed", "Failed to delete figure")));
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;
  return (
    <ModalLayout size="2xl">
      <div className="flex flex-col items-center w-full gap-6">
        <h1 className="font-medium md:text-2xl text-xl">
          {t("figures.actions.deleteTitle", "Delete This Figure")}
        </h1>

        <Trash2 size={72} className="text-gray-txt-50 max-md:hidden" />
        <Trash2 size={52} className="text-gray-txt-50 md:hidden" />

        <p className="font-medium text-center max-md:text-sm">
          {t(
            "figures.actions.deleteBody",
            "Are you sure you want to delete this figure? You can't undo this action.",
          )}
        </p>

        <div className="flex items-center gap-4 w-full font-medium max-sm:flex-col">
          <button onClick={() => setShow(false)} className="secondary-btn w-full">
            {t("common.cancel", "Cancel")}
          </button>
          <button
            onClick={handleDelete}
            className="primary-btn bg-base-red text-white w-full flex justify-center"
            disabled={loading}
          >
            {loading ? <Loader className="animate-spin" /> : t("common.delete", "Delete")}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default FigureDeleteDialog;
