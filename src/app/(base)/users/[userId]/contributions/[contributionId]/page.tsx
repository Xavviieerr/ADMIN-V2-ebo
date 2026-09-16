import { PermissionGate } from "@/features/shared";
import ContributionDetailFeature from "@/features/users/contribution-detail/main";

export default async function ContributionDetailPage({
  params,
}: {
  params: Promise<{ userId: string; contributionId: string }>;
}) {
  const { userId, contributionId } = await params;

  return (
    <PermissionGate permission="view_user">
      <ContributionDetailFeature
        userId={userId}
        contributionId={contributionId}
      />
    </PermissionGate>
  );
}
