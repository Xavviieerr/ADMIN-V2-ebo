"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type Translation = {
    id: string;
    nameId: string;
    targetLanguage: string;
    translatedMeaning: string;
    equivalentName: string;
    priority: number;
    isPrimary: boolean;
    notes: string;
    createdById: string;
    createdAt: string;
    updatedAt: string;
    rowVersion: number;
};

const NameTranslation = ({ data }: { data: Translation[] }) => {
    const [index, setIndex] = useState(1);
    const total = data.length || 1;

    const next = () => {
        if (index < total) {
            setIndex((prev) => prev + 1);
        }
    };

    const prev = () => {
        if (index > 1) {
            setIndex((prev) => prev - 1);
        }
    };
    return (
        <div className=" flex flex-col md:px-8 px-4 py-6 bg-gray-txt-100 rounded-md w-full gap-5 h-fit">
            <div className="flex items-center gap-3 text-base font-medium">
                <div className="h-3 w-3 rounded-full bg-yellow-600" />
                <h2>Translations</h2>
            </div>

            <div className="flex flex-col gap-2">
                <p className="font-medium">Name</p>
                <p className="text-gray-txt-50 font-normal capitalize">{data[index - 1]?.translatedMeaning}</p>
            </div>

            <div className="flex flex-col gap-2">
                <p className="font-medium">Notes</p>
                <p className="text-gray-txt-50 font-normal capitalize">
                    {data[index - 1]?.notes || "N/A"}
                </p>
            </div>

            {total > 1 && <div className="flex w-full justify-end items-center gap-4 mt-5 text-base font-medium">
                <button
                    onClick={prev}
                    disabled={index <= 1}
                    className={`border ${index <= 1 ? "border-primary text-primary" : "border-gray-300 text-gray-400"} hover:border-2 transition-all duration-300 ease-in-out px-3 py-2 rounded-lg`}
                >
                    <ChevronLeft size={20} strokeWidth={1.2} />
                </button>

                <p>
                    {index}/{total}
                </p>
                <button
                    onClick={next}
                    disabled={index >= total}
                    className={`border ${index >= total ? "border-primary text-primary" : "border-gray-300 text-gray-400"} hover:border-2 transition-all duration-300 ease-in-out px-3 py-2 rounded-lg`}
                >
                    <ChevronRight size={20} strokeWidth={1.2} />
                </button>
            </div>}
        </div>
    );
};

export default NameTranslation;
