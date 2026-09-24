import React from "react";
import Image from "next/image";
import { StopCircle, Volume2 } from "lucide-react";
import { PayloadData } from "@/features/dictionary/lib";

const PreviewSummary = ({
  data,
  playing,
  onPlay,
}: {
  data: PayloadData;
  playing: boolean;
  onPlay: () => void;
}) => {
  return (
    <div className="flex flex-col md:px-8 px-0 md:py-6 md:bg-gray-txt-100 md:my-5 max-md:mb-5 rounded-md w-full">
      <div className="flex flex-col dark-box max-md:px-3 gap-2">
        <div className="flex max-md:flex-col items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              {" "}
              <p className="text-2xl capitalize font-medium">{data.ota}</p>
              {data.oho[0]?.omra[0] && (
                <button onClick={onPlay} className="text-foreground-50">
                  {playing ? <StopCircle /> : <Volume2 />}
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <p className="text-gray-txt-50">{data.oho.length} Sense(s)</p>
              <span className="">
                Dialect:{" "}
                <span className="text-gray-txt-50 capitalize">
                  {data.erevwe}
                </span>
              </span>
              {data.otaOkpopko && (
                <p>
                  Creation Reason:{" "}
                  <span className="text-gray-txt-50">
                    {data.creationReason}
                  </span>
                </p>
              )}
            </div>
          </div>

          {data.image && (
            <div className="md:w-28 md:h-24 w-full h-40 shrink-0 rounded-md relative">
              <Image
                src={data.image}
                alt="word image"
                fill
                className="object-cover rounded-md"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewSummary;
