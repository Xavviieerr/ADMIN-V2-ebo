import React from "react";
import { AccountInfoForm, IdentityForm } from "./components";
import Link from "next/link";
import { ContributorApplicationStage } from "@/features/shared";

const AccountInfoStage = ({
  stage,
  userId,
}: {
  stage: ContributorApplicationStage;
  userId: string;
}) => {
  return (
    <>
      {stage === "accountInfo" && (
        <div className="dark-box w-full">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-white font-medium text-lg">
              1. Artist & Account Info
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
            <div className=" flex flex-col px-8 py-6 bg-gray-txt-100 rounded-md w-full">
              <div className="flex items-center gap-3 text-base font-medium">
                <div className="h-3 w-3 rounded-full bg-yellow-600" />
                <h2>Artist Details</h2>
              </div>

              <AccountInfoForm />
            </div>

            <div className=" flex flex-col px-8 py-6 bg-gray-txt-100 rounded-md w-full h-fit">
              <div className="flex items-center gap-3 text-base font-medium">
                <div className="h-3 w-3 rounded-full bg-yellow-600" />
                <h2>Identity Verification</h2>
              </div>

              <IdentityForm />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountInfoStage;
