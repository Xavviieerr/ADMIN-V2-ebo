"use client";

import { Play } from "lucide-react";

import React, { useState } from "react";

const UploadTrackForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    featured: "",
    language: "",
    genre: "",
  });
  return (
    <div className="flex flex-col w-full mt-6 gap-4">
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="title">Track Title</label>
        <input
          type="text"
          id="title"
          placeholder="Enter the track title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="input"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="artist">Primary Artist</label>
          <input
            type="text"
            id="artist"
            placeholder="Enter the artists's stage name"
            value={formData.artist}
            onChange={(e) =>
              setFormData({ ...formData, artist: e.target.value })
            }
            className="input"
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="featured">Featured Artist(s)</label>
          <input
            type="text"
            id="featured"
            placeholder="Enter the names of featured artists"
            value={formData.featured}
            onChange={(e) =>
              setFormData({ ...formData, featured: e.target.value })
            }
            className="input"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="language">Language</label>
          <select
            onChange={(e) =>
              setFormData({ ...formData, language: e.target.value })
            }
            id="language"
            className="input"
          >
            {["Urhobo", "English", "Pidgin"].map((type) => (
              <option
                key={type}
                value={type}
                className="text-white bg-secondary-bg"
              >
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="genre">Genre</label>
          <select
            onChange={(e) =>
              setFormData({ ...formData, genre: e.target.value })
            }
            id="genre"
            className="input"
          >
            {["Gospel", "Afrobeat", "R&B", "Hip Hop"].map((type) => (
              <option
                key={type}
                value={type}
                className="text-white bg-secondary-bg"
              >
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <p>Uploaded Track</p>
        <div className="flex items-center gap-3 border border-gray-500 rounded-md p-5 w-full">
          <div className="h-7 w-7 flex items-center justify-center bg-white/90 text-base-bg rounded-full">
            <Play fill="currentColor" className="rounded-full" size={14} />
          </div>

          <div className="flex items-center w-full gap-4">
            <p className="text-sm">00:00:00</p>

            <div className="h-1 w-full bg-white rounded-full" />

            <p className="text-sm">03:30:00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadTrackForm;
