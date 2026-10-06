import ModalLayout from "@/features/shared/modal-layout";
import { Loader } from "lucide-react";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";
import React, { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { deleteName } from "../api/names";
import { getNamesErrorMessage } from "../api/errors";
import { canDeleteName } from "../api/capabilities";

const DeleteNameDialog = ({
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

    const handleDelete = async () => {
        setLoading(true);
        try {
            // Verified: success is 204 with no body; second delete is 404.
            await deleteName(nameId, tokenStorage.getAccessToken());
            toast.success(t("names.moderation.deletedSuccess", "Name deleted successfully"));
            setShow(false);
            router.push("/guonopedia/names");
        } catch (error) {
            toast.error(getNamesErrorMessage(error, t("names.moderation.deleteFailed", "Failed to delete name")));
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;
    if (!canDeleteName()) return null;
    return (
        <ModalLayout size="2xl">
            <div className="flex flex-col items-center w-full gap-6">
                <h1 className="font-medium md:text-2xl text-xl">
                    {t("names.moderation.deleteTitle", "Delete This Name")}
                </h1>

                <Image src={"/warning-circle.svg"} alt="warning" width={100} height={100} className="w-25 h-25 max-md:w-18 max-md:h-18" />

                <p className="font-medium text-center max-md:text-sm">
                    {t(
                        "names.moderation.deleteBody",
                        "Are you sure you want to delete this name? You can't undo this action.",
                    )}
                </p>

                <div className="flex items-center gap-4 w-full font-medium max-sm:flex-col">
                    <button
                        onClick={() => setShow(false)}
                        className="secondary-btn w-full"
                    >
                        {t("common.cancel", "Cancel")}
                    </button>
                    <button
                        onClick={handleDelete}
                        className="primary-btn bg-base-red hover:bg-red-700 text-white w-full flex justify-center"
                        disabled={loading}
                    >
                        {loading ? <Loader className="animate-spin" /> : <>{t("common.delete", "Delete")} <span className="max-md:hidden">{t("common.name", "Name")}</span></>}
                    </button>
                </div>
            </div>
        </ModalLayout>
    );
};

export default DeleteNameDialog;
