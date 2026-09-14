"use client";

import React, { useState } from "react";

const TaxCompliance = () => {
  const [formData, setFormData] = useState({
    residency: "",
    withholdingDetails: "",
    selfCertification: "",
  });
  return (
    <div className=" flex flex-col px-8 py-6 bg-gray-txt-100 rounded-md w-full h-fit">
      <div className="flex items-center gap-3 text-base font-medium">
        <div className="h-3 w-3 rounded-full bg-yellow-600" />
        <h2> Tax Compliance</h2>
      </div>

      <div className="flex flex-col w-full mt-6 gap-4">
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="residency">Tax Residency</label>
          <input
            type="text"
            id="residency"
            placeholder="Enter the artists's legal name"
            value={formData.residency}
            onChange={(e) =>
              setFormData({ ...formData, residency: e.target.value })
            }
            className="input"
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="withholdingDetails">Withholding Details</label>
          <input
            type="text"
            id="withholdingDetails"
            placeholder="Enter the artists's stage name"
            value={formData.withholdingDetails}
            onChange={(e) =>
              setFormData({ ...formData, withholdingDetails: e.target.value })
            }
            className="input"
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="selfCertification">Self-certification</label>
          <input
            type="text"
            id="selfCertification"
            placeholder="Enter the invitee's email"
            value={formData.selfCertification}
            onChange={(e) =>
              setFormData({ ...formData, selfCertification: e.target.value })
            }
            className="input"
          />
        </div>
      </div>
    </div>
  );
};

export default TaxCompliance;
