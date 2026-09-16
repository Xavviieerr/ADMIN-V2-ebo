import { PermissionGate } from "@/features/shared";
import { SingleUserFeature } from "@/features/users/user-detail";
import { fetchUserDetail } from "@/features/users/api/fetchUserDetail";

export default async function UserDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ role?: string; contributorId?: string }>;
}) {
  const { userId } = await params;
  const { role, contributorId } = await searchParams;
  const { userData, adminData } = await fetchUserDetail(userId);

  return (
    <PermissionGate permission="view_user">
      <SingleUserFeature
        userData={userData}
        adminData={adminData}
        contributorId={contributorId}
        isContributorView={role === "contributor"}
      />
    </PermissionGate>
  );
}
