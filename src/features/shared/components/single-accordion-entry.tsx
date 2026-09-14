"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface IEntry {
  id: string;
  title: string;
  body: string;
}

const SingleEntry = ({
  entry,
  handleEdit,
  handleDelete,
}: {
  entry: IEntry;
  handleEdit?: () => void;
  handleDelete?: () => void;
}) => {
  const [open, setOpen] = useState(true);
  const canSeeActions = handleEdit && handleDelete;

  return (
    <div className="flex flex-col w-full">
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between gap-4 border-b border-gray-500/40 pb-2"
      >
        <p>{entry.title}</p>

        <ChevronDown
          className={`transition-all duration-300 ${open ? "rotate-180" : ""}`}
        />
      </div>

      {open && (
        <div className="flex flex-col">
          {canSeeActions && (
            <div className="flex justify-between w-full gap-4 items-center mt-4">
              <button
                onClick={handleEdit}
                className="secondary-btn px-10 text-sm w-fit"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="secondary-btn text-sm bg-white text-base-red px-10 w-fit"
              >
                Delete
              </button>
            </div>
          )}

          <p className="w-full p-4 text-sm">{entry.body}</p>
        </div>
      )}
    </div>
  );
};

export default SingleEntry;
