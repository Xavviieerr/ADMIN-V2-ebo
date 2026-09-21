"use client";
import React, { useState } from "react";

const MusicTypeSelect = () => {
  const [_type, setType] = useState("");
  return (
    <div className="flex flex-col gap-2 w-full mt-6">
      <label htmlFor="role">What are you uploading?</label>
      <select
        onChange={(e) => setType(e.target.value)}
        id="country"
        className="input"
      >
        {["Single", "Cover", "Album", "EP", "Compilation", "Soundtrack"].map(
          (type) => (
            <option
              key={type}
              value={type}
              className="text-white bg-secondary-bg"
            >
              {type}
            </option>
          ),
        )}
      </select>
    </div>
  );
};

export default MusicTypeSelect;
