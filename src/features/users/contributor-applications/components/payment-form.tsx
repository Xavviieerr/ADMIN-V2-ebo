"use client";
import { Check } from "lucide-react";
import React, { useState } from "react";

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    bankName: "",
    accountNumber: "",
    country: "",
    currency: "",
    swiftCode: "",
  });
  return (
    <div className="flex flex-col w-full gap-4">
      <div className=" flex flex-col px-8 py-6 bg-gray-txt-100 rounded-md w-full">
        <div className="flex items-center gap-3 text-base font-medium">
          <div className="h-3 w-3 rounded-full bg-yellow-600" />
          <h2>Payment Details</h2>
        </div>

        <div className="flex flex-col w-full mt-6 gap-4">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="name">Legal Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter the legal name"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="input"
            />
          </div>

          <div className="flex items-center gap-4">
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
              <label htmlFor="currency">Currency</label>
              <select
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
                id="currency"
                className="input"
              >
                {["USD", "NGN"].map((currency) => (
                  <option
                    key={currency}
                    value={currency}
                    className="text-white bg-secondary-bg"
                  >
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="bankName">Bank Name</label>
            <input
              type="text"
              id="bankName"
              placeholder="Enter the bank name"
              value={formData.bankName}
              onChange={(e) =>
                setFormData({ ...formData, bankName: e.target.value })
              }
              className="input"
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="accountNumber">Account Number / IBAN</label>
            <input
              type="text"
              id="accountNumber"
              placeholder="Enter the account number"
              value={formData.accountNumber}
              onChange={(e) =>
                setFormData({ ...formData, accountNumber: e.target.value })
              }
              className="input"
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="swiftCode">Swift Code</label>
            <input
              type="text"
              placeholder="Enter the swift code"
              id="swiftCode"
              value={formData.swiftCode}
              onChange={(e) =>
                setFormData({ ...formData, swiftCode: e.target.value })
              }
              className="input"
            />
          </div>
        </div>
      </div>

      <div className=" flex flex-col px-8 py-6 bg-gray-txt-100 rounded-md w-full">
        <div className="flex items-center gap-3 text-base font-medium">
          <div className="h-3 w-3 rounded-full bg-yellow-600" />
          <h2> Monetization & Access</h2>
        </div>

        <div className="flex flex-col gap-2 mt-5">
          {[
            {
              label: "Ad-supported streaming",
              value: true,
            },
            {
              label: "Subscription inclusion (user-centric payouts)",
              value: true,
            },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <div
                className={`${
                  item.value ? "text-white bg-green-600 border-green-600" : ""
                } border rounded`}
              >
                <Check size={14} />
              </div>
              <p>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
