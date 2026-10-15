"use client";
import { CheckCheck, X, Trash2, PenBox } from "lucide-react";
import { useState } from "react";
import React from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { PermissionGate } from "@/features/shared";
import Link from "next/link";
import FigureApproveDialog from "../moderation/FigureApproveDialog";
import FigureRejectDialog from "../moderation/FigureRejectDialog";
import FigureDeleteDialog from "../moderation/FigureDeleteDialog";

const FigureActions = ({ status, figureId }: { status: string; figureId: string }) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [showReject, setShowReject] = useState(false);
  const [showApprove, setShowApprove] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const isPending = (status ?? "").toLowerCase() === "pending";
  return (
    <>
      <div className="md:flex grid grid-cols-2 max-sm:grid-cols-1 justify-end items-center gap-4">
        <PermissionGate permission="edit_figure">
          <Link
            href={`/guonopedia/figures/${figureId}/edit`}
            className="secondary-btn flex items-center gap-3"
          >
            <PenBox strokeWidth={1.4} size={16} />
            {t("figures.actions.edit", "Edit")}
          </Link>
        </PermissionGate>

        {isPending && (
          <PermissionGate permission="moderate_figure">
            <button
              onClick={() => setShowApprove(true)}
              className="primary-btn bg-base-green text-white flex items-center gap-2"
            >
              <CheckCheck strokeWidth={1.4} size={18} />
              {t("figures.actions.approve", "Approve")}
            </button>
          </PermissionGate>
        )}

        {isPending && (
          <PermissionGate permission="moderate_figure">
            <button
              onClick={() => setShowReject(true)}
              className="primary-btn bg-base-red text-white flex items-center gap-2"
            >
              <X strokeWidth={1.4} size={18} />
              {t("figures.actions.reject", "Reject")}
            </button>
          </PermissionGate>
        )}

        <PermissionGate permission="delete_figure">
          <button
            onClick={() => setShowDelete(true)}
            className="primary-btn items-center bg-white text-base-red flex gap-2"
          >
            <Trash2 strokeWidth={1.7} size={18} />
            {t("common.delete", "Delete")}
          </button>
        </PermissionGate>
      </div>

      <FigureApproveDialog figureId={figureId} show={showApprove} setShow={setShowApprove} />

      <FigureRejectDialog figureId={figureId} show={showReject} setShow={setShowReject} />

      <FigureDeleteDialog figureId={figureId} show={showDelete} setShow={setShowDelete} />
    </>
  );
};

export default FigureActions;
