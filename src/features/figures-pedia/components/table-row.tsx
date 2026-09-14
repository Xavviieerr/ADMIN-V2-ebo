"use client";

import { StatusCard } from "@/features/shared";
import { useRouter } from "next/navigation";
import React from "react";
import { MiniFigures } from "../lib";

const TableRow = ({ item }: { item: MiniFigures }) => {
  const router = useRouter();
  return (
    <tr
      onClick={() => router.push(`/guonopedia/figures/${item.id}`)}
      className="hover:bg-[#2a2a2a]/50 transition-colors capitalize cursor-pointer hover:underline"
    >
      <td className="p-6 text-sm text-white  ">{item.fullName}</td>
      <td className="p-6 text-sm text-white ">{item.occupation}</td>
      <td className="p-6 text-sm text-center text-white ">
        {item.dateOfBirth || "N/A"}
      </td>
      <td className="p-6 text-sm text-center capitalize text-gray-300">
        <StatusCard status={item.status} />
      </td>
    </tr>
  );
};

export default TableRow;
