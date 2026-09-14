type UserLike = {
  suspensionReason?: string | null;
  isVerified?: boolean;
  isActive?: boolean;
};

export type UserStatusValue = "suspended" | "deleted" | "rejected" | "pending" | "active" | "";

export function getUserStatus(user: UserLike): UserStatusValue {
  if (user.suspensionReason) {
    return "suspended";
  }
  if (user) {
    if (user.isVerified && !user.isActive) {
      return "deleted";
    }
    if (!user.isVerified && !user.isActive) {
      return "rejected";
    }
    if (!user.isVerified && user.isActive) {
      return "pending";
    }
    if (user.isVerified && user.isActive) {
      return "active";
    }
  }
  return "";
}

const STATUS_COLORS: Record<string, string> = {
  active: "text-green-400",
  pending: "text-orange-400",
  suspended: "text-yellow-400",
  rejected: "text-red-400",
  deleted: "text-red-400",
};

export function getStatusColor(status: string): string {
  return STATUS_COLORS[status] || "text-gray-400";
}
