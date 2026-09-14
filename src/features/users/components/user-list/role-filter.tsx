"use client";

import { LocaleWrapper } from "@/features/shared";
import { ROLE_FILTER_OPTIONS } from "../../constants";

const UserFilter = ({
  role,
  isSuperAdmin,
  handleRoleFilterChange,
}: {
  role: string;
  isSuperAdmin: boolean;
  handleRoleFilterChange: (role: string) => void;
}) => {
  if (!isSuperAdmin) return null;
  return (
    <div className="flex max-md:overflow-x-scroll max-md:pb-4 items-center w-full gap-4 mt-10">
      {ROLE_FILTER_OPTIONS.map((item) => (
        <button
          key={item.value}
          onClick={() => handleRoleFilterChange(item.value)}
          className={`${role === item.value ? "primary-btn font-medium" : "border-dashed border-gray-txt-100 hover:border-gray-txt-50 hover:font-medium transition-all duration-300 ease-in-out"} rounded  px-5 py-2 shrink-0 border`}
        >
          <LocaleWrapper item={item.label} />
        </button>
      ))}
    </div>
  );
};

export default UserFilter;
