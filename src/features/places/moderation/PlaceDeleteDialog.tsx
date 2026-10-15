import ModalLayout from "@/features/shared/modal-layout";
import { Loader, Trash2 } from "lucide-react";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";
import React, { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deletePlace } from "../api/places";
import { getPlaceErrorMessage } from "../api/errors";

const PlaceDeleteDialog = ({
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

  const handleDelete = async () => {
    setLoading(true);
    try {
      // Verified: 204 with an empty body on success.
      await deletePlace(placeId, tokenStorage.getAccessToken());
      toast.success(t("places.actions.deletedSuccess", "Place deleted successfully"));
      setShow(false);
      router.replace("/guonopedia/places");
    } catch (error) {
      toast.error(getPlaceErrorMessage(error, t("places.actions.deleteFailed", "Failed to delete place")));
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;
  return (
    <ModalLayout size="2xl">
      <div className="flex flex-col items-center w-full gap-6">
        <h1 className="font-medium md:text-2xl text-xl">
          {t("places.actions.deleteTitle", "Delete This Place")}
        </h1>

        <Trash2 size={72} className="text-gray-txt-50 max-md:hidden" />
        <Trash2 size={52} className="text-gray-txt-50 md:hidden" />

        <p className="font-medium text-center max-md:text-sm">
          {t(
            "places.actions.deleteBody",
            "Are you sure you want to delete this place? You can't undo this action.",
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
            onClick={handleDelete}
            className="primary-btn bg-base-red text-white w-full flex justify-center"
            disabled={loading}
          >
            {loading ? (
              <Loader className="animate-spin" />
            ) : (
              <>
                {t("common.delete", "Delete")}{" "}
                <span className="max-md:hidden">{t("places.placeLabel", "Place")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default PlaceDeleteDialog;
