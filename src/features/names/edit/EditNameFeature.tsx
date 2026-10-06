import { GoBackButton, LocaleWrapper } from "@/features/shared";
import React from "react";
import EditNameForm from "./EditNameForm";
import { getServerAccessToken } from "@/features/auth/utils/serverTokenStorage";
import { fetchDialects, fetchSingleName } from "../api";
import { NamesApiError, getNamesErrorMessage } from "../api/errors";
import type { SingleName } from "../model/types";
import { notFound } from "next/navigation";

const EditNameFeature = async ({ nameId }: { nameId: string }) => {
    if (!nameId || typeof nameId !== "string") notFound();

    const token = await getServerAccessToken()

    let dialects: { name: string; id: string }[] | null = null;
    let name: SingleName | null = null;
    try {
        [dialects, name] = await Promise.all([
            fetchDialects(token),
            fetchSingleName(token, nameId),
        ]);
    } catch (error) {
        if (error instanceof NamesApiError && error.isNotFound) notFound();
        if (error instanceof Error && error.message.startsWith("Missing access token")) throw error;
        return (
            <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 text-white">
                <GoBackButton link="/guonopedia/names" />
                <div
                    role="alert"
                    className="dark-box px-4 w-full py-10 flex flex-col items-center gap-3 text-center"
                >
                    <p className="font-medium">
                        <LocaleWrapper
                            item="names.detail.loadFailed"
                            fallback="Failed to load name for editing"
                        />
                    </p>
                    <p className="text-sm text-gray-300">
                        {getNamesErrorMessage(error, "An unexpected error occurred")}
                    </p>
                </div>
            </div>
        );
    }

    if (!name) notFound();

    return (
        <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 text-white">
            <GoBackButton link="/guonopedia/names" />

            <EditNameForm name={name} dialects={dialects ?? []} />
        </div>
    );
};

export default EditNameFeature;
