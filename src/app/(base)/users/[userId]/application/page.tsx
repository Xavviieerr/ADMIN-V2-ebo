import { PermissionGate } from "@/features/shared";
import { UserApplicationFeature } from "@/features/users/contributor-applications";

export default async function UserApplicationPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ stage: string }>;
}) {
  const { userId } = await params;
  const { stage = "" } = await searchParams;
  return (
    <PermissionGate>
      <UserApplicationFeature userId={userId} stage={stage} />
    </PermissionGate>
  );
}
