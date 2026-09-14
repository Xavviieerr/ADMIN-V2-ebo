"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { getErrorMessage } from "@/utils/errorHandler";
import { useDeleteUserMutation } from "@/slice/requestSlice";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import ActionModal from "./action-modal";

const DeleteUser = ({
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
  const [deleteUserMutation, { isLoading }] = useDeleteUserMutation();

  const handleDelete = async () => {
    try {
      await deleteUserMutation({ userId }).unwrap();
      toast.success(t("messages.userDeletedSuccessToast", "User deleted successfully"));
      setShow(false);
      router.replace("/users");
    } catch (error) {
      toast.error(getErrorMessage(error, t("messages.failedToDeleteUserToast", "Failed to delete user")));
    }
  };

  return (
    <ActionModal
      open={show}
      onOpenChange={setShow}
      title={t("common.deleteUser", "Delete User")}
      titleIcon={<Trash2 className="h-5 w-5 text-red-400" />}
      description={t("common.deleteUserConfirm", "Are you sure you want to delete this user? You can't undo this action.")}
      cancelLabel={t("common.cancel", "Cancel")}
      confirmLabel={t("common.deleteUser", "Delete User")}
      confirmClassName="bg-red-500 hover:bg-red-600 text-white"
      pending={isLoading}
      onConfirm={handleDelete}
    />
  );
};

export default DeleteUser;
