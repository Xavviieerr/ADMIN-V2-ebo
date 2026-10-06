"use client"
import { CheckCheck, X, Trash2, PenBox } from 'lucide-react';
import { useState } from 'react'
import React from 'react'
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import RejectName from '../moderation/RejectNameDialog';
import DeleteName from '../moderation/DeleteNameDialog';
import ApproveName from '../moderation/ApproveNameDialog';
import Link from 'next/link';

const NameActions = ({ status, nameId }: { status: string, nameId: string }) => {
    const { locale } = useLocale();
    const { t } = useTranslation(locale);
    const [showReject, setShowReject] = useState(false);
    const [showApprove, setShowApprove] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const isPending = (status ?? "").toLowerCase() === "pending";
    return (
        <>
            <div className="md:flex grid grid-cols-2 max-sm:grid-cols-1 justify-end items-center gap-4">

                <Link
                    href={`/guonopedia/names/edit?id=${nameId}`}
                    className="secondary-btn flex items-center gap-3">
                    <PenBox strokeWidth={1.4} size={16} />
                    {t("common.edit", "Edit")}
                </Link>

                {isPending && <button
                    onClick={() => setShowApprove(true)}
                    className="primary-btn bg-base-green text-white flex items-center gap-2">
                    <CheckCheck strokeWidth={1.4} size={18} />
                    {t("common.approve", "Approve")}
                </button>}

                {isPending && <button
                    onClick={() => setShowReject(true)}
                    className="primary-btn bg-base-red text-white flex items-center gap-2">
                    <X strokeWidth={1.4} size={18} />
                    {t("common.dictionary.reject", "Reject")}
                </button>}

                <button
                    onClick={() => setShowDelete(true)}
                    className="primary-btn items-center bg-white text-base-red flex gap-2">
                    <Trash2 strokeWidth={1.7} size={18} />
                    {t("common.delete", "Delete")}
                </button>
            </div>

            <ApproveName
                nameId={nameId}
                show={showApprove}
                setShow={setShowApprove}
            />

            <RejectName
                nameId={nameId}
                show={showReject}
                setShow={setShowReject}
            />

            <DeleteName
                nameId={nameId}
                show={showDelete}
                setShow={setShowDelete}
            />
        </>
    )
}

export default NameActions