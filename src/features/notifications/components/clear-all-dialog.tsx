"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface ClearAllDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function ClearAllDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: ClearAllDialogProps) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1E1E1E] border border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>{t("notifications.clearAllConfirm")}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-400">
          {t("notifications.clearAllDescription")}
        </p>
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
          >
            {t("notifications.cancel")}
          </Button>
          <Button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading && <Loader size={16} className="animate-spin mr-2" />}
            {t("notifications.delete")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
