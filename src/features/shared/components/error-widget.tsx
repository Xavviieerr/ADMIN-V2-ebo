import React from "react";
import { X } from "lucide-react";

const ErrorWidget = ({
  message,
  action,
}: {
  message: string;
  action: () => void;
}) => {
  if (!message) return null;

  return (
    <div className="flex items-center justify-center w-fit mx-auto gap-5 text-base-red border border-dashed border-base-red rounded-full mt-4 py-3 px-5 bg-red-500/10">
      <p className=" text-center">{message}</p>

      <X onClick={() => action()} className="" />
    </div>
  );
};

export default ErrorWidget;
