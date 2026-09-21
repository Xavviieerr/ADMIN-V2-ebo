import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import AddUserBtn from "./add-user-btn";
import {
  LocaleWrapper,
  PermissionGate,
  UserStats,
} from "@/features/shared";

const UserAnalytics = ({ role: _role, data }: { role: string; data: UserStats }) => {
  return (
    <div className="flex flex-col gap-4 w-full pr-4">
      <div className="flex max-md:flex-col md:items-center justify-between w-full md:gap-4 gap-6 ">
        <div className="flex flex-col gap-2 text-base">
          <h1 className="text-2xl font-semibold">
            <LocaleWrapper item="common.usersOverview" />
          </h1>
          <p className="max-md:text-sm text-gray-500">
            Manage members, contributors, and administrators on the platform.
          </p>
        </div>

        <PermissionGate permission="create_admin">
          <AddUserBtn />
        </PermissionGate>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
        {[
          {
            label: "Total Users",
            value: data?.totalUsers?.toLocaleString() ?? "0",
            change: "0",
            changeType: "up" as const,
            caption: "Registered members on the platform",
          },
          {
            label: "Active Users",
            value: data?.activeUsers?.toLocaleString() ?? "0",
            change: "0",
            changeType: "up" as const,
            caption: "Users actively using the platform",
          },
          {
            label: "Total Contributors",
            value: data?.contributors?.toLocaleString() ?? "0",
            change: "0",
            changeType: "up" as const,
            caption: "Users actively submitting content",
          },
          {
            label: "Total Admins",
            value: data?.adminUsers?.toLocaleString() ?? "0",
            change: "0",
            changeType: "up" as const,
            caption: "Guono System Administrators",
          },
          {
            label: "Suspended Users",
            value: data?.suspendedUsers?.toLocaleString() ?? "0",
            change: "0",
            changeType: "down" as const,
            caption: "Accounts suspended due to violations",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="w-full md:gap-5 gap-3 rounded-2xl p-5 bg-secondary-bg flex flex-col justify-between"
          >
            <span className="text-gray-txt-50 max-md:text-sm">
              {stat.label}
            </span>

            <div className="flex justify-between gap-2">
              <span className="md:text-2xl text-xl font-bold text-white">
                {stat.value}
              </span>
              {stat.change != "0" && (
                <span
                  className={`${stat.changeType === "up" ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"} text-sm font-semibold flex items-center gap-1 p-2 rounded-md`}
                >
                  {stat.changeType === "up" ? (
                    <ArrowTrendingUpIcon className="h-4 w-4" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4" />
                  )}{" "}
                  {stat.change}
                </span>
              )}
            </div>

            <span className="text-xs max-md:hidden text-gray-txt-50">
              {stat.caption}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserAnalytics;
