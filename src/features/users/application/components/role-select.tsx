"use client";
import React, { useState } from "react";

const RoleSelect = () => {
  const [role, setRole] = useState("");
  return (
    <div className="flex flex-col gap-2 w-full mt-6">
      <label htmlFor="role">I am uploading as:</label>
      <select
        onChange={(e) => setRole(e.target.value)}
        id="country"
        className="input"
      >
        {["I am an independent Artist", "I am a Label/Company"].map((role) => (
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
  );
};

export default RoleSelect;
