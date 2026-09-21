"use client";

import Image from "next/image";
import React, { useState } from "react";

const ApproveContributor = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: (value: boolean) => void;
}) => {
  const [_role, setRole] = useState("");

  if (!show) return;

  return (
    <dialog className="flex justify-center items-center backdrop-blur-sm z-200 overflow-auto no-scrollbar fixed top-0 left-0 w-screen h-screen bg-black/20">
      <div className="flex flex-col items-center max-w-lg w-full bg-gray-txt-100 rounded-lg p-10 gap-2 text-white">
        <Image
          src={"/warning-circle.svg"}
          alt="warning"
          width={80}
          height={80}
        />
        <h1 className="font-medium text-2xl">Accept Contributor?</h1>

        <p className="font-medium mb-6 text-gray-txt-50">
          This user will gain contributor access and permissions.
        </p>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="role">Assign Contributor Role</label>
          <select
            onChange={(e) => setRole(e.target.value)}
            id="role"
            className="input"
          >
            {["admin", "user"].map((role) => (
              <option
                key={role}
                value={role}
                className="text-white bg-secondary-bg"
              >
                {role}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between gap-4 w-full mt-5 font-medium">
          <button
            onClick={() => setShow(false)}
            className="secondary-btn px-10"
          >
            Cancel
          </button>
          <button
            onClick={() => {}}
            className="primary-btn bg-base-green text-white px-10"
          >
            Approve Contributor
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ApproveContributor;
