"use client";

import React, { ReactNode } from "react";

type ModalLayoutProps = {
  size: "2xl" | "3xl" | "4xl";
  children: ReactNode;
};

const ModalLayout = ({ size = "2xl", children }: ModalLayoutProps) => {
  const sizeOptions: Record<"2xl" | "3xl" | "4xl", string> = {
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
  };

  return (
    <dialog className="flex justify-center items-center backdrop-blur-sm z-200 overflow-auto no-scrollbar fixed top-0 left-0 w-screen h-screen bg-black/20">
      <div
        className={`flex flex-col items-center ${sizeOptions[size]} md:w-full w-[90%] bg-gray-txt-100 rounded-lg md:p-10 px-4 py-6 gap-2 text-white`}
      >
        {children}
      </div>
    </dialog>
  );
};

export default ModalLayout;
