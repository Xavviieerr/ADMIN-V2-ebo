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

const SingleUserFeature = ({
  adminData,
  userData,
}: {
  adminData: AdminData | null;
  userData: UserData | null;
}) => {
  const isAdmin = adminData ? true : false;
  const user = adminData ? adminData.user : userData;

  if (!user) {
    return <ErrorWidget />;
  }

  return (
    <div className="min-h-screen p-4 md:p-6 text-white">
      <GoBackButton link="/users" />

      <div className="flex max-md:flex-col items-start justify-between gap-6 rounded-xl px-6 md:p-8 mb-8 relative">
        <AvatarNameSection user={user} adminData={adminData} />

        <div className="flex gap-2 items-center max-md:justify-end max-md:w-full">
          <SingleAdminCTA adminData={adminData} />

          <SingleContributorCTA userData={userData} />

          <SingleUserCTA userData={userData} />

          <DeleteBtn status={getUserStatus(user)} />
        </div>
      </div>

      {isAdmin && adminData && <AdminBody adminData={adminData} />}

      {!isAdmin && userData && <UserBody userData={userData} />}

      {!isAdmin && userData && <ContributorBody data={userData} />}
    </div>
  );
};

export default SingleUserFeature;
