import { PermissionGate } from "@/features/shared";
import { UserManagementFeature } from "@/features/users";
import { fetchUserStats } from "@/features/users/api/fetchUserStats";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const data = await fetchUserStats();
  return (
    <PermissionGate permission="view_user">
      <UserManagementFeature data={data} />
    </PermissionGate>
  );
}
