"use client";

import { Figure } from "@/features/shared";
import Image from "next/image";
import React, { useState } from "react";

const ImageGallery = ({ gallery }: { gallery: Figure["gallery"] }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  return (
    <>
      <div className="w-full h-60 bg-secondary-bg md:rounded-md relative">
        {gallery.length > 0 && (
          <Image
            src={gallery[selectedImage].image}
            alt={gallery[selectedImage].caption ?? "Alt image"}
            fill
            unoptimized
          />
        )}
      </div>
      <p className="text-gray-txt-500 text-sm italic text-center">
        {gallery[selectedImage].caption}
      </p>

      {gallery.length > 0 && (
        <div className="flex w-full overflow-x-auto gap-2 pb-4 no-scrollbar">
          {gallery.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className="w-24 h-24 rounded border-secondary-bg bg-secondary-bg relative shrink-0"
            >
              <Image
                src={item.image}
                alt={item.caption ?? "alt image"}
                fill
                unoptimized
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ImageGallery;
