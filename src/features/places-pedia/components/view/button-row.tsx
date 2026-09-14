"use client";

import { PenBox, CheckCheck, XCircle, Trash2 } from "lucide-react";
import React from "react";

const ButtonRow = () => {
  return (
    <div className="md:flex grid grid-cols-2 items-center gap-4">
      <button className="flex items-center gap-2 secondary-btn">
        <PenBox size={18} />
        Edit
      </button>
      <button className="flex items-center primary-btn gap-2 bg-green-600 text-white">
        <CheckCheck size={18} />
        Approve
      </button>

      <button className="flex items-center gap-2 secondary-btn text-base-red bg-white border-transparent">
        <XCircle size={18} />
        Reject
      </button>

      <button className="flex items-center gap-2 secondary-btn bg-base-red text-white border-transparent">
        <Trash2 size={18} />
        Delete
      </button>
    </div>
  );
};

export default ButtonRow;
