import { Check, CheckCircle } from "lucide-react";
import Image from "next/image";
import React from "react";

const ProofOfRightsForm = () => {
  return (
    <div className="flex flex-col w-full gap-4">
      <div className=" flex flex-col px-8 py-6 bg-gray-txt-100 rounded-md w-full">
        <div className="flex items-center gap-3 text-base font-medium">
          <div className="h-3 w-3 rounded-full bg-yellow-600" />
          <h2> Rights Attestation</h2>
        </div>

        <div className="flex flex-col gap-2 mt-5">
          {[
            {
              label:
                "I own or control the rights, or I am authorized to upload",
              value: true,
            },
            {
              label: "This content does not infringe on third-party rights",
              value: true,
            },
            {
              label:
                "I understand false claims may lead to removal and account termination",
              value: true,
            },
            {
              label: "I agree to the GUỌNỌ Music Upload Agreement",
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
      <div className=" flex flex-col px-8 py-6 bg-gray-txt-100 rounded-md w-full">
        <div className="flex items-center gap-3 text-base font-medium">
          <div className="h-3 w-3 rounded-full bg-yellow-600" />
          <h2>Uploaded Proof of Rights</h2>
        </div>

        <div className="flex flex-col gap-2 mt-6">
          <div className="flex justify-between gap-4 w-full rounded-lg border-2 border-gray-500 p-5">
            <div className="flex items-center gap-3">
              <Image src={"/file.svg"} alt="file" width={40} height={40} />

              <div className="font-normal">
                <p>Rights-Document.pdf</p>
                <p className="text-sm">1.2mb</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-green-600" />
              <p className="text-sm underline cursor-pointer">Preview</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProofOfRightsForm;
