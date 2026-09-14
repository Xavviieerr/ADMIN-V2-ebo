"use client";
import React, { useEffect } from "react";
import AdminProfile from "./components/admin-profile";
import { AdminData, LocaleWrapper } from "@/features/shared";
import AdminPermissions from "./components/admin-permissions";
import { useSearchParams } from "next/navigation";
import { getUserStatus } from "@/helpers";
import { toast } from "sonner";

const AdminBody = ({ adminData }: { adminData: AdminData }) => {
  const [page, setPage] = React.useState<"profile" | "permission">("profile");
  const searchParams = useSearchParams();

  useEffect(() => {
    const view = searchParams.get("v");
    if (view && ["profile", "permission"].includes(view)) {
      setPage(view as "profile" | "permission");
    }
  }, [searchParams]);
  return (
    <div className="w-full pb-20">
      {adminData.user.suspensionReason && (
        <div className="flex flex-col px-5 py-2 border border-base-red border-dashed rounded-md text-gray-txt-50 mb-5 gap-1 md:w-fit w-full text-sm">
          <p>Reason for suspension:</p>
          <p>{adminData.user.suspensionReason}</p>
        </div>
      )}

      {adminData.rejectionReason && (
        <div className="flex flex-col px-5 py-2 border border-base-red border-dashed rounded-md text-gray-txt-50 mb-5 gap-1 md:w-fit w-full text-sm">
          <p>Reason for rejection:</p>
          <p>{adminData.rejectionReason}</p>
        </div>
      )}

      <div className="flex items-center w-1/2 my-5">
        {[
          { label: "sidebar.profile", value: "profile" },
          { label: "sidebar.permissions", value: "permission" },
        ].map((item: { label: string; value: string }) => {
          const disallowClick =
            getUserStatus(adminData.user) !== "active" &&
            item.value === "permission";

          return (
            <button
              key={item.value}
              onClick={() =>
                disallowClick
                  ? toast.error("Admin must be active to view permissions")
                  : setPage(item.value as any)
              }
              className={`${page === item.value ? "primary-btn font-medium" : "border border-gray-txt-100 hover:border-gray-txt-50 hover:font-medium transition-all duration-300 ease-in-out"} ${disallowClick ? "cursor-not-allowed" : "cursor-pointer"} rounded  px-10 py-3 w-full`}
            >
              <LocaleWrapper item={item.label} />
            </button>
          );
        })}
      </div>

      {page == "profile" && <AdminProfile adminData={adminData} />}
      {page == "permission" && <AdminPermissions userId={adminData.userId} />}
    </div>
  );
};

export default AdminBody;
