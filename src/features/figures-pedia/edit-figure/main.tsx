import { GoBackButton } from "@/features/shared";
import React from "react";
import EditFigureProvider from "./components/context";
import { SaveBtn, Tabs, TabViewWrapper } from "./components";
import { Figure } from "../lib";
import {
  BiographyForm,
  FamilyForm,
  MetadataForm,
  PersonalForm,
} from "./components/forms";

const EditFigureFeature = async ({
  data,
}: {
  data: Promise<{ data: Figure }>;
}) => {
  const { data: figure } = await data;

  if (!figure) return <p className="text-white">No matching figure found</p>;

  return (
    <EditFigureProvider figure={figure}>
      <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 text-white font-open-sans">
        <div className="flex w-full justify-between items-center">
          <GoBackButton />
          <SaveBtn id={figure.id} />
        </div>

        <Tabs />

        <TabViewWrapper condition="personal">
          <PersonalForm />
        </TabViewWrapper>

        <TabViewWrapper condition="biography">
          <BiographyForm />
        </TabViewWrapper>

        <TabViewWrapper condition="family">
          <FamilyForm />
        </TabViewWrapper>

        <TabViewWrapper condition="metadata">
          <MetadataForm />
        </TabViewWrapper>
      </div>
    </EditFigureProvider>
  );
};

export default EditFigureFeature;
