"use client";

import { ArrowLeft } from "lucide-react";
import LocaleWrapper from "./locale-wrapper";
import { useRouter } from "next/navigation";

const GoBackButton = ({
  link,
  onClick,
}: {
  link?: string;
  onClick?: () => void;
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) return onClick();
    if (link) return router.replace(link);
    return router.back();
  };
  return (
    <div className="mb-6">
      <button
        onClick={handleClick}
        className="text-gray-300 hover:text-white hover:bg-[#2a2a2a] px-5 py-2 rounded-lg flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <LocaleWrapper item="common.back" />
      </button>
    </div>
  );
};

export default GoBackButton;
