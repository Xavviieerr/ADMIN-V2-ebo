import { CheckCircle } from "lucide-react";
import Image from "next/image";
import React from "react";

const IdentityForm = () => {
  return (
    <div className="flex flex-col gap-2 mt-6">
      <p>
        Government Issued ID <span className="text-red-600">*</span>
      </p>
      <div className="flex justify-between gap-4 w-full rounded-lg border-2 border-gray-500 p-5">
        <div className="flex items-center gap-3">
          <Image src={"/file.svg"} alt="file" width={40} height={40} />

          <div className="font-normal">
            <p>NIN-Document.pdf</p>
            <p className="text-sm">1.2mb</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CheckCircle size={20} className="text-green-600" />
          <p className="text-sm underline cursor-pointer">Preview</p>
        </div>
      </div>
    </div>
  );
};

export default IdentityForm;
