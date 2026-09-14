"use client";
import React from "react";
import { useSingleWordContext } from "../context";
import { PenBox } from "lucide-react";

const AddReview = () => {
  const { setReviewView } = useSingleWordContext();
  return (
    <button
      onClick={() => setReviewView("add")}
      className="primary-btn px-10 flex items-center gap-3 py-2"
    >
      <PenBox width={16} /> Add
    </button>
  );
};

export default AddReview;
