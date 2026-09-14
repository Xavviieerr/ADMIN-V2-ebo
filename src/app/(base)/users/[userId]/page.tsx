import { PermissionGate } from "@/features/shared";
import { SingleUserFeature } from "@/features/users/user-detail";
import { fetchUserDetail } from "@/features/users/api/fetchUserDetail";

export default async function UserDetailsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const { userData, adminData } = await fetchUserDetail(userId);

  return (
    <PermissionGate permission="view_user">
      <SingleUserFeature userData={userData} adminData={adminData} />
    </PermissionGate>
  );
}
