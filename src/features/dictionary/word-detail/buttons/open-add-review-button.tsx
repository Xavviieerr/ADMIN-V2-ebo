"use client";
import React from "react";
import { useSingleWordReviewContext } from "../contexts/SingleWordReviewContext";
import { PenBox } from "lucide-react";

const OpenAddReviewButton = () => {
  const { setReviewView } = useSingleWordReviewContext();
  return (
    <button
      onClick={() => setReviewView("add")}
      className="primary-btn px-10 flex items-center gap-3 py-2"
    >
      <PenBox width={16} /> Add
    </button>
  );
};

export default OpenAddReviewButton;
