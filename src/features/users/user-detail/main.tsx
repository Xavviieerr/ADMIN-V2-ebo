"use client";

import AdminBody from "./admin-body";
import AvatarNameSection from "./components/avatar-name";
import UserBody from "./user-body";
import ContributorBody from "./contributor-body";
import SingleAdminCTA from "./components/single-admin-cta";
import SingleContributorCTA from "./components/single-contributor-cta";
import SingleUserCTA from "./components/single-user-cta";
import { DeleteBtn } from "../components";
import { GoBackButton } from "@/features/shared";
import type { AdminData, UserData } from "../types";
import { getUserStatus } from "../utils/getUserStatus";
import ErrorWidget from "./components/error-widget";
import { useGetContributorByIdQuery } from "@/slice/requestSlice";

const SingleUserFeature = ({
  adminData,
  userData,
  contributorId,
  isContributorView,
}: {
  adminData: AdminData | null;
  userData: UserData | null;
  contributorId?: string;
  isContributorView?: boolean;
}) => {
  const isAdmin = adminData ? true : false;
  const user = adminData ? adminData.user : userData;

  const { data: contributorData } = useGetContributorByIdQuery(
    { contributorId: contributorId || "" },
    { skip: !contributorId },
  );

  const contributor = contributorData?.data;

  if (!user) {
    return <ErrorWidget />;
  }

  return (
    <div className="min-h-screen p-4 md:p-6 text-white">
      <GoBackButton link="/users" />

      <div className="dark-box rounded-xl px-6 py-6 md:px-8 md:py-8 mb-8">
        <div className="flex max-md:flex-col items-start justify-between gap-6">
          <AvatarNameSection user={user} adminData={adminData} />

          <div className="flex gap-2 items-center max-md:justify-end max-md:w-full shrink-0">
            <SingleAdminCTA adminData={adminData} />

            <SingleContributorCTA
              userData={userData}
              contributor={contributor}
            />

            <SingleUserCTA userData={userData} />

            <DeleteBtn status={getUserStatus(user)} />
          </div>
        </div>
      </div>

      {isAdmin && adminData && <AdminBody adminData={adminData} />}

      {!isAdmin && userData && <UserBody userData={userData} contributor={contributor} />}

      {!isAdmin && userData && (
        <ContributorBody
          data={userData}
          contributor={contributor}
          isContributorView={isContributorView}
        />
      )}
    </div>
  );
};

export default SingleUserFeature;
