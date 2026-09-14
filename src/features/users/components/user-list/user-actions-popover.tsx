"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { MoreVertical, EyeIcon, Trash2 } from "lucide-react";

type UserActionsPopoverProps = {
  userId: string;
  userRole: string;
  isSuperAdmin: boolean;
  hasPermission: (permission: string) => boolean;
  handleViewUser: (id: string) => void;
  handleDelete: (id: string) => void;
  onClick?: (e: React.MouseEvent) => void;
};

const UserActionsPopover = ({
  userId,
  userRole,
  isSuperAdmin,
  hasPermission,
  handleViewUser,
  handleDelete,
  onClick,
}: UserActionsPopoverProps) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const canDelete =
    (isSuperAdmin || hasPermission("delete_user")) &&
    (userRole === "user" || userRole === "admin");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-[#333]"
          title={t("common.actions", "Actions")}
          aria-label={t("common.actions", "Actions")}
          onClick={onClick}
        >
          <MoreVertical className="h-4 w-4 text-gray-300" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="bg-[#1e1e1e] border border-gray-700 p-2 w-48"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            className="text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 rounded-md flex items-center gap-2 justify-start h-auto"
            onClick={() => handleViewUser(userId)}
          >
            <EyeIcon className="h-4 w-4" />
            {t("common.viewProfile")}
          </Button>

          {canDelete && (
            <Button
              variant="ghost"
              className="text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-md flex items-center gap-2 justify-start h-auto"
              onClick={() => handleDelete(userId)}
            >
              <Trash2 className="h-4 w-4" />
              {t("common.delete", "Delete")}
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserActionsPopover;
