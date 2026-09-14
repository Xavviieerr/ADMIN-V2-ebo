"use client";

import ModalLayout from "@/features/shared/modal-layout";
import { CircleX, Delete, Loader, Plus, Trash, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import { uploadImage } from "../api";

type FileHolder = {
  id: string;
  file: File | null;
  caption: string;
  url: string;
};

const ImageUploads = ({
  urls,
  onSuccess,
  type,
}: {
  urls: string[];
  onSuccess: (value: string) => void;
  type: "word" | "figures";
}) => {
  // const [picking, setPicking] = useState(false);
  // const [files, setFiles] = useState<FileHolder[]>([]);
  // const [fileHolder, setFileHolder] = useState<FileHolder[]>([]);
  // const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);

  const allFilesSize = useRef(0);
  const maxFileSize = 10 * 1024 * 1024;
  const imageRef = useRef<HTMLInputElement>(null);

  const showImagePicker = () => {
    if (allFilesSize.current > maxFileSize)
      return toast.error(
        "Media Size Limit Reached! You cannot attach media files larger than 10mb.",
      );

    return imageRef.current?.click();
  };
  const handleFilePicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length <= 0)
      return toast.error(
        "You did not select any file. Kindly select one to proceed",
      );

    const file = e.target.files[0];

    if (file.size > maxFileSize) {
      return toast.error(
        "Size Limit Reached! You cannot attach an image larger than 3mb.",
      );
    }

    setLoading(true);

    e.target.value = "";

    handleUpload({ file });

    // const files = e.target.files;
    // const allFiles: FileHolder[] = [];

    // for (let i = 0; i < files.length; i++) {
    //   const fileSize = files[i].size;

    //   if (
    //     fileSize >= maxFileSize ||
    //     allFilesSize.current + fileSize >= maxFileSize
    //   ) {
    //     return toast.error(
    //       "Media Size Limit Reached! You cannot attach media files larger than 10mb.",
    //     );
    //   }

    //   setLoading(true);

    //   allFilesSize.current = allFilesSize.current + fileSize;

    //   let url;
    //   url = URL.createObjectURL(files[i]);

    //   const singleFile: FileHolder = {
    //     id: Date.now().toString() + "-" + i,
    //     file: files[i],
    //     caption: "",
    //     url,
    //   };

    //   allFiles.push(singleFile);
    // }

    // setFileHolder((prev) => [...prev, ...allFiles]);
    // e.target.value = "";

    // handleUpload({ files });
  };

  const formData = new FormData();

  const handleUpload = async ({ file }: { file: File }) => {
    formData.append("imageFile", file);
    formData.append("preferredFormat", "webp");
    formData.append("quality", "80");

    const token = getAccessToken();
    if (!token) return;

    const { msg, data } = await uploadImage({ token, formData, type });

    if (data) {
      console.log(data);
      onSuccess(data);
    }
    setLoading(false);
  };

  // const handleUpload = () => {
  // for (let i = 0; i < files.length; i++) {
  //   formData.append("files", files[i]);
  // }
  // formData.append("caption", mediaFile.caption);
  // setFiles(fileHolder);
  // setPicking(false);
  // };

  return (
    <div className=" flex flex-col rounded-md w-full h-fit ">
      <p className="mt-2">Image Uploads (Optional)</p>

      <div className="flex flex-wrap gap-4 w-full mt-4 relative">
        {loading && (
          <div className="h-32 relative w-32 rounded-md bg-gray-txt-50/50 group">
            <Loader
              size={24}
              className="animate-spin absolute top-14 left-14"
            />
          </div>
        )}

        {urls.map((url, id) => (
          <div
            key={id}
            // onClick={() => setSelected(id)}
            className="h-32 relative w-32 rounded-md bg-gray-txt-50/50 group"
          >
            <Image src={url} fill alt="Figure Image" className="rounded-md" />
            {/* <div className="hidden group-hover:flex w-80 absolute -bottom-16 left-0 z-20 px-5 py-2 dark-box text-sm rounded-md">
              {caption || "No caption added yet"}
            </div> */}
          </div>
        ))}

        <button
          disabled={loading}
          onClick={showImagePicker}
          className="h-32 w-32 flex items-center justify-center bg-gray-txt-50/10 rounded-md hover:border border-gray-txt-50/40 hover:cursor-pointer"
        >
          <Plus size={64} strokeWidth={1.2} />
          <input
            type="file"
            className="hidden"
            ref={imageRef}
            accept="image/*"
            onChange={handleFilePicker}
          />
        </button>
      </div>

      {/* {selected && (
        <CaptionModal
          onClose={() => setSelected("")}
          fileHolder={fileHolder.find((f) => f.id === selected)!}
          setFileCaption={(value: string) => {
            setFileHolder((prev) =>
              prev.map((item) =>
                item.id === selected ? { ...item, caption: value } : item,
              ),
            );
          }}
          deleteFile={() => {
            setFileHolder((prev) =>
              prev.filter((item) => item.id !== selected),
            );
            setSelected("");
          }}
        />
      )} */}
    </div>
  );
};

export default ImageUploads;

const CaptionModal = ({
  onClose,
  fileHolder,
  setFileCaption,
  deleteFile,
}: {
  onClose: () => void;
  fileHolder: FileHolder;
  setFileCaption: (value: string) => void;
  deleteFile: () => void;
}) => {
  const [caption, setCaption] = useState(fileHolder.caption);
  const handleDone = () => {
    if (caption.trim()) {
      setFileCaption(caption);
    }
    onClose();
  };
  return (
    <ModalLayout size="2xl">
      <div className="flex flex-col w-full items-start">
        <div className="flex w-full justify-between items-center mb-5 border-b border-gray-txt-50/50 pb-3">
          <p className="text-lg font-medium">Add Caption</p>

          <button onClick={onClose} className="w-fit cursor-pointer">
            <CircleX size={28} />
          </button>
        </div>

        <div className="h-48 w-64 relative rounded-md bg-gray-txt-50/50">
          <Image
            src={fileHolder.url}
            fill
            alt="Figure Image"
            className="rounded-md"
          />
        </div>
        <div className="mt-6 flex flex-col gap-2 w-full">
          <label htmlFor="caption">Caption</label>
          <input
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="input text-sm"
          />
        </div>

        <div className="flex items-center w-full gap-6 justify-center mt-5">
          <button
            onClick={deleteFile}
            className="secondary-btn hover:text-base-red hover:bg-white w-fit"
          >
            Delete This Image
          </button>

          <button onClick={handleDone} className="primary-btn px-14">
            Done
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};
