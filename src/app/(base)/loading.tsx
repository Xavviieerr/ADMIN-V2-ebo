import LoadingSpinner from "@/components/ui/LoadingSpinner";
import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-[70vh]">
      <LoadingSpinner size="lg" />
    </div>
  );
};

export default Loading;
