import { DashboardFeature } from "@/features/dashboard";
import { PermissionGate } from "@/features/shared";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  const query = await searchParams;
  return (
    <PermissionGate>
      <DashboardFeature query={query} />
    </PermissionGate>
  );
}
