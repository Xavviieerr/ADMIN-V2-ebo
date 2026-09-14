"use client";

import { LocaleWrapper } from "@/features/shared";
import { usePermissions } from "@/hooks/usePermissions";
import React from "react";

const UserFilter = ({
  role,
  handleRoleFilterChange,
}: {
  role: string;
  handleRoleFilterChange: (role: string) => void;
}) => {
  const { isSuperAdmin } = usePermissions();

  if (!isSuperAdmin) return null;
  return (
    <div className="flex max-md:overflow-x-scroll max-md:pb-4 items-center w-full gap-4 mt-10">
      {[
        { label: "common.allRoles", value: "all" },
        { label: "common.admin", value: "admin" },
        // { label: "common.superAdmin", value: "super_admin" },
        { label: "common.users", value: "user" },
        { label: "common.contributors", value: "contributor" },
      ].map((item) => {
        if (
          !isSuperAdmin &&
          item.value !== "user" &&
          item.value !== "contributor"
        )
          return null;

        return (
          <button
            key={item.value}
            onClick={() => handleRoleFilterChange(item.value)}
            className={`${role === item.value ? "primary-btn font-medium" : "border-dashed border-gray-txt-100 hover:border-gray-txt-50 hover:font-medium transition-all duration-300 ease-in-out"} rounded  px-5 py-2 shrink-0 border`}
          >
            <LocaleWrapper item={item.label} />
          </button>
        );
      })}
    </div>
  );
};

export default UserFilter;
