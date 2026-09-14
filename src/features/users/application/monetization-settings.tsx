import { ContributorApplicationStage } from "@/features/shared";
import Link from "next/link";
import React from "react";
import { PaymentForm, TaxCompliance } from "./components";

const MonetizationSettingsStage = ({
  stage,
  userId,
}: {
  stage: ContributorApplicationStage;
  userId: string;
}) => {
  return (
    <>
      {stage === "monetizationSettings" && (
        <div className="dark-box w-full">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-white font-medium text-lg">
              4. Monetization Settings
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
            <PaymentForm />

            <TaxCompliance />
          </div>
        </div>
      )}
    </>
  );
};

export default MonetizationSettingsStage;
