import { GoBackButton, SingleName } from "@/features/shared";
import React from "react";
import { EditNameForm } from "./components";
import { getServerAccessToken } from "@/features/auth/utils/serverTokenStorage";
import { fetchDialects, fetchSingleName } from "./lib/api";


const EditNameFeature = async ({ nameId }: { nameId: string }) => {

    const token = await getServerAccessToken()

    const dialects = await fetchDialects({ token: token as string });


    const name: SingleName = await fetchSingleName({ token: token as string, id: nameId });
    return (
        <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 text-white">
            <GoBackButton />

            <EditNameForm name={name} dialects={dialects} />
        </div>
    );
};

export default EditNameFeature;
