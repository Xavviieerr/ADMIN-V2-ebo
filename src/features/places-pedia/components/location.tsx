"use client";

import React, { useState } from "react";

const LocationForm = () => {
  const [formData, setFormData] = useState({
    state: "",
    LGA: "",
    lat: "",
    long: "",
    googleMap: "",
    province: "",
  });

  return (
    <div className=" flex flex-col px-8 py-6 bg-gray-txt-100 rounded-md w-full h-fit">
      <div className="flex items-center gap-3 text-base font-medium">
        <div className="h-3 w-3 rounded-full bg-yellow-600" />
        <h2>Location Details</h2>
      </div>

      <div className="flex flex-col w-full mt-6 gap-4">
        {/* State */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="state">State</label>
          <select
            onChange={(e) =>
              setFormData({ ...formData, state: e.target.value })
            }
            id="state"
            className="input h-12"
          >
            {["Delta"].map((type) => (
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
          <label htmlFor="lga">L.G.A</label>
          <select
            onChange={(e) => setFormData({ ...formData, LGA: e.target.value })}
            id="lga"
            className="input h-12"
          >
            {["Warri"].map((lga) => (
              <option
                key={lga}
                value={lga}
                className="text-white bg-secondary-bg"
              >
                {lga}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="province">Province</label>
          <select
            onChange={(e) =>
              setFormData({ ...formData, province: e.target.value })
            }
            id="province"
            className="input h-12"
          >
            {["Agabrho"].map((province) => (
              <option
                key={province}
                value={province}
                className="text-white bg-secondary-bg"
              >
                {province}
              </option>
            ))}
          </select>
        </div>

        {/* Coord */}
        <div className="flex items-center gap-4 w-full">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="long">Longitude</label>
            <input
              type="text"
              id="long"
              placeholder="Enter Longitude"
              value={formData.long}
              onChange={(e) =>
                setFormData({ ...formData, long: e.target.value })
              }
              className="input"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="lat">Latitude</label>
            <input
              type="text"
              id="lat"
              placeholder="Enter Latitude"
              value={formData.lat}
              onChange={(e) =>
                setFormData({ ...formData, lat: e.target.value })
              }
              className="input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationForm;
