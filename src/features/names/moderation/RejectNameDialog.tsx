import ModalLayout from "@/features/shared/modal-layout";
import { Loader } from "lucide-react";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";
import React, { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { rejectName } from "../api/names";
import { getNamesErrorMessage } from "../api/errors";
import { canModerateName } from "../api/capabilities";

const RejectNameDialog = ({
    show,
    setShow,
    nameId,
}: {
    show: boolean;
    setShow: (value: boolean) => void;
    nameId: string;
}) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { locale } = useLocale();
    const { t } = useTranslation(locale);

    const [rejectReason, setRejectReason] = useState("");

    const handleReject = async () => {
        // Backend requires a non-empty reason (verified 400 on {}) and accepts
        // short reasons (verified 200 on 2 chars) — no invented length rule.
        if (rejectReason.trim() === "") {
            toast.error(t("names.moderation.reasonRequired", "Reason for rejection is required"));
            return;
        }
        setLoading(true);
        try {
            // Verified: pending → rejected (200); repeated reject → 400
            // "Name is already rejected" — surfaced below, not swallowed.
            await rejectName(nameId, rejectReason.trim(), tokenStorage.getAccessToken());
            toast.success(t("names.moderation.rejectedSuccess", "Name rejected successfully"));
            setShow(false);
            router.refresh();
        } catch (error) {
            toast.error(getNamesErrorMessage(error, t("names.moderation.rejectFailed", "Failed to reject name")));
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;
    if (!canModerateName()) return null;
    return (
        <ModalLayout size="2xl">
            <div className="flex flex-col items-center w-full">
                <h1 className="font-semibold md:text-2xl text-xl">
                    {t("names.moderation.rejectTitle", "Reject Name")}
                </h1>
                <p className="font-medium mt-3 text-center max-md:text-sm">
                    {t(
                        "names.moderation.rejectBody",
                        "Are you sure you want to reject this name? You can't undo this action.",
                    )}
                </p>

                <div className="mt-5 w-full">
                    <label htmlFor="reject-reason" className="block text-sm font-medium mb-2">
                        {t("names.moderation.reasonLabel", "Reason")}
                    </label>
                    <textarea
                        id="reject-reason"
                        rows={4}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="input resize-none w-full"
                        placeholder={t("names.moderation.reasonPlaceholder", "Enter reason for rejecting name")}
                    ></textarea>
                </div>

                <div className="flex items-center gap-4 w-full mt-5 font-medium max-sm:flex-col">
                    <button
                        onClick={() => setShow(false)}
                        className="secondary-btn w-full"
                    >
                        {t("common.cancel", "Cancel")}
                    </button>
                    <button
                        onClick={handleReject}
                        className="primary-btn bg-base-red hover:bg-red-700 text-white w-full flex justify-center"
                        disabled={loading}
                    >
                        {loading ? <Loader className="animate-spin" /> : <>{t("common.dictionary.reject", "Reject")} <span className="max-md:hidden">{t("common.name", "Name")}</span></>}
                    </button>
                </div>
            </div>
        </ModalLayout>
    );
};

export default RejectNameDialog;
