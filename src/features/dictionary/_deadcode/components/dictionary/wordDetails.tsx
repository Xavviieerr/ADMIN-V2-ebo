'use client'
import React, { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Star, MessageSquare, Check, X, Edit, Volume2, User, Languages, Plus, Upload, Trash2, Keyboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { usePermissions } from '@/hooks/usePermissions'
import LoadingSpinner from '../ui/LoadingSpinner'
import { useGetSingleWordQuery, useApproveWordMutation, useRejectWordMutation, useSetWordToReviewMutation, useGenericMutationMutation, useSubmitWordReviewMutation, useGetSingleUserQuery, useDeleteWordMutation, useUpdateSenseImageMutation, useUpdateSenseAudioMutation, useUpdateSenseOtoAudioMutation, useUpdateSenseExampleSentenceAudioMutation, useUpdateTranslationOtoAudioMutation, useUpdateTranslationExampleSentenceAudioMutation, useDeleteSenseImageMutation, useDeleteSenseAudioMutation, useCreateSenseMutation, useUpdateSenseMutation, useDeleteSenseMutation, useCreateTranslationMutation, useDeleteTranslationMutation, useUpdateTranslationMutation, useUpdateTranslationAudioMutation, useDeleteTranslationAudioMutation, useDeleteTranslationImageMutation, useGetAllProvinceNoPaginationQuery, useApproveTranslationMutation, useCommentTranslationMutation, useGetWordReviewsQuery, useReplyToReviewMutation } from '@/slice/requestSlice'
import { Word as APIWord } from '@/types/fetchWord'
import { toast } from 'sonner'
import { getErrorMessage } from "@/utils/errorHandler";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import UploadModal from './UploadModal'
import VirtualUrhoboKeyboard from '@/components/virtualUrhoboKeyboard'
import { useForm, useFieldArray, Controller, useWatch, useFormState } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { OkpoFieldArray } from '@/components/ui/fieldArrays/okpoFieldArray'
import { useTranslation } from '@/hooks/useTranslation'
import { useLocale } from '@/contexts/LocaleContext'

// Helper function to extract sentence from idje (handles both string and object formats)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getIdjeSentence = (idjeItem: any): string => {
  if (!idjeItem) return ''
  if (typeof idjeItem === 'string') {
    return idjeItem
  }
  if (typeof idjeItem === 'object' && idjeItem !== null) {
    return idjeItem.sentence || ''
  }
  return String(idjeItem)
}

// Helper function to convert idje array to form array format for sense (objects with sentence and audioUrl)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const idjeToFormArray = (idje: any[] | undefined): Array<{ sentence: string; audioUrl: string }> => {
  if (!idje || idje.length === 0) return [{ sentence: '', audioUrl: '' }]
  return idje.map(item => {
    if (typeof item === 'string') {
      return { sentence: item, audioUrl: '' }
    }
    if (typeof item === 'object' && item !== null) {
      return {
        sentence: item.sentence || '',
        audioUrl: item.audioUrl || ''
      }
    }
    return { sentence: String(item), audioUrl: '' }
  })
}

// Types for our data structures
interface Word {
  id: string
  word: string
  meaning: string
  example: string
  partOfSpeech: string
  createdAt: string
  status: 'approved' | 'pending' | 'rejected' | 'in-review'
  author: string
  authorId: string
  totalRatings: number
  totalReviews: number
  averageRating: number
  reviews: Review[]
  audioUrl?: string
  imageUrl?: string
  allImages?: { url: string; type: string }[]
  allAudio?: string[]
  otaOkpopko?: boolean
  creationReason?: string
  erevwe?: string
}

interface Review {
  id: string
  userId: string
  username: string
  userAvatar?: string
  rating: number
  comment: string
  createdAt: string
  helpful: number
  notHelpful: number
}

interface WordDetailsProps {
  wordId: string
}

// Schema for idje (example sentences with optional audio)
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

// Schema for sense form
const senseSchema = z.object({
  kere: z.number().min(1),
  ekerota: z.array(z.string()).refine(
    (arr) => arr.filter((item) => item.trim().length > 0).length > 0,
    { message: "At least one part of speech is required" }
  ),
  upho: z.string().min(1, "Pronunciation is required"),
  oto: z.string().min(1, "Definition is required"),
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
  uphoesio: z.string().min(1, "Phonetic alphabet is required"),
  okpo: z.array(
    z.object({
      ota: z.string().optional(),
      egba: z.union([z.enum(["gan", "guo", "strong", "Not strong"]), z.literal("")]).optional(),
    })
  ).optional(),
  orhan: z.array(z.string()).optional(),
  ibuebu: z.array(z.string()).optional(),
  ekaeruo: z.array(z.string()).optional(),
  odeUfue: z.array(z.string()).optional(),
  erevwe: z.string(),
})

// Helper component for single audio URL field (for otoOmra)
function IdjeFieldArray({
  control,
  name,
  label,
  uploadState,
  setUploadState,
  setValue
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  name: string;
  label: string;
  uploadState: Record<string, string>;
  setUploadState: (state: Record<string, string>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: any;
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
        render={() => (
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
                    Audio uploaded
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

// Helper component for Idje field array with sentence and audioUrl (defined before use)
function IdjeSentenceFieldArray({
  control,
  name,
  label,
  buttonText,
  required = false,
  uploadState,
  setUploadState,
  setValue
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  name: string;
  label: string;
  buttonText?: string;
  required?: boolean;
  uploadState: Record<string, string>;
  setUploadState: (state: Record<string, string>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: any;
}) {
  const { fields, append, remove } = useFieldArray({ control, name });
  const { errors } = useFormState({ control });

  const getFieldError = (fieldPath: string) => {
    const pathParts = fieldPath.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

          return (
            <div key={field.id} className="space-y-2 p-3 bg-[#2a2a2a] rounded-lg">
              <div className="flex flex-col gap-2">
                <Controller
                  control={control}
                  name={`${name}.${idx}.sentence`}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={`${label} - Sentence${required ? ' *' : ''}`}
                      className="w-full bg-[#1e1e1e] border-white/10 text-white"
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
                      Add Audio
                    </Button>
                  </UploadModal>
                  {hasUpload && (
                    <span className="text-green-400 text-sm font-medium">
                      Audio uploaded
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
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(fieldError as any)?.message || "This field is required"}
        </p>
      )}
      <div className="flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-2 text-white hover:bg-white/10"
          onClick={() => append({ sentence: "", audioUrl: "" })}
        >
          <Plus className="mr-1 h-4 w-4" /> Add {buttonText ?? label}
        </Button>
      </div>
    </div>
  );
}

// Schema for translation form
const translationSchema = z.object({
  ota: z.string().min(1, "Headword is required"),
  ekerota: z.array(z.string()).refine(
    (arr) => arr.filter((item) => item.trim().length > 0).length > 0,
    { message: "At least one part of speech is required" }
  ),
  oto: z.string().min(1, "Definition is required"),
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
  upho: z.string().optional(),
  uphoesio: z.string().optional(),
  okpo: z.array(
    z.object({
      ota: z.string().optional(),
      egba: z.union([z.enum(["gan", "guo", "strong", "Not strong"]), z.literal("")]).optional(),
    })
  ).optional(),
  orhan: z.array(z.string()).optional(),
  ibuebu: z.array(z.string()).optional(),
  ekaeruo: z.array(z.string()).optional(),
  odeUfue: z.array(z.string()).optional(),
  languageType: z.enum(["english", "korean"]),
}).refine(
  (data) => {
    // For English translations, upho and uphoesio are required
    if (data.languageType === 'english') {
      if (!data.upho || data.upho.trim().length === 0) {
        return false;
      }
      if (!data.uphoesio || data.uphoesio.trim().length === 0) {
        return false;
      }
    }
    // For Korean translations, upho and uphoesio are optional
    return true;
  },
  {
    message: "Pronunciation and Phonetic alphabet are required for English translations",
    path: ["upho"], // This will show the error on the upho field
  }
).refine(
  (data) => {
    // For English translations, uphoesio is required
    if (data.languageType === 'english') {
      if (!data.uphoesio || data.uphoesio.trim().length === 0) {
        return false;
      }
    }
    return true;
  },
  {
    message: "Phonetic alphabet is required for English translations",
    path: ["uphoesio"],
  }
)

// Schema for editing base word details
const editWordSchema = z.object({
  ota: z.string().min(1, "Headword is required"),
  otaOkpopko: z.boolean().optional(),
  creationReason: z.string().optional().or(z.literal('')),
  erevwe: z.string().optional(),
})

export default function WordDetails({ wordId }: WordDetailsProps) {
  const { locale } = useLocale()
  const { t } = useTranslation(locale)

  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [isSettingToReview, setIsSettingToReview] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [activeTranslationLang, setActiveTranslationLang] = useState<'eng' | 'kor'>('eng')
  const [editingSenseId, setEditingSenseId] = useState<string | null>(null)
  const [editedSense, setEditedSense] = useState<{ oto: string; idje: string; ekerota: string } | null>(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [rating, setRating] = useState<number>(0)
  const [reviewText, setReviewText] = useState<string>('')
  const [replyingToReviewId, setReplyingToReviewId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState<string>('')
  const [deleteImageModalOpen, setDeleteImageModalOpen] = useState(false)
  const [deleteAudioModalOpen, setDeleteAudioModalOpen] = useState(false)
  const [deleteOtoAudioModalOpen, setDeleteOtoAudioModalOpen] = useState(false)
  const [deleteExampleSentenceAudioModalOpen, setDeleteExampleSentenceAudioModalOpen] = useState(false)
  const [deleteTranslationOtoAudioModalOpen, setDeleteTranslationOtoAudioModalOpen] = useState(false)
  const [commentModalOpen, setCommentModalOpen] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [currentTranslationForComment, setCurrentTranslationForComment] = useState<any>(null)
  const [deleteTranslationExampleSentenceAudioModalOpen, setDeleteTranslationExampleSentenceAudioModalOpen] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [itemToDelete, setItemToDelete] = useState<{ sense: any; url: string; type: 'image' | 'audio'; imageType?: string } | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [otoAudioToDelete, setOtoAudioToDelete] = useState<{ sense: any } | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [exampleSentenceAudioToDelete, setExampleSentenceAudioToDelete] = useState<{ sense: any; exampleSentenceIndex: number } | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [translationOtoAudioToDelete, setTranslationOtoAudioToDelete] = useState<{ translation: any; languageType: string; translationId: string } | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [translationExampleSentenceAudioToDelete, setTranslationExampleSentenceAudioToDelete] = useState<{ translation: any; languageType: string; translationId: string; exampleSentenceIndex: number } | null>(null)
  const [addSenseModalOpen, setAddSenseModalOpen] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingSense, setEditingSense] = useState<any | null>(null)
  const [deleteSenseModalOpen, setDeleteSenseModalOpen] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [senseToDelete, setSenseToDelete] = useState<any | null>(null)
  const [addTranslationModalOpen, setAddTranslationModalOpen] = useState(false)
  const [editTranslationModalOpen, setEditTranslationModalOpen] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingTranslation, setEditingTranslation] = useState<{ translation: any; languageType: string; translationId: string } | null>(null)
  const [deleteTranslationModalOpen, setDeleteTranslationModalOpen] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [translationToDelete, setTranslationToDelete] = useState<{ translation: any; languageType: string; translationId: string } | null>(null)
  const [deleteTranslationAudioModalOpen, setDeleteTranslationAudioModalOpen] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [translationAudioToDelete, setTranslationAudioToDelete] = useState<{ translation: any; url: string; languageType: string; translationId: string } | null>(null)
  const [deleteTranslationImageModalOpen, setDeleteTranslationImageModalOpen] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [translationImageToDelete, setTranslationImageToDelete] = useState<{ translation: any; url: string; imageType: string; languageType: string; translationId: string } | null>(null)
  const [showEditWord, setShowEditWord] = useState(false)

  // State for sense idje audio uploads
  const [senseIdjeAudioUploads, setSenseIdjeAudioUploads] = useState<Record<string, string>>({})
  // State for translation idje audio uploads
  const [translationIdjeAudioUploads, setTranslationIdjeAudioUploads] = useState<Record<string, string>>({})
  // State for sense otoOmra audio uploads
  const [senseOtoOmraUploads, setSenseOtoOmraUploads] = useState<Record<string, string>>({})
  // State for translation otoOmra audio uploads
  const [translationOtoOmraUploads, setTranslationOtoOmraUploads] = useState<Record<string, string>>({})

  // Fetch provinces for erevwe field
  const { data: namesOfProvinces } = useGetAllProvinceNoPaginationQuery()
  const provinces = namesOfProvinces?.data

  // Form for adding sense
  const senseForm = useForm<z.infer<typeof senseSchema>>({
    resolver: zodResolver(senseSchema),
    defaultValues: {
      kere: 1,
      ekerota: [''],
      upho: '',
      oto: '',
      otoOmra: '',
      idje: [{ sentence: '', audioUrl: '' }],
      uphoesio: '',
      okpo: [],
      orhan: [],
      ibuebu: [],
      ekaeruo: [],
      odeUfue: [],
      erevwe: '',
    },
  })

  // Form for adding translation
  const translationForm = useForm<z.infer<typeof translationSchema>>({
    resolver: zodResolver(translationSchema),
    defaultValues: {
      ota: '',
      ekerota: [''],
      oto: '',
      otoOmra: '',
      idje: [{ sentence: '', audioUrl: '' }],
      upho: '',
      uphoesio: '',
      okpo: [],
      orhan: [],
      ibuebu: [],
      ekaeruo: [],
      odeUfue: [],
      languageType: 'english',
    },
  })

  // Form for editing base word details
  const editWordForm = useForm<z.infer<typeof editWordSchema>>({
    resolver: zodResolver(editWordSchema),
    defaultValues: {
      ota: '',
      otaOkpopko: false,
      creationReason: '',
      erevwe: '',
    },
  })

  // Form for editing translation
  const editTranslationForm = useForm<z.infer<typeof translationSchema>>({
    resolver: zodResolver(translationSchema),
    defaultValues: {
      ota: '',
      ekerota: [''],
      oto: '',
      otoOmra: '',
      idje: [{ sentence: '', audioUrl: '' }],
      upho: '',
      uphoesio: '',
      okpo: [],
      orhan: [],
      ibuebu: [],
      ekaeruo: [],
      odeUfue: [],
      languageType: 'english',
    },
  })
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode') || 'edit' // Default to 'edit' for backward compatibility
  const isViewMode = mode === 'view'
  const { hasPermission, isSuperAdmin } = usePermissions()
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [activeInputId, setActiveInputId] = useState<string | null>(null)
  const lastFocusedInputRef = useRef<HTMLElement | null>(null)

  // Track the currently focused input/textarea
  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        lastFocusedInputRef.current = target
        const id = target.id || target.getAttribute('id')
        if (id) {
          setActiveInputId(id)
        } else {
          // Generate a temporary ID if none exists
          const tempId = `temp-input-${Date.now()}`
          target.setAttribute('id', tempId)
          setActiveInputId(tempId)
        }
      }
    }

    document.addEventListener('focusin', handleFocus)

    return () => {
      document.removeEventListener('focusin', handleFocus)
    }
  }, [])

  // Fetch word from API
  const { data: apiWordData, isLoading, isError, error, refetch } = useGetSingleWordQuery({ id: wordId })

  // Extract the word data from the API response
  const apiWord = apiWordData?.data || null

  // Fetch user details for moderation actions
  const { data: approvedByUser } = useGetSingleUserQuery(
    { id: apiWord?.approvedBy || '' },
    { skip: !apiWord?.approvedBy }
  )
  const { data: rejectedByUser } = useGetSingleUserQuery(
    { id: apiWord?.rejectedBy || '' },
    { skip: !apiWord?.rejectedBy }
  )
  const { data: reviewedByUser } = useGetSingleUserQuery(
    { id: apiWord?.reviewedBy || '' },
    { skip: !apiWord?.reviewedBy }
  )

  // Word moderation mutations
  const [approveWord] = useApproveWordMutation()
  const [rejectWord] = useRejectWordMutation()
  const [setWordToReview] = useSetWordToReviewMutation()
  const [deleteWord] = useDeleteWordMutation()
  const [editWordMutation, { isLoading: isUpdatingWord }] = useGenericMutationMutation()
  const [updateSenseImage, { isLoading: isUpdatingSenseImage }] = useUpdateSenseImageMutation()
  const [updateSenseAudio, { isLoading: isUpdatingSenseAudio }] = useUpdateSenseAudioMutation()
  const [updateSenseOtoAudio, { isLoading: isUpdatingSenseOtoAudio }] = useUpdateSenseOtoAudioMutation()
  const [updateSenseExampleSentenceAudio, { isLoading: isUpdatingSenseExampleSentenceAudio }] = useUpdateSenseExampleSentenceAudioMutation()
  const [updateTranslationOtoAudio, { isLoading: isUpdatingTranslationOtoAudio }] = useUpdateTranslationOtoAudioMutation()
  const [updateTranslationExampleSentenceAudio, { isLoading: isUpdatingTranslationExampleSentenceAudio }] = useUpdateTranslationExampleSentenceAudioMutation()
  const [deleteSenseImage, { isLoading: isDeletingSenseImage }] = useDeleteSenseImageMutation()
  const [deleteSenseAudio, { isLoading: isDeletingSenseAudio }] = useDeleteSenseAudioMutation()
  const [createSense, { isLoading: isCreatingSense }] = useCreateSenseMutation()
  const [updateSense, { isLoading: isUpdatingSense }] = useUpdateSenseMutation()
  const [deleteSense, { isLoading: isDeletingSense }] = useDeleteSenseMutation()
  const [createTranslation, { isLoading: isCreatingTranslation }] = useCreateTranslationMutation()
  const [updateTranslation, { isLoading: isUpdatingTranslation }] = useUpdateTranslationMutation()
  const [deleteTranslation, { isLoading: isDeletingTranslation }] = useDeleteTranslationMutation()
  const [updateTranslationAudio, { isLoading: isUpdatingTranslationAudio }] = useUpdateTranslationAudioMutation()
  const [deleteTranslationAudio, { isLoading: isDeletingTranslationAudio }] = useDeleteTranslationAudioMutation()
  const [deleteTranslationImage, { isLoading: isDeletingTranslationImage }] = useDeleteTranslationImageMutation()
  const [genericMutation, { isLoading: isSavingSense }] = useGenericMutationMutation()
  const [submitReview, { isLoading: isSubmittingReview }] = useSubmitWordReviewMutation()
  const [approveTranslation, { isLoading: isApprovingTranslation }] = useApproveTranslationMutation()
  const [commentTranslation, { isLoading: isCommentingTranslation }] = useCommentTranslationMutation()
  const { data: wordReviewsResponse } = useGetWordReviewsQuery(wordId, { skip: !wordId })
  const [replyToReview, { isLoading: isSubmittingReply }] = useReplyToReviewMutation()

  // Map API word to component format
  const mapAPIWordToWord = (apiWord: APIWord): Word => {
    const firstOho = apiWord.oho && apiWord.oho.length > 0 ? apiWord.oho[0] : null;

    // Collect all images and audio from all oho entries
    const allImages: { url: string; type: string }[] = [];
    const allAudio: string[] = [];

    if (apiWord.oho && apiWord.oho.length > 0) {
      apiWord.oho.forEach(oho => {
        if (oho.oma && oho.oma.length > 0) {
          allImages.push(...oho.oma);
        }
        if (oho.omra && oho.omra.length > 0) {
          allAudio.push(...oho.omra);
        }
      });
    }

    // Calculate average rating from wordRatings
    const ratings = apiWord.wordRatings || [];
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0
      ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings
      : 0;

    return {
      id: apiWord.id,
      word: apiWord.ota,
      meaning: firstOho?.oto || '',
      example: firstOho?.idje?.[0] ? getIdjeSentence(firstOho.idje[0]) : '',
      partOfSpeech: firstOho?.ekerota?.[0] || '',
      createdAt: apiWord.createdAt,
      status: apiWord.status, // preserve 'in-review' to display explicitly
      author: apiWord.createdBy?.username || 'Unknown',
      authorId: apiWord.createdBy?.id || '',
      totalRatings: totalRatings,
      totalReviews: totalRatings, // Assuming each rating is a review
      averageRating: averageRating,
      audioUrl: allAudio[0], // First audio for backward compatibility
      imageUrl: allImages[0]?.url, // First image for backward compatibility
      allImages: allImages, // All images
      allAudio: allAudio, // All audio files
      otaOkpopko: apiWord.otaOkpopko,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      creationReason: (apiWord as any).creationReason,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      erevwe: (apiWord as any)?.erevwe,
      reviews: ratings.map(rating => ({
        id: rating.id,
        userId: rating.userId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        username: (rating as any).user?.username || 'User',
        userAvatar: undefined,
        rating: rating.rating,
        comment: rating.review || '',
        createdAt: rating.createdAt,
        helpful: 0,
        notHelpful: 0
      }))
    }
  }

  // Map API word to component format
  const word = apiWord ? mapAPIWordToWord(apiWord) : null

  // Prefill edit word form when data is loaded
  useEffect(() => {
    if (apiWord) {
      editWordForm.reset({
        ota: apiWord.ota || '',
        otaOkpopko: apiWord.otaOkpopko || false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        creationReason: (apiWord as any)?.creationReason || '',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        erevwe: (apiWord as any)?.erevwe || '',
      })
    }
  }, [apiWord, editWordForm])

  const handleUpdateWord = async (values: z.infer<typeof editWordSchema>) => {
    try {
      // Clean up the payload - remove empty creationReason
      const cleanedValues = {
        ...values,
        creationReason: values.creationReason?.trim() || undefined,
      }

      await editWordMutation({
        url: `/word/${wordId}`,
        method: 'PATCH',
        body: cleanedValues,
        invalidatesTags: [{ type: 'words' as const }],
      }).unwrap()
      toast.success('Word updated successfully')
      await refetch()
      setShowEditWord(false)
    } catch (err) {
      console.error(err)
      toast.error(getErrorMessage(err, 'Failed to update word'))
    }
  }

  const handleApprove = async () => {
    if (!word) return

    setIsApproving(true)
    try {
      await approveWord({ id: wordId }).unwrap()
      toast.success('Word approved successfully!')
      console.log('Word approved:', wordId)
      setApproveModalOpen(false)
      // After approval, redirect or refetch
      router.push('/dictionary')
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error('Error approving word:', error as any)
      toast.error(getErrorMessage(error, 'Failed to approve word. Please try again.'))
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    if (!word) return

    setIsRejecting(true)
    try {
      await rejectWord({ id: wordId, reason: rejectionReason || 'Rejected by admin' }).unwrap()
      toast.success('Word rejected successfully!')
      console.log('Word rejected:', wordId)
      setRejectModalOpen(false)
      setRejectionReason('')
      // After rejection, redirect or refetch
      router.push('/dictionary')
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error('Error rejecting word:', error as any)
      toast.error(getErrorMessage(error, 'Failed to reject word. Please try again.'))
    } finally {
      setIsRejecting(false)
    }
  }

  const handleSetToReview = async () => {
    if (!word) return

    setIsSettingToReview(true)
    try {
      await setWordToReview({ id: wordId }).unwrap()
      toast.success('Word set to review successfully!')
      console.log('Word set to review:', wordId)
      // After setting to review, redirect or refetch
      router.push('/dictionary')
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error('Error setting word to review:', error as any)
      toast.error(getErrorMessage(error, 'Failed to set word to review. Please try again.'))
    } finally {
      setIsSettingToReview(false)
    }
  }

  const handleDelete = async () => {
    if (!word) return

    setIsDeleting(true)
    try {
      await deleteWord({ id: wordId }).unwrap()
      toast.success('Word deleted successfully!')
      console.log('Word deleted:', wordId)
      setDeleteModalOpen(false)
      // After deletion, redirect to dictionary
      router.push('/dictionary')
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error('Error deleting word:', error as any)
      toast.error(getErrorMessage(error, 'Failed to delete word. Please try again.'))
    } finally {
      setIsDeleting(false)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSenseImageUpload = async (sense: any, imageUrl: string) => {
    if (!apiWord || !sense) return

    try {
      await updateSenseImage({
        wordId: wordId,
        senseId: sense.id,
        senseIndex: sense.kere,
        url: imageUrl,
        imageType: 'photo'
      }).unwrap()

      toast.success('Sense image updated successfully!')
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error('Error updating sense image:', error as any)
      toast.error(getErrorMessage(error, 'Failed to update sense image. Please try again.'))
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSenseAudioUpload = async (sense: any, audioUrl: string) => {
    if (!apiWord || !sense) return

    try {
      await updateSenseAudio({
        wordId: wordId,
        senseId: sense.id,
        senseIndex: sense.kere,
        url: audioUrl
      }).unwrap()

      toast.success('Sense audio updated successfully!')
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error('Error updating sense audio:', error as any)
      toast.error(getErrorMessage(error, 'Failed to update sense audio. Please try again.'))
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSenseExampleSentenceAudioUpload = async (sense: any, exampleSentenceIndex: number, audioUrl: string) => {
    if (!apiWord || !sense) return

    try {
      await updateSenseExampleSentenceAudio({
        wordId: wordId,
        senseId: sense.id,
        senseIndex: sense.kere,
        exampleSentenceIndex: exampleSentenceIndex + 1,
        url: audioUrl
      }).unwrap()

      toast.success('Example sentence audio updated successfully!')
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error('Error updating example sentence audio:', error as any)
      toast.error(getErrorMessage(error, 'Failed to update example sentence audio. Please try again.'))
    }
  }

  const handleDeleteSenseOtoAudio = async () => {
    if (!otoAudioToDelete || !apiWord) return

    try {
      await updateSenseOtoAudio({
        wordId: wordId,
        senseId: otoAudioToDelete.sense.id,
        senseIndex: otoAudioToDelete.sense.kere,
        url: '' // Empty url to delete
      }).unwrap()

      toast.success('Sense definition audio deleted successfully!')
      setDeleteOtoAudioModalOpen(false)
      setOtoAudioToDelete(null)
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error('Error deleting sense definition audio:', error as any)
      toast.error(getErrorMessage(error, 'Failed to delete sense definition audio. Please try again.'))
    }
  }

  const handleDeleteSenseExampleSentenceAudio = async () => {
    if (!exampleSentenceAudioToDelete || !apiWord) return

    try {
      await updateSenseExampleSentenceAudio({
        wordId: wordId,
        senseId: exampleSentenceAudioToDelete.sense.id,
        senseIndex: exampleSentenceAudioToDelete.sense.kere,
        exampleSentenceIndex: exampleSentenceAudioToDelete.exampleSentenceIndex + 1,
        url: ''
      }).unwrap()

      toast.success('Example sentence audio deleted successfully!')
      setDeleteExampleSentenceAudioModalOpen(false)
      setExampleSentenceAudioToDelete(null)
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error('Error deleting example sentence audio:', error as any)
      toast.error(getErrorMessage(error, 'Failed to delete example sentence audio. Please try again.'))
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTranslationExampleSentenceAudioUpload = async (translation: any, exampleSentenceIndex: number, audioUrl: string) => {
    if (!apiWord || !translation) return

    try {
      const languageType = activeTranslationLang === 'eng' ? 'english' : 'korean'
      const translationId = activeTranslationLang === 'eng'
        ? (translation.efaEngId || translation.id)
        : (translation.efaKorId || translation.id)

      await updateTranslationExampleSentenceAudio({
        wordId: wordId,
        translationId: translationId,
        translationIndex: translation.kere,
        languageType: languageType,
        exampleSentenceIndex: exampleSentenceIndex + 1, // API uses 1-based index
        url: audioUrl
      }).unwrap()

      toast.success('Translation example sentence audio updated successfully!')
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error('Error updating translation example sentence audio:', error as any)
      toast.error(getErrorMessage(error, 'Failed to update translation example sentence audio. Please try again.'))
    }
  }

  const handleDeleteTranslationOtoAudio = async () => {
    if (!translationOtoAudioToDelete || !apiWord) return

    try {
      await updateTranslationOtoAudio({
        wordId: wordId,
        translationId: translationOtoAudioToDelete.translationId,
        translationIndex: translationOtoAudioToDelete.translation.kere,
        languageType: translationOtoAudioToDelete.languageType,
        url: '' // Empty url to delete
      }).unwrap()

      toast.success('Translation definition audio deleted successfully!')
      setDeleteTranslationOtoAudioModalOpen(false)
      setTranslationOtoAudioToDelete(null)
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error('Error deleting translation definition audio:', error as any)
      toast.error(getErrorMessage(error, 'Failed to delete translation definition audio. Please try again.'))
    }
  }

  const handleDeleteTranslationExampleSentenceAudio = async () => {
    if (!translationExampleSentenceAudioToDelete || !apiWord) return

    try {
      await updateTranslationExampleSentenceAudio({
        wordId: wordId,
        translationId: translationExampleSentenceAudioToDelete.translationId,
        translationIndex: translationExampleSentenceAudioToDelete.translation.kere,
        languageType: translationExampleSentenceAudioToDelete.languageType,
        exampleSentenceIndex: translationExampleSentenceAudioToDelete.exampleSentenceIndex + 1, // API uses 1-based index
        url: '' // Empty url to delete
      }).unwrap()

      toast.success('Translation example sentence audio deleted successfully!')
      setDeleteTranslationExampleSentenceAudioModalOpen(false)
      setTranslationExampleSentenceAudioToDelete(null)
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error('Error deleting translation example sentence audio:', error as any)
      toast.error(getErrorMessage(error, 'Failed to delete translation example sentence audio. Please try again.'))
    }
  }

  const handleDeleteSenseImage = async () => {
    if (!itemToDelete || !apiWord) return

    try {
      await deleteSenseImage({
        wordId: wordId,
        senseId: itemToDelete.sense.id,
        senseIndex: itemToDelete.sense.kere,
        url: itemToDelete.url,
        imageType: itemToDelete.imageType || 'photo'
      }).unwrap()

      toast.success('Sense image deleted successfully!')
      setDeleteImageModalOpen(false)
      setItemToDelete(null)
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error('Error deleting sense image:', error as any)
      toast.error(getErrorMessage(error, 'Failed to delete sense image. Please try again.'))
    }
  }

  const handleDeleteSenseAudio = async () => {
    if (!itemToDelete || !apiWord) return

    try {
      await deleteSenseAudio({
        wordId: wordId,
        senseId: itemToDelete.sense.id,
        senseIndex: itemToDelete.sense.kere,
        url: itemToDelete.url
      }).unwrap()

      toast.success('Sense audio deleted successfully!')
      setDeleteAudioModalOpen(false)
      setItemToDelete(null)
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error('Error deleting sense audio:', error as any)
      toast.error(getErrorMessage(error, 'Failed to delete sense audio. Please try again.'))
    }
  }

  const handleAddSense = async (data: z.infer<typeof senseSchema>) => {
    if (!apiWord) return

    try {
      // Pre-process okpo to remove items with empty ota before validation
      const processedData = {
        ...data,
        okpo: data.okpo?.filter(item => item.ota && item.ota.trim().length > 0).map(item => ({
          ota: item.ota,
          egba: item.egba && item.egba.trim().length > 0 ? item.egba : undefined
        })) || []
      }

      if (editingSense) {
        // Update existing sense
        // Process idje to filter empty sentences and remove empty audioUrl
        const processedIdje = processedData.idje
          .filter(item => item.sentence && item.sentence.trim().length > 0)
          .map(item => ({
            sentence: item.sentence,
            ...(item.audioUrl && item.audioUrl.trim().length > 0 ? { audioUrl: item.audioUrl } : {})
          }))

        const senseData = {
          ekerota: processedData.ekerota.filter(item => item.trim().length > 0),
          upho: processedData.upho,
          oto: processedData.oto,
          otoOmra: processedData.otoOmra && processedData.otoOmra.trim().length > 0 ? processedData.otoOmra : undefined,
          idje: processedIdje,
          uphoesio: processedData.uphoesio,
          okpo: processedData.okpo,
          orhan: processedData.orhan?.filter(item => item.trim().length > 0) || [],
          ibuebu: processedData.ibuebu?.filter(item => item.trim().length > 0) || [],
          ekaeruo: processedData.ekaeruo?.filter(item => item.trim().length > 0) || [],
          odeUfue: processedData.odeUfue?.filter(item => item.trim().length > 0) || [],
          erevwe: processedData.erevwe || '',
          senseIndex: editingSense.kere,
          senseId: editingSense.id,
        }

        await updateSense({
          wordId: wordId,
          senseData
        }).unwrap()

        toast.success('Sense updated successfully!')
      } else {
        // Create new sense
        const existingSenses = apiWord.oho || []
        const maxKere = existingSenses.length > 0
          ? Math.max(...existingSenses.map(s => s.kere))
          : 0
        const nextKere = maxKere + 1

        // Process idje to filter empty sentences and remove empty audioUrl
        const processedIdje = processedData.idje
          .filter(item => item.sentence && item.sentence.trim().length > 0)
          .map(item => ({
            sentence: item.sentence,
            ...(item.audioUrl && item.audioUrl.trim().length > 0 ? { audioUrl: item.audioUrl } : {})
          }))

        const senseData = {
          kere: processedData.kere || nextKere,
          ekerota: processedData.ekerota.filter(item => item.trim().length > 0),
          upho: processedData.upho,
          oto: processedData.oto,
          idje: processedIdje,
          uphoesio: processedData.uphoesio,
          okpo: processedData.okpo,
          orhan: processedData.orhan?.filter(item => item.trim().length > 0) || [],
          ibuebu: processedData.ibuebu?.filter(item => item.trim().length > 0) || [],
          ekaeruo: processedData.ekaeruo?.filter(item => item.trim().length > 0) || [],
          odeUfue: processedData.odeUfue?.filter(item => item.trim().length > 0) || [],
          erevwe: processedData.erevwe || '',
        }

        await createSense({
          wordId: wordId,
          senseData
        }).unwrap()

        toast.success('Sense added successfully!')
      }

      setAddSenseModalOpen(false)
      setEditingSense(null)
      senseForm.reset()
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error('Error saving sense:', error as any)
      toast.error(getErrorMessage(error, `Failed to ${editingSense ? 'update' : 'add'} sense. Please try again.`))
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditSense = (sense: any) => {
    setEditingSense(sense)

    // Pre-fill form with sense data
    senseForm.reset({
      kere: sense.kere,
      ekerota: sense.ekerota && sense.ekerota.length > 0 ? sense.ekerota : [''],
      upho: sense.upho || '',
      oto: sense.oto || '',
      otoOmra: sense.otoOmra || '',
      idje: idjeToFormArray(sense.idje),
      uphoesio: sense.uphoesio || '',
      okpo: sense.okpo && sense.okpo.length > 0 ? sense.okpo : [],
      orhan: sense.orhan && sense.orhan.length > 0 ? sense.orhan : [],
      ibuebu: sense.ibuebu && sense.ibuebu.length > 0 ? sense.ibuebu : [],
      ekaeruo: sense.ekaeruo && sense.ekaeruo.length > 0 ? sense.ekaeruo : [],
      odeUfue: sense.odeUfue && sense.odeUfue.length > 0 ? sense.odeUfue : [],
      erevwe: sense.erevwe || '',
    })

    // Populate idje audio uploads state
    if (sense.idje && Array.isArray(sense.idje)) {
      const uploads: Record<string, string> = {}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sense.idje.forEach((item: any, idx: number) => {
        if (item && typeof item === 'object' && item.audioUrl) {
          uploads[`idje.${idx}.audioUrl`] = item.audioUrl
        }
      })
      setSenseIdjeAudioUploads(uploads)
    }

    // Populate sense otoOmra upload state
    if (sense.otoOmra) {
      setSenseOtoOmraUploads({ otoOmra: sense.otoOmra })
    }

    setAddSenseModalOpen(true)
  }

  const handleDeleteSense = async () => {
    if (!senseToDelete || !apiWord) return

    try {
      await deleteSense({
        wordId: wordId,
        senseId: senseToDelete.id,
        senseIndex: senseToDelete.kere
      }).unwrap()

      toast.success('Sense deleted successfully!')
      setDeleteSenseModalOpen(false)
      setSenseToDelete(null)
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error('Error deleting sense:', error as any)
      toast.error(getErrorMessage(error, 'Failed to delete sense. Please try again.'))
    }
  }

  // Update kere when modal opens (only for new senses)
  useEffect(() => {
    if (addSenseModalOpen && apiWord && !editingSense) {
      const existingSenses = apiWord.oho || []
      const maxKere = existingSenses.length > 0
        ? Math.max(...existingSenses.map(s => s.kere))
        : 0
      senseForm.setValue('kere', maxKere + 1)
    }
  }, [addSenseModalOpen, apiWord, senseForm, editingSense])

  // Update languageType when translation modal opens (only for new translations)
  useEffect(() => {
    if (addTranslationModalOpen) {
      translationForm.setValue('languageType', activeTranslationLang === 'eng' ? 'english' : 'korean')
    }
  }, [addTranslationModalOpen, activeTranslationLang, translationForm])

  const handleAddTranslation = async (data: z.infer<typeof translationSchema>) => {
    if (!apiWord) return

    try {
      // Pre-process okpo to remove items with empty ota before validation
      const processedData = {
        ...data,
        okpo: data.okpo?.filter(item => item.ota && item.ota.trim().length > 0).map(item => ({
          ota: item.ota,
          egba: item.egba && item.egba.trim().length > 0 ? item.egba : undefined
        })) || []
      }

      // Process idje to filter empty sentences and remove empty audioUrl
      const processedIdje = processedData.idje
        .filter(item => item.sentence && item.sentence.trim().length > 0)
        .map(item => ({
          sentence: item.sentence,
          ...(item.audioUrl && item.audioUrl.trim().length > 0 ? { audioUrl: item.audioUrl } : {})
        }))

      // Create new translation
      const translationData = {
        ota: processedData.ota,
        ekerota: processedData.ekerota.filter(item => item.trim().length > 0),
        oto: processedData.oto,
        otoOmra: processedData.otoOmra && processedData.otoOmra.trim().length > 0 ? processedData.otoOmra : undefined,
        idje: processedIdje,
        upho: processedData.languageType === 'korean'
          ? (processedData.upho && processedData.upho.trim().length > 0 ? processedData.upho : undefined)
          : processedData.upho,
        uphoesio: processedData.languageType === 'korean'
          ? (processedData.uphoesio && processedData.uphoesio.trim().length > 0 ? processedData.uphoesio : undefined)
          : processedData.uphoesio,
        okpo: processedData.okpo,
        orhan: processedData.orhan?.filter(item => item.trim().length > 0) || [],
        ibuebu: processedData.ibuebu?.filter(item => item.trim().length > 0) || [],
        ekaeruo: processedData.ekaeruo?.filter(item => item.trim().length > 0) || [],
        odeUfue: processedData.odeUfue?.filter(item => item.trim().length > 0) || [],
        languageType: processedData.languageType,
      }

      await createTranslation({
        wordId: wordId,
        translationData
      }).unwrap()

      toast.success('Translation added successfully!')

      setAddTranslationModalOpen(false)
      translationForm.reset()
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error('Error adding translation:', error as any)
      toast.error(getErrorMessage(error, 'Failed to add translation. Please try again.'))
    }
  }

  const handleEditTranslationSubmit = async (data: z.infer<typeof translationSchema>) => {
    if (!apiWord || !editingTranslation) return

    try {
      // Pre-process okpo to remove items with empty ota before validation
      const processedData = {
        ...data,
        okpo: data.okpo?.filter(item => item.ota && item.ota.trim().length > 0).map(item => ({
          ota: item.ota,
          egba: item.egba && item.egba.trim().length > 0 ? item.egba : undefined
        })) || []
      }

      // Process idje to filter empty sentences and remove empty audioUrl
      const processedIdje = processedData.idje
        .filter(item => item.sentence && item.sentence.trim().length > 0)
        .map(item => ({
          sentence: item.sentence,
          ...(item.audioUrl && item.audioUrl.trim().length > 0 ? { audioUrl: item.audioUrl } : {})
        }))

      // Update existing translation
      const translationData = {
        ota: processedData.ota,
        ekerota: processedData.ekerota.filter(item => item.trim().length > 0),
        oto: processedData.oto,
        otoOmra: processedData.otoOmra && processedData.otoOmra.trim().length > 0 ? processedData.otoOmra : undefined,
        idje: processedIdje,
        upho: processedData.languageType === 'korean'
          ? (processedData.upho && processedData.upho.trim().length > 0 ? processedData.upho : undefined)
          : processedData.upho,
        uphoesio: processedData.languageType === 'korean'
          ? (processedData.uphoesio && processedData.uphoesio.trim().length > 0 ? processedData.uphoesio : undefined)
          : processedData.uphoesio,
        okpo: processedData.okpo,
        orhan: processedData.orhan?.filter(item => item.trim().length > 0) || [],
        ibuebu: processedData.ibuebu?.filter(item => item.trim().length > 0) || [],
        ekaeruo: processedData.ekaeruo?.filter(item => item.trim().length > 0) || [],
        odeUfue: processedData.odeUfue?.filter(item => item.trim().length > 0) || [],
        languageType: processedData.languageType,
        translationIndex: editingTranslation.translation.kere,
        translationId: editingTranslation.translationId,
      }

      await updateTranslation({
        wordId: wordId,
        translationData
      }).unwrap()

      toast.success('Translation updated successfully!')

      setEditTranslationModalOpen(false)
      setEditingTranslation(null)
      editTranslationForm.reset()
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error('Error updating translation:', error as any)
      toast.error(getErrorMessage(error, 'Failed to update translation. Please try again.'))
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditTranslation = (translation: any) => {
    const languageType = activeTranslationLang === 'eng' ? 'english' : 'korean'
    const translationId = activeTranslationLang === 'eng'
      ? (translation.efaEngId || translation.id)
      : (translation.efaKorId || translation.id)

    setEditingTranslation({
      translation,
      languageType,
      translationId
    })

    // Pre-fill form with translation data
    const details = translation.details || {}
    editTranslationForm.reset({
      ota: translation.otaWord || '',
      ekerota: details.ekerota && details.ekerota.length > 0 ? details.ekerota : [''],
      upho: details.upho || '',
      oto: details.oto || '',
      otoOmra: details.otoOmra || '',
      idje: idjeToFormArray(details.idje),
      uphoesio: details.uphoesio || '',
      okpo: details.okpo && details.okpo.length > 0 ? details.okpo : [],
      orhan: details.orhan && details.orhan.length > 0 ? details.orhan : [],
      ibuebu: details.ibuebu && details.ibuebu.length > 0 ? details.ibuebu : [],
      ekaeruo: details.ekaeruo && details.ekaeruo.length > 0 ? details.ekaeruo : [],
      odeUfue: details.odeUfue && details.odeUfue.length > 0 ? details.odeUfue : [],
      languageType: languageType,
    })

    // Populate translation idje audio uploads state
    if (details.idje && Array.isArray(details.idje)) {
      const uploads: Record<string, string> = {}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      details.idje.forEach((item: any, idx: number) => {
        if (item && typeof item === 'object' && item.audioUrl) {
          uploads[`idje.${idx}.audioUrl`] = item.audioUrl
        }
      })
      setTranslationIdjeAudioUploads(uploads)
    }

    // Populate translation otoOmra upload state
    if (details.otoOmra) {
      setTranslationOtoOmraUploads({ otoOmra: details.otoOmra })
    }

    setEditTranslationModalOpen(true)
  }

  const handleDeleteTranslation = async () => {
    if (!translationToDelete || !apiWord) return

    try {
      await deleteTranslation({
        wordId: wordId,
        translationId: translationToDelete.translationId,
        translationIndex: translationToDelete.translation.kere,
        languageType: translationToDelete.languageType
      }).unwrap()

      toast.success('Translation deleted successfully!')
      setDeleteTranslationModalOpen(false)
      setTranslationToDelete(null)
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error('Error deleting translation:', error as any)
      toast.error(getErrorMessage(error, 'Failed to delete translation. Please try again.'))
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTranslationAudioUpload = async (translation: any, audioUrl: string) => {
    if (!apiWord || !translation) return

    try {
      const languageType = activeTranslationLang === 'eng' ? 'english' : 'korean'
      const translationId = activeTranslationLang === 'eng'
        ? (translation.efaEngId || translation.id)
        : (translation.efaKorId || translation.id)

      await updateTranslationAudio({
        wordId: wordId,
        translationId: translationId,
        translationIndex: translation.kere,
        url: audioUrl,
        languageType: languageType
      }).unwrap()

      toast.success('Translation audio updated successfully!')
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error('Error updating translation audio:', error as any)
      toast.error(getErrorMessage(error, 'Failed to update translation audio. Please try again.'))
    }
  }

  const handleDeleteTranslationAudio = async () => {
    if (!translationAudioToDelete || !apiWord) return

    try {
      await deleteTranslationAudio({
        wordId: wordId,
        translationId: translationAudioToDelete.translationId,
        translationIndex: translationAudioToDelete.translation.kere,
        removeUrl: translationAudioToDelete.url,
        languageType: translationAudioToDelete.languageType
      }).unwrap()

      toast.success('Translation audio deleted successfully!')
      setDeleteTranslationAudioModalOpen(false)
      setTranslationAudioToDelete(null)
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error('Error deleting translation audio:', error as any)
      toast.error(getErrorMessage(error, 'Failed to delete translation audio. Please try again.'))
    }
  }

  const handleDeleteTranslationImage = async () => {
    if (!translationImageToDelete || !apiWord) return

    try {
      await deleteTranslationImage({
        wordId: wordId,
        translationId: translationImageToDelete.translationId,
        translationIndex: translationImageToDelete.translation.kere,
        removeUrl: translationImageToDelete.url,
        imageType: translationImageToDelete.imageType || 'photo',
        languageType: translationImageToDelete.languageType
      }).unwrap()

      toast.success('Translation image deleted successfully!')
      setDeleteTranslationImageModalOpen(false)
      setTranslationImageToDelete(null)
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error('Error deleting translation image:', error as any)
      toast.error(getErrorMessage(error, 'Failed to delete translation image. Please try again.'))
    }
  }

  const cancelEditSense = () => {
    setEditingSenseId(null)
    setEditedSense(null)
  }

  const saveSenseEdit = async (senseId: string) => {
    if (!apiWord || !editedSense) return
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updatedOho = (apiWord.oho || []).map((s: any) => {
        if (s.id !== senseId) return s
        const newIdje = Array.isArray(s.idje) && s.idje.length > 0 ? [...s.idje] : ['']
        newIdje[0] = editedSense.idje
        const newEkerota = Array.isArray(s.ekerota) && s.ekerota.length > 0 ? [...s.ekerota] : ['']
        newEkerota[0] = editedSense.ekerota
        return {
          ...s,
          oto: editedSense.oto,
          idje: newIdje,
          ekerota: newEkerota,
        }
      })

      await genericMutation({
        url: `/word/${wordId}`,
        method: 'PATCH',
        body: { oho: updatedOho },
        invalidatesTags: [{ type: 'words' }]
      }).unwrap()

      toast.success('Sense updated')
      setEditingSenseId(null)
      setEditedSense(null)
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error('Failed to update sense', e as any)
      toast.error(getErrorMessage(e, 'Failed to update sense'))
    }
  }

  const handleSubmitReview = async () => {
    if (!rating || rating === 0) {
      toast.error('Please select a rating')
      return
    }
    if (!reviewText.trim()) {
      toast.error('Please write a review')
      return
    }

    try {
      // Preserve whitespace exactly as typed - don't trim the review text
      await submitReview({
        id: wordId,
        rating,
        review: reviewText
      }).unwrap()

      toast.success('Review submitted successfully!')
      setIsReviewModalOpen(false)
      setRating(0)
      setReviewText('')
    } catch (error) {
      console.error('Failed to submit review', error)
      toast.error(getErrorMessage(error, 'Failed to submit review. Please try again.'))
    }
  }

  const handleReplyToReview = async () => {
    if (!wordId || !replyingToReviewId || !replyText.trim()) return
    try {
      await replyToReview({
        wordId,
        parentId: replyingToReviewId,
        review: replyText.trim(),
      }).unwrap()
      toast.success(t('common.replySubmitted', 'Reply submitted successfully!'))
      setReplyingToReviewId(null)
      setReplyText('')
    } catch (error) {
      console.error('Failed to submit reply', error)
      toast.error(getErrorMessage(error, 'Failed to submit reply. Please try again.'))
    }
  }

  const renderStarRating = (rating: number | null | undefined, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5'
    }
    const safeRating = rating != null ? Number(rating) : 0
    const hasRating = rating != null && !Number.isNaN(safeRating)

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${star <= safeRating ? 'text-yellow-400 fill-current' : 'text-gray-400'
              }`}
          />
        ))}
        {hasRating && (
          <span className="text-sm text-gray-400 ml-1">({safeRating.toFixed(1)})</span>
        )}
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'in-review':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-400 mb-2">Error Loading Word</h2>
          <p className="text-gray-300">
            {error && 'data' in error ? String(error.data) : 'Failed to load word details. Please try again.'}
          </p>
          <Button
            onClick={() => router.push('/dictionary')}
            className="mt-4 hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back', 'Back')}
          </Button>
        </div>
      </div>
    )
  }

  // Word not found
  if (!word) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-yellow-400 mb-2">Word Not Found</h2>
          <p className="text-gray-300">
            The word you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button
            onClick={() => router.push('/dictionary')}
            className="mt-4 hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back', 'Back')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="lg:max-w-4xl mx-auto px-3 sm:px-4 md:px-0 pt-4 sm:pt-0 space-y-4 overflow-x-hidden grid grid-cols-1 w-full">
      {/* Header with Back button and Moderation buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center justify-between sm:justify-start w-full gap-2">
          <Button
            variant="default"
            onClick={() => router.push('/dictionary')}
            className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] w-fit cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back', 'Back')}
          </Button>

        </div>
      </div>

      {/* Rejection Reason Card */}
      {apiWord?.status === 'rejected' && apiWord?.rejectionReason && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="shrink-0 mt-0.5">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-400">{apiWord.rejectionReason}</p>
            </div>
          </div>
        </div>
      )}

      {/* Word Info */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 wrap-break-words">{word?.word}</h1>
            {(isSuperAdmin || hasPermission('edit_word')) && !isViewMode && (
              <div className="sm:hidden">
                <Dialog open={showEditWord} onOpenChange={setShowEditWord}>
                  <DialogTrigger asChild>
                    <Button variant="default" size="icon" className="text-white bg-[#2a2a2a] hover:bg-[#3a3a3a]">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#1E1E1E] text-white border border-white/10 max-w-lg w-full">
                    <DialogHeader>
                      <DialogTitle>{t('common.editWordDetails', 'Edit Word Details')}</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        editWordForm.handleSubmit(handleUpdateWord)(e);
                      }}
                      className="space-y-4 mt-2"
                    >
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">{t('common.ota', 'Ota')}</label>
                        <Input
                          {...editWordForm.register('ota')}
                          className="bg-transparent border-white/10"
                          placeholder={t('common.enterHeadword', 'Enter headword')}
                        />
                        {editWordForm.formState.errors.ota && (
                          <p className="text-xs text-red-400">{editWordForm.formState.errors.ota.message}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Controller
                          name="otaOkpopko"
                          control={editWordForm.control}
        render={({ field }) => (
                            <input
                              type="checkbox"
                              id="otaOkpopko"
                              className="h-4 w-4"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          )}
                        />
                        <label htmlFor="otaOkpopko" className="text-sm text-gray-300">
                          {t('common.isNewWord', 'Is new word?')}
                        </label>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">{t('common.wordExplanation', 'Word explanation')}</label>
                        <Input
                          {...editWordForm.register('creationReason')}
                          className="bg-transparent border-white/10"
                          placeholder={t('common.enterWordExplanation', 'Enter word explanation')}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">{t('common.dialect', 'Dialect')}</label>
                        <select
                          {...editWordForm.register('erevwe')}
                          className="bg-[#1e1e1e] border border-white/10 p-2 rounded-md w-full text-white"
                        >
                          <option value="" className="text-white">
                            {t('common.selectDialect', 'Select dialect')}
                          </option>
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {provinces?.map((opt: any, index: number) => (
                            <option key={index} value={opt.name} className="text-white">
                              {opt.name}
                            </option>
                          ))}
                          <option value="standard" className="text-white">
                            {t('common.standard', 'Standard')}
                          </option>
                        </select>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setShowEditWord(false)}
                          className="text-gray-300"
                        >
                          {t('common.cancel', 'Cancel')}
                        </Button>
                        <Button
                          type="submit"
                          disabled={isUpdatingWord}
                          className="cursor-pointer"
                        >
                          {isUpdatingWord ? t('common.saving', 'Saving...') : t('common.save', 'Save')}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>

          <div className="space-y-1 text-sm">
            {/* Mobile: Senses and Status with justify-between */}
            <div className="md:hidden flex items-center justify-between flex-wrap gap-2">
              <p className="text-gray-400 flex items-center gap-2">
                <span className="text-gray-300 font-medium">Senses:</span> <span className="text-gray-400">{apiWord?.oho?.length || 0}</span>
              </p>
              {/* Status badge - shown beside Senses in mobile */}
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(word?.status || '')}`}>
                {/* {word?.status && word?.status?.charAt(0).toUpperCase() + word?.status?.slice(1) || ''} */}
                {word?.status === 'pending' ? t('common.pendingReview', 'Pending Review') :
                  word?.status === 'in-review' ? t('common.inReview', 'In Review') :
                    word?.status === 'approved' ? t('common.approved', 'Approved') :
                      word?.status === 'rejected' ? t('common.rejected', 'Rejected') : word?.status || ''
                }
              </span>
            </div>
            {/* Desktop: Senses only */}
            <p className="hidden md:block text-gray-400">
              <span className="text-gray-300 font-medium">{t('common.senses', 'Ọhọ')}:</span> <span className="text-gray-400">{apiWord?.oho?.length || 0}</span>
            </p>
            <p className="text-gray-400">
              <span className="text-gray-300 font-medium">{t('common.addedBy', 'Added by')}:</span> <span className="text-gray-400">{word?.author}</span>
            </p>
            <div className="md:hidden flex items-center justify-between">
              <p className="text-gray-400">
                <span className="text-gray-300 font-medium">{t('common.date', 'Date')}:</span> <span className="text-gray-400">{new Date(word?.createdAt || '').toLocaleDateString()}</span>
              </p>
              {/* Set to Review button - shown beside date in mobile (all users) */}
              {word?.status === 'pending' && (
                  <Button
                    size="sm"
                    onClick={handleSetToReview}
                    disabled={isApproving || isRejecting || isSettingToReview || isDeleting}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    {isSettingToReview ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {t('common.setToReview', 'Set to Review')}
                      </>
                    )}
                  </Button>
                )}
            </div>
            <p className="hidden md:block text-gray-400">
              <span className="text-gray-300 font-medium">{t('common.date', 'Date')}:</span> <span className="text-gray-400">{new Date(word?.createdAt || '').toLocaleDateString()}</span>
            </p>
          </div>
        </div>
        <div className="hidden md:flex flex-wrap items-center gap-2">
          {/* Status badge and Set to Review button - shown in header for desktop (all users can set to review) */}
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(word?.status || '')}`}>
            {word?.status === 'pending' ? t('common.pendingReview', 'Pending Review') :
              word?.status === 'in-review' ? t('common.inReview', 'In Review') :
                word?.status === 'approved' ? t('common.approved', 'Approved') :
                  word?.status === 'rejected' ? t('common.rejected', 'Rejected') : word?.status || ''
            }
          </span>
          {word?.status === 'pending' && (
              <Button
                size="sm"
                onClick={handleSetToReview}
                disabled={isApproving || isRejecting || isSettingToReview || isDeleting}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                {isSettingToReview ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {t('common.setToReview', 'Set to Review')}
                  </>
                )}
              </Button>
            )}
          {(isSuperAdmin || hasPermission('edit_word')) && !isViewMode && (
            <Dialog open={showEditWord} onOpenChange={setShowEditWord}>
              <DialogTrigger asChild>
                <Button variant="default" size="sm" className="whitespace-nowrap">
                  <Edit className="h-4 w-4 mr-1" />
                  {t('common.editWord', 'Edit Word')}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1E1E1E] text-white border border-white/10 max-w-lg w-full">
                <DialogHeader>
                  <DialogTitle>{t('common.editWordDetails', 'Edit Word Details')}</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    editWordForm.handleSubmit(handleUpdateWord)(e);
                  }}
                  className="space-y-4 mt-2"
                >
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">{t('common.ota', 'Ota')}</label>
                    <Input
                      {...editWordForm.register('ota')}
                      className="bg-transparent border-white/10"
                      placeholder={t('common.enterHeadword', 'Enter headword')}
                    />
                    {editWordForm.formState.errors.ota && (
                      <p className="text-xs text-red-400">{editWordForm.formState.errors.ota.message}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Controller
                      name="otaOkpopko"
                      control={editWordForm.control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          id="otaOkpopko-desktop"
                          className="h-4 w-4"
                          checked={field.value || false}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                    <label htmlFor="otaOkpopko-desktop" className="text-sm text-gray-300">
                      {t('common.isNewWord', 'Is new word?')}
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">{t('common.wordExplanation', 'Word explanation')}</label>
                    <Input
                      {...editWordForm.register('creationReason')}
                      className="bg-transparent border-white/10"
                      placeholder={t('common.enterWordExplanation', 'Enter word explanation')}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">{t('common.dialect', 'Dialect')}</label>
                    <select
                      {...editWordForm.register('erevwe')}
                      className="bg-[#1e1e1e] border border-white/10 p-2 rounded-md w-full text-white"
                    >
                      <option value="" className="text-white">
                        {t('common.selectDialect', 'Select dialect')}
                      </option>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {provinces?.map((opt: any, index: number) => (
                        <option key={index} value={opt.name} className="text-white">
                          {opt.name}
                        </option>
                      ))}
                      <option value="standard" className="text-white">
                        {t('common.standard', 'Standard')}
                      </option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowEditWord(false)}
                      className="text-gray-300"
                    >
                      {t('common.cancel', 'Cancel')}
                    </Button>
                    <Button
                      type="submit"
                      disabled={isUpdatingWord}
                      className="cursor-pointer"
                    >
                      {isUpdatingWord ? t('common.saving', 'Saving...') : t('common.save', 'Save')}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>


      {/* Tabs: Senses, Translations, Reviews */}
      <Tabs defaultValue="senses" className="w-full">
        <div className="mb-4 overflow-x-auto no-scrollbar w-full">
          <TabsList className="lg:grid lg:grid-cols-3 bg-[#1E1E1E] border border-white/10 lg:w-full">
            <TabsTrigger value="senses" className="data-[state=active]:bg-[#F5DEB3]! data-[state=active]:text-[#1e1e1e]! whitespace-nowrap px-4 w-full space-x-2 text-white!">
              {t('common.senses', 'Ọhọ')}
            </TabsTrigger>
            <TabsTrigger value="translations" className="data-[state=active]:bg-[#F5DEB3]! data-[state=active]:text-[#1e1e1e]! whitespace-nowrap px-4 w-full space-x-2 flex items-center gap-1 text-white!">
              <Languages className="h-4 w-4" /> {t('common.translations', 'Translations')}
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-[#F5DEB3]! data-[state=active]:text-[#1e1e1e]! whitespace-nowrap px-4 w-full space-x-2 flex items-center gap-1 text-white!">
              <MessageSquare className="h-4 w-4" /> {t('common.reviews', 'Reviews')}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="senses" className="mt-4">
          <div className="space-y-6">
            {apiWord?.oho && apiWord.oho.length > 0 ? (
              <>
                {[...apiWord.oho]
                  .sort((a, b) => a.kere - b.kere)
                  .map((sense) => (
                    <div key={sense.id} className="bg-linear-to-br from-[#1E1E1E] to-[#232323] border border-white/10 rounded-xl p-4 sm:p-4 shadow-lg overflow-hidden">
                      {/* Header */}
                      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="shrink-0 w-10 h-10 rounded-lg bg-[#F5DEB3]/20 border border-[#F5DEB3]/30 flex items-center justify-center">
                            <span className="text-[#F5DEB3] font-bold text-lg">{sense.kere}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {editingSenseId === sense.id ? (
                            <>
                              <Button size="sm" className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] cursor-pointer shrink-0" onClick={() => saveSenseEdit(sense.id)} disabled={isSavingSense}>
                                {isSavingSense ? <LoadingSpinner size="sm" /> : <><Check className="h-4 w-4 mr-1" /> {t('common.save', "Save")}</>}
                              </Button>
                              <Button size="sm" className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] cursor-pointer shrink-0" onClick={cancelEditSense}>
                                <X className="h-4 w-4 mr-1" /> {t("common.cancel", "Cancel")}
                              </Button>
                            </>
                          ) : (
                            <>
                              {!isViewMode && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] shrink-0 cursor-pointer"
                                    onClick={() => handleEditSense(sense)}
                                  >
                                    <Edit className="h-4 w-4 sm:mr-1" /> <span className="hidden sm:inline">{t("common.edit", "Edit")}</span>
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="default"
                                    className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] shrink-0 cursor-pointer"
                                    onClick={() => setAddSenseModalOpen(true)}
                                  >
                                    <Plus className="h-4 w-4 sm:mr-1" /> <span className="hidden sm:inline">{t("common.addSense", "Ba Ọhọ")}</span>
                                  </Button>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Main Content */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Left Column - Single Card with All Information */}
                        <div className="lg:col-span-2">
                          <div className="bg-[#1a1a1a]/50 rounded-lg p-3 sm:p-5 border border-white/5 space-y-4 wrap-break-words">
                            {sense.upho && (
                              <div>
                                <p className="text-sm sm:text-md text-gray-300 mb-1 font-semibold wrap-break-words">
                                  {t('common.upho', 'Ubiupho')}: <span className="text-gray-400 text-sm sm:text-base wrap-break-words">{`[${sense.upho}]`}</span>
                                </p>
                              </div>
                            )}
                            {sense.uphoesio && (
                              <div>
                                <p className="text-sm sm:text-md text-gray-300 mb-1 font-semibold wrap-break-words">
                                  {t('common.uphoesio', 'IPA')}: <span className="text-gray-400 font-mono text-sm sm:text-base wrap-break-words">/{sense.uphoesio}/</span>
                                </p>
                              </div>
                            )}
                            {sense.oto && (
                              <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm sm:text-md text-gray-300 font-semibold wrap-break-words">
                                      {t('common.oto', 'Otọ')}: <span className="text-gray-400 text-sm sm:text-base wrap-break-words">{sense.oto}</span>
                                    </p>
                                  </div>
                                </div>
                                {sense.otoOmra && (
                                  <div className="bg-[#1e1e1e] rounded-lg p-2 flex items-center gap-2">
                                    <audio controls className="flex-1 w-full min-w-0">
                                      <source src={sense.otoOmra} type="audio/mpeg" />
                                    </audio>
                                    {(isSuperAdmin || hasPermission('delete_media')) && !isViewMode && (
                                      <button
                                        onClick={() => {
                                          setOtoAudioToDelete({ sense })
                                          setDeleteOtoAudioModalOpen(true)
                                        }}
                                        className="text-red-400 hover:text-red-500 bg-transparent hover:bg-transparent rounded-full p-1.5 shrink-0"
                                        disabled={isUpdatingSenseOtoAudio}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                            {sense.ekerota && sense.ekerota.length > 0 && (
                              <div>
                                <p className="text-sm sm:text-md text-gray-300 mb-1 font-semibold wrap-break-words">
                                  {t('common.ekerota', 'Eghọ rẹ Ejajẹ')}: <span className="text-gray-400 text-sm sm:text-base wrap-break-words lowercase! text-lowercase!">{sense.ekerota.join(', ')}</span>
                                </p>
                              </div>
                            )}
                            {sense.idje && Array.isArray(sense.idje) && sense.idje.length > 0 && (
                              <div>
                                <p className="text-sm sm:text-md text-gray-300 mb-2 font-semibold">
                                  {t('common.idje', 'Udje')}:
                                </p>
                                <ul className="list-none space-y-3 ml-4">
                                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                  {sense.idje.map((example: any, idx: number) => {
                                    const sentence = getIdjeSentence(example)
                                    const audioUrl = typeof example === 'object' && example !== null ? example.audioUrl : null
                                    return sentence ? (
                                      <li key={idx} className="space-y-3">
                                        <div className="flex items-start gap-3">
                                          <span className="text-gray-400 italic text-sm sm:text-base wrap-break-words flex-1 min-w-0">
                                            {idx + 1}. {sentence}
                                          </span>
                                          {(isSuperAdmin || hasPermission('add_media')) && !isViewMode && (
                                            <UploadModal
                                              type="audio"
                                              onUrlSelect={(url) => handleSenseExampleSentenceAudioUpload(sense, idx, url)}
                                            >
                                              <Button
                                                type="button"
                                                size="sm"
                                                className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] cursor-pointer shrink-0"
                                                disabled={isUpdatingSenseExampleSentenceAudio}
                                              >
                                                {isUpdatingSenseExampleSentenceAudio ? (
                                                  <LoadingSpinner size="sm" />
                                                ) : (
                                                  <>
                                                    <Volume2 className="h-4 w-4 mr-1" />
                                                    {audioUrl ? t('common.updateAudio', 'Update Audio') : t('common.add', 'Add')}
                                                  </>
                                                )}
                                              </Button>
                                            </UploadModal>
                                          )}
                                        </div>
                                        {audioUrl && (
                                          <div className="bg-[#1e1e1e] rounded-lg p-2 flex items-center gap-2">
                                            <audio controls className="flex-1 w-full min-w-0">
                                              <source src={audioUrl} type="audio/mpeg" />
                                            </audio>
                                            {(isSuperAdmin || hasPermission('delete_media')) && !isViewMode && (
                                              <button
                                                onClick={() => {
                                                  setExampleSentenceAudioToDelete({ sense, exampleSentenceIndex: idx })
                                                  setDeleteExampleSentenceAudioModalOpen(true)
                                                }}
                                                className="text-red-400 hover:text-red-500 bg-transparent hover:bg-transparent rounded-full p-1.5 shrink-0"
                                                disabled={isUpdatingSenseExampleSentenceAudio}
                                              >
                                                <Trash2 className="h-4 w-4" />
                                              </button>
                                            )}
                                          </div>
                                        )}
                                      </li>
                                    ) : null
                                  })}
                                </ul>
                              </div>
                            )}
                            {sense.ibuebu && sense.ibuebu.length > 0 && (
                              <div>
                                <p className="text-md text-gray-300 mb-2 font-semibold">
                                  {t('common.ibuebu', 'Ebuo')}:
                                </p>
                                <ul className="list-none space-y-1 ml-4">
                                  {sense.ibuebu.map((plural: string, idx: number) => (
                                    <li key={idx} className="text-gray-400 text-base">
                                      {idx + 1}. {plural}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {sense.orhan && sense.orhan.length > 0 && (
                              <div>
                                <p className="text-sm sm:text-md text-gray-300 mb-1 font-semibold wrap-break-words">
                                  {t('common.orhan', 'Antonyms')}: <span className="text-gray-400 text-sm sm:text-base wrap-break-words">{sense.orhan.join(', ')}</span>
                                </p>
                              </div>
                            )}
                            {sense.ekaeruo && sense.ekaeruo.length > 0 && (
                              <div>
                                <p className="text-md text-gray-300 mb-2 font-semibold">
                                  {t('common.ekaeruo', 'Oka Eruo')}:
                                </p>
                                <ul className="list-none space-y-1 ml-4">
                                  {sense.ekaeruo.map((verbType: string, idx: number) => (
                                    <li key={idx} className="text-gray-400 text-base">
                                      {idx + 1}. {verbType}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {sense.okpo && sense.okpo.length > 0 && (
                              <div>
                                <p className="text-sm sm:text-md text-gray-300 mb-1 font-semibold wrap-break-words">
                                  {t('common.okpo', 'Synonyms')}: <span className="text-gray-400 text-sm sm:text-base wrap-break-words">
                                    {sense.okpo.map((rw, idx) => (
                                      <span key={idx}>
                                        {rw.ota}{rw.egba ? ` (${rw.egba})` : ''}{idx < sense.okpo.length - 1 ? ', ' : ''}
                                      </span>
                                    ))}
                                  </span>
                                </p>
                              </div>
                            )}
                            {sense.odeUfue && sense.odeUfue.length > 0 && sense.odeUfue.some(v => v.trim() !== '') && (
                              <div>
                                <p className="text-sm sm:text-md text-gray-300 mb-1 font-semibold wrap-break-words">
                                  {t('common.odeUfue', 'Scientific Name')}: <span className="text-gray-400 italic text-sm sm:text-base wrap-break-words">{sense.odeUfue.filter(v => v.trim() !== '').join(', ')}</span>
                                </p>
                              </div>
                            )}
                          </div>
                          {/* Delete Sense Button - hidden in mobile, shown in desktop */}
                          {(isSuperAdmin || hasPermission('delete_word')) && (
                            <div className="hidden lg:block mt-4 pt-4 border-t border-white/10">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-400 hover:text-red-500 hover:bg-transparent bg-transparent cursor-pointer"
                                onClick={() => {
                                  setSenseToDelete(sense)
                                  setDeleteSenseModalOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4 sm:mr-1" /> <span className="hidden sm:inline">{t('common.deleteSense', 'Delete Ọhọ')}</span>
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Right Column - Media */}
                        <div className="lg:col-span-1 space-y-4">
                          {/* Audio */}
                          {isViewMode ? (
                            // View mode: Show speaker icon(s) instead of audio card
                            sense.omra && sense.omra.length > 0 ? (
                              <div className="flex flex-wrap gap-3">
                                {sense.omra.map((audioUrl, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => {
                                      const audio = new Audio(audioUrl)
                                      audio.play().catch(err => {
                                        console.error('Error playing audio:', err)
                                        toast.error('Failed to play audio')
                                      })
                                    }}
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F5DEB3] text-[#1e1e1e] hover:bg-[#f0d4a0] transition-colors cursor-pointer"
                                    title="Play audio"
                                  >
                                    <Volume2 className="h-5 w-5" />
                                  </button>
                                ))}
                              </div>
                            ) : null
                          ) : (
                            // Edit mode: Show full audio card
                            <div className="bg-[#1a1a1a]/50 rounded-lg p-4 border border-white/5">
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold text-[#F5DEB3]">{t('common.omra', 'Audio')}</h3>
                                {(isSuperAdmin || hasPermission('add_media')) && (
                                  <UploadModal
                                    type="audio"
                                    onUrlSelect={(url) => handleSenseAudioUpload(sense, url)}
                                  >
                                    <Button
                                      type="button"
                                      size="sm"
                                      className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] cursor-pointer"
                                      disabled={isUpdatingSenseAudio}
                                    // className="
                                    >
                                      {isUpdatingSenseAudio ? (
                                        <LoadingSpinner size="sm" />
                                      ) : (
                                        <>
                                          <Upload className="h-4 w-4 mr-2" />
                                          {t('common.addAudio', 'Add Audio')}
                                        </>
                                      )}
                                    </Button>
                                  </UploadModal>
                                )}
                              </div>
                              {sense.omra && sense.omra.length > 0 ? (
                                <div className="space-y-3">
                                  {sense.omra.map((audioUrl, idx) => (
                                    <div key={idx} className="bg-[#1e1e1e] rounded-lg p-2 flex items-center gap-2">
                                      <audio controls className="flex-1 w-full min-w-0">
                                        <source src={audioUrl} type="audio/mpeg" />
                                      </audio>
                                      {(isSuperAdmin || hasPermission('delete_media')) && (
                                        <button
                                          onClick={() => {
                                            setItemToDelete({ sense, url: audioUrl, type: 'audio' })
                                            setDeleteAudioModalOpen(true)
                                          }}
                                          className="text-red-400 hover:text-red-500 bg-transparent hover:bg-transparent rounded-full p-1.5 shrink-0"
                                          disabled={isDeletingSenseAudio}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-4">
                                  <p className="text-sm text-gray-400 mb-2">{t('common.noAudioYet', 'No audio yet')}</p>
                                  <p className="text-xs text-gray-500">{t('common.clickAddAudioToUpload', 'Click "Add Audio" to upload')}</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Images */}
                          <div className="bg-[#1a1a1a]/50 rounded-lg p-4 border border-white/5">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-sm font-semibold text-[#F5DEB3]">{t('common.oma', 'Images')}</h3>
                              {(isSuperAdmin || hasPermission('add_media')) && !isViewMode && (
                                <UploadModal
                                  type="image"
                                  onUrlSelect={(url) => handleSenseImageUpload(sense, url)}
                                >
                                  <Button
                                    type="button"
                                    size="sm"
                                    className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] cursor-pointer"
                                    disabled={isUpdatingSenseImage}
                                  >
                                    {isUpdatingSenseImage ? (
                                      <LoadingSpinner size="sm" />
                                    ) : (
                                      <>
                                        <Upload className="h-4 w-4 mr-2" />
                                        {t('common.addImage', 'Add Image')}
                                      </>
                                    )}
                                  </Button>
                                </UploadModal>
                              )}
                            </div>
                            {sense.oma && sense.oma.length > 0 ? (
                              <div className="grid grid-cols-2 gap-2 overflow-hidden">
                                {sense.oma.map((img, idx) => (
                                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/10">
                                    <Image
                                      src={img.url}
                                      alt={`sense-${sense.id}-img-${idx}`}
                                      fill
                                      className="object-cover"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.style.display = 'none'
                                      }}
                                    />
                                    <div className="absolute top-2 right-2 flex items-center gap-2">
                                      <span className="text-xs text-white bg-black/60 px-2 py-1 rounded">{img.type}</span>
                                      {(isSuperAdmin || hasPermission('delete_media')) && !isViewMode && (
                                        <button
                                          onClick={() => {
                                            setItemToDelete({ sense, url: img.url, type: 'image', imageType: img.type || 'photo' })
                                            setDeleteImageModalOpen(true)
                                          }}
                                          className="text-red-400 hover:text-red-500 bg-transparent hover:bg-transparent rounded-full p-1.5"
                                          disabled={isDeletingSenseImage}
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-4">
                                <p className="text-sm text-gray-400 mb-2">{t('common.noImagesYet', 'No images yet')}</p>
                                <p className="text-xs text-gray-500">{t('common.clickAddImageToUpload', 'Click "Add Image" to upload')}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Delete Sense Button - shown at end of card in mobile view */}
                      {(isSuperAdmin || hasPermission('delete_word')) && !isViewMode && (
                        <div className="lg:hidden mt-4 pt-4 border-t border-white/10">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-500 hover:bg-transparent bg-transparent cursor-pointer w-full"
                            onClick={() => {
                              setSenseToDelete(sense)
                              setDeleteSenseModalOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> {t('common.deleteSense', 'Delete Ọhọ')}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
              </>
            ) : (
              <div className="bg-[#1E1E1E] border border-white/10 rounded-lg p-8 text-center">
                <p className="text-gray-400">{t('common.noSensesYet', 'Uvweran Ọhọ')}</p>
              </div>
            )}
            {/* Add Sense Button - Always visible, aligned to the right */}
            {(isSuperAdmin || hasPermission('add_word')) && !isViewMode && (
              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  variant="default"
                  className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] cursor-pointer"
                  onClick={() => setAddSenseModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-1" /> {t('common.addSense', 'Ba Ọhọ')}
                </Button>
              </div>
            )}
          </div>

          <div className="bg-[#1E1E1E] border border-white/10 rounded-lg p-4 sm:p-6 mt-5">
            <h2 className="text-lg font-semibold mb-3 text-[#F5DEB3]">{t('common.statistics', 'Statistics')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">{t('common.averageRating', 'Average Rating')}:</span>
                {word?.totalRatings && word?.totalRatings > 0 ? renderStarRating(word?.averageRating || 0, 'lg') : '0'}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">{t('common.totalRatings', 'Total Ratings')}:</span>
                <span className="text-white">{word?.totalRatings}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">{t('common.totalReviews', 'Total Reviews')}:</span>
                <span className="text-white">{word?.totalReviews}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">{t('common.created', 'Created')}:</span>
                <span className="text-white">{new Date(word?.createdAt || '').toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Additional Word Information */}
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(apiWord?.approvedBy || apiWord?.rejectedBy || apiWord?.reviewedBy || apiWord?.rejectionReason || apiWord?.lastAccessed || apiWord?.updatedAt || (apiWord as any)?.creationReason) && (
            <Accordion type="single" collapsible className="mt-6">
              <AccordionItem value="word-information" className="border border-white/10 rounded-lg">
                <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline">
                  <h2 className="text-lg font-semibold text-[#F5DEB3]">{t('common.moreInformation', 'More Information')}</h2>
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(apiWord as any)?.creationReason && (
                      <div className="sm:col-span-2 lg:col-span-3">
                        <p className="text-xs text-gray-400 mb-1">{t('common.wordExplanation', 'Word Explanation')}</p>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <p className="text-sm text-gray-300">{(apiWord as any).creationReason}</p>
                      </div>
                    )}
                    {apiWord?.approvedBy && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">{t('common.approvedBy', 'Approved by')}</p>
                        <p className="text-sm text-gray-300">
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {(approvedByUser as any)?.data?.firstName && (approvedByUser as any)?.data?.lastName
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            ? `${(approvedByUser as any).data.firstName} ${(approvedByUser as any).data.lastName}`
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            : (approvedByUser as any)?.data?.username || apiWord.approvedBy}
                        </p>
                      </div>
                    )}
                    {apiWord?.rejectedBy && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">{t('common.rejectedBy', 'Rejected by')}</p>
                        <p className="text-sm text-gray-300">
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {(rejectedByUser as any)?.data?.firstName && (rejectedByUser as any)?.data?.lastName
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            ? `${(rejectedByUser as any).data.firstName} ${(rejectedByUser as any).data.lastName}`
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            : (rejectedByUser as any)?.data?.username || apiWord.rejectedBy}
                        </p>
                      </div>
                    )}
                    {apiWord?.reviewedBy && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">{t('common.reviewedBy', 'Reviewed by')}</p>
                        <p className="text-sm text-gray-300">
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {(reviewedByUser as any)?.data?.firstName && (reviewedByUser as any)?.data?.lastName
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            ? `${(reviewedByUser as any).data.firstName} ${(reviewedByUser as any).data.lastName}`
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            : (reviewedByUser as any)?.data?.username || apiWord.reviewedBy}
                        </p>
                      </div>
                    )}
                    {apiWord?.lastAccessed && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">{t('common.lastAccessed', 'Last Accessed')}</p>
                        <p className="text-sm text-gray-300">{new Date(apiWord.lastAccessed).toLocaleDateString()}</p>
                      </div>
                    )}
                    {apiWord?.updatedAt && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">{t('common.lastUpdated', 'Last Updated')}</p>
                        <p className="text-sm text-gray-300">{new Date(apiWord.updatedAt).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {/* Action Buttons - Approve, Reject, and Delete */}
          <div className="flex items-center justify-between gap-4 mt-6 pt-6 border-t border-white/10">
            {/* Delete button - shown if user has delete_word permission */}
            {(isSuperAdmin || hasPermission('delete_word')) && (
              <Button
                size="sm"
                onClick={() => setDeleteModalOpen(true)}
                disabled={isApproving || isRejecting || isSettingToReview || isDeleting}
                className="bg-[#1e1e1e] border border-white/10 text-red-400 hover:text-[#1e1e1e]/90"
              >
                <Trash2 className="h-4 w-4 mr-1 text-red-400 " />
                {t('common.delete', 'Delete')}
              </Button>
            )}
            <div className="flex flex-wrap gap-2">
              {(isSuperAdmin || hasPermission('moderate_word')) &&
                word?.status &&
                word?.status !== 'approved' &&
                word?.status !== 'rejected' && (
                  <>
                    {/* Show Approve and Reject for in-review and pending - Reversed order */}
                    {(word.status === 'in-review' || word.status === 'pending') && (
                      <div className="flex flex-row-reverse gap-2">
                        <Button
                          size="sm"
                          onClick={() => setApproveModalOpen(true)}
                          disabled={isApproving || isRejecting || isSettingToReview || isDeleting}
                          className="border-2 border-green-700 text-green-700 bg-transparent hover:bg-green-700 hover:text-white cursor-pointer"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          {t('common.approve', 'Approve')}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setRejectModalOpen(true)}
                          disabled={isApproving || isRejecting || isSettingToReview || isDeleting}
                          className="bg-[#1e1e1e] border border-white/10 hover:bg-[#1e1e1e]/90 text-red-400"
                        >
                          <X className="h-4 w-4 mr-1 text-red-400 " />
                          {t('common.reject', 'Reject')}
                        </Button>

                      </div>
                    )}
                  </>
                )}
            </div>

          </div>
        </TabsContent>

        <TabsContent value="translations" className="mt-4">
          {/* Language Switch */}
          <div className="mb-6">
            <div className="inline-flex gap-2 p-1 rounded-lg bg-[#232323] border border-white/10">
              <Button
                size="sm"
                variant="ghost"
                className={`px-4 rounded-md transition-all ${activeTranslationLang === 'eng'
                  ? 'bg-[#F5DEB3] text-[#1e1e1e] shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                onClick={() => setActiveTranslationLang('eng')}
              >
                English
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className={`px-4 rounded-md transition-all ${activeTranslationLang === 'kor'
                  ? 'bg-[#F5DEB3] text-[#1e1e1e] shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                onClick={() => setActiveTranslationLang('kor')}
              >
                Korean
              </Button>
            </div>
          </div>

          {[...(activeTranslationLang === 'eng' ? (apiWord?.efaEng || []) : (apiWord?.efaKor || []))]
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .sort((a: any, b: any) => a.kere - b.kere)
            .length > 0 ? (
            <div className="space-y-6">
              {[...(activeTranslationLang === 'eng' ? (apiWord?.efaEng || []) : (apiWord?.efaKor || []))]
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .sort((a: any, b: any) => a.kere - b.kere)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((trans: any) => (
                  <div key={trans.id} className="bg-linear-to-br from-[#1E1E1E] to-[#232323] border border-white/10 rounded-xl p-4 sm:p-6 shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="shrink-0 w-10 h-10 rounded-lg bg-[#F5DEB3]/20 border border-[#F5DEB3]/30 flex items-center justify-center">
                          <span className="text-[#F5DEB3] font-bold text-lg">{trans.kere}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {(isSuperAdmin || hasPermission('moderate_word')) && (
                          <>
                            <Button
                              size="sm"
                              className="border-2 border-green-700 text-green-700 bg-transparent hover:bg-green-700 hover:text-white cursor-pointer"
                              onClick={async () => {
                                try {
                                  const languageType = activeTranslationLang === 'eng' ? 'english' : 'korean'
                                  const translationId = activeTranslationLang === 'eng'
                                    ? (trans.efaEngId || trans.id)
                                    : (trans.efaKorId || trans.id)
                                  await approveTranslation({
                                    wordId: wordId,
                                    translationId,
                                    translationIndex: trans.kere - 1,
                                    languageType
                                  }).unwrap()
                                  toast.success('Translation approved successfully')
                                } catch (error) {
                                  toast.error(getErrorMessage(error, 'Failed to approve translation'))
                                }
                              }}
                              disabled={isApprovingTranslation}
                            >
                              {isApprovingTranslation ? (
                                <LoadingSpinner size="sm" />
                              ) : (
                                <>
                                  <Check className="h-4 w-4 sm:mr-1" />
                                  <span className="hidden sm:inline">
                                    {t('common.approve', 'Approve')}
                                  </span>
                                </>
                              )}
                            </Button>
                            <Dialog open={commentModalOpen && currentTranslationForComment?.id === trans.id} onOpenChange={(open) => {
                              if (!open) {
                                setCommentModalOpen(false)
                                setCurrentTranslationForComment(null)
                              }
                            }}>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-white/10 hover:bg-[#2a2a2a] text-gray-300"
                                  onClick={() => {
                                    setCurrentTranslationForComment(trans)
                                    setCommentModalOpen(true)
                                  }}
                                >
                                  <MessageSquare className="h-4 w-4 sm:mr-1" /> <span className="hidden sm:inline">{t('common.comment', 'Comment')}</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-[#1E1E1E] border border-white/10 text-white">
                                <DialogHeader>
                                  <DialogTitle>{t('common.commentOnTranslation', 'Comment on Translation')}</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={async (e) => {
                                  e.preventDefault()
                                  const formData = new FormData(e.currentTarget)
                                  const comment = formData.get('comment') as string
                                  if (!comment || comment.trim().length === 0) {
                                    toast.error('Please enter a comment')
                                    return
                                  }
                                  try {
                                    const languageType = activeTranslationLang === 'eng' ? 'english' : 'korean'
                                    const translationId = activeTranslationLang === 'eng'
                                      ? (trans.efaEngId || trans.id)
                                      : (trans.efaKorId || trans.id)
                                    await commentTranslation({
                                      wordId: wordId,
                                      translationId,
                                      translationIndex: trans.kere - 1,
                                      languageType,
                                      comment: comment.trim()
                                    }).unwrap()
                                    toast.success('Comment added successfully')
                                      ; (e.target as HTMLFormElement).reset()
                                    setCommentModalOpen(false)
                                    setCurrentTranslationForComment(null)
                                  } catch (error) {
                                    toast.error(getErrorMessage(error, 'Failed to add comment'))
                                  }
                                }} className="space-y-4">
                                  <Textarea
                                    name="comment"
                                    placeholder={t('common.enterYourComment', 'Enter your comment...')}
                                    className="bg-[#1e1e1e] border-white/10 text-white min-h-[100px]"
                                    required
                                  />
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      onClick={() => {
                                        setCommentModalOpen(false)
                                        setCurrentTranslationForComment(null)
                                      }}
                                    >
                                      {t('common.cancel', 'Cancel')}
                                    </Button>
                                    <Button
                                      type="submit"
                                      disabled={isCommentingTranslation}
                                      className="bg-[#F5DEB3] hover:bg-[#F5DEB3]/90 text-[#1e1e1e]"
                                    >
                                      {isCommentingTranslation ? <LoadingSpinner size="sm" /> : t('common.submit', 'Submit')}
                                    </Button>
                                  </div>
                                </form>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}
                        {(isSuperAdmin || hasPermission('edit_word')) && !isViewMode && (
                          <Button
                            size="sm"
                            className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] cursor-pointer"
                            onClick={() => handleEditTranslation(trans)}
                          >
                            <Edit className="h-4 w-4 sm:mr-1" /> <span className="hidden sm:inline">{t('common.edit', 'Edit')}</span>
                          </Button>
                        )}
                        {(isSuperAdmin || hasPermission('add_word')) && !isViewMode && (
                          <Button
                            type="button"
                            size="sm"
                            className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] cursor-pointer"
                            onClick={() => {
                              translationForm.reset()
                              setAddTranslationModalOpen(true)
                            }}
                          >
                            <Plus className="h-4 w-4 sm:mr-1" /> <span className="hidden sm:inline">{t('common.addTranslation', 'Add Translation')}</span>
                          </Button>
                        )}

                      </div>
                    </div>

                    {/* Details */}
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(trans as any).details && (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
                        {/* Left Column - Single Card with All Information */}
                        <div className="lg:col-span-2">
                          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 wrap-break-words">{trans.otaWord}</h2>
                          <div className="bg-[#1a1a1a]/50 rounded-lg p-3 sm:p-5 border border-white/5 space-y-4 wrap-break-words">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {(trans as any).details.upho && (
                              <div>
                                <p className="text-sm sm:text-md text-gray-300 mb-1 font-semibold wrap-break-words">
                                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                  {t('common.upho', 'Ubiupho')}: <span className="text-gray-400 text-sm sm:text-base wrap-break-words">{`[${(trans as any).details.upho}]`}</span>
                                </p>
                              </div>
                            )}
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {(trans as any).details.uphoesio && (
                              <div>
                                <p className="text-sm sm:text-md text-gray-300 mb-1 font-semibold wrap-break-words">
                                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                  {t('common.uphoesio', 'IPA')}: <span className="text-gray-400 font-mono text-sm sm:text-base wrap-break-words">/{(trans as any).details.uphoesio}/</span>
                                </p>
                              </div>
                            )}
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {(trans as any).details.oto && (
                              <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm sm:text-md text-gray-300 font-semibold wrap-break-words">
                                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                      {t('common.oto', 'Otọ')}: <span className="text-gray-400 text-sm sm:text-base wrap-break-words">{(trans as any).details.oto}</span>
                                    </p>
                                  </div>
                                </div>
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {(trans as any).details.otoOmra && (
                                  <div className="bg-[#1e1e1e] rounded-lg p-2 flex items-center gap-2">
                                    <audio controls className="flex-1 w-full min-w-0">
                                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                      <source src={(trans as any).details.otoOmra} type="audio/mpeg" />
                                    </audio>
                                    {(isSuperAdmin || hasPermission('delete_media')) && !isViewMode && (
                                      <button
                                        onClick={() => {
                                          const languageType = activeTranslationLang === 'eng' ? 'english' : 'korean'
                                          const translationId = activeTranslationLang === 'eng'
                                            ? (trans.efaEngId || trans.id)
                                            : (trans.efaKorId || trans.id)
                                          setTranslationOtoAudioToDelete({ translation: trans, languageType, translationId })
                                          setDeleteTranslationOtoAudioModalOpen(true)
                                        }}
                                        className="text-red-400 hover:text-red-500 bg-transparent hover:bg-transparent rounded-full p-1.5 shrink-0"
                                        disabled={isUpdatingTranslationOtoAudio}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {(trans as any).details.ekerota && (trans as any).details.ekerota.length > 0 && (
                              <div>
                                <p className="text-sm sm:text-md text-gray-300 mb-1 font-semibold wrap-break-words">
                                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                  {t('common.ekerota', 'Eghọ rẹ Ejajẹ')}: <span className="text-gray-400 text-sm sm:text-base wrap-break-words lowercase!">{(trans as any).details.ekerota.join(', ')}</span>
                                </p>
                              </div>
                            )}
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {(trans as any).details.idje && Array.isArray((trans as any).details.idje) && (trans as any).details.idje.length > 0 && (
                              <div>
                                <p className="text-sm sm:text-md text-gray-300 mb-2 font-semibold">
                                  {t('common.idje', 'Udje')}:
                                </p>
                                <ul className="list-none space-y-3 ml-4">
                                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                  {(trans as any).details.idje.map((example: any, idx: number) => {
                                    const sentence = getIdjeSentence(example)
                                    const audioUrl = typeof example === 'object' && example !== null ? example.audioUrl : null
                                    return sentence ? (
                                      <li key={idx} className="space-y-3">
                                        <div className="flex items-start gap-3">
                                          <span className="text-gray-400 italic text-sm sm:text-base wrap-break-words flex-1 min-w-0">
                                            {idx + 1}. {sentence}
                                          </span>
                                          {(isSuperAdmin || hasPermission('add_media')) && !isViewMode && (
                                            <UploadModal
                                              type="audio"
                                              onUrlSelect={(url) => handleTranslationExampleSentenceAudioUpload(trans, idx, url)}
                                            >
                                              <Button
                                                type="button"
                                                size="sm"
                                                className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] cursor-pointer shrink-0"
                                                disabled={isUpdatingTranslationExampleSentenceAudio}
                                              >
                                                {isUpdatingTranslationExampleSentenceAudio ? (
                                                  <LoadingSpinner size="sm" />
                                                ) : (
                                                  <>
                                                    <Volume2 className="h-4 w-4 mr-1" />
                                                    {audioUrl ? t('common.updateAudio', 'Update Audio') : t('common.add', 'Add')}
                                                  </>
                                                )}
                                              </Button>
                                            </UploadModal>
                                          )}
                                        </div>
                                        {audioUrl && (
                                          <div className="bg-[#1e1e1e] rounded-lg p-2 flex items-center gap-2">
                                            <audio controls className="flex-1 w-full min-w-0">
                                              <source src={audioUrl} type="audio/mpeg" />
                                            </audio>
                                            {(isSuperAdmin || hasPermission('delete_media')) && !isViewMode && (
                                              <button
                                                onClick={() => {
                                                  const languageType = activeTranslationLang === 'eng' ? 'english' : 'korean'
                                                  const translationId = activeTranslationLang === 'eng'
                                                    ? (trans.efaEngId || trans.id)
                                                    : (trans.efaKorId || trans.id)
                                                  setTranslationExampleSentenceAudioToDelete({ translation: trans, languageType, translationId, exampleSentenceIndex: idx })
                                                  setDeleteTranslationExampleSentenceAudioModalOpen(true)
                                                }}
                                                className="text-red-400 hover:text-red-500 bg-transparent hover:bg-transparent rounded-full p-1.5 shrink-0"
                                                disabled={isUpdatingTranslationExampleSentenceAudio}
                                              >
                                                <Trash2 className="h-4 w-4" />
                                              </button>
                                            )}
                                          </div>
                                        )}
                                      </li>
                                    ) : null
                                  })}
                                </ul>
                              </div>
                            )}
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {(trans as any).details.ibuebu && (trans as any).details.ibuebu.length > 0 && (
                              <div>
                                <p className="text-md text-gray-300 mb-2 font-semibold">
                                  {t('common.ibuebu', 'Ebuo')}:
                                </p>
                                <ul className="list-none space-y-1 ml-4">
                                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                  {(trans as any).details.ibuebu.map((plural: string, idx: number) => (
                                    <li key={idx} className="text-gray-400 text-base">
                                      {idx + 1}. {plural}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {(trans as any).details.orhan && (trans as any).details.orhan.length > 0 && (
                              <div>
                                <p className="text-sm sm:text-md text-gray-300 mb-1 font-semibold wrap-break-words">
                                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                  Orhan (Antonyms): <span className="text-gray-400 text-sm sm:text-base wrap-break-words">{(trans as any).details.orhan.join(', ')}</span>
                                </p>
                              </div>
                            )}
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {(trans as any).details.ekaeruo && (trans as any).details.ekaeruo.length > 0 && (
                              <div>
                                <p className="text-md text-gray-300 mb-2 font-semibold">
                                  {t('common.ekaeruo', 'Oka Eruo')}:
                                </p>
                                <ul className="list-none space-y-1 ml-4">
                                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                  {(trans as any).details.ekaeruo.map((verbType: string, idx: number) => (
                                    <li key={idx} className="text-gray-400 text-base">
                                      {idx + 1}. {verbType}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {(trans as any).details.okpo && (trans as any).details.okpo.length > 0 && (
                              <div>
                                <p className="text-md text-gray-300 mb-1 font-semibold">
                                  Okpo (Synonyms): <span className="text-gray-400 text-base wrap-break-words">
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {(trans as any).details.okpo.map((rw: any, idx: number) => (
                                       <span key={idx}>
                                         {rw.ota}{rw.egba ? ` (${rw.egba})` : ''}
                                         {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                         {idx < (trans as any).details.okpo.length - 1 ? ', ' : ''}
                                      </span>
                                    ))}
                                  </span>
                                </p>
                              </div>
                            )}
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {(trans as any).details.odeUfue && (trans as any).details.odeUfue.length > 0 && (trans as any).details.odeUfue.some((v: string) => v.trim() !== '') && (
                              <div>
                                <p className="text-md text-gray-300 mb-1 font-semibold">
                                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                  OdẹUfue (Scientific Name): <span className="text-gray-400 italic text-base">{(trans as any).details.odeUfue.filter((v: string) => v.trim() !== '').join(', ')}</span>
                                </p>
                              </div>
                            )}
                          </div>
                          {/* Delete Translation Button - hidden in mobile, shown in desktop */}
                          {(isSuperAdmin || hasPermission('delete_word')) && !isViewMode && (
                            <div className="hidden lg:block mt-4 pt-4 border-t border-white/10">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-400 hover:text-red-500 hover:bg-transparent bg-transparent cursor-pointer"
                                onClick={() => {
                                  const languageType = activeTranslationLang === 'eng' ? 'english' : 'korean'
                                  const translationId = activeTranslationLang === 'eng'
                                    ? (trans.efaEngId || trans.id)
                                    : (trans.efaKorId || trans.id)
                                  setTranslationToDelete({
                                    translation: trans,
                                    languageType,
                                    translationId
                                  })
                                  setDeleteTranslationModalOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4 sm:mr-1" /> <span className="hidden sm:inline">{t('common.deleteTranslation', 'Delete Translation')}</span>
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Right Column - Media */}
                        <div className="lg:col-span-1 space-y-4">
                          {/* Audio */}
                          {isViewMode ? (
                            // View mode: Show speaker icon(s) instead of audio card
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (trans as any).details.omra && (trans as any).details.omra.length > 0 ? (
                              <div className="flex flex-wrap gap-3">
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {(trans as any).details.omra.map((audioUrl: string, idx: number) => (
                                  <button
                                    key={idx}
                                    onClick={() => {
                                      const audio = new Audio(audioUrl)
                                      audio.play().catch(err => {
                                        console.error('Error playing audio:', err)
                                        toast.error('Failed to play audio')
                                      })
                                    }}
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F5DEB3] text-[#1e1e1e] hover:bg-[#f0d4a0] transition-colors cursor-pointer"
                                    title="Play audio"
                                  >
                                    <Volume2 className="h-5 w-5" />
                                  </button>
                                ))}
                              </div>
                            ) : null
                          ) : (
                            // Edit mode: Show full audio card
                            <div className="bg-[#1a1a1a]/50 rounded-lg p-4 border border-white/5">
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold text-[#F5DEB3]">{t('common.omra', 'Audio')}</h3>
                                {(isSuperAdmin || hasPermission('add_media')) && (
                                  <UploadModal
                                    type="audio"
                                    onUrlSelect={(url) => handleTranslationAudioUpload(trans, url)}
                                  >
                                    <Button
                                      type="button"
                                      size="sm"
                                      className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] cursor-pointer"
                                      disabled={isUpdatingTranslationAudio}
                                    >
                                      {isUpdatingTranslationAudio ? (
                                        <LoadingSpinner size="sm" />
                                      ) : (
                                        <>
                                          <Upload className="h-4 w-4 mr-2" />
                                          {t('common.addAudio', 'Add Audio')}
                                        </>
                                      )}
                                    </Button>
                                  </UploadModal>
                                )}
                              </div>
                              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                              {(trans as any).details.omra && (trans as any).details.omra.length > 0 ? (
                                <div className="space-y-3">
                                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                  {(trans as any).details.omra.map((audioUrl: string, idx: number) => {
                                    const languageType = activeTranslationLang === 'eng' ? 'english' : 'korean'
                                    const translationId = activeTranslationLang === 'eng'
                                      ? (trans.efaEngId || trans.id)
                                      : (trans.efaKorId || trans.id)

                                    return (
                                      <div key={idx} className="bg-[#1e1e1e] rounded-lg p-2 flex items-center gap-2">
                                        <audio controls className="flex-1">
                                          <source src={audioUrl} type="audio/mpeg" />
                                        </audio>
                                        {(isSuperAdmin || hasPermission('delete_media')) && (
                                          <button
                                            onClick={() => {
                                              setTranslationAudioToDelete({
                                                translation: trans,
                                                url: audioUrl,
                                                languageType,
                                                translationId
                                              })
                                              setDeleteTranslationAudioModalOpen(true)
                                            }}
                                            className="text-red-400 hover:text-red-500 bg-transparent hover:bg-transparent rounded-full p-1.5 shrink-0"
                                            disabled={isDeletingTranslationAudio}
                                          >
                                            <X className="h-4 w-4" />
                                          </button>
                                        )}
                                      </div>
                                    )
                                  })}
                                </div>
                              ) : (
                                <div className="text-center py-4">
                                  <p className="text-sm text-gray-400 mb-2">{t('common.noAudioYet', 'No audio yet')}</p>
                                  <p className="text-xs text-gray-500">{t('common.clickAddAudioToUpload', 'Click "Add Audio" to upload')}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {/* Delete Translation Button - shown at end of card in mobile view */}
                    {(isSuperAdmin || hasPermission('delete_word')) && (
                      <div className="lg:hidden mt-4 pt-4 border-t border-white/10">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-400 bg-transparent cursor-pointer w-full"
                          onClick={() => {
                            const languageType = activeTranslationLang === 'eng' ? 'english' : 'korean'
                            const translationId = activeTranslationLang === 'eng'
                              ? (trans.efaEngId || trans.id)
                              : (trans.efaKorId || trans.id)
                            setTranslationToDelete({
                              translation: trans,
                              languageType,
                              translationId
                            })
                            setDeleteTranslationModalOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> {t('common.deleteTranslation', 'Delete Translation')}
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div className="bg-[#1E1E1E] border border-white/10 rounded-lg p-8 text-center">
                <p className="text-gray-400">{t('common.noTranslationsAvailable', 'No translations available')}</p>
            </div>
          )}
          {/* Add Translation Button - Always visible */}
          {(isSuperAdmin || hasPermission('add_word')) && !isViewMode && (
            <div className="mt-4">
              <Button
                type="button"
                size="sm"
                className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] cursor-pointer"
                onClick={() => {
                  translationForm.reset()
                  setAddTranslationModalOpen(true)
                }}
              >
                <Plus className="h-4 w-4 mr-1" /> {t('common.addTranslation', 'Add Translation')}
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="mt-4">
          <div className="bg-[#1E1E1E] border border-white/10 rounded-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[#F5DEB3]" />
                {t('common.reviews', 'Reviews')} ({wordReviewsResponse?.data?.length ?? 0})
              </h2>
              <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#F5DEB3] hover:bg-[#F5DEB3]/90 text-[#1e1e1e]">
                    <Star className="h-4 w-4 mr-2" />
                    {t('common.addRating', 'Add Rating')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1E1E1E] border border-white/10 text-white max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-white">{t('common.addRating', 'Add Rating')}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    {/* Star Rating */}
                    <div>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110"
                          >
                            <Star
                              className={`h-8 w-8 ${star <= rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-400'
                                }`}
                            />
                          </button>
                        ))}
                        {rating > 0 && (
                          <span className="text-sm text-gray-400 ml-2">{rating} {rating === 1 ? 'star' : 'stars'}</span>
                        )}
                      </div>
                    </div>

                    {/* Review Text */}
                    <div className="relative">
                      <Textarea
                        id="review-text"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder={t('common.review', 'Review')}
                        className="bg-[#232323] border-white/10 text-white min-h-[120px] resize-none pr-10"
                        rows={5}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!showKeyboard) {
                            // Check if there's currently a focused input
                            const activeElement = document.activeElement as HTMLElement
                            if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
                              const id = activeElement.id || activeElement.getAttribute('id')
                              if (id) {
                                setActiveInputId(id)
                              } else {
                                const tempId = `temp-input-${Date.now()}`
                                activeElement.setAttribute('id', tempId)
                                setActiveInputId(tempId)
                              }
                              lastFocusedInputRef.current = activeElement
                            } else if (lastFocusedInputRef.current) {
                              // Use the last focused input if available
                              const lastInput = lastFocusedInputRef.current
                              const id = lastInput.id || lastInput.getAttribute('id')
                              if (id) {
                                setActiveInputId(id)
                              }
                            } else {
                              // Default to review-text if no input is focused
                              setActiveInputId('review-text')
                            }
                          }
                          setShowKeyboard(!showKeyboard)
                        }}
                        className="absolute right-2 top-2 p-1.5 rounded hover:bg-white/10 transition-colors text-gray-400 hover:text-[#F5DEB3]"
                        title="Virtual Keyboard"
                      >
                        <Keyboard className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="default"
                      onClick={() => {
                        setIsReviewModalOpen(false)
                        setRating(0)
                        setReviewText('')
                      }}
                      className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] cursor-pointer"
                    >
                      {t('common.cancel', 'Cancel')}
                    </Button>
                    <Button
                      onClick={handleSubmitReview}
                      disabled={isSubmittingReview || rating === 0 || !reviewText.trim()}
                      className="bg-[#F5DEB3] hover:bg-[#F5DEB3]/90 text-[#1e1e1e] disabled:opacity-50"
                    >
                      {isSubmittingReview ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          {t('common.submitting', 'Submitting')}...
                        </>
                      ) : (
                        <>
                          <Star className="h-4 w-4 mr-2" />
                          {t('common.submitReview', 'Submit Review')}
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {wordReviewsResponse?.data && wordReviewsResponse.data.length > 0 ? (
              <div className="space-y-4">
                {wordReviewsResponse.data
                  .filter((r) => !r.parentId)
                  .map((review) => {
                    const replies = wordReviewsResponse.data.filter((r) => r.parentId === review.id)
                    return (
                      <div key={review.id} className="bg-[#2a2a2a] border border-white/5 rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#F5DEB3] rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-[#1e1e1e]" />
                            </div>
                            <div>
                              <p className="font-medium text-white">{t('common.user', 'User')}</p>
                              <p className="text-xs text-gray-400">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {renderStarRating(review.rating, 'sm')}
                          </div>
                        </div>
                        <p className="text-gray-300 whitespace-pre-wrap">{review.review}</p>
                        {(isSuperAdmin || hasPermission('moderate_word')) && (
                          <div className="mt-3 pt-3 border-t border-white/5">
                            {replyingToReviewId === review.id ? (
                              <div className="space-y-2">
                                <Textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder={t('common.writeReply', 'Write a reply...')}
                                  className="bg-[#232323] border-white/10 text-white min-h-[80px] resize-none"
                                  rows={3}
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-white/10 text-gray-300"
                                    onClick={() => {
                                      setReplyingToReviewId(null)
                                      setReplyText('')
                                    }}
                                  >
                                    {t('common.cancel', 'Cancel')}
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="bg-[#F5DEB3] hover:bg-[#F5DEB3]/90 text-[#1e1e1e]"
                                    onClick={handleReplyToReview}
                                    disabled={isSubmittingReply || !replyText.trim()}
                                  >
                                    {isSubmittingReply ? (
                                      <>
                                        <LoadingSpinner size="sm" className="mr-2" />
                                        {t('common.submitting', 'Submitting')}...
                                      </>
                                    ) : (
                                      t('common.submitReply', 'Submit Reply')
                                    )}
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-[#F5DEB3] hover:bg-[#F5DEB3]/10"
                                onClick={() => setReplyingToReviewId(review.id)}
                              >
                                {t('common.reply', 'Reply')}
                              </Button>
                            )}
                          </div>
                        )}
                        {replies.length > 0 && (
                          <div className="mt-4 ml-4 pl-4 border-l-2 border-[#F5DEB3]/30 space-y-3">
                            {replies.map((reply) => (
                              <div key={reply.id} className="bg-[#1e1e1e] rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <User className="h-3 w-3 text-[#F5DEB3]" />
                                  <p className="text-xs text-gray-400">
                                    {t('common.user', 'User')} · {new Date(reply.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <p className="text-gray-300 text-sm whitespace-pre-wrap">{reply.review}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">{t('common.noReviewsYet', 'No reviews yet. Be the first to review this word!')}</p>
              </div>
            )}
          </div>
        </TabsContent>

      </Tabs>

      {/* Delete Image Confirmation Dialog */}
      <Dialog open={deleteImageModalOpen} onOpenChange={setDeleteImageModalOpen}>
        <DialogContent className="bg-[#1E1E1E] border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">{t('common.deleteImage', 'Delete Image')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300 mb-4">
              {t('common.areYouSureYouWantToDeleteThisImage', 'Are you sure you want to delete this image? This action cannot be undone.')}
            </p>
            {itemToDelete && (
              <div className="relative mb-4">
                <Image
                  src={itemToDelete.url}
                  alt="Image to delete"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] cursor-pointer"
              onClick={() => {
                setDeleteImageModalOpen(false)
                setItemToDelete(null)
              }}
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={handleDeleteSenseImage}
              disabled={isDeletingSenseImage}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeletingSenseImage ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {t('common.deleting', 'Deleting')}...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('common.delete', 'Delete')}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Audio Confirmation Dialog */}
      <Dialog open={deleteAudioModalOpen} onOpenChange={setDeleteAudioModalOpen}>
        <DialogContent className="bg-[#1E1E1E] border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">{t('common.deleteAudio', 'Delete Audio')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300 mb-4">
              {t('common.areYouSureYouWantToDeleteThisAudioFile', 'Are you sure you want to delete this audio file? This action cannot be undone.')}
            </p>
            {itemToDelete && (
              <div className="mb-4 bg-[#1a1a1a] rounded-lg p-4">
                <audio controls className="w-full">
                  <source src={itemToDelete.url} type="audio/mpeg" />
                </audio>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] cursor-pointer"
              onClick={() => {
                setDeleteAudioModalOpen(false)
                setItemToDelete(null)
              }}
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={handleDeleteSenseAudio}
              disabled={isDeletingSenseAudio}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeletingSenseAudio ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {t('common.deleting', 'Deleting')}...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('common.delete', 'Delete')}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Translation Audio Confirmation Dialog */}
      <Dialog open={deleteTranslationAudioModalOpen} onOpenChange={setDeleteTranslationAudioModalOpen}>
        <DialogContent className="bg-[#1E1E1E] border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">{t('common.deleteTranslationAudio', 'Delete Translation Audio')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300 mb-4">
              {t('common.areYouSureYouWantToDeleteThisAudioFile', 'Are you sure you want to delete this audio file? This action cannot be undone.')}
            </p>
            {translationAudioToDelete && (
              <div className="mb-4 bg-[#1a1a1a] rounded-lg p-4">
                <audio controls className="w-full">
                  <source src={translationAudioToDelete.url} type="audio/mpeg" />
                </audio>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] cursor-pointer"
              onClick={() => {
                setDeleteTranslationAudioModalOpen(false)
                setTranslationAudioToDelete(null)
              }}
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={handleDeleteTranslationAudio}
              disabled={isDeletingTranslationAudio}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeletingTranslationAudio ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {t('common.deleting', 'Deleting')}...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('common.delete', 'Delete')}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Translation Image Confirmation Dialog */}
      <Dialog open={deleteTranslationImageModalOpen} onOpenChange={setDeleteTranslationImageModalOpen}>
        <DialogContent className="bg-[#1E1E1E] border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">{t('common.deleteTranslationImage', 'Delete Translation Image')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300 mb-4">
              {t('common.areYouSureYouWantToDeleteThisImage', 'Are you sure you want to delete this image? This action cannot be undone.')}
            </p>
            {translationImageToDelete && (
              <div className="relative mb-4">
                <Image
                  src={translationImageToDelete.url}
                  alt="Image to delete"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] cursor-pointer"
              onClick={() => {
                setDeleteTranslationImageModalOpen(false)
                setTranslationImageToDelete(null)
              }}
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={handleDeleteTranslationImage}
              disabled={isDeletingTranslationImage}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeletingTranslationImage ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {t('common.deleting', 'Deleting')}...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('common.delete', 'Delete')}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Oto Audio Confirmation Dialog */}
      <Dialog open={deleteOtoAudioModalOpen} onOpenChange={setDeleteOtoAudioModalOpen}>
        <DialogContent className="bg-[#1E1E1E] border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">{t('common.deleteDefinitionAudio', 'Delete Definition Audio')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300 mb-4">
              {t('common.areYouSureYouWantToDeleteThisDefinitionAudio', 'Are you sure you want to delete this definition audio? This action cannot be undone.')}
            </p>
            {otoAudioToDelete && otoAudioToDelete.sense.otoOmra && (
              <div className="mb-4 bg-[#1a1a1a] rounded-lg p-4">
                <audio controls className="w-full">
                  <source src={otoAudioToDelete.sense.otoOmra} type="audio/mpeg" />
                </audio>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] cursor-pointer"
              onClick={() => {
                setDeleteOtoAudioModalOpen(false)
                setOtoAudioToDelete(null)
              }}
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={handleDeleteSenseOtoAudio}
              disabled={isUpdatingSenseOtoAudio}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isUpdatingSenseOtoAudio ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {t('common.deleting', 'Deleting')}...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('common.delete', 'Delete')}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Example Sentence Audio Confirmation Dialog */}
      <Dialog open={deleteExampleSentenceAudioModalOpen} onOpenChange={setDeleteExampleSentenceAudioModalOpen}>
        <DialogContent className="bg-[#1E1E1E] border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">{t('common.deleteExampleSentenceAudio', 'Delete Example Sentence Audio')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300 mb-4">
              {t('common.areYouSureYouWantToDeleteThisExampleSentenceAudio', 'Are you sure you want to delete this example sentence audio? This action cannot be undone.')}
            </p>
            {exampleSentenceAudioToDelete && (() => {
              const example = exampleSentenceAudioToDelete.sense.idje?.[exampleSentenceAudioToDelete.exampleSentenceIndex]
              const audioUrl = typeof example === 'object' && example !== null ? example.audioUrl : null
              const sentence = getIdjeSentence(example)
              return (
                <>
                  {sentence && (
                    <p className="text-gray-400 italic mb-4">
                      &quot;{sentence}&quot;
                    </p>
                  )}
                  {audioUrl && (
                    <div className="mb-4 bg-[#1a1a1a] rounded-lg p-4">
                      <audio controls className="w-full">
                        <source src={audioUrl} type="audio/mpeg" />
                      </audio>
                    </div>
                  )}
                </>
              )
            })()}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] cursor-pointer"
              onClick={() => {
                setDeleteExampleSentenceAudioModalOpen(false)
                setExampleSentenceAudioToDelete(null)
              }}
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={handleDeleteSenseExampleSentenceAudio}
              disabled={isUpdatingSenseExampleSentenceAudio}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isUpdatingSenseExampleSentenceAudio ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {t('common.deleting', 'Deleting')}...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('common.delete', 'Delete')}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Translation Oto Audio Confirmation Dialog */}
      <Dialog open={deleteTranslationOtoAudioModalOpen} onOpenChange={setDeleteTranslationOtoAudioModalOpen}>
        <DialogContent className="bg-[#1E1E1E] border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">{t('common.deleteTranslation DefinitionAudio', 'Delete Translation Definition Audio')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300 mb-4">
              {t('common.areYouSureYouWantToDeleteThisTranslationDefinitionAudio', 'Are you sure you want to delete this translation definition audio? This action cannot be undone.')}
            </p>
            {translationOtoAudioToDelete && translationOtoAudioToDelete.translation.details?.otoOmra && (
              <div className="mb-4 bg-[#1a1a1a] rounded-lg p-4">
                <audio controls className="w-full">
                  <source src={translationOtoAudioToDelete.translation.details.otoOmra} type="audio/mpeg" />
                </audio>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] cursor-pointer"
              onClick={() => {
                setDeleteTranslationOtoAudioModalOpen(false)
                setTranslationOtoAudioToDelete(null)
              }}
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={handleDeleteTranslationOtoAudio}
              disabled={isUpdatingTranslationOtoAudio}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isUpdatingTranslationOtoAudio ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {t('common.deleting', 'Deleting')}...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('common.delete', 'Delete')}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Translation Example Sentence Audio Confirmation Dialog */}
      <Dialog open={deleteTranslationExampleSentenceAudioModalOpen} onOpenChange={setDeleteTranslationExampleSentenceAudioModalOpen}>
        <DialogContent className="bg-[#1E1E1E] border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">{t('common.deleteTranslationExampleSentenceAudio', 'Delete Translation Example Sentence Audio')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300 mb-4">
              {t('common.areYouSureYouWantToDeleteThisTranslationExampleSentenceAudio', 'Are you sure you want to delete this translation example sentence audio? This action cannot be undone.')}
            </p>
            {translationExampleSentenceAudioToDelete && (() => {
              const example = translationExampleSentenceAudioToDelete.translation.details?.idje?.[translationExampleSentenceAudioToDelete.exampleSentenceIndex]
              const audioUrl = typeof example === 'object' && example !== null ? example.audioUrl : null
              const sentence = getIdjeSentence(example)
              return (
                <>
                  {sentence && (
                    <p className="text-gray-400 italic mb-4">
                      &quot;{sentence}&quot;
                    </p>
                  )}
                  {audioUrl && (
                    <div className="mb-4 bg-[#1a1a1a] rounded-lg p-4">
                      <audio controls className="w-full">
                        <source src={audioUrl} type="audio/mpeg" />
                      </audio>
                    </div>
                  )}
                </>
              )
            })()}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] cursor-pointer"
              onClick={() => {
                setDeleteTranslationExampleSentenceAudioModalOpen(false)
                setTranslationExampleSentenceAudioToDelete(null)
              }}
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={handleDeleteTranslationExampleSentenceAudio}
              disabled={isUpdatingTranslationExampleSentenceAudio}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isUpdatingTranslationExampleSentenceAudio ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {t('common.deleting', 'Deleting')}...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('common.delete', 'Delete')}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Sense Confirmation Dialog */}
      <Dialog open={deleteSenseModalOpen} onOpenChange={setDeleteSenseModalOpen}>
        <DialogContent className="bg-[#1E1E1E] border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">{t('common.deleteSense', 'Delete Ọhọ')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300 mb-4">
              {t('common.areYouSureYouWantToDeleteThisSense', 'Are you sure you want to delete this sense? This action cannot be undone.')}
            </p>
            {senseToDelete && (
              <div className="bg-[#2a2a2a] rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-400 mb-2">Sense #{senseToDelete.kere}</p>
                <p className="text-white font-medium">{senseToDelete.oto || 'No definition'}</p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] cursor-pointer"
              onClick={() => {
                setDeleteSenseModalOpen(false)
                setSenseToDelete(null)
              }}
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={handleDeleteSense}
              disabled={isDeletingSense}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeletingSense ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {t('common.deleting', 'Deleting')}...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('common.delete', 'Delete')}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Translation Confirmation Dialog */}
      <Dialog open={deleteTranslationModalOpen} onOpenChange={setDeleteTranslationModalOpen}>
        <DialogContent className="bg-[#1E1E1E] border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">{t('common.deleteTranslation', 'Delete Translation')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300 mb-4">
              {t('common.areYouSureYouWantToDeleteThisTranslation', 'Are you sure you want to delete this translation? This action cannot be undone.')}
            </p>
            {translationToDelete && (
              <div className="bg-[#2a2a2a] rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-400 mb-2">
                  Translation #{translationToDelete.translation.kere} ({translationToDelete.languageType})
                </p>
                <p className="text-white font-medium">
                  {translationToDelete.translation.otaWord || (translationToDelete.translation.details?.oto) || 'No definition'}
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] cursor-pointer"
              onClick={() => {
                setDeleteTranslationModalOpen(false)
                setTranslationToDelete(null)
              }}
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={handleDeleteTranslation}
              disabled={isDeletingTranslation}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeletingTranslation ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {t('common.deleting', 'Deleting')}...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('common.delete', 'Delete')}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Sense Modal */}
      <Dialog open={addSenseModalOpen} onOpenChange={(open) => {
        setAddSenseModalOpen(open)
        if (!open) {
          setEditingSense(null)
          senseForm.reset()
        }
      }}>
        <DialogContent className="bg-[#1E1E1E] border border-white/10 text-white w-[95vw] sm:w-full max-w-4xl lg:max-w-6xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold text-white">
              {editingSense ? t('common.editSense', 'Edit Sense') : t('common.addNewSense', 'Add New Sense')}
            </DialogTitle>
          </DialogHeader>
          <Form {...senseForm}>
            <form onSubmit={senseForm.handleSubmit(handleAddSense)} className="space-y-4 sm:space-y-6">
              {/* Kere - only show for new senses */}
              {!editingSense && (
                <FormField
                  control={senseForm.control}
                  name="kere"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          className="bg-[#1e1e1e] border-white/10 text-white"
                          placeholder={t('common.kere', 'Kere (Sense Number)')} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Ekerota */}
              <EkerotaFieldArray control={senseForm.control} name="ekerota" label={t('common.ekerota', 'Eghọ rẹ Ejajẹ')} />

              {/* Upho and Uphoesio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={senseForm.control}
                  name="upho"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} className="bg-[#1e1e1e] border-white/10 text-white" placeholder={t('common.upho', 'Ubiupho') + ' *'} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={senseForm.control}
                  name="uphoesio"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} className="bg-[#1e1e1e] border-white/10 text-white" placeholder={t('common.uphoesio', 'IPA') + ' *'} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Oto */}
              <FormField
                control={senseForm.control}
                name="oto"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="bg-[#1e1e1e] border-white/10 text-white min-h-[100px]"
                        placeholder={t('common.oto', 'Otọ *')} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* OtoOmra */}
              <IdjeFieldArray
                control={senseForm.control}
                name="otoOmra"
                label={t('common.otoOmra', 'OtoOmra (Definition Audio)')} 
                uploadState={senseOtoOmraUploads}
                setUploadState={setSenseOtoOmraUploads}
                setValue={senseForm.setValue}
              />

              {/* Idje */}
              <IdjeSentenceFieldArray
                control={senseForm.control}
                name="idje"
                label={t('common.idje', 'Udje')} 
                buttonText={t('common.addExample', 'Ba Udje')}
                required={true}
                uploadState={senseIdjeAudioUploads}
                setUploadState={setSenseIdjeAudioUploads}
                setValue={senseForm.setValue}
              />

              {/* Okpo */}
              <OkpoFieldArray
                lang="ota"
                control={senseForm.control}
                name="okpo"
                label={t('common.okpo', 'Okpo (Synonyms)')} 
              />

              {/* Optional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DynamicFieldArray control={senseForm.control} name="orhan" label={t('common.orhan', 'Orhan (Antonyms)')} required={false} />
                <DynamicFieldArray control={senseForm.control} name="ibuebu" label={t('common.ibuebu', 'Ebuo')} required={false} />
                <DynamicFieldArray control={senseForm.control} name="ekaeruo" label={t('common.ekaeruo', 'Oka Eruo')} required={false} />
                <DynamicFieldArray control={senseForm.control} name="odeUfue" label={t('common.odeUfue', 'OdẹUfue (Scientific Name)')} required={false} />
              </div>

              {/* Erevwe */}
              <FormField
                control={senseForm.control}
                name="erevwe"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <select
                        {...field}
                        className="bg-[#1e1e1e] border border-white/10 rounded-md px-3 py-2 w-full text-white"
                      >
                        <option value="">{t('common.erevwe', 'Erevwe (Dialect)')}</option>
                        {provinces?.map((opt, index) => (
                          <option key={index} value={opt.name}>
                            {opt.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4 sm:mt-6">
                <Button
                  type="button"
                  className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] cursor-pointer w-full sm:w-auto"
                  onClick={() => {
                    setAddSenseModalOpen(false)
                    setEditingSense(null)
                    senseForm.reset()
                  }}
                >
                  {t('common.cancel', 'Cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={isCreatingSense || isUpdatingSense}
                  className="bg-[#F5DEB3] hover:bg-[#F5DEB3]/90 text-[#1e1e1e] w-full sm:w-auto"
                >
                  {(isCreatingSense || isUpdatingSense) ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      {editingSense ? t('common.updating', 'Updating') : t('common.adding', 'Adding')}...
                    </>
                  ) : (
                    <>
                      {editingSense ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          {t('common.updateSense', 'Update Sense')}
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          {t('common.addSense', 'Ba Ọhọ')}
                        </>
                      )}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Add Translation Modal */}
      <Dialog open={addTranslationModalOpen} onOpenChange={(open) => {
        setAddTranslationModalOpen(open)
        if (!open) {
          translationForm.reset()
        }
      }}>
        <DialogContent className="bg-[#1E1E1E] border border-white/10 text-white w-[95vw] sm:w-full max-w-4xl lg:max-w-6xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold text-white">
              {t('common.addTranslation', 'Add New Translation')} ({activeTranslationLang === 'eng' ? t('common.english', 'English') : t('common.korean', 'Korean')})
            </DialogTitle>
          </DialogHeader>
          <Form {...translationForm}>
            <form onSubmit={translationForm.handleSubmit(handleAddTranslation)} className="space-y-4 sm:space-y-6">
              {/* Ota */}
              <FormField
                control={translationForm.control}
                name="ota"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} className="bg-[#1e1e1e] border-white/10 text-white" placeholder={t('common.ota', 'Ota (Headword) *')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ekerota */}
              <TranslationEkerotaFieldArray control={translationForm.control} name="ekerota" label={t('common.ekerota', 'Eghọ rẹ Ejajẹ')} />

              {/* Upho and Uphoesio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={translationForm.control}
                  name="upho"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} className="bg-[#1e1e1e] border-white/10 text-white" placeholder={`${t('common.upho', 'Ubiupho')}${activeTranslationLang === 'eng' ? ' *' : ''}`} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={translationForm.control}
                  name="uphoesio"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} className="bg-[#1e1e1e] border-white/10 text-white" placeholder={`${t('common.uphoesio', 'IPA')}${activeTranslationLang === 'eng' ? ' *' : ''}`} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Oto */}
              <FormField
                control={translationForm.control}
                name="oto"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="bg-[#1e1e1e] border-white/10 text-white min-h-[100px]"
                        placeholder={t('common.oto', 'Otọ *')} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* OtoOmra */}
              <IdjeFieldArray
                control={translationForm.control}
                name="otoOmra"
                label={t('common.otoOmra', 'OtoOmra (Definition Audio)')} 
                uploadState={translationOtoOmraUploads}
                setUploadState={setTranslationOtoOmraUploads}
                setValue={translationForm.setValue}
              />

              {/* Idje */}
              <IdjeSentenceFieldArray
                control={translationForm.control}
                name="idje"
                label={t('common.idje', 'Udje')} 
                buttonText={t('common.addExample', 'Ba Udje')}
                required={true}
                uploadState={translationIdjeAudioUploads}
                setUploadState={setTranslationIdjeAudioUploads}
                setValue={translationForm.setValue}
              />

              {/* Okpo */}
              <OkpoFieldArray
                lang="ota"
                control={translationForm.control}
                name="okpo"
                label={t('common.okpo', 'Okpo (Synonyms)')} 
              />

              {/* Optional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DynamicFieldArray control={translationForm.control} name="orhan" label={t('common.orhan', 'Orhan (Antonyms)')} required={false} />
                <DynamicFieldArray control={translationForm.control} name="ibuebu" label={t('common.ibuebu', 'Ebuo')} required={false} />
                <DynamicFieldArray control={translationForm.control} name="ekaeruo" label={t('common.ekaeruo', 'Oka Eruo')} required={false} />
                <DynamicFieldArray control={translationForm.control} name="odeUfue" label={t('common.odeUfue', 'OdẹUfue (Scientific Name)')} required={false} />
              </div>

              {/* Language Type - hidden field */}
              <FormField
                control={translationForm.control}
                name="languageType"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input {...field} type="hidden" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4 sm:mt-6">
                <Button
                  type="button"
                  className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] cursor-pointer w-full sm:w-auto"
                  onClick={() => {
                    setAddTranslationModalOpen(false)
                    translationForm.reset()
                  }}
                >
                  {t('common.cancel', 'Cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={isCreatingTranslation}
                  className="bg-[#F5DEB3] hover:bg-[#F5DEB3]/90 text-[#1e1e1e] w-full sm:w-auto"
                >
                  {isCreatingTranslation ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      {t('common.adding', 'Adding')}...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      {t('common.addTranslation', 'Add Translation')}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Translation Modal */}
      <Dialog open={editTranslationModalOpen} onOpenChange={(open) => {
        setEditTranslationModalOpen(open)
        if (!open) {
          setEditingTranslation(null)
          editTranslationForm.reset()
        }
      }}>
        <DialogContent className="bg-[#1E1E1E] border border-white/10 text-white w-[95vw] sm:w-full max-w-4xl lg:max-w-6xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold text-white">
              {t('common.editTranslation', 'Edit Translation')} ({editingTranslation?.languageType === 'english' ? t('common.english', 'English') : t('common.korean', 'Korean')})
            </DialogTitle>
          </DialogHeader>
          <Form {...editTranslationForm}>
            <form onSubmit={editTranslationForm.handleSubmit(handleEditTranslationSubmit)} className="space-y-4 sm:space-y-6">
              {/* Ota */}
              <FormField
                control={editTranslationForm.control}
                name="ota"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} className="bg-[#1e1e1e] border-white/10 text-white" placeholder={t('common.ota', 'Ota (Headword) *')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ekerota */}
              <TranslationEkerotaFieldArray control={editTranslationForm.control} name="ekerota" label={t('common.ekerota', 'Eghọ rẹ Ejajẹ')} />

              {/* Upho and Uphoesio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editTranslationForm.control}
                  name="upho"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} className="bg-[#1e1e1e] border-white/10 text-white" placeholder={`${t('common.upho', 'Ubiupho')}${editingTranslation?.languageType === 'english' ? ' *' : ''}`} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editTranslationForm.control}
                  name="uphoesio"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} className="bg-[#1e1e1e] border-white/10 text-white" placeholder={`${t('common.uphoesio', 'IPA')}${editingTranslation?.languageType === 'english' ? ' *' : ''}`} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Oto */}
              <FormField
                control={editTranslationForm.control}
                name="oto"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="bg-[#1e1e1e] border-white/10 text-white min-h-[100px]"
                        placeholder={t('common.oto', 'Otọ *')} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* OtoOmra */}
              <IdjeFieldArray
                control={editTranslationForm.control}
                name="otoOmra"
                label={t('common.otoOmra', 'OtoOmra (Definition Audio)')} 
                uploadState={translationOtoOmraUploads}
                setUploadState={setTranslationOtoOmraUploads}
                setValue={editTranslationForm.setValue}
              />

              {/* Idje */}
              <IdjeSentenceFieldArray
                control={editTranslationForm.control}
                name="idje"
                label={t('common.idje', 'Udje')} 
                buttonText={t('common.addExample', 'Ba Udje')}
                required={true}
                uploadState={translationIdjeAudioUploads}
                setUploadState={setTranslationIdjeAudioUploads}
                setValue={editTranslationForm.setValue}
              />

              {/* Okpo */}
              <OkpoFieldArray
                lang="ota"
                control={editTranslationForm.control}
                name="okpo"
                label={t('common.okpo', 'Okpo (Synonyms)')} 
              />

              {/* Optional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DynamicFieldArray control={editTranslationForm.control} name="orhan" label={t('common.orhan', 'Orhan (Antonyms)')} required={false} />
                <DynamicFieldArray control={editTranslationForm.control} name="ibuebu" label={t('common.ibuebu', 'Ebuo')} required={false} />
                <DynamicFieldArray control={editTranslationForm.control} name="ekaeruo" label={t('common.ekaeruo', 'Oka Eruo')} required={false} />
                <DynamicFieldArray control={editTranslationForm.control} name="odeUfue" label={t('common.odeUfue', 'OdẹUfue (Scientific Name)')} required={false} />
              </div>

              {/* Language Type - hidden field */}
              <FormField
                control={editTranslationForm.control}
                name="languageType"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input {...field} type="hidden" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4 sm:mt-6">
                <Button
                  type="button"
                  className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] cursor-pointer w-full sm:w-auto"
                  onClick={() => {
                    setEditTranslationModalOpen(false)
                    setEditingTranslation(null)
                    editTranslationForm.reset()
                  }}
                >
                  {t('common.cancel', 'Cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdatingTranslation}
                  className="bg-[#F5DEB3] hover:bg-[#F5DEB3]/90 text-[#1e1e1e] w-full sm:w-auto"
                >
                  {isUpdatingTranslation ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      {t('common.updating', 'Updating')}...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      {t('common.updateTranslation', 'Update Translation')}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Approve Word Confirmation Dialog */}
      <Dialog open={approveModalOpen} onOpenChange={setApproveModalOpen}>
        <DialogContent className="bg-[#1E1E1E] border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">{t('common.approveWord', 'Approve Word')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300 mb-4">
              {t('common.areYouSureYouWantToApproveThisWord', 'Are you sure you want to approve this word? This will mark it as approved and make it visible to users.')}
            </p>
            {word && (
              <div className="bg-[#2a2a2a] rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-400 mb-2">{t('common.word', 'Word')}</p>
                <p className="text-white font-medium">{word.word}</p>
                {word.meaning && (
                  <>
                    <p className="text-sm text-gray-400 mt-2 mb-1">{t('common.meaning', 'Meaning')}</p>
                    <p className="text-white text-sm">{word.meaning}</p>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] cursor-pointer"
              onClick={() => setApproveModalOpen(false)}
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isApproving}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isApproving ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  {t('common.approve', 'Approve')}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Word Confirmation Dialog */}
      <Dialog open={rejectModalOpen} onOpenChange={(open) => {
        setRejectModalOpen(open)
        if (!open) setRejectionReason('')
      }}>
        <DialogContent className="bg-[#1E1E1E] border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">{t('common.rejectWord', 'Reject Word')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300 mb-4">
              {t('common.areYouSureYouWantToRejectThisWord', 'Are you sure you want to reject this word? Please provide a reason for rejection.')}
            </p>
            {word && (
              <div className="bg-[#2a2a2a] rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-400 mb-2">{t('common.word', 'Word')}</p>
                <p className="text-white font-medium">{word.word}</p>
                {word.meaning && (
                  <>
                    <p className="text-sm text-gray-400 mt-2 mb-1">{t('common.meaning', 'Meaning')}</p>
                    <p className="text-white text-sm">{word.meaning}</p>
                  </>
                )}
              </div>
            )}
            <div className="mb-4">
              <Textarea
                placeholder={t('common.rejectionReason', 'Rejection reason (optional)')} 
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="bg-[#1e1e1e] border-white/10 text-white placeholder:text-gray-400 min-h-[100px]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] cursor-pointer"
              onClick={() => {
                setRejectModalOpen(false)
                setRejectionReason('')
              }}
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={handleReject}
              disabled={isRejecting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isRejecting ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <X className="h-4 w-4 mr-1" />
                  {t('common.reject', 'Reject')}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Word Confirmation Dialog */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="bg-[#1E1E1E] border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">{t('common.deleteWord', 'Delete Word')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300 mb-4">
              {t('common.areYouSureYouWantToDeleteThisWord', 'Are you sure you want to delete this word? This action cannot be undone and will permanently remove the word from the dictionary.')}
            </p>
            {word && (
              <div className="bg-[#2a2a2a] rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-400 mb-2">{t('common.word', 'Word')}</p>
                <p className="text-white font-medium">{word.word}</p>
                {word.meaning && (
                  <>
                    <p className="text-sm text-gray-400 mt-2 mb-1">{t('common.meaning', 'Meaning')}</p>
                    <p className="text-white text-sm">{word.meaning}</p>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] cursor-pointer"
              onClick={() => setDeleteModalOpen(false)}
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-1" />
                  {t('common.delete', 'Delete')}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {showKeyboard && (
        <VirtualUrhoboKeyboard
          targetInputId={activeInputId || undefined}
          onClose={() => {
            setShowKeyboard(false)
            setActiveInputId(null)
          }}
        />
      )}
    </div>
  )
}

// Helper component for dynamic field arrays
function DynamicFieldArray({
  control,
  name,
  label,
  required = false,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  name: string;
  label: string;
  required?: boolean;
}) {
  const { fields, append, remove } = useFieldArray({ control, name });

  useEffect(() => {
    if (fields.length === 0) append("");
  }, [fields, append]);

  const { locale } = useLocale()
  const { t } = useTranslation(locale)

  return (
    <div className="mt-4">
      <div className="space-y-2">
        {fields.map((field, idx) => (
          <div key={field.id} className="flex items-center gap-2">
            <Controller
              control={control}
              name={`${name}.${idx}`}
              render={({ field }) => (
                <Input
                  {...field}
                  className="bg-[#1e1e1e] border-white/10 text-white"
                  placeholder={`${label}${required ? ' *' : ''}`}
                />
              )}
            />
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(idx)}
                className="text-red-400 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => append("")}
          className="text-white hover:bg-white/10"
        >
          <Plus className="h-4 w-4 mr-1" /> {t('common.add', 'Add')} {label}
        </Button>
      </div>
    </div>
  );
}

// Helper component for Ekerota field array (multi-select)
function EkerotaFieldArray({
  control,
  name,
  label,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  name: string;
  label: string;
}) {
  const { fields, append, remove } = useFieldArray({ control, name });
  const { locale } = useLocale()
  const { t } = useTranslation(locale)

  useEffect(() => {
    if (fields.length === 0) append("");
  }, [fields, append]);

  const options = ["Odẹ", "ẹdiodẹ", "Odjephia", "Eruo", "Eruodẹ", "Eruoga", "Odjedia", "Ọrhuọ", "Ukperi", "Ubi"];

  return (
    <div className="mt-4">
      <div className="space-y-2">
        {fields.map((field, idx) => (
          <div key={field.id} className="flex items-center gap-2">
            <Controller
              control={control}
              name={`${name}.${idx}`}
              render={({ field }) => (
                <select
                  {...field}
                  className="bg-[#1e1e1e] border border-white/10 rounded-md px-3 py-2 w-full text-white lowercase!"
                >
                  <option value="">{label} *</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt} className="lowercase!">
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
                className="text-red-400 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => append("")}
          className="text-white hover:bg-white/10"
        >
          <Plus className="h-4 w-4 mr-1" /> {t('common.add', 'Add')} {label}
        </Button>
      </div>
    </div>
  );
}

// Helper component for Translation Ekerota field array (multi-select with English/Korean options)
function TranslationEkerotaFieldArray({
  control,
  name,
  label,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  name: string;
  label: string;
}) {
  const { fields, append, remove } = useFieldArray({ control, name });
  const { locale } = useLocale()
  const { t } = useTranslation(locale)

  useEffect(() => {
    if (fields.length === 0) append("");
  }, [fields, append]);

  // Get language type from form to determine options
  const languageType = useWatch({ control, name: 'languageType' }) || 'english';
  const options = languageType === 'english'
    ? ["Noun", "Pronoun", "Adjective", "Verb", "Gerund", "Adverb", "Preposition", "Conjunction", "Interjection", "Numeral"]
    : ["명사", "대명사", "형용사", "동사", "동명사", "부사", "조사", "접속사", "감탄사", "수사"];

  return (
    <div className="mt-4">
      <div className="space-y-2">
        {fields.map((field, idx) => (
          <div key={field.id} className="flex items-center gap-2">
            <Controller
              control={control}
              name={`${name}.${idx}`}
              render={({ field }) => (
                <select
                  {...field}
                  className="bg-[#1e1e1e] border border-white/10 rounded-md px-3 py-2 w-full text-white lowercase!"
                >
                  <option value="">{label} *</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt} className="lowercase!">
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
                className="text-red-400 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => append("")}
          className="text-white hover:bg-white/10"
        >
          <Plus className="h-4 w-4 mr-1" /> {t('common.add', 'Add')} {label}
        </Button>
      </div>
    </div>
  );
}

