import { DashboardStats } from "../types";

export function getUserStatCards(stats: DashboardStats["stats"] | undefined) {
  return [
    {
      label: "Total Users",
      value: stats?.totalUsers?.toLocaleString() ?? "0",
      href: "/users",
      caption: "Registered members on the platform",
    },
    {
      label: "Total Admins",
      value: stats?.totalAdmins?.toLocaleString() ?? "0",
      href: "/users?role=admins",
      caption: "Guono System Administrators",
    },
    {
      label: "Total Contributors",
      value: stats?.contributors?.toLocaleString() ?? "0",
      href: "/users",
      caption: "Users actively submitting content",
    },
    {
      label: "Total Posts",
      value: stats?.posts?.toLocaleString() ?? "0",
      href: "",
      caption: "Total Posts",
    },
  ];
}

export function getDictionaryStatCards(stats: DashboardStats["stats"] | undefined) {
  return [
    {
      label: "Dictionary Entries",
      value: stats?.totalWords?.toLocaleString() ?? "0",
      caption: "Total Dictionary Entries",
    },
    {
      label: "Approved Entries",
      value: stats?.approvedWords?.toLocaleString() ?? "0",
      caption: "Total Approved Entries",
    },
    {
      label: "Pending Entries",
      value: stats?.pendingWords?.toLocaleString() ?? "0",
      caption: "Entries awaiting approval",
    },
    {
      label: "Entries In Review",
      value: stats?.inReviewWords?.toLocaleString() ?? "0",
      caption: "Entries awaiting admin review",
    },
    {
      label: "Rejected Entries",
      value: stats?.rejectedWords?.toLocaleString() ?? "0",
      caption: "Total Rejected Entries",
    },
  ];
}
