import React from "react";
import { GoBackButton, PermissionGate } from "@/features/shared";
import {
  RatingsSection,
  ReviewsList,
  SensesList,
  SingleWordProvider,
  Tabs,
  TabViewWrapper,
  TranslationList,
  WordDetailSection,
} from "./components/single-word";
import { ArrowLeftCircle, Info } from "lucide-react";
import { getServerAccessToken } from "@/features/auth/utils/serverTokenStorage";
import { fetchSingleWord } from "./lib/api";
import { SingleWord } from "./lib";
import Link from "next/link";
import {
  ReviewListWrapper,
  SenseListWrapper,
} from "./components/single-word/wrappers";
import DeleteWordBtn from "./components/single-word/buttons/delete-word";
import { fetchDialects } from "../shared/api";

const SingleWordFeature = async ({ id }: { id: string }) => {
  const token = await getServerAccessToken();
  const dialects: { id: string; name: string }[] = await fetchDialects({
    token: token as string,
  });
  const { msg, data }: { msg: string; data: SingleWord } =
    await fetchSingleWord({
      token: token as string,
      id,
    });

  if (!data)
    return (
      <div className="min-h-screen max-w-6xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8 text-white">
        <div className="flex flex-col items-center justify-center input py-7 gap-4 my-10">
          <Info size={52} className="text-base-red" strokeWidth={1.2} />
          <p className="text-lg">OOPS! We were unable to find this word...</p>
          <Link
            href={"/guonopedia/dictionary"}
            className="primary-btn px-10 flex items-center gap-3 py-2"
          >
            <ArrowLeftCircle width={16} /> Go Back
          </Link>
        </div>
      </div>
    );

  return (
    <SingleWordProvider>
      <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 text-white">
        <div className="flex w-full items-center justify-between">
          <GoBackButton />
          <PermissionGate permission="delete_word">
            <DeleteWordBtn data={data} />
          </PermissionGate>
        </div>

        <div className="dark-box w-full py-10 px-5">
          <WordDetailSection data={data} dialects={dialects} />

          <RatingsSection data={data} />

          <Tabs />

          <SenseListWrapper>
            <SensesList senses={data.oho} />
          </SenseListWrapper>

          <TabViewWrapper condition="translations">
            <TranslationList data={data} />
          </TabViewWrapper>

          <ReviewListWrapper>
            <ReviewsList ratings={data.wordRatings} />
          </ReviewListWrapper>

          {data.otaOkpopko && (
            <TabViewWrapper condition="senses">
              <section className="flex flex-col w-full mt-7 gap-3">
                <h3 className="text-lg font-medium">More Information</h3>

                <div
                  id="creation-reason"
                  className="flex flex-col gap-2 px-5 py-3 text-gray-txt-50 text-sm border border-gray-txt-50 bg-gray-txt-50/5 border-dashed rounded-md"
                >
                  <p className="">Creation Reason</p>
                  <p>{data.creationReason}</p>
                </div>
              </section>
            </TabViewWrapper>
          )}
        </div>
      </div>
    </SingleWordProvider>
  );
};

export default SingleWordFeature;
