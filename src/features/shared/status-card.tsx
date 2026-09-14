import React from "react";
import LocaleWrapper from "./locale-wrapper";

const StatusCard = ({
  status,
  size = "sm",
}: {
  status: string;
  size?: "sm" | "md" | "lg";
}) => {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "common.active";
      case "pending":
        return "common.pending";
      case "inactive":
        return "common.inactive";
      case "suspended":
        return "common.suspended";
      case "rejected":
        return "common.rejected";
      case "approved":
        return "common.approved";
      default:
        return status;
    }
  };

  const getStyling = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/15 text-green-300";
      case "pending":
        return "bg-orange-500/15 text-orange-300";
      case "deleted":
        return "bg-red-500/15 text-red-300";
      case "suspended":
        return "bg-red-500/15 text-red-300";
      case "rejected":
        return "bg-red-500/15 text-red-300";
      case "approved":
        return "bg-green-500/15 text-green-300";
      case "in-review":
        return "bg-blue-500/15 text-blue-300";
      default:
        return "bg-gray-500/15 text-gray-300";
    }
  };

  const getSizing = () => {
    switch (size) {
      case "md":
        return "px-5 py-2 text-sm";
      case "lg":
        return "px-5 py-2 text-base";
      default:
        return "px-3 py-1 text-xs";
    }
  };

  return (
    <span
      className={`${getSizing()} rounded-full  font-medium capitalize ${getStyling(
        status,
      )}`}
    >
      <LocaleWrapper item={getStatusLabel(status)} />
    </span>
  );
};

export default StatusCard;
