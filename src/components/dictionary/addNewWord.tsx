"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller, useFormState, useWatch } from "react-hook-form";
import { z } from "zod";
import { OkpoFieldArray } from "../ui/fieldArrays/okpoFieldArray";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { X, Plus, Upload, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetAllProvinceNoPaginationQuery, useCreateWordMutation } from "@/slice/requestSlice";
import UploadModal from "./UploadModal";
import LoadingSpinner from "../ui/LoadingSpinner";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocale } from "@/contexts/LocaleContext";

/* -------------------- SCHEMAS -------------------- */
const omaSchema = z.object({
    type: z.string().optional(),
    url: z.string().optional(),
}).refine(
    (data) => {
        const hasType = data.type && data.type.trim().length > 0;
        const hasUrl = data.url && data.url.trim().length > 0;

        // If both are empty/undefined, it's valid (optional field)
        if (!hasType && !hasUrl) {
            return true;
        }

        // If type is provided, it must be non-empty (already checked above)
        // If url is provided, it must be a valid URL
        if (hasUrl) {
            try {
                new URL(data.url!);
                return true;
            } catch {
                return false;
            }
        }

        // If only type is provided (no URL), that's also valid (user might select type before uploading)
        return true;
    },
    {
        message: "URL must be a valid URL when provided",
    }
);

const idjeSchema = z.object({
    sentence: z.string().optional(),
    audioUrl: z.string().optional(),
}).refine(
    (data) => {
        const hasSentence = data.sentence && data.sentence.trim().length > 0;
        const hasAudioUrl = data.audioUrl && data.audioUrl.trim().length > 0;

        // If both are empty/undefined, it's invalid (at least sentence is required)
        if (!hasSentence && !hasAudioUrl) {
            return false;
        }

        // If audioUrl is provided, it must be a valid URL
        if (hasAudioUrl) {
            try {
                new URL(data.audioUrl!);
                return true;
            } catch {
                return false;
            }
        }

        // If only sentence is provided, that's valid
        return true;
    },
    {
        message: "Sentence is required, and audioUrl must be a valid URL when provided",
    }
);

const translationSchema = z.object({
    ota: z.string().min(1, "Headword is required"),
    ekerota: z.array(z.string()).refine(
        (arr) => arr.filter((item) => item.trim().length > 0).length > 0,
        { message: "At least one part of speech is required" }
    ),
    oto: z.string().min(1, "Definition required"),
    otoOmra: z.string().refine(
        (url) => {
            if (!url || url.trim().length === 0) return true; // Optional
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        },
        { message: "Must be a valid audio URL" }
    ).optional(),
    idje: z.array(idjeSchema).refine(
        (arr) => arr.filter((item) => item.sentence && item.sentence.trim().length > 0).length > 0,
        { message: "At least one example sentence is required" }
    ),
    omra: z.array(z.string()).refine(
        (arr) => {
            if (!arr || arr.length === 0) return true;
            // Filter out empty strings and validate remaining URLs
            const nonEmpty = arr.filter((item) => item && item.trim().length > 0);
            if (nonEmpty.length === 0) return true; // All empty is valid for optional
            // Validate that all non-empty strings are valid URLs
            return nonEmpty.every((url) => {
                try {
                    new URL(url);
                    return true;
                } catch {
                    return false;
                }
            });
        },
        { message: "Must be a valid audio URL" }
    ).optional(),
    oma: z.array(omaSchema).optional(),
    okpo: z
        .array(
            z.object({
                ota: z.string(),
                egba: z.enum(["gan", "guo", "strong", "Not strong"]).optional(),
            })
        )
        .optional(),
    uphoesio: z.string().min(1, "Phonetic Alphabet Required"),
    upho: z.string().min(1, "Pronunciation required"),
    orhan: z.array(z.string()).optional(),
    ibuebu: z.array(z.string()).optional(),
    ekaeruo: z.array(z.string()).optional(),
    odeUfue: z.array(z.string()).optional(),
});

// Korean translation schema with all fields optional (will be conditionally validated)
const koreanTranslationSchema = z.object({
    ota: z.string().optional(),
    ekerota: z.array(z.string()).optional(),
    oto: z.string().optional(),
    otoOmra: z.string().refine(
        (url) => {
            if (!url || url.trim().length === 0) return true; // Optional
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        },
        { message: "Must be a valid audio URL" }
    ).optional(),
    idje: z.array(z.object({
        sentence: z.string().optional(),
        audioUrl: z.string().optional(),
    })).optional(),
    omra: z.array(z.string()).refine(
        (arr) => {
            if (!arr || arr.length === 0) return true;
            // Filter out empty strings and validate remaining URLs
            const nonEmpty = arr.filter((item) => item && item.trim().length > 0);
            if (nonEmpty.length === 0) return true; // All empty is valid for optional
            // Validate that all non-empty strings are valid URLs
            return nonEmpty.every((url) => {
                try {
                    new URL(url);
                    return true;
                } catch {
                    return false;
                }
            });
        },
        { message: "Must be a valid audio URL" }
    ).optional(),
    oma: z.array(omaSchema).optional(),
    okpo: z
        .array(
            z.object({
                ota: z.string(),
                egba: z.enum(["gan", "guo", "strong", "Not strong"]).optional(),
            })
        )
        .optional(),
    uphoesio: z.string().optional(),
    upho: z.string().optional(),
    orhan: z.array(z.string()).optional(),
    ibuebu: z.array(z.string()).optional(),
    ekaeruo: z.array(z.string()).optional(),
    odeUfue: z.array(z.string()).optional(),
}).superRefine((data, ctx) => {
    // Only validate required fields if there's any data in Korean translation
    if (!hasKoreanTranslationData(data)) {
        return; // No data, skip validation
    }
    
    // If Korean translation has any data, validate all required fields
    if (!data.ota || data.ota.trim().length === 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Headword is required",
            path: ["ota"],
        });
    }
    
    if (!data.ekerota || data.ekerota.filter((item: string) => item && item.trim().length > 0).length === 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "At least one part of speech is required",
            path: ["ekerota"],
        });
    }
    
    if (!data.oto || data.oto.trim().length === 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Definition required",
            path: ["oto"],
        });
    }
    
    // Validate idje - require at least one sentence when Korean translation has data
    if (!data.idje || data.idje.filter((item: any) => item.sentence && item.sentence.trim().length > 0).length === 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "At least one example sentence is required",
            path: ["idje"],
        });
    }
    
    // Validate audioUrl format in idje items if provided
    if (data.idje && Array.isArray(data.idje)) {
        data.idje.forEach((item: any, index: number) => {
            if (item.audioUrl && item.audioUrl.trim().length > 0) {
                try {
                    new URL(item.audioUrl);
                } catch {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Must be a valid audio URL",
                        path: ["idje", index, "audioUrl"],
                    });
                }
            }
        });
    }
    
    if (!data.uphoesio || data.uphoesio.trim().length === 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Phonetic Alphabet Required",
            path: ["uphoesio"],
        });
    }
    
    if (!data.upho || data.upho.trim().length === 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Pronunciation required",
            path: ["upho"],
        });
    }
});


// Helper function to check if Korean translation has any non-empty values
function hasKoreanTranslationData(kor: any): boolean {
    if (!kor) return false;
    
    // Check main fields
    if (kor.ota && kor.ota.trim().length > 0) return true;
    if (kor.oto && kor.oto.trim().length > 0) return true;
    if (kor.upho && kor.upho.trim().length > 0) return true;
    if (kor.uphoesio && kor.uphoesio.trim().length > 0) return true;
    
    // Check arrays
    if (kor.ekerota && kor.ekerota.some((item: string) => item && item.trim().length > 0)) return true;
    if (kor.idje && kor.idje.some((item: any) => item.sentence && item.sentence.trim().length > 0)) return true;
    if (kor.omra && kor.omra.some((item: string) => item && item.trim().length > 0)) return true;
    if (kor.oma && kor.oma.some((item: any) => (item.type && item.type.trim().length > 0) || (item.url && item.url.trim().length > 0))) return true;
    if (kor.okpo && kor.okpo.some((item: any) => item.ota && item.ota.trim().length > 0)) return true;
    if (kor.orhan && kor.orhan.some((item: string) => item && item.trim().length > 0)) return true;
    if (kor.ibuebu && kor.ibuebu.some((item: string) => item && item.trim().length > 0)) return true;
    if (kor.ekaeruo && kor.ekaeruo.some((item: string) => item && item.trim().length > 0)) return true;
    if (kor.odeUfue && kor.odeUfue.some((item: string) => item && item.trim().length > 0)) return true;
    if (kor.otoOmra && kor.otoOmra.trim().length > 0) return true;
    
    return false;
}

const ohochema = z.object({
    kere: z.number().optional(),
    uphoesio: z.string().min(1, "Phonetic Alphabet Required"),
    upho: z.string().min(1, "Secondary pronunciation required"),
    ekerota: z.array(z.string()).refine(
        (arr) => arr.filter((item) => item.trim().length > 0).length > 0,
        { message: "At least one part of speech is required" }
    ),
    oto: z.string().min(1, "Definition required"),
    otoOmra: z.string().refine(
        (url) => {
            if (!url || url.trim().length === 0) return true; // Optional
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        },
        { message: "Must be a valid audio URL" }
    ).optional(),
    idje: z.array(idjeSchema).refine(
        (arr) => arr.filter((item) => item.sentence && item.sentence.trim().length > 0).length > 0,
        { message: "At least one example sentence is required" }
    ),
    omra: z.array(z.string()).refine(
        (arr) => {
            if (!arr || arr.length === 0) return true;
            // Filter out empty strings and validate remaining URLs
            const nonEmpty = arr.filter((item) => item && item.trim().length > 0);
            if (nonEmpty.length === 0) return true; // All empty is valid for optional
            // Validate that all non-empty strings are valid URLs
            return nonEmpty.every((url) => {
                try {
                    new URL(url);
                    return true;
                } catch {
                    return false;
                }
            });
        },
        { message: "Must be a valid audio URL" }
    ).optional(),
    oma: z.array(omaSchema).optional(),
    odeUfue: z.array(z.string()).optional(),
    okpo: z
        .array(
            z.object({
                ota: z.string(),
                egba: z.enum(["gan", "guo", "strong", "Not strong"]).optional(),
            })
        )
        .optional(),
    orhan: z.array(z.string()).optional(),
    ibuebu: z.array(z.string()).optional(),
    ekaeruo: z.array(z.string()).optional(),
    translations: z.object({
        eng: translationSchema,
        kor: koreanTranslationSchema.optional(), // Korean translation is optional
    }),
});

export const createWordSchema = z.object({
    ota: z.string().min(1, "Word is required"),
    // oka: z.number().min(1, "Priority is required"),
    erevwe: z.string().min(1, "Dialect is required"),
    otaOkpopko: z.boolean().optional(),
    creationReason: z.string().optional(),
    // omra: z.array(z.string()).optional(),
    // oma: z.array(omaSchema).optional(),
    oho: z.array(ohochema),
});

/* -------------------- COMPONENT -------------------- */
export default function AddNewWord() {
    const { locale } = useLocale();
    const { t } = useTranslation(locale);
    const router = useRouter();
    const form = useForm<z.infer<typeof createWordSchema>>({
        resolver: zodResolver(createWordSchema),
        defaultValues: {
            ota: "",
            erevwe: "standard",
            // oka: 1,
            otaOkpopko: false,
            creationReason: "",
            // omra: [""],
            // oma: [{ type: "", url: "" }],
            oho: [
                {
                    kere: 1,
                    uphoesio: "",
                    upho: "",
                    ekerota: [""],
                    oto: "",
                    otoOmra: "",
                    idje: [{ sentence: "", audioUrl: "" }],
                    omra: [""],
                    oma: [{ type: "", url: "" }],
                    odeUfue: [""],
                    okpo: [{ ota: "", egba: undefined as "gan" | "guo" | "strong" | "Not strong" | undefined }],
                    orhan: [""],
                    ibuebu: [""],
                    ekaeruo: [""],
                    translations: {
                        eng: {
                            ota: "",
                            ekerota: [""],
                            oto: "",
                            otoOmra: "",
                            idje: [{ sentence: "", audioUrl: "" }],
                            omra: [""],
                            oma: [{ type: "", url: "" }],
                            okpo: [{ ota: "", egba: undefined as "gan" | "guo" | "strong" | "Not strong" | undefined }],
                            uphoesio: "",
                            upho: "",
                            orhan: [""],
                            ibuebu: [""],
                            ekaeruo: [""],
                            odeUfue: [""],
                        },
                        kor: {
                            ota: "",
                            ekerota: [""],
                            oto: "",
                            otoOmra: "",
                            idje: [{ sentence: "", audioUrl: "" }],
                            omra: [""],
                            oma: [{ type: "", url: "" }],
                            okpo: [{ ota: "", egba: undefined as "gan" | "guo" | "strong" | "Not strong" | undefined }],
                            uphoesio: "",
                            upho: "",
                            orhan: [""],
                            ibuebu: [""],
                            ekaeruo: [""],
                            odeUfue: [""],
                        },
                    },
                },
            ],
        },
    });

    // State for storing upload responses
    const [ohoAudioUploads, setOhoAudioUploads] = useState<Record<string, string>>({});
    const [ohoImageUploads, setOhoImageUploads] = useState<Record<string, string>>({});
    const [translationAudioUploads, setTranslationAudioUploads] = useState<Record<string, string>>({});
    const [translationImageUploads, setTranslationImageUploads] = useState<Record<string, string>>({});
    
    // State for tracking Korean translation visibility for each sense
    const [showKoreanTranslation, setShowKoreanTranslation] = useState<Set<number>>(new Set());

    const { data: namesOfProvinces, isLoading, isError, error } = useGetAllProvinceNoPaginationQuery();
    const [createWord, { isLoading: isCreatingWord }] = useCreateWordMutation();

    console.log("Oho Audio Uploads:", ohoAudioUploads);
    console.log("Oho Image Uploads:", ohoImageUploads);
    console.log("Translation Audio Uploads:", translationAudioUploads);
    console.log("Translation Image Uploads:", translationImageUploads);

    const provinces = namesOfProvinces?.data

    const { control, handleSubmit, watch, setValue } = form;

    const { fields: senseFields, append, remove } = useFieldArray({
        control,
        name: "oho",
    });

    console.log("Form values:", form.getValues());
    console.log("Form errors:", form.formState.errors);

    const oho = watch("oho");


    // Helper function to clean empty optional fields
    function cleanPayload(data: z.infer<typeof createWordSchema>) {
        const cleaned: any = {
            ...data,
            oho: data.oho.map((sense, index) => {
                const cleanedSense: any = {
                    ...sense,
                    kere: index + 1,
                };

                // Remove empty otoOmra if present
                if (cleanedSense.otoOmra && (!cleanedSense.otoOmra || cleanedSense.otoOmra.trim().length === 0)) {
                    delete cleanedSense.otoOmra;
                }

                // Clean idje array (array of objects with sentence and audioUrl)
                if (cleanedSense.idje) {
                    const nonEmptyIdje = cleanedSense.idje
                        .filter((item: any) => item.sentence && item.sentence.trim().length > 0)
                        .map((item: any) => {
                            const cleaned: any = { sentence: item.sentence };
                            if (item.audioUrl && item.audioUrl.trim().length > 0) {
                                cleaned.audioUrl = item.audioUrl;
                            }
                            return cleaned;
                        });
                    if (nonEmptyIdje.length === 0) {
                        delete cleanedSense.idje;
                    } else {
                        cleanedSense.idje = nonEmptyIdje;
                    }
                }

                // Remove empty optional array fields from sense
                const optionalArrayFields = ['omra', 'orhan', 'ibuebu', 'odeUfue', 'ekaeruo'];
                optionalArrayFields.forEach(field => {
                    if (cleanedSense[field]) {
                        const nonEmpty = cleanedSense[field].filter((item: string) => item && item.trim().length > 0);
                        if (nonEmpty.length === 0) {
                            delete cleanedSense[field];
                        } else {
                            cleanedSense[field] = nonEmpty;
                        }
                    }
                });

                // Clean oma array (array of objects)
                if (cleanedSense.oma) {
                    const nonEmptyOma = cleanedSense.oma.filter((item: any) => {
                        const hasType = item.type && item.type.trim().length > 0;
                        const hasUrl = item.url && item.url.trim().length > 0;
                        return hasType || hasUrl;
                    });
                    if (nonEmptyOma.length === 0) {
                        delete cleanedSense.oma;
                    } else {
                        cleanedSense.oma = nonEmptyOma;
                    }
                }

                // Clean okpo array (array of objects)
                if (cleanedSense.okpo) {
                    const nonEmptyOkpo = cleanedSense.okpo.filter((item: any) => {
                        return item.ota && item.ota.trim().length > 0;
                    });
                    if (nonEmptyOkpo.length === 0) {
                        delete cleanedSense.okpo;
                    } else {
                        cleanedSense.okpo = nonEmptyOkpo;
                    }
                }

                // Clean translations
                if (cleanedSense.translations) {
                    const cleanedTranslations: any = {};

                    ['eng', 'kor'].forEach(lang => {
                        if (cleanedSense.translations[lang]) {
                            const translation = cleanedSense.translations[lang];
                            
                            // For Korean translation, check if it has any data before processing
                            if (lang === 'kor' && !hasKoreanTranslationData(translation)) {
                                // Skip empty Korean translation
                                return;
                            }
                            
                            cleanedTranslations[lang] = { ...translation };

                            // Remove empty otoOmra if present
                            if (cleanedTranslations[lang].otoOmra && (!cleanedTranslations[lang].otoOmra || cleanedTranslations[lang].otoOmra.trim().length === 0)) {
                                delete cleanedTranslations[lang].otoOmra;
                            }

                            // Clean idje array in translations
                            if (cleanedTranslations[lang].idje) {
                                const nonEmptyIdje = cleanedTranslations[lang].idje
                                    .filter((item: any) => item.sentence && item.sentence.trim().length > 0)
                                    .map((item: any) => {
                                        const cleaned: any = { sentence: item.sentence };
                                        if (item.audioUrl && item.audioUrl.trim().length > 0) {
                                            cleaned.audioUrl = item.audioUrl;
                                        }
                                        return cleaned;
                                    });
                                if (nonEmptyIdje.length === 0) {
                                    delete cleanedTranslations[lang].idje;
                                } else {
                                    cleanedTranslations[lang].idje = nonEmptyIdje;
                                }
                            }

                            // Remove empty optional array fields from translations
                            optionalArrayFields.forEach(field => {
                                if (cleanedTranslations[lang][field]) {
                                    const nonEmpty = cleanedTranslations[lang][field].filter((item: string) => item && item.trim().length > 0);
                                    if (nonEmpty.length === 0) {
                                        delete cleanedTranslations[lang][field];
                                    } else {
                                        cleanedTranslations[lang][field] = nonEmpty;
                                    }
                                }
                            });

                            // Clean oma array in translations
                            if (cleanedTranslations[lang].oma) {
                                const nonEmptyOma = cleanedTranslations[lang].oma.filter((item: any) => {
                                    const hasType = item.type && item.type.trim().length > 0;
                                    const hasUrl = item.url && item.url.trim().length > 0;
                                    return hasType || hasUrl;
                                });
                                if (nonEmptyOma.length === 0) {
                                    delete cleanedTranslations[lang].oma;
                                } else {
                                    cleanedTranslations[lang].oma = nonEmptyOma;
                                }
                            }

                            // Clean okpo array in translations
                            if (cleanedTranslations[lang].okpo) {
                                const nonEmptyOkpo = cleanedTranslations[lang].okpo.filter((item: any) => {
                                    return item.ota && item.ota.trim().length > 0;
                                });
                                if (nonEmptyOkpo.length === 0) {
                                    delete cleanedTranslations[lang].okpo;
                                } else {
                                    cleanedTranslations[lang].okpo = nonEmptyOkpo;
                                }
                            }
                        }
                    });

                    cleanedSense.translations = cleanedTranslations;
                }

                return cleanedSense;
            }),
        };

        // Ensure otaOkpopko is always a boolean (defaults to false if undefined)
        cleaned.otaOkpopko = cleaned.otaOkpopko ?? false;

        // Only include creationReason if otaOkpopko is true
        if (!cleaned.otaOkpopko) {
            delete cleaned.creationReason;
        } else if (cleaned.creationReason && cleaned.creationReason.trim().length === 0) {
            delete cleaned.creationReason;
        }

        // Clean word-level omra array
        if (cleaned.omra) {
            const nonEmptyOmra = cleaned.omra.filter((item: string) => item && item.trim().length > 0);
            if (nonEmptyOmra.length === 0) {
                delete cleaned.omra;
            } else {
                cleaned.omra = nonEmptyOmra;
            }
        }

        // Clean word-level oma array
        if (cleaned.oma) {
            const nonEmptyOma = cleaned.oma.filter((item: any) => {
                const hasType = item.type && item.type.trim().length > 0;
                const hasUrl = item.url && item.url.trim().length > 0;
                return hasType || hasUrl;
            });
            if (nonEmptyOma.length === 0) {
                delete cleaned.oma;
            } else {
                cleaned.oma = nonEmptyOma;
            }
        }

        return cleaned;
    }

    async function onSubmit(values: z.infer<typeof createWordSchema>) {
        try {
            const formatted = cleanPayload(values);

            console.log("Formatted Request:", formatted);

            const result = await createWord(formatted).unwrap();
            console.log("Word created successfully:", result);
            toast.success(t('messages.wordCreatedSuccessfully', 'Word created successfully'));

            // Reset form after successful creation
            router.back();
            form.reset();

        } catch (error) {
            console.error("Error creating word:", error);
            toast.error(getErrorMessage(error, t('messages.errorCreatingWord', 'Error creating word')));
        }
    }

    return (
        <div className="w-full mx-auto px-3 sm:px-2 lg:px-5">
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Accordion type="multiple" className="w-full">
                        {/* Word Details */}
                        <AccordionItem value="word-details">
                            <AccordionTrigger className="text-lg">
                                {t('common.wordDetails', 'Word Details')}
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg p-3 lg:p-4 bg-[#2a2a2a]">
                                    <FormField
                                        control={control}
                                        name="ota"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder={`${t('common.ota', 'Ota')} *`}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="otaOkpopko"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-4 bg-[#1e1e1e]">
                                                <div className="space-y-0.5">
                                                    <FormControl>
                                                        <span className="text-sm font-medium text-white accent-color-[#F5DEB3]">
                                                            {t('common.otaOkpopko', 'OtaOkpopko')} ({t('common.newWord', 'New Word')}?)
                                                        </span>
                                                    </FormControl>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value || false}
                                                        onCheckedChange={field.onChange}
                                                        className="data-[state=checked]:bg-[#F5DEB3]! data-[state=checked]:border-[#F5DEB3]"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {watch("otaOkpopko") && (
                                        <FormField
                                            control={control}
                                            name="creationReason"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                        {...field}
                                                        placeholder={`${t('common.wordExplanation', 'Formation Explanation')} *`}
                                                    />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}

                                    <FormField
                                        control={control}
                                        name="erevwe"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl className="">
                                                    <select
                                                        {...field}
                                                        className="bg-[#1e1e1e] border p-2 rounded-md w-full text-white"
                                                    >
                                                        <option value="" className="text-white">
                                                            {t('common.erevwe', 'Erevwe')} *
                                                        </option>
                                                        {provinces?.map((opt, index) => (
                                                            <option key={index} value={opt.name} className="text-white">
                                                                {opt.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                               
                            </AccordionContent>
                        </AccordionItem>

                        {/* oho */}
                        <AccordionItem value="oho">
                            <AccordionTrigger className="text-lg">
                                {t('common.oho', 'Oho')}
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-6">
                                    {senseFields.map((sense, index) => (
                                        <div
                                            key={sense.id}
                                            className="relative shadow-md rounded-lg bg-[#1e1e1e] "
                                        >
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>

                                            {/* Pronunciations + style */}
                                            <div className="rounded-lg p-3 lg:p-4 bg-[#2a2a2a]">
                                                <div className="lg:col-span-2 mb-4">
                                                    <MultiSelectArray
                                                        control={control}
                                                        name={`oho.${index}.ekerota`}
                                                        label={t('common.ekerota', 'Eghọ rẹ Ejajẹ')}
                                                        required={true}
                                                        options={[
                                                            "Odẹ",
                                                            "ẹdiodẹ",
                                                            "Odjephia",
                                                            "Eruo",
                                                            "Eruodẹ",
                                                            "Eruoga",
                                                            "Odjedia",
                                                            "Ọrhuọ",
                                                            "Ukperi",
                                                            "Ubi"
                                                        ]}
                                                        t={t}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
                                                    {/* Column 1: oma, omra, okpo, orhan, odeUfue */}
                                                    <div className="space-y-6">
                                                        <div>
                                                            <AudioFieldArray
                                                                control={control}
                                                                name={`oho.${index}.omra`}
                                                                label={t('common.omra', 'Omra')}
                                                                uploadState={ohoAudioUploads}
                                                                setUploadState={setOhoAudioUploads}
                                                                setValue={setValue}
                                                                t={t}
                                                            />
                                                        </div>

                                                        <div>
                                                            <OmaFieldArray
                                                                control={control}
                                                                name={`oho.${index}.oma`}
                                                                label={t('common.oma', 'Oma')}
                                                                uploadState={ohoImageUploads}
                                                                setUploadState={setOhoImageUploads}
                                                                setValue={setValue}
                                                                t={t}
                                                            />
                                                        </div>

                                                        <div>
                                                            <OkpoFieldArray
                                                                control={control}
                                                                name={`oho.${index}.okpo`}
                                                                label={t('common.okpo', 'Okpo')}
                                                            />
                                                        </div>

                                                        <div>
                                                            <DynamicFieldArray
                                                                control={control}
                                                                name={`oho.${index}.orhan`}
                                                                label={t('common.orhan', 'Orhan')}
                                                                buttonText={t('common.opposite', 'Opposite')}
                                                                required={false}
                                                                t={t}
                                                            />
                                                        </div>

                                                        <div>
                                                            <DynamicFieldArray control={control} name={`oho.${index}.odeUfue`} label={t('common.odeUfue', 'OdẹUfue')} buttonText={t('common.scientificName', 'Scientific Name')} t={t} />
                                                        </div>
                                                    </div>

                                                    {/* Column 2: upho, uphoesio, oto, idje, ibuebu */}
                                                    <div className="space-y-[35px]">
                                                        <div>
                                                            <FormField
                                                                control={control}
                                                                name={`oho.${index}.upho`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <Input {...field} placeholder={`${t('common.upho', 'Ubiupho')} *`} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>

                                                        <div>
                                                            <FormField
                                                                control={control}
                                                                name={`oho.${index}.uphoesio`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <Input {...field} placeholder={`${t('common.uphoesio', 'IPA')} *`} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>

                                                        <div>
                                                            <FormField
                                                                control={control}
                                                                name={`oho.${index}.oto`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <Input
                                                                                {...field}
                                                                                placeholder={`${t('common.oto', 'Otọ')} *`}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>

                                                        <div>
                                                            <IdjeFieldArray
                                                                control={control}
                                                                name={`oho.${index}.otoOmra`}
                                                                label={t('common.otoOmra', 'OtoOmra')}
                                                                uploadState={ohoAudioUploads}
                                                                setUploadState={setOhoAudioUploads}
                                                                setValue={setValue}
                                                                t={t}
                                                            />
                                                        </div>

                                                        <div>
                                                            <IdjeSentenceFieldArray
                                                                control={control}
                                                                name={`oho.${index}.idje`}
                                                                label={t('common.idje', 'Udje')}
                                                                buttonText={t('common.addExample', 'Ba Udje')}
                                                                required={true}
                                                                uploadState={ohoAudioUploads}
                                                                setUploadState={setOhoAudioUploads}
                                                                setValue={setValue}
                                                                t={t}
                                                            />
                                                        </div>

                                                        <div className="">
                                                            <DynamicFieldArray
                                                                control={control}
                                                                name={`oho.${index}.ibuebu`}
                                                                label={t('common.ibuebu', 'Ebuo')}
                                                                buttonText={t('common.plural', 'Ebuo')}
                                                                required={false}
                                                                t={t}
                                                            />
                                                        </div>

                                                        <div>
                                                            <DynamicFieldArray
                                                                control={control}
                                                                name={`oho.${index}.ekaeruo`}
                                                                label={t('common.ekaeruo', 'Oka Eruo')}
                                                                buttonText={t('common.verbTypes', 'Oka Eruo')}
                                                                required={false}
                                                                t={t}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Translations */}
                                            <div className="mt-6 space-y-6">
                                                <TranslationSection
                                                    control={control}
                                                    index={index}
                                                    lang="eng"
                                                    title={t('common.englishTranslation', 'English Translation')}
                                                    translationAudioUploads={translationAudioUploads}
                                                    setTranslationAudioUploads={setTranslationAudioUploads}
                                                    translationImageUploads={translationImageUploads}
                                                    setTranslationImageUploads={setTranslationImageUploads}
                                                    setValue={setValue}
                                                    t={t}
                                                />
                                                
                                                {/* Toggle button for Korean Translation */}
                                                <div className="flex justify-center">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => {
                                                            const newSet = new Set(showKoreanTranslation);
                                                            if (newSet.has(index)) {
                                                                newSet.delete(index);
                                                            } else {
                                                                newSet.add(index);
                                                            }
                                                            setShowKoreanTranslation(newSet);
                                                        }}
                                                        className="cursor-pointer bg-[#2a2a2a] text-white border-white/20 hover:bg-[#3a3a3a] hover:border-white/40"
                                                    >
                                                        {showKoreanTranslation.has(index) ? (
                                                            <>
                                                                <ChevronUp className="mr-2 h-4 w-4" />
                                                                {t('common.hide', 'Hide')} {t('common.koreanTranslation', 'Korean Translation')}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ChevronDown className="mr-2 h-4 w-4" />
                                                                {t('common.add', 'Add')} {t('common.koreanTranslation', 'Korean Translation')}
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>

                                                {/* Conditionally render Korean Translation */}
                                                {showKoreanTranslation.has(index) && (
                                                    <TranslationSection
                                                        control={control}
                                                        index={index}
                                                        lang="kor"
                                                        title={t('common.koreanTranslation', 'Korean Translation')}
                                                        translationAudioUploads={translationAudioUploads}
                                                        setTranslationAudioUploads={setTranslationAudioUploads}
                                                        translationImageUploads={translationImageUploads}
                                                        setTranslationImageUploads={setTranslationImageUploads}
                                                        setValue={setValue}
                                                        t={t}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    <div className="flex justify-end w-full">
                                        <Button
                                            type="button"
                                            variant="default"
                                            className="cursor-pointer bg-[#F5DEB3] text-[#1e1e1e] hover:bg-[#f5deb3] disabled:opacity-50"
                                            onClick={() =>
                                                append(form.getValues("oho")[0])
                                            }
                                        >
                                            <Plus className="mr-2 h-4 w-4" /> {t('common.addSense', 'Ba Ọhọ')}
                                        </Button>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <div className="flex justify-center sm:justify-end w-full">
                        <Button
                            type="submit"
                            disabled={isCreatingWord}
                            className="mt-4 w-full cursor-pointer bg-[#F5DEB3] text-[#1e1e1e] hover:bg-[#f5deb3] disabled:opacity-50"
                        >
                            {isCreatingWord ? (
                                <>
                                    <LoadingSpinner size="sm" className="mr-2" />
                                    {t('common.creatingWord', 'Creating Word...')}
                                </>
                            ) : (
                                t('common.submit', 'Submit')
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

/* -------------------- HELPERS -------------------- */
function IdjeFieldArray({
    control,
    name,
    label,
    uploadState,
    setUploadState,
    setValue,
    t
}: {
    control: any;
    name: string;
    label: string;
    uploadState: Record<string, string>;
    setUploadState: (state: Record<string, string>) => void;
    setValue: any;
    t: (key: string, fallback: string) => string;
}) {
    const handleAudioUpload = (url: string) => {
        setValue(name, url);
        setUploadState({
            ...uploadState,
            [name]: url
        });
        toast.success("Audio URL successfully added to form!");
    };

    const currentValue = control._getWatch(name);
    const hasUpload = uploadState[name] || currentValue;

    return (
        <div className="mt-4">
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                                <UploadModal
                                    type="audio"
                                    onUrlSelect={handleAudioUpload}
                                >
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="w-full sm:w-auto whitespace-nowrap cursor-pointer bg-[#F5DEB3]! text-[#1e1e1e]! border-[#F5DEB3]! hover:bg-[#f0d4a0]! hover:!border-[#f0d4a0]! font-medium"
                                    >
                                        <Upload className="h-4 w-4 mr-1" />
                                        {label}
                                    </Button>
                                </UploadModal>
                                {hasUpload && (
                                    <span className="text-green-400 text-sm font-medium">
                                        {t('common.audioUploaded', 'Audio uploaded')}
                                    </span>
                                )}
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}

function IdjeSentenceFieldArray({
    control,
    name,
    label,
    buttonText,
    required = false,
    uploadState,
    setUploadState,
    setValue,
    t
}: {
    control: any;
    name: string;
    label: string;
    buttonText?: string;
    required?: boolean;
    uploadState: Record<string, string>;
    setUploadState: (state: Record<string, string>) => void;
    setValue: any;
    t: (key: string, fallback: string) => string;
}) {
    const { fields, append, remove } = useFieldArray({ control, name });
    const { errors } = useFormState({ control });

    const getFieldError = (fieldPath: string) => {
        const pathParts = fieldPath.split('.');
        let error: any = errors;
        for (const part of pathParts) {
            if (error && typeof error === 'object' && part in error) {
                error = error[part];
            } else {
                return null;
            }
        }
        return error;
    };

    const fieldError = getFieldError(name);

    useEffect(() => {
        if (fields.length === 0) append({ sentence: "", audioUrl: "" });
    }, [fields, append]);
    
    const handleAudioUpload = (url: string, idx: number) => {
        setValue(`${name}.${idx}.audioUrl`, url);
        const uploadKey = `${name}.${idx}.audioUrl`;
        setUploadState({
            ...uploadState,
            [uploadKey]: url
        });
        toast.success("Audio URL successfully added!");
    };

    return (
        <div className="mt-4">
            <div className="space-y-4">
                {fields.map((field, idx) => {
                    const uploadKey = `${name}.${idx}.audioUrl`;
                    const hasUpload = uploadState[uploadKey] || control._getWatch(`${name}.${idx}.audioUrl`);
                    const sentenceValue = control._getWatch(`${name}.${idx}.sentence`) || "";

                    return (
                        <div key={field.id} className="space-y-2 p-3 bg-[#2a2a2a] rounded-lg">
                            <div className="flex flex-col gap-2">
                                <Controller
                                    control={control}
                                    name={`${name}.${idx}.sentence`}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder={`${label} - ${t('common.sentence', 'Sentence')}${required ? ' *' : ''}`}
                                            className="w-full"
                                        />
                                    )}
                                />
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                                    <UploadModal
                                        type="audio"
                                        onUrlSelect={(url) => handleAudioUpload(url, idx)}
                                    >
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="w-full sm:w-auto whitespace-nowrap cursor-pointer bg-[#F5DEB3]! text-[#1e1e1e]! border-[#F5DEB3]! hover:bg-[#f0d4a0]! hover:!border-[#f0d4a0]! font-medium"
                                        >
                                            <Upload className="h-4 w-4 mr-1" />
                                            {t('common.addAudio', 'Add Audio')}
                                        </Button>
                                    </UploadModal>
                                    {hasUpload && (
                                        <span className="text-green-400 text-sm font-medium">
                                            {t('common.audioUploaded', 'Audio uploaded')}
                                        </span>
                                    )}
                                    {fields.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => remove(idx)}
                                            className="text-red-400 hover:text-red-600 self-start sm:self-center"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {required && fieldError && (
                <p className="text-sm font-medium text-red-500 mt-1">
                    {(fieldError as any)?.message || "This field is required"}
                </p>
            )}
            <div className="flex justify-end">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => append({ sentence: "", audioUrl: "" })}
                >
                    <Plus className="mr-1 h-4 w-4" /> {t('common.add', 'Add')} {buttonText ?? label}
                </Button>
            </div>
        </div>
    );
}

function DynamicFieldArray({
    control,
    name,
    label,
    buttonText,
    required = false,
    t
}: {
    control: any;
    name: string;
    label: string;
    buttonText?: string;
    required?: boolean;
    t: (key: string, fallback: string) => string;
}) {
    const { fields, append, remove } = useFieldArray({ control, name });
    const { errors } = useFormState({ control });

    // Get error for nested field paths (e.g., "oho.0.idje" or "oho.0.translations.eng.idje")
    const getFieldError = (fieldPath: string) => {
        const pathParts = fieldPath.split('.');
        let error: any = errors;
        for (const part of pathParts) {
            if (error && typeof error === 'object' && part in error) {
                error = error[part];
            } else {
                return null;
            }
        }
        return error;
    };

    const fieldError = getFieldError(name);

    useEffect(() => {
        if (fields.length === 0) append("");
    }, [fields, append]);

    return (
        <div className="mt-4">
            <div className="space-y-2">
                {fields.map((field, idx) => (
                    <div key={field.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mt-2">
                        <Controller
                            control={control}
                            name={`${name}.${idx}`}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder={`${label}${required ? ' *' : ''}`}
                                    className="w-full"
                                />
                            )}
                        />
                        {fields.length > 1 && (
                            <button
                                type="button"
                                onClick={() => remove(idx)}
                                className="text-red-400 hover:text-red-600 self-start sm:self-center"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
            {required && fieldError && (
                <p className="text-sm font-medium text-red-500 mt-1">
                    {(fieldError as any)?.message || "This field is required"}
                </p>
            )}
            <div className="flex justify-end">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => append("")}
                >
                    <Plus className="mr-1 h-4 w-4" /> {t('common.add', 'Add')} {buttonText ?? label}
                </Button>
            </div>
        </div>
    );
}


function AudioFieldArray({
    control,
    name,
    label,
    uploadState,
    setUploadState,
    setValue,
    t
}: {
    control: any;
    name: string;
    label: string;
    uploadState: Record<string, string>;
    setUploadState: (state: Record<string, string>) => void;
    setValue: any;
    t: (key: string, fallback: string) => string;
}) {
    const { fields, append, remove } = useFieldArray({ control, name });

    useEffect(() => {
        if (fields.length === 0) append("");
    }, [fields, append]);

    const handleAudioUpload = (url: string, idx: number) => {
        // Update the URL for the specific field using setValue
        setValue(`${name}.${idx}`, url);

        // Store the upload response in state
        const uploadKey = `${name}.${idx}`;
        setUploadState({
            ...uploadState,
            [uploadKey]: url
        });

        toast.success("Audio URL successfully added to form!");
    };

    return (
        <div className="mt-4">
            <div className="space-y-2">
                {fields.map((field, idx) => {
                    const uploadKey = `${name}.${idx}`;
                    const hasUpload = uploadState[uploadKey];

                    return (
                        <div key={field.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mt-2">
                            <UploadModal
                                type="audio"
                                onUrlSelect={(url) => handleAudioUpload(url, idx)}
                            >
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="w-full sm:w-auto whitespace-nowrap cursor-pointer bg-[#F5DEB3]! text-[#1e1e1e]! border-[#F5DEB3]! hover:bg-[#f0d4a0]! hover:!border-[#f0d4a0]! font-medium"
                                >
                                    <Upload className="h-4 w-4 mr-1" />
                                    {label}
                                </Button>
                            </UploadModal>
                            {hasUpload && (
                                <span className="text-green-400 text-sm font-medium">
                                    {t('common.audioUploaded', 'Audio uploaded')}
                                </span>
                            )}
                            {fields.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => remove(idx)}
                                    className="text-red-400 hover:text-red-600 self-start sm:self-center"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-end">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => append("")}
                >
                    <Plus className="mr-1 h-4 w-4" /> {t('common.addAudio', 'Add Audio')}
                </Button>
            </div>
        </div>
    );
}

function OmaFieldArray({
    control,
    name,
    label,
    uploadState,
    setUploadState,
    setValue,
    t
}: {
    control: any;
    name: string;
    label: string;
    uploadState: Record<string, string>;
    setUploadState: (state: Record<string, string>) => void;
    setValue: any;
    t: (key: string, fallback: string) => string;
}) {
    const { fields, append, remove } = useFieldArray({ control, name });
    
    // Watch all type fields to detect changes
    const watchedTypes = useWatch({
        control,
        name: name,
    });

    useEffect(() => {
        if (fields.length === 0) append({ type: "photo", url: "" });
    }, [fields, append]);

    const handleImageUpload = (url: string, idx: number) => {
        // Get current type from watched values
        const currentType = watchedTypes?.[idx]?.type;
        if (!currentType || currentType.trim().length === 0) {
            toast.error("Please select an image type before uploading");
            return;
        }

        // Update the URL for the specific field using setValue
        setValue(`${name}.${idx}.url`, url);

        // Store the upload response in state
        const uploadKey = `${name}.${idx}`;
        setUploadState({
            ...uploadState,
            [uploadKey]: url
        });

        toast.success("Image URL successfully added to form!");
    };

    return (
        <div className="mt-4">
            <div className="space-y-2">
                {fields.map((field, idx) => {
                    const uploadKey = `${name}.${idx}`;
                    const hasUpload = uploadState[uploadKey];
                    const currentType = watchedTypes?.[idx]?.type;
                    const isTypeSelected = !!currentType && currentType.trim().length > 0;

                    return (
                        <div key={field.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mt-2">
                            <Controller
                                control={control}
                                name={`${name}.${idx}.type`}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className="bg-[#1e1e1e] border rounded-md px-3 py-2 w-full sm:w-[200px] text-white"
                                    >
                                        <option value="" className="text-white">{label} - {t('common.type', 'Type')}</option>
                                        <option value="photo" className="text-white">{t('common.photo', 'Photo')}</option>
                                        <option value="illustration" className="text-white">{t('common.illustration', 'Illustration')}</option>
                                    </select>
                                )}
                            />
                            <UploadModal
                                type="image"
                                className=""
                                onUrlSelect={(url) => handleImageUpload(url, idx)}
                            >
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="w-full sm:w-auto whitespace-nowrap bg-[#ffe6b0]! text-[#1e1e1e]! border-[#ffe6b0]! hover:!bg-[#ffd980]! hover:!border-[#ffd980]! font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!isTypeSelected}
                                >
                                    <Upload className="h-4 w-4 mr-1" />
                                    {t('common.uploadImage', 'Upload Image')}
                                </Button>
                            </UploadModal>
                            {hasUpload && (
                                <span className="text-green-400 text-sm font-medium">
                                    {t('common.imageUploaded', 'Image uploaded')}
                                </span>
                            )}
                            {fields.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => remove(idx)}
                                    className="text-red-400 hover:text-red-600 self-start sm:self-center"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-end">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => append({ type: "photo", url: "" })}
                >
                    <Plus className="mr-1 h-4 w-4" /> {t('common.add', 'Add')} {label}
                </Button>
            </div>
        </div>
    );
}

function MultiSelectArray({
    control,
    name,
    label,
    options,
    required = false,
    t
}: {
    control: any;
    name: string;
    label: string;
    options: string[];
    required?: boolean;
    t: (key: string, fallback: string) => string;
}) {
    const { fields, append, remove } = useFieldArray({ control, name });
    const { errors } = useFormState({ control });

    // Get error for nested field paths (e.g., "oho.0.ekerota" or "oho.0.translations.eng.ekerota")
    const getFieldError = (fieldPath: string) => {
        const pathParts = fieldPath.split('.');
        let error: any = errors;
        for (const part of pathParts) {
            if (error && typeof error === 'object' && part in error) {
                error = error[part];
            } else {
                return null;
            }
        }
        return error;
    };

    const fieldError = getFieldError(name);

    useEffect(() => {
        if (fields.length === 0) append("");
    }, [fields, append]);

    return (
        <div className="mt-4">
            <div className="space-y-2">
                {fields.map((field, idx) => (
                    <div key={field.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mt-2">
                        <Controller
                            control={control}
                            name={`${name}.${idx}`}
                            render={({ field }) => (
                                <select
                                    {...field}
                                    className="bg-[#1e1e1e] border rounded-md px-3 py-2 w-full text-white lowercase!"
                                >
                                    <option value="" className="text-white">{label}{required ? ' *' : ''}</option>
                                    {options.map((opt) => (
                                        <option key={opt} value={opt} className="text-white lowercase!">
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            )}
                        />
                        {fields.length > 1 && (
                            <button
                                type="button"
                                onClick={() => remove(idx)}
                                className="text-red-400 hover:text-red-600 self-start sm:self-center"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
            {required && fieldError && (
                <p className="text-sm font-medium text-red-500 mt-1">
                    {(fieldError as any)?.message || "This field is required"}
                </p>
            )}
            <div className="flex justify-end">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => append("")}
                >
                    <Plus className="mr-1 h-4 w-4" /> {t('common.add', 'Add')} {label}
                </Button>
            </div>
        </div>
    );
}



function TranslationSection({
    control,
    index,
    lang,
    title,
    translationAudioUploads,
    setTranslationAudioUploads,
    translationImageUploads,
    setTranslationImageUploads,
    setValue,
    t
}: {
    control: any;
    index: number;
    lang: "eng" | "kor";
    title: string;
    translationAudioUploads: Record<string, string>;
    setTranslationAudioUploads: (state: Record<string, string>) => void;
    translationImageUploads: Record<string, string>;
    setTranslationImageUploads: (state: Record<string, string>) => void;
    setValue: any;
    t: (key: string, fallback: string) => string;
}) {
    return (
        <div className="rounded-lg p-4 bg-[#2a2a2a]">
            <p className="text-lg mb-4">{title}</p>

            <FormField control={control} name={`oho.${index}.translations.${lang}.ota`} render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <Input {...field} placeholder={`${t('common.headword', 'Headword')} *`} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />

            <div className="lg:col-span-2 mb-4">
                <MultiSelectArray
                    control={control}
                    name={`oho.${index}.translations.${lang}.ekerota`}
                    label={t('common.ekerota', 'Eghọ rẹ Ejajẹ')}
                    required={true}
                    t={t}
                    options={
                        lang === "eng"
                            ? ["Noun", "Pronoun", "Adjective", "Verb", "Gerund", "Adverb", "Preposition", "Conjunction", "Interjection", "Numeral"]
                            : lang === 'kor'
                                ? ["명사", "대명사", "형용사", "동사", "동명사", "부사", "조사", "접속사", "감탄사", "수사"]
                                : ["Odẹ", "ẹdiodẹ", "Odjephia", "Eruo", "Eruodẹ", "Eruoga", "Odjedia", "Ọrhuọ", "Ukperi", "Ubi"]
                    }
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
                {/* Column 1: oma, omra, okpo, orhan, odeUfue */}
                <div className="space-y-6">
                    <div>
                        <AudioFieldArray
                            control={control}
                            name={`oho.${index}.translations.${lang}.omra`}
                            label={t('common.omra', 'Omra')}
                            uploadState={translationAudioUploads}
                            setUploadState={setTranslationAudioUploads}
                            setValue={setValue}
                            t={t}
                        />
                    </div>
                    <div>
                        <OmaFieldArray
                            control={control}
                            name={`oho.${index}.translations.${lang}.oma`}
                            label={t('common.oma', 'Oma')}
                            uploadState={translationImageUploads}
                            setUploadState={setTranslationImageUploads}
                            setValue={setValue}
                            t={t}
                        />
                    </div>
                    <div>
                        <OkpoFieldArray
                            lang={lang}
                            control={control}
                            name={`oho.${index}.translations.${lang}.okpo`}
                            label={t('common.okpo', 'Okpo')}
                        />
                    </div>
                    <div>
                        <DynamicFieldArray control={control} name={`oho.${index}.translations.${lang}.orhan`} label={t('common.orhan', 'Orhan')} buttonText={t('common.opposite', 'Opposite')} required={false} t={t} />
                    </div>
                    <div>
                        <DynamicFieldArray control={control} name={`oho.${index}.translations.${lang}.odeUfue`} label={t('common.odeUfue', 'OdẹUfue')} buttonText={t('common.scientificName', 'Scientific Name')} t={t} />
                    </div>
                </div>

                {/* Column 2: upho, uphoesio, oto, idje, ibuebu */}
                <div className="space-y-[35px]">
                    <div>
                        <FormField control={control} name={`oho.${index}.translations.${lang}.upho`} render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input {...field} placeholder={`${t('common.upho', 'Ubiupho')} *`} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                    <div>
                        <FormField control={control} name={`oho.${index}.translations.${lang}.uphoesio`} render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input {...field} placeholder={`${t('common.uphoesio', 'IPA')} *`} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                    <div>
                        <FormField control={control} name={`oho.${index}.translations.${lang}.oto`} render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input {...field} placeholder={`${t('common.oto', 'Otọ')} *`} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                    <div>
                        <IdjeFieldArray
                            control={control}
                            name={`oho.${index}.translations.${lang}.otoOmra`}
                            label={t('common.otoOmra', 'OtoOmra')}
                            uploadState={translationAudioUploads}
                            setUploadState={setTranslationAudioUploads}
                            setValue={setValue}
                            t={t}
                        />
                    </div>
                    <div>
                        <IdjeSentenceFieldArray
                            control={control}
                            name={`oho.${index}.translations.${lang}.idje`}
                            label={t('common.idje', 'Udje')}
                            buttonText={t('common.addExample', 'Ba Udje')}
                            required={true}
                            uploadState={translationAudioUploads}
                            setUploadState={setTranslationAudioUploads}
                            setValue={setValue}
                            t={t}
                        />
                    </div>
                    <div className="">
                        <DynamicFieldArray control={control} name={`oho.${index}.translations.${lang}.ibuebu`} label={t('common.ibuebu', 'Ebuo')} buttonText={t('common.plural', 'Ebuo')} required={false} t={t} />
                    </div>
                    <div>
                        <DynamicFieldArray control={control} name={`oho.${index}.translations.${lang}.ekaeruo`} label={t('common.ekaeruo', 'Oka Eruo')} buttonText={t('common.verbTypes', 'Oka Eruo')} required={false} t={t} />
                    </div>
                </div>
            </div>
        </div>
    );
}
