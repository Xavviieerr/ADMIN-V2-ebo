import { useState } from "react";
import { useDeleteUserMutation } from "@/slice/requestSlice";
import { getErrorMessage } from "@/utils/errorHandler";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocale } from "@/contexts/LocaleContext";
import { toast } from "sonner";

export function useDeleteConfirmation() {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [removeUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleDelete = (userId: string) => {
    setSelectedUserId(userId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedUserId) return;
    try {
      await removeUser({ userId: selectedUserId }).unwrap();
      toast.success(t("messages.deletedSuccessfully", "Deleted successfully"));
      setShowDeleteModal(false);
      setSelectedUserId(null);
    } catch (error) {
      toast.error(
        getErrorMessage(error, t("messages.failedToDelete", "Failed to delete")),
      );
    }
  };

  return {
    showDeleteModal,
    setShowDeleteModal,
    isDeleting,
    handleDelete,
    confirmDelete,
  };
}
