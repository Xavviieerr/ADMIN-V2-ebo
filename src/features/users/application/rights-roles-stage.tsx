import { ContributorApplicationStage } from "@/features/shared";
import Link from "next/link";
import React from "react";
import { ProofOfRightsForm, RoleSelect, SignatureForm } from "./components";

const RightsRolesStage = ({
  stage,
  userId,
}: {
  stage: ContributorApplicationStage;
  userId: string;
}) => {
  return (
    <>
      {stage === "rightsRoles" && (
        <div className="dark-box w-full">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-white font-medium text-lg">
              2. Roles & Copyrights
            </h2>

            <div className="flex items-center gap-4">
              <Link
                href={`/users/${userId}/application`}
                className="primary-btn font-medium"
              >
                Done
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 w-full gap-6  mt-8">
            <div className="flex flex-col w-full gap-4">
              <div className=" flex flex-col px-8 py-6 bg-gray-txt-100 rounded-md w-full">
                <div className="flex items-center gap-3 text-base font-medium">
                  <div className="h-3 w-3 rounded-full bg-yellow-600" />
                  <h2>Your Role in This Music</h2>
                </div>

                <RoleSelect />
              </div>

              <div className=" flex flex-col px-8 py-6 bg-gray-txt-100 rounded-md w-full">
                <div className="flex items-center gap-3 text-base font-medium">
                  <div className="h-3 w-3 rounded-full bg-yellow-600" />
                  <h2>Digital Signature Section</h2>
                </div>

                <SignatureForm />
              </div>
            </div>

            <ProofOfRightsForm />
          </div>
        </div>
      )}
    </>
  );
};

export default RightsRolesStage;
