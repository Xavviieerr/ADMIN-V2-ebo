"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Ban } from "lucide-react";
import { getErrorMessage } from "@/utils/errorHandler";
import {
  useRestrictUserMutation,
  useUnrestrictUserMutation,
} from "@/slice/requestSlice";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { reasonSchema } from "../../schemas/userActions";
import ActionModal from "./action-modal";

const SuspendUser = ({
  show,
  setShow,
  isSuspended,
  userId,
}: {
  show: boolean;
  setShow: (value: boolean) => void;
  isSuspended: boolean;
  userId: string;
}) => {
  const router = useRouter();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [restrictUser, { isLoading: isRestricting }] = useRestrictUserMutation();
  const [unrestrictUser, { isLoading: isUnrestricting }] = useUnrestrictUserMutation();
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState<string | null>(null);

  const isLoading = isSuspended ? isUnrestricting : isRestricting;

  if (isSuspended) {
    return (
      <ActionModal
        open={show}
        onOpenChange={setShow}
        title={t("common.removeSuspension", "Remove User Suspension")}
        titleIcon={<Ban className="h-5 w-5 text-green-400" />}
        description={t("common.removeSuspensionConfirm", "Are you sure you want to remove this user's suspension?")}
        cancelLabel={t("common.cancel", "Cancel")}
        confirmLabel={t("common.removeSuspension", "Remove Suspension")}
        confirmClassName="bg-green-600 hover:bg-green-700 text-white"
        pending={isLoading}
        onConfirm={async () => {
          try {
            await unrestrictUser({ userId }).unwrap();
            toast.success(t("messages.suspensionRemovedSuccessToast", "User suspension removed successfully"));
            setShow(false);
            router.refresh();
          } catch (error) {
            toast.error(getErrorMessage(error, t("messages.failedToRemoveSuspensionToast", "Failed to remove user suspension")));
          }
        }}
      />
    );
  }

  const handleSuspend = async () => {
    const result = reasonSchema.safeParse({ reason });
    if (!result.success) {
      setReasonError(result.error.issues[0]?.message || t("common.pleaseProvideReason", "Please provide a reason"));
      return;
    }
    setReasonError(null);

    try {
      await restrictUser({ userId, suspensionReason: reason.trim() }).unwrap();
      toast.success(t("messages.userSuspendedSuccessToast", "User suspended successfully"));
      setShow(false);
      setReason("");
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error, t("messages.failedToSuspendUserToast", "Failed to suspend user")));
    }
  };

  return (
    <ActionModal
      open={show}
      onOpenChange={setShow}
      title={t("common.suspendUser", "Suspend User")}
      titleIcon={<Ban className="h-5 w-5 text-red-400" />}
      description={t("common.suspendUserConfirm", "Are you sure you want to suspend this user?")}
      showReason
      reasonLabel={t("common.reason", "Reason")}
      reasonPlaceholder={t("common.enterReasonSuspend", "Enter reason for suspending user")}
      reason={reason}
      reasonError={reasonError}
      onReasonChange={(val) => {
        setReason(val);
        if (reasonError) setReasonError(null);
      }}
      cancelLabel={t("common.cancel", "Cancel")}
      confirmLabel={t("common.suspendUser", "Suspend User")}
      confirmClassName="bg-red-500 hover:bg-red-600 text-white"
      pending={isLoading}
      onConfirm={handleSuspend}
    />
  );
};

export default SuspendUser;
