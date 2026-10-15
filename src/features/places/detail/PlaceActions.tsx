"use client";
import { CheckCheck, X, Trash2, PenBox, BadgeCheck } from 'lucide-react';
import { useState } from 'react'
import React from 'react'
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { PermissionGate } from "@/features/shared";
import Link from 'next/link';
import PlaceApproveDialog from '../moderation/PlaceApproveDialog';
import PlaceRejectDialog from '../moderation/PlaceRejectDialog';
import PlaceVerifyDialog from '../moderation/PlaceVerifyDialog';
import PlaceDeleteDialog from '../moderation/PlaceDeleteDialog';

// Action row for a place. Every action is permission-gated; the backend
// remains authoritative and 403s surface as toasts from the dialogs.
const PlaceActions = ({ status, placeId, verificationStatus }: { status: string, placeId: string, verificationStatus?: string }) => {
    const { locale } = useLocale();
    const { t } = useTranslation(locale);
    const [showReject, setShowReject] = useState(false);
    const [showApprove, setShowApprove] = useState(false);
    const [showVerify, setShowVerify] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const isPending = (status ?? "").toLowerCase() === "pending";
    return (
        <>
            <div className="md:flex grid grid-cols-2 max-sm:grid-cols-1 justify-end items-center gap-4">

                <PermissionGate permission="edit_place">
                    <Link
                        href={`/guonopedia/places/${placeId}/edit`}
                        className="secondary-btn flex items-center gap-3">
                        <PenBox strokeWidth={1.4} size={16} />
                        {t("places.actions.edit", "Edit")}
                    </Link>
                </PermissionGate>

                {isPending && (
                    <PermissionGate permission="moderate_place">
                        <button
                            onClick={() => setShowApprove(true)}
                            className="primary-btn bg-base-green text-white flex items-center gap-2">
                            <CheckCheck strokeWidth={1.4} size={18} />
                            {t("places.actions.approve", "Approve")}
                        </button>
                    </PermissionGate>
                )}

                {isPending && (
                    <PermissionGate permission="moderate_place">
                        <button
                            onClick={() => setShowReject(true)}
                            className="primary-btn bg-base-red text-white flex items-center gap-2">
                            <X strokeWidth={1.4} size={18} />
                            {t("places.actions.reject", "Reject")}
                        </button>
                    </PermissionGate>
                )}

                <PermissionGate permission="edit_place">
                    <button
                        onClick={() => setShowVerify(true)}
                        className="secondary-btn flex items-center gap-3">
                        <BadgeCheck strokeWidth={1.4} size={16} />
                        {t("places.actions.verify", "Verify")}
                    </button>
                </PermissionGate>

                <PermissionGate permission="delete_place">
                    <button
                        onClick={() => setShowDelete(true)}
                        className="primary-btn items-center bg-white text-base-red flex gap-2">
                        <Trash2 strokeWidth={1.7} size={18} />
                        {t("common.delete", "Delete")}
                    </button>
                </PermissionGate>
            </div>

            <PlaceApproveDialog
                placeId={placeId}
                show={showApprove}
                setShow={setShowApprove}
            />

            <PlaceRejectDialog
                placeId={placeId}
                show={showReject}
                setShow={setShowReject}
            />

            <PlaceVerifyDialog
                placeId={placeId}
                show={showVerify}
                setShow={setShowVerify}
                current={verificationStatus}
            />

            <PlaceDeleteDialog
                placeId={placeId}
                show={showDelete}
                setShow={setShowDelete}
            />
        </>
    )
}

export default PlaceActions
