"use client";

import React from "react";
import { Loader } from "lucide-react";
import { ReactNode } from "react";
import { REASON_MAX_LENGTH } from "../../constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ActionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  titleIcon?: ReactNode;
  description?: string;
  showReason?: boolean;
  reasonLabel?: string;
  reasonPlaceholder?: string;
  reason?: string;
  reasonError?: string | null;
  onReasonChange?: (value: string) => void;
  cancelLabel: string;
  confirmLabel: string;
  confirmClassName?: string;
  pending?: boolean;
  onConfirm: () => void;
}

/**
 * Shared confirmation modal for users-list destructive / status-changing
 * actions. Reason entry, validation message, pending states and
 * cancel-locking behave identically across all callers.
 */
export default function ActionModal({
  open,
  onOpenChange,
  title,
  titleIcon,
  description,
  showReason,
  reasonLabel,
  reasonPlaceholder,
  reason = "",
  reasonError,
  onReasonChange,
  cancelLabel,
  confirmLabel,
  confirmClassName,
  pending,
  onConfirm,
}: ActionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1E1E1E] border border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {titleIcon}
            {title}
          </DialogTitle>
        </DialogHeader>
        {description && (
          <p className="text-sm text-gray-400">{description}</p>
        )}
        {showReason && (
          <div className="flex flex-col items-start gap-2">
            {reasonLabel && (
              <label htmlFor="action-modal-reason" className="text-sm text-gray-300">
                {reasonLabel}
              </label>
            )}
            <textarea
              id="action-modal-reason"
              value={reason}
              maxLength={REASON_MAX_LENGTH}
              onChange={(e) => onReasonChange?.(e.target.value)}
              placeholder={reasonPlaceholder}
              rows={4}
              aria-describedby="action-modal-reason-count"
              className="input min-h-24"
            />
            <div className="flex w-full items-center justify-between">
              <span
                id="action-modal-reason-count"
                className="text-xs text-gray-500"
              >
                {reason.length}/{REASON_MAX_LENGTH}
              </span>
              {reasonError && (
                <span role="alert" className="text-sm text-red-400">
                  {reasonError}
                </span>
              )}
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            disabled={pending}
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            disabled={pending}
            onClick={onConfirm}
            className={confirmClassName}
          >
            {pending && <Loader size={16} className="animate-spin mr-2" />}
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
