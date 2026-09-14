"use client";

import { LocaleWrapper, PermissionGate } from "@/features/shared";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";
import { useApproveAdminMutation } from "@/slice/requestSlice";
import { useParamUserId } from "../../hooks/useParamUserId";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import ActionModal from "./action-modal";

const ApproveBtn = ({ status }: { status: string }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const router = useRouter();
  const userId = useParamUserId();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [approveAdmin, { isLoading }] = useApproveAdminMutation();

  if (status !== "pending") return null;

  const handleApprove = async () => {
    try {
      await approveAdmin({ userId }).unwrap();
      toast.success(t("messages.adminApprovedSuccessToast", "Admin approved successfully"));
      setConfirmOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error, t("messages.failedToApproveAdminToast", "Failed to approve admin")));
    }
  };

  return (
    <PermissionGate permission="edit_user">
      <button
        onClick={() => setConfirmOpen(true)}
        className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-medium text-base rounded-md transition-colors flex items-center gap-2"
      >
        <LocaleWrapper item="common.approveUser" />
      </button>
      <ActionModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t("common.approveAdmin", "Approve Admin?")}
        description={t("common.approveAdminConfirm", "This admin will gain access to the dashboard.")}
        cancelLabel={t("common.cancel", "Cancel")}
        confirmLabel={t("common.approve", "Approve")}
        confirmClassName="bg-green-600 hover:bg-green-700 text-white"
        pending={isLoading}
        onConfirm={handleApprove}
      />
    </PermissionGate>
  );
};

export default ApproveBtn;
