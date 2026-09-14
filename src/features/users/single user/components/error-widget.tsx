"use client";

import { LocaleWrapper } from "@/features/shared";
import { useRouter } from "next/navigation";

const ErrorWidget = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen p-4 md:p-6 bg-[#1F1F27] text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-400 text-lg">
          <LocaleWrapper item="common.user" />{" "}
          <LocaleWrapper item="common.notFound" />
        </p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          <LocaleWrapper item="common.back" />
        </button>
      </div>
    </div>
  );
};

export default ErrorWidget;
