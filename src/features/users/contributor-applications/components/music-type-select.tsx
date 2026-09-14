"use client";
import React, { useState } from "react";

const MusicTypeSelect = () => {
  const [type, setType] = useState("");
  return (
    <div className="flex flex-col gap-2 w-full mt-6">
      <label htmlFor="music-type">What are you uploading?</label>
      <select
        onChange={(e) => setType(e.target.value)}
        id="music-type"
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
