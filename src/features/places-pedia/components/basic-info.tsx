import Link from "next/link";
import { PlaceInfoStage } from "@/features/shared";
import BasicInfoForm from "./basic-info-form";
import LocationForm from "./location";

const BasicInfoStage = ({ stage }: { stage: PlaceInfoStage }) => {
  return (
    <>
      {stage === "basicInfo" && (
        <div className="dark-box w-full">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-white font-medium text-lg">1. Basic Info</h2>

            <div className="flex items-center gap-4">
              <Link
                href={`/guonopedia/places/add`}
                className="primary-btn font-medium"
              >
                Done
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 w-full gap-6  mt-8">
            <BasicInfoForm />

            <LocationForm />
          </div>
        </div>
      )}
    </>
  );
};

export default BasicInfoStage;
