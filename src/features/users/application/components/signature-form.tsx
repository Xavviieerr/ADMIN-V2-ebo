"use client";

import Image from "next/image";
import React, { useState } from "react";

const SignatureForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
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
        <label htmlFor="dob">Date of Birth</label>
        <input
          type="date"
          id="dob"
          value={formData.dob}
          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          className="input"
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <p>Signature</p>
        <div className="border border-gray-500 rounded-md py-5 w-full">
          <Image
            src="/signature.png"
            alt="signature"
            width={200}
            height={105}
            className="mx-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default SignatureForm;
