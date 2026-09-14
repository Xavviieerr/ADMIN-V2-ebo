import React from "react";
import Link from "next/link";
import { DashboardStats } from "../types";
import { PermissionGate } from "@/features/shared";

const RecentUsers = ({
  data,
}: {
  data: DashboardStats["recentUsers"] | undefined;
}) => {
  return (
    <section className="md:w-1/2 w-full container px-0">
      <div className="flex items-center justify-between pb-4 mb-2 border-b border-gray-txt-50/30 px-5">
        <h2 className="max-md:text-lg max-md:font-medium text-xl font-semibold text-white">
          Recent Users
        </h2>
        <PermissionGate permission="view_user">
          <Link
            href={"/users"}
            className="primary-btn flex items-center gap-2 text-sm font-medium"
          >
            View All
          </Link>
        </PermissionGate>
      </div>

      {data && data.length > 0 && (
        <ul className="space-y-4 px-5 mt-5 overflow-y-scroll max-h-100 custom-scrollbar">
          {data.map((user) => (
            <li
              key={user.id}
              className="flex py-3 border-b border-gray-txt-50/30 last:border-b-0"
            >
              <Link
                href={`/users/${user.id}`}
                className="flex items-center justify-between gap-3 w-full"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.profilePictureUrl || "/default-avatar.svg"}
                    alt={user.firstName}
                    className="max-md:h-6 max-md:w-6 h-9 w-9 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-white font-medium capitalize">
                      {user.firstName.toLowerCase() +
                        " " +
                        user.lastName.toLowerCase()}
                    </div>
                    <div className="text-xs text-gray-txt-50">
                      {user.gender}
                    </div>
                  </div>
                </div>
                <span className="text-gray-txt-50 text-sm">{user.role}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {(!data || data.length === 0) && (
        <p className="px-5 max-md:pt-4 md:py-9 w-full text-center text-gray-txt-50">
          Nothing to see here.
        </p>
      )}
    </section>
  );
};

export default RecentUsers;
