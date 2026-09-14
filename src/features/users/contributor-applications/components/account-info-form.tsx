"use client";

import React, { useState } from "react";

const AccountInfoForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    stageName: "",
    email: "",
    country: "",
    dob: "",
  });

  return (
    <div className="flex flex-col w-full mt-6 gap-4">
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="name">Legal Name</label>
        <input
          type="text"
          id="name"
          placeholder="Enter the artists's legal name"
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
          className="input"
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="stageName">Artist's Stage Name</label>
        <input
          type="text"
          id="stageName"
          placeholder="Enter the artists's stage name"
          value={formData.stageName}
          onChange={(e) =>
            setFormData({ ...formData, stageName: e.target.value })
          }
          className="input"
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Enter the invitee's email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="input"
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="role">Country</label>
        <select
          onChange={(e) =>
            setFormData({ ...formData, country: e.target.value })
          }
          id="country"
          className="input"
        >
          {["Nigeria"].map((country) => (
            <option
              key={country}
              value={country}
              className="text-white bg-secondary-bg"
            >
              {country}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="dob">Date of Birth</label>
        <input
          type="date"
          id="dob"
          value={formData.dob}
          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          className="input"
        />
      </div>
    </div>
  );
};

export default AccountInfoForm;
