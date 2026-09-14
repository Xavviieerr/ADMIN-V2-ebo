"use client";
import React, { useState } from "react";
import { ChevronDown, PenBox, Trash2 } from "lucide-react";
import Image from "next/image";

interface IEntry {
  order: number;
  title: string;
  content: string;
  photos: string[];
}

const BioEntry = ({
  entry,
  handleEdit,
  handleDelete,
}: {
  entry: IEntry;
  handleEdit: () => void;
  handleDelete: () => void;
}) => {
  const [open, setOpen] = useState(false);

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
        <div className="flex">
          <div className="flex flex-col w-full gap-4">
            <p className="w-full p-4 text-sm text-justify whitespace-pre-wrap">
              {entry.content}
            </p>

            <div className="flex flex-wrap items-center gap-4 ">
              {entry.photos.length > 0 &&
                entry.photos.map((photo, idx) => (
                  <div key={idx} className="h-32 w-32 relative rounded-md">
                    <Image
                      src={photo}
                      fill
                      alt="Figure Photo"
                      className="rounded-md"
                    />
                  </div>
                ))}
            </div>
          </div>
          <div className="flex flex-col items-end w-fit gap-4 mt-4">
            <button
              title="Edit Entry"
              onClick={handleEdit}
              className="text-foreground-50 cursor-pointer"
            >
              <PenBox size={28} />
            </button>
            <button
              title="Delete Entry"
              onClick={handleDelete}
              className="text-base-red cursor-pointer"
            >
              <Trash2 size={30} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BioEntry;
