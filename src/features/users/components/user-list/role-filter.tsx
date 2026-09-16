"use client";

import { LocaleWrapper } from "@/features/shared";
import { ROLE_FILTER_OPTIONS, ADMIN_ROLE_FILTER_OPTIONS } from "../../constants";
import type { ActiveView } from "../../hooks/useUsersList";

const UserFilter = ({
  role,
  activeView,
  isSuperAdmin,
  isAdmin,
  handleRoleFilterChange,
}: {
  role: string;
  activeView: ActiveView;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  handleRoleFilterChange: (role: string) => void;
}) => {
  if (!isAdmin) return null;

  const options = isSuperAdmin ? ROLE_FILTER_OPTIONS : ADMIN_ROLE_FILTER_OPTIONS;

  return (
    <div className="flex max-md:overflow-x-scroll max-md:pb-4 items-center w-full gap-4 mt-10">
      {options.map((item) => {
        const isActive =
          item.value === "contributors"
            ? activeView === "contributors"
            : activeView === "users" && role === item.value;

        return (
          <button
            key={item.value}
            onClick={() => handleRoleFilterChange(item.value)}
            className={`${isActive ? "primary-btn font-medium" : "border-dashed border-gray-txt-100 hover:border-gray-txt-50 hover:font-medium transition-all duration-300 ease-in-out"} rounded  px-5 py-2 shrink-0 border`}
          >
            <LocaleWrapper item={item.label} />
          </button>
        );
      })}
    </div>
  );
};

export default UserFilter;
