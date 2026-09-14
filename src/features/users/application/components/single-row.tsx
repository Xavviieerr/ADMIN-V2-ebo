"use client";
import { useRouter } from "next/navigation";
import React from "react";

const SingleRow = ({
  item,
}: {
  item: { label: string; status: string; value: string };
}) => {
  const router = useRouter();
  return (
    <tr
      key={item.value}
      onClick={() => router.push(`?stage=${item.value}`)}
      className="hover:bg-[#2a2a2a]/50 transition-colors cursor-pointer "
    >
      <td className="p-6 text-sm text-white font-medium">{item.label}</td>
      <td
        className={`p-6 text-sm text-gray-300 ${
          item.status.toLowerCase() === "completed"
            ? "text-green-600"
            : item.status.toLowerCase() === "in progress"
              ? "text-yellow-600"
              : "text-red-600"
        }`}
      >
        {item.status}
      </td>
      <td className="p-6 underline text-center cursor-pointer hover:text-gray-txt-50 hover:font-medium transition-all text-sm text-gray-300">
        View Submission
      </td>
    </tr>
  );
};

export default SingleRow;
