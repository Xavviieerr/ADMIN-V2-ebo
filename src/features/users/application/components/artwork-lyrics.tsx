"use client";

import { Check, CheckCircle } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const ArtWorkLyricsForm = () => {
  const [lyricsAgreement, setLyricsAgreement] = useState(true);
  const [permission, setPermission] = useState(true);
  return (
    <div className="flex flex-col w-full gap-4">
      <div className=" flex flex-col px-8 py-6 bg-gray-txt-100 rounded-md w-full">
        <div className="flex items-center gap-3 text-base font-medium">
          <div className="h-3 w-3 rounded-full bg-yellow-600" />
          <h2> Artwork Upload</h2>
        </div>

        <div className="flex flex-col gap-2 mt-6">
          <p>Upload Single Artwork or Album Cover</p>
          <div className="flex justify-between gap-4 w-full rounded-lg border-2 border-gray-500 p-5">
            <div className="flex items-center gap-3">
              <Image src={"/image.svg"} alt="file" width={40} height={40} />

              <div className="font-normal">
                <p>EP-Artwork.png</p>
                <p className="text-sm">3.2mb</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-green-600" />
              <p className="text-sm underline cursor-pointer">Preview</p>
            </div>
          </div>
        </div>

        <div className="my-5 flex flex-col text-sm">
          <p className="font-medium">Rules</p>
          <ul className="list-disc ml-5 mt-2">
            <li>Square image</li>
            <li>Minimum resolution of 1500 x 1500 pixels</li>
            <li>Maximum file size of 5MB</li>
            <li>No unauthorized logos or artwork</li>
          </ul>
        </div>

        <div
          onClick={() => setPermission(!permission)}
          className="flex items-center gap-2 text-sm"
        >
          <div
            className={`${
              permission ? "text-white bg-green-600 border-green-600" : ""
            } border rounded`}
          >
            <Check size={14} />
          </div>
          <p> I own or have permission to use this artwork</p>
        </div>
      </div>

      <div className=" flex flex-col px-8 py-6 bg-gray-txt-100 rounded-md w-full">
        <div className="flex items-center gap-3 text-base font-medium">
          <div className="h-3 w-3 rounded-full bg-yellow-600" />
          <h2>Uploaded Lyrics</h2>
        </div>

        <div className="flex flex-col gap-2 mt-6">
          <div className="flex justify-between gap-4 w-full rounded-lg border-2 border-gray-500 p-5">
            <div className="flex items-center gap-3">
              <Image src={"/file.svg"} alt="file" width={40} height={40} />

              <div className="font-normal">
                <p>Lyrics-File.pdf</p>
                <p className="text-sm">0.7mb</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-green-600" />
              <p className="text-sm underline cursor-pointer">Preview</p>
            </div>
          </div>

          <div
            onClick={() => setLyricsAgreement(!lyricsAgreement)}
            className="flex items-center gap-2 text-sm mt-2"
          >
            <div
              className={`${
                lyricsAgreement
                  ? "text-white bg-green-600 border-green-600"
                  : ""
              } border rounded`}
            >
              <Check size={14} />
            </div>
            <p>I agree to the lyrics & Language Addendum</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtWorkLyricsForm;
