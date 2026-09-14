import Link from "next/link";
import React from "react";
import { NameButtons, NameTranslation } from "./components";
import { GoBackButton, SingleName } from "../shared";
import { getServerAccessToken } from "@/features/auth/utils/serverTokenStorage";
import { fetchSingleName } from "./lib/api";

const SingleNameFeature = async ({ id }: { id: string }) => {
  const token = await getServerAccessToken();
  const data: SingleName = await fetchSingleName({
    token: token as string,
    id,
  });

  console.log(data);

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 text-white">
      <GoBackButton link="/guonopedia/names" />

      <div className="dark-box px-4 w-full space-y-6 pb-20">
        <div className="flex max-md:flex-col md:items-center justify-between gap-4">
          <div className="flex flex-col ">
            <p className="font-medium">Name</p>
            <h3 className="text-2xl font-medium capitalize">{data.name}</h3>
          </div>

          <NameButtons status={data.status} nameId={data.id} />
        </div>

        {data.rejectionReason && (
          <div className="flex flex-col md:px-8 px-4 py-6 bg-gray-txt-100 rounded-md w-full gap-3">
            <p className="text-red-400">Reason For Rejection</p>
            <p className="font-normal">{data.rejectionReason}</p>
          </div>
        )}

        <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-10">
          {/* Details */}
          <div className=" flex flex-col md:px-8 px-4 py-6 bg-gray-txt-100 rounded-md w-full gap-5">
            <div className="flex items-center gap-3 text-base font-medium">
              <div className="h-3 w-3 rounded-full bg-yellow-600" />
              <h2>Name Details</h2>
            </div>

            {/* Source, Type & Gender */}
            <div className="w-full grid grid-cols-3 gap-5">
              <div className="flex flex-col gap-2">
                <p className="font-medium">Type</p>
                <p className="capitalize text-gray-txt-50 font-normal">
                  {data.nameType.toLowerCase().includes("given")
                    ? "First Name"
                    : "Surname"}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-medium">Gender</p>
                <p className="capitalize text-gray-txt-50 font-normal">
                  {data.gender}
                </p>
              </div>

              {data.regionOfUse && (
                <div className="flex flex-col gap-2">
                  <p className="font-medium">Dialect</p>
                  <p className="text-gray-txt-50 font-normal capitalize">
                    {data.regionOfUse}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <p className="font-medium">Status</p>
                <p
                  className={`text-gray-txt-50 font-normal capitalize ${
                    data.status === "approved"
                      ? "text-base-green"
                      : data.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-500"
                  }`}
                >
                  {data.status}
                </p>
              </div>

              {data.pronunciation && (
                <div className="flex flex-col gap-2">
                  <p className="font-medium">Pronunciation</p>
                  <p className="text-gray-txt-50 font-normal">
                    /{data.pronunciation}/
                  </p>
                </div>
              )}

              {data.syllableCount > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="font-medium">Syllable Count</p>
                  <p className="text-gray-txt-50 font-normal">
                    {data.syllableCount}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-medium">Summary</p>
              <p className="text-gray-txt-50 font-normal">
                {data.culturalSignificance}
              </p>
            </div>

            {data.nameComposition.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="font-medium">Name Composition</p>
                <div className="flex flex-wrap items-center gap-3 w-full">
                  {data.nameComposition.map((item) => (
                    <Link
                      href={""}
                      key={item}
                      className="px-5 py-3 rounded-full text-sm border hover:border-primary w-fit"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {data.nicknames.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="font-medium">Nick Names</p>
                <div className="flex flex-wrap items-center gap-3 w-full">
                  {data.nicknames.map((item) => (
                    <Link
                      href={""}
                      key={item}
                      className="px-5 py-3 rounded-full text-sm border hover:border-primary w-fit"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {data.notableBearers.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="font-medium">Notable Bearers</p>
                <div className="flex flex-wrap items-center gap-3 w-full">
                  {data.notableBearers.map((item) => (
                    <Link
                      href={""}
                      key={item}
                      className="px-5 py-3 rounded-full text-sm border hover:border-primary w-fit"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Translations */}
          <NameTranslation data={data.translations} />
        </div>
      </div>
    </div>
  );
};

export default SingleNameFeature;
