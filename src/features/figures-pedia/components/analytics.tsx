"use client";
import React, { use } from "react";
import { LocaleWrapper } from "@/features/shared";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const FiguresAnalytics = ({
  data,
}: {
  data: Promise<{
    data: {
      count: number;
      approved: number;
      pending: number;
      rejected: number;
    };
  }>;
}) => {
  const { data: stats } = use(data);

  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get("status") ?? "";
  const handleClick = (v: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());

    if (v === status || v == "") {
      currentParams.delete("status");
      const newPath = `/guonopedia/figures?${currentParams.toString()}`;
      return router.replace(newPath);
    }

    if (v === "approved") {
      currentParams.set("status", "approved");
    } else if (v === "pending") {
      currentParams.set("status", "pending");
    } else if (v === "rejected") {
      currentParams.set("status", "rejected");
    }

    const newPath = `/guonopedia/figures?${currentParams.toString()}`;
    router.replace(newPath);
  };
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between w-full gap-4 ">
        <div className="flex flex-col gap-2 text-base">
          <h1 className="text-2xl font-semibold">
            <LocaleWrapper item="common.figuresOverview" />
          </h1>
          <p className="text-sm text-gray-500">
            Manage important figures on the platform.
          </p>
        </div>

        <Link
          href={"/guonopedia/figures/add"}
          className="secondary-btn flex items-center gap-3"
        >
          <Plus />
          <span className="max-md:hidden">
            <LocaleWrapper item="common.addFigure" />
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {[
          {
            label: "All Figures",
            slug: "",
            value: stats?.count ?? 0,
            caption: "All figures indexed on Guono",
          },
          {
            label: "Approved",
            slug: "approved",
            value: stats?.approved ?? 0,
            caption: "Total number of approved figures",
          },
          {
            label: "Pending",
            slug: "pending",
            value: stats?.pending ?? 0,
            caption: "Total number of pending figures",
          },
          {
            label: "Rejected",
            slug: "rejected",
            value: stats?.rejected ?? 0,
            caption: "Total number of rejected figures",
          },
        ].map((stat) => (
          <div
            onClick={() => handleClick(stat.slug)}
            key={stat.label}
            className={`w-full md:gap-5 gap-3 rounded-md md:p-5 p-3 bg-secondary-bg flex flex-col justify-between shadow cursor-pointer ${
              status === stat.label.toLowerCase()
                ? "ring-1 ring-foreground-50 "
                : "hover:border border-gray-txt-50"
            } transition-all duration-200 ease-in`}
          >
            <span className="text-gray-txt-50 max-md:text-sm">
              {stat.label}
            </span>

            <div className="flex justify-between gap-2">
              <span className="md:text-2xl text-lg font-bold text-white">
                {stat.value}
              </span>
            </div>

            <span className="text-xs text-gray-txt-50 max-md:hidden">
              {stat.caption}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FiguresAnalytics;
