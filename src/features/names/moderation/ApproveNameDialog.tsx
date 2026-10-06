import ModalLayout from "@/features/shared/modal-layout";
import { CheckCheck, Loader } from "lucide-react";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";
import React, { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { approveName } from "../api/names";
import { getNamesErrorMessage } from "../api/errors";
import { canModerateName } from "../api/capabilities";

const ApproveNameDialog = ({
  show,
  setShow,
  nameId,
}: {
  show: boolean;
  setShow: (value: boolean) => void;
  nameId: string;
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const handleApprove = async () => {
    setLoading(true);
    try {
      // Backend state machine (verified): pending → approved (200);
      // repeated approve → 400 "Name is already approved" — surfaced below.
      await approveName(nameId, tokenStorage.getAccessToken());
      toast.success(t("names.moderation.approvedSuccess", "Name approved successfully"));
      setShow(false);
      router.refresh();
    } catch (error) {
      toast.error(getNamesErrorMessage(error, t("names.moderation.approveFailed", "Failed to approve name")));
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;
  if (!canModerateName()) return null;
  return (
    <ModalLayout size="2xl">
      <div className="flex flex-col items-center w-full gap-6">
        <h1 className="font-medium md:text-2xl text-xl">
          {t("names.moderation.approveTitle", "Approve This Name")}
        </h1>

        <CheckCheck size={72} className="text-gray-txt-50 max-md:hidden" />
        <CheckCheck size={52} className="text-gray-txt-50 md:hidden" />

        <p className="font-medium text-center max-md:text-sm">
          {t(
            "names.moderation.approveBody",
            "Are you sure you want to approve this name? Kindly confirm before proceeding.",
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
                {t("common.approve", "Approve")}{" "}
                <span className="max-md:hidden">{t("common.name", "Name")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default ApproveNameDialog;
