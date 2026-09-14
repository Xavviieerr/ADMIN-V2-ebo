"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ShieldX } from "lucide-react";
import { getErrorMessage } from "@/utils/errorHandler";
import { useRejectUserMutation } from "@/slice/requestSlice";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { reasonSchema } from "../../schemas/userActions";
import ActionModal from "./action-modal";

const RejectUser = ({
  show,
  setShow,
  userId,
}: {
  show: boolean;
  setShow: (value: boolean) => void;
  userId: string;
}) => {
  const router = useRouter();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [rejectUserMutation, { isLoading }] = useRejectUserMutation();
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState<string | null>(null);

  const handleReject = async () => {
    const result = reasonSchema.safeParse({ reason });
    if (!result.success) {
      setReasonError(result.error.issues[0]?.message || t("common.pleaseProvideReason", "Please provide a reason"));
      return;
    }
    setReasonError(null);

    try {
      await rejectUserMutation({ userId, rejectionReason: reason.trim() }).unwrap();
      toast.success(t("messages.userRejectedSuccessToast", "User rejected successfully"));
      setShow(false);
      setReason("");
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error, t("messages.failedToRejectUserToast", "Failed to reject user")));
    }
  };

  return (
    <ActionModal
      open={show}
      onOpenChange={setShow}
      title={t("common.rejectUser", "Reject User")}
      titleIcon={<ShieldX className="h-5 w-5 text-red-400" />}
      description={t("common.rejectUserConfirm", "Are you sure you want to reject this user?")}
      showReason
      reasonLabel={t("common.reason", "Reason")}
      reasonPlaceholder={t("common.enterReasonReject", "Enter reason for rejecting user")}
      reason={reason}
      reasonError={reasonError}
      onReasonChange={(val) => {
        setReason(val);
        if (reasonError) setReasonError(null);
      }}
      cancelLabel={t("common.cancel", "Cancel")}
      confirmLabel={t("common.rejectUser", "Reject User")}
      confirmClassName="bg-red-500 hover:bg-red-600 text-white"
      pending={isLoading}
      onConfirm={handleReject}
    />
  );
};

export default RejectUser;
