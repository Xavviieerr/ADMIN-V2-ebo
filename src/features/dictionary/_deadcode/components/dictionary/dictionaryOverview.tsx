'use client'
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Eye, Edit, X, Star, MessageSquare, Keyboard, BadgeCheck } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { useRouter, usePathname } from 'next/navigation'
import VirtualUrhoboKeyboard from '@/components/virtualUrhoboKeyboard'
import { usePermissions } from '@/hooks/usePermissions'
import LoadingSpinner from '../ui/LoadingSpinner'
import { useGetAllWordsQuery, useSetWordToReviewMutation } from '@/slice/requestSlice'
import { Word as APIWord } from '@/types/fetchWord'
import { toast } from 'sonner'
import { getErrorMessage } from "@/utils/errorHandler";
import TermsConditionsPopup from './TermsConditionsPopup'
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

// Urhobo letters for letter filter strip (display order)
const URHOBO_LETTERS = ['A', 'B', 'C', 'D', 'E', 'Ẹ', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'Ọ', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'Y', 'Z']

// Custom alphabet for sorting
const customAlphabet = 'a b c d e ẹ f g h i j k l m n o ọ p r s t u v w y z'.split(' ').filter(Boolean)

// Create a map for quick lookup of character positions
const alphabetMap = new Map<string, number>()
customAlphabet.forEach((char, index) => {
  alphabetMap.set(char.toLowerCase(), index)
  alphabetMap.set(char.toUpperCase(), index)
})

// Custom sorting function using the custom alphabet
// Sorts words according to the custom alphabet: a b c d e ẹ f g h i j k l m n o ọ p r s t u v w y z
const sortWordsByCustomAlphabet = (words: Word[]): Word[] => {
  if (!words || words.length === 0) return words

  return [...words].sort((a, b) => {
    const wordA = (a.word || '').toLowerCase().trim()
    const wordB = (b.word || '').toLowerCase().trim()

    // Handle empty words
    if (!wordA && !wordB) return 0
    if (!wordA) return 1
    if (!wordB) return -1

    const minLength = Math.min(wordA.length, wordB.length)

    for (let i = 0; i < minLength; i++) {
      const charA = wordA[i]
      const charB = wordB[i]

      // Get positions in custom alphabet (undefined if not found)
      const posA = alphabetMap.get(charA)
      const posB = alphabetMap.get(charB)

      // If both characters are in the custom alphabet, compare by position
      if (posA !== undefined && posB !== undefined) {
        if (posA !== posB) {
          return posA - posB
        }
        continue
      }

      // If only one is in the alphabet, prioritize the one in the alphabet
      if (posA !== undefined && posB === undefined) {
        return -1
      }
      if (posA === undefined && posB !== undefined) {
        return 1
      }

      // If neither is in the alphabet, use standard comparison
      if (charA !== charB) {
        return charA.localeCompare(charB)
      }
    }

    // If all compared characters are equal, shorter word comes first
    return wordA.length - wordB.length
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
  creatorUsername?: string
  dialect?: string
  isStandard?: boolean
  totalRatings: number
  totalReviews: number
  averageRating: number
  reviews?: Review[]
  hasAudio?: boolean
  reviewStatus?: 'in-review' | 'ready-for-review'
  audioUrl?: string
  imageUrl?: string
  allImages?: { url: string; type: string }[]
  allAudio?: string[]
  sensesCount?: number
}

interface Review {
  id: string
  userId: string
  username: string
  rating: number
  comment: string
  createdAt: string
}

interface WordStats {
  approved: number
  rejected: number
  pending: number
  inReview: number
  total: number
}

const STORAGE_KEY_ALL_WORDS_PAGE = 'dictionary_all_words_page'
const STORAGE_KEY_ALL_WORDS_SEARCH = 'dictionary_all_words_search'

// Helper function to generate page numbers for pagination
const getPageNumbers = (currentPage: number, totalPages: number): (number | string)[] => {
  const pages: (number | string)[] = []
  const maxVisible = 4 // Maximum number of page buttons to show

  if (totalPages <= maxVisible) {
    // Show all pages if total is less than max visible
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    if (currentPage <= 3) {
      // Near the beginning
      for (let i = 2; i <= 4; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(totalPages)
    } else if (currentPage >= totalPages - 2) {
      // Near the end
      pages.push('...')
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // In the middle
      pages.push('...')
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(totalPages)
    }
  }

  return pages
}

export default function DictionaryOverview() {
  const { locale } = useLocale()
  const { t } = useTranslation(locale)

  // Initialize searchTerm from localStorage to restore search when coming back
  const [searchTerm, setSearchTerm] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY_ALL_WORDS_SEARCH) || ''
    }
    return ''
  })
  const [moderateFilter, setModerateFilter] = useState('all')
  const [myWordsFilter, setMyWordsFilter] = useState('all')
  const [mediaFilter, setMediaFilter] = useState<'all' | 'hasAudio' | 'noAudio' | 'hasImage' | 'noImage'>('all')
  const [activeTab, setActiveTab] = useState('all-words')
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [selectedLetter, setSelectedLetter] = useState<string>('')

  // Initialize page from localStorage for all-words tab only
  const [page, setPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedPage = localStorage.getItem(STORAGE_KEY_ALL_WORDS_PAGE)
      const storedSearch = localStorage.getItem(STORAGE_KEY_ALL_WORDS_SEARCH)
      // Only restore if we're on all-words tab and search term matches
      if (storedPage && storedSearch === '') {
        const pageNum = parseInt(storedPage, 10)
        if (!isNaN(pageNum) && pageNum > 0) {
          return pageNum
        }
      }
    }
    return 1
  })

  const [limit] = useState(10)
  const [openAccordionValue, setOpenAccordionValue] = useState<string | null>(null)
  const pendingNavigationRef = useRef<string | null>(null)
  const router = useRouter()
  const { hasPermission, isSuperAdmin, currentUser } = usePermissions()
  const pathname = usePathname()

  // When navigating to dictionary: clear search if sidebar "Dictionary" was clicked, otherwise restore from localStorage
  useEffect(() => {
    if (pathname === '/dictionary' && typeof window !== 'undefined') {
      const clearSearchFlag = sessionStorage.getItem('dictionary-clear-search')
      if (clearSearchFlag === '1') {
        sessionStorage.removeItem('dictionary-clear-search')
        setSearchTerm('')
        setSelectedLetter('')
        setPage(1)
        localStorage.setItem(STORAGE_KEY_ALL_WORDS_PAGE, '1')
        localStorage.setItem(STORAGE_KEY_ALL_WORDS_SEARCH, '')
      } else {
        // Restore search term from localStorage when coming back (e.g. from word details)
        const storedSearch = localStorage.getItem(STORAGE_KEY_ALL_WORDS_SEARCH)
        if (storedSearch !== null && storedSearch !== searchTerm) {
          setSearchTerm(storedSearch)
        }
        setPage(1)
        localStorage.setItem(STORAGE_KEY_ALL_WORDS_PAGE, '1')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Listen for nav click events: when Dictionary tab is clicked, clear search and reset pagination
  useEffect(() => {
    const handleNavClick = (event: CustomEvent) => {
      const clickedHref = event.detail?.href
      if (clickedHref === '/dictionary') {
        // Clear any search and letter filter when user clicks Dictionary in sidebar
        setSearchTerm('')
        setSelectedLetter('')
        setPage(1)
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY_ALL_WORDS_PAGE, '1')
          localStorage.setItem(STORAGE_KEY_ALL_WORDS_SEARCH, '')
        }
      }
    }

    window.addEventListener('nav-click', handleNavClick as EventListener)
    return () => {
      window.removeEventListener('nav-click', handleNavClick as EventListener)
    }
  }, [])

  // Helper function to handle accordion value change
  const handleAccordionValueChange = (value: string | undefined) => {
    const pendingNav = pendingNavigationRef.current
    // If trying to close an accordion (value is undefined/null) and we have a pending navigation
    if (!value && pendingNav && openAccordionValue === pendingNav) {
      handleViewWordDetails(pendingNav)
      pendingNavigationRef.current = null
      return
    }
    setOpenAccordionValue(value || null)
    // Clear pending navigation if opening a different accordion
    if (value && value !== pendingNav) {
      pendingNavigationRef.current = null
    }
  }

  // Word moderation mutations

  const [setWordToReview] = useSetWordToReviewMutation()

  // Save page to localStorage when it changes (only for all-words tab)
  useEffect(() => {
    if (activeTab === 'all-words' && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_ALL_WORDS_PAGE, page.toString())
      localStorage.setItem(STORAGE_KEY_ALL_WORDS_SEARCH, searchTerm)
    }
  }, [page, activeTab, searchTerm])

  // Reset page to 1 when search term changes
  const prevSearchTerm = React.useRef(searchTerm)
  useEffect(() => {
    if (prevSearchTerm.current !== searchTerm) {
      setPage(1)
      if (activeTab === 'all-words' && typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_ALL_WORDS_PAGE, '1')
        localStorage.setItem(STORAGE_KEY_ALL_WORDS_SEARCH, searchTerm)
      }
      prevSearchTerm.current = searchTerm
    }
  }, [searchTerm, activeTab])

  // Restore page from localStorage on mount (only for all-words tab)
  const hasRestoredPage = React.useRef(false)
  useEffect(() => {
    if (!hasRestoredPage.current && activeTab === 'all-words' && typeof window !== 'undefined') {
      const storedPage = localStorage.getItem(STORAGE_KEY_ALL_WORDS_PAGE)
      const storedSearch = localStorage.getItem(STORAGE_KEY_ALL_WORDS_SEARCH)
      // Only restore if search term matches
      if (storedPage && storedSearch === searchTerm) {
        const pageNum = parseInt(storedPage, 10)
        if (!isNaN(pageNum) && pageNum > 0) {
          setPage(pageNum)
        }
      }
      hasRestoredPage.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount

  // Reset page to 1 when tab changes (except when switching to all-words)
  const prevActiveTab = React.useRef(activeTab)
  useEffect(() => {
    if (prevActiveTab.current !== activeTab) {
      if (activeTab === 'all-words') {
        // Restore page from localStorage when switching to all-words tab
        if (typeof window !== 'undefined') {
          const storedPage = localStorage.getItem(STORAGE_KEY_ALL_WORDS_PAGE)
          const storedSearch = localStorage.getItem(STORAGE_KEY_ALL_WORDS_SEARCH)
          if (storedPage && storedSearch === searchTerm) {
            const pageNum = parseInt(storedPage, 10)
            if (!isNaN(pageNum) && pageNum > 0) {
              setPage(pageNum)
            } else {
              setPage(1)
            }
          } else {
            setPage(1)
          }
        }
      } else {
        // For other tabs, reset to page 1
        setPage(1)
      }
      prevActiveTab.current = activeTab
    }
  }, [activeTab, searchTerm])


  // Fetch statistics without filters to get accurate counts
  const { data: statsData } = useGetAllWordsQuery({
    page: 1,
    limit: 1, // We only need the pagination info, not the actual data
    sortBy: 'ota',
    sortDir: 'ASC',
  })

  // Determine query parameters for the current active tab
  const queryParams = useMemo(() => {
    const params: {
      page: number;
      limit: number;
      search?: string;
      status?: string;
      createdBy?: string;
      hasAudio?: string;
      hasImage?: string;
      sortBy?: string;
      sortDir?: string;
    } = {
      page,
      limit: activeTab === 'all-words' ? 6 : limit,
      sortBy: 'ota',
      sortDir: 'ASC',
    }

    // Use selected letter as search if available, otherwise use searchTerm
    if (selectedLetter) {
      params.search = selectedLetter
    } else if (searchTerm) {
      params.search = searchTerm
    }

    // Media filter: hasAudio, noAudio, hasImage, noImage
    if (mediaFilter === 'hasAudio') params.hasAudio = 'true'
    else if (mediaFilter === 'noAudio') params.hasAudio = 'false'
    else if (mediaFilter === 'hasImage') params.hasImage = 'true'
    else if (mediaFilter === 'noImage') params.hasImage = 'false'

    // Set status and createdBy based on active tab
    if (activeTab === 'approved') {
      params.status = 'approved'
    } else if (activeTab === 'my-words') {
      // For my-words, always filter by createdBy
      if (currentUser?.id) {
        params.createdBy = currentUser.id
      }
      // Also apply status filter if myWordsFilter is not 'all'
      if (myWordsFilter !== 'all') {
        params.status = myWordsFilter
      }
    } else if (activeTab === 'moderate') {
      // For moderate, apply filter if not 'all'
      if (moderateFilter !== 'all') {
        params.status = moderateFilter
      }
    }
    // For 'all-words' tab, don't set status or createdBy

    return params
  }, [page, limit, searchTerm, activeTab, myWordsFilter, moderateFilter, mediaFilter, currentUser?.id, selectedLetter])

  // Fetch all words from API with different filters based on active tab
  const { data: allWordsData, isLoading: isLoadingAllWords, isFetching: isFetchingAllWords } = useGetAllWordsQuery(queryParams)

  // Map API words to component format
  const mapAPIWordToWord = (apiWord: APIWord): Word => {
    const firstOho = apiWord.oho && apiWord.oho.length > 0 ? apiWord.oho[0] : null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dialect = (apiWord as any).erevwe || (firstOho as any)?.erevwe || '';
    // Standard = show Twitter check, no text. Agbarho is treated as standard (verified) for display.
    const isStandard = dialect?.toLowerCase() === 'standard' || dialect?.toLowerCase() === 'agbarho';

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
      example: (() => {
        if (!firstOho?.idje || !Array.isArray(firstOho.idje) || firstOho.idje.length === 0 || !firstOho.idje[0]) {
          return '';
        }
        const sentence = getIdjeSentence(firstOho.idje[0]);
        return typeof sentence === 'string' ? sentence : String(sentence || '');
      })(),
      partOfSpeech: firstOho?.ekerota?.[0] || '',
      createdAt: apiWord.createdAt,
      status: apiWord.status, // preserve 'in-review' to display explicitly
      author: `${apiWord.createdBy?.firstName || ''} ${apiWord.createdBy?.lastName || ''}`.trim() || 'Unknown',
      creatorUsername: apiWord.createdBy?.username || '',
      dialect,
      isStandard,
      totalRatings: totalRatings,
      totalReviews: totalRatings, // Assuming each rating is a review
      averageRating: averageRating,
      hasAudio: allAudio.length > 0,
      reviewStatus: apiWord.status === 'in-review' ? 'in-review' : 'ready-for-review',
      audioUrl: allAudio[0], // First audio for backward compatibility
      imageUrl: allImages[0]?.url, // First image for backward compatibility
      allImages: allImages, // All images
      allAudio: allAudio, // All audio files
      sensesCount: apiWord.oho?.length || 0, // Number of senses
    }
  }


  const filterMyWordsByStatus = (words: Word[], status: string) => {
    if (status === 'all') return words
    return words.filter(word => {
      if (status === 'in-review') return word.reviewStatus === 'in-review'
      return word.status === status
    })
  }

  // Get processed data for each tab
  const getAllWords = () => {
    if (activeTab !== 'all-words') return []
    if (!allWordsData?.data?.data) return []
    const words = allWordsData.data.data.map(mapAPIWordToWord)
    return sortWordsByCustomAlphabet(words)
  }


  const getMyWords = () => {
    if (activeTab !== 'my-words') return []
    if (!allWordsData?.data?.data) return []
    const allWords = allWordsData.data.data.map(mapAPIWordToWord)
    // For my-words, the API already filters by createdBy, so we just need to filter by status if needed
    const filtered = filterMyWordsByStatus(allWords, myWordsFilter)
    return sortWordsByCustomAlphabet(filtered)
  }

  const getApprovedWords = () => {
    if (activeTab !== 'approved') return []
    if (!allWordsData?.data?.data) return []
    const words = allWordsData.data.data.map(mapAPIWordToWord)
    return sortWordsByCustomAlphabet(words)
  }

  const getModerateWords = () => {
    if (activeTab !== 'moderate') return []
    if (!allWordsData?.data?.data) return []
    const allWords = allWordsData.data.data.map(mapAPIWordToWord)
    // The API already filters by status if moderateFilter is not 'all'
    // But we still need to apply client-side filtering for hasAudio/hasNoAudio
    const filtered = allWords.filter((word: Word) => {
      // Always exclude approved words
      if (word.status === 'approved') return false

      // After filtering out approved, word.status is now: 'pending' | 'rejected' | 'in-review'
      const status = word.status

      // Filter logic - only apply if not already filtered by API
      if (moderateFilter === 'rejected') return status === 'rejected'
      if (moderateFilter === 'in-review') return word.reviewStatus === 'in-review' || status === 'in-review'
      if (moderateFilter === 'hasAudio') return word.hasAudio === true
      if (moderateFilter === 'hasNoAudio') return !word.hasAudio
      if (moderateFilter === 'ready-for-review') return word.reviewStatus === 'ready-for-review'

      // For 'all' filter, show all remaining words (pending, in-review, and rejected)
      if (moderateFilter === 'all') {
        return true
      }

      return true
    })
    return sortWordsByCustomAlphabet(filtered)
  }

  // Get all words from API
  const pagination = allWordsData?.data?.pagination


  // Calculate all words statistics from API (using unfiltered stats)
  const statsPagination = statsData?.data?.pagination
  const allWordsStats: WordStats = {
    approved: statsPagination?.statusCounts?.approved || 0,
    rejected: statsPagination?.statusCounts?.rejected || 0,
    pending: statsPagination?.statusCounts?.pending || 0,
    inReview: statsPagination?.statusCounts?.['in-review'] || 0,
    total: (statsPagination?.statusCounts?.approved || 0) +
      (statsPagination?.statusCounts?.rejected || 0) +
      (statsPagination?.statusCounts?.pending || 0) +
      (statsPagination?.statusCounts?.['in-review'] || 0)
  }

  const handleViewWordDetails = (wordId: string, mode: 'view' | 'edit' = 'view') => {
    // Save current page and search term to localStorage before navigating
    // Save for all-words and my-words tabs (tabs with pagination)
    if ((activeTab === 'all-words' || activeTab === 'my-words') && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_ALL_WORDS_PAGE, page.toString())
      localStorage.setItem(STORAGE_KEY_ALL_WORDS_SEARCH, searchTerm)
    }
    router.push(`/dictionary/word/${wordId}${mode === 'view' ? '?mode=view' : '?mode=edit'}`)
  }


  const handleSetWordToReview = async (wordId: string) => {
    try {
      await setWordToReview({ id: wordId }).unwrap()
      toast.success(t('messages.wordSetToReviewSuccessfully', 'Word set to review successfully!'))
      console.log('Word set to review:', wordId)
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error('Error setting word to review:', error as any)
      toast.error(getErrorMessage(error, t('messages.failedToSetWordToReview', 'Failed to set word to review. Please try again.')))
    }
  }

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
              }`}
          />
        ))}
        <span className="text-sm text-gray-400 ml-1">({rating.toFixed(1)})</span>
      </div>
    )
  }



  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 bg-[#18191f] text-white">
      {/* Terms & Conditions Popup */}
      <TermsConditionsPopup />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8 mt-3 sm:mt-5">
        <h1 className="text-xl sm:text-2xl font-semibold text-white">{t('common.dictionaryOverview', 'Dictionary Overview')}</h1>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">

          {/* Search Input */}
          <div className="relative w-full sm:min-w-[260px] lg:min-w-[300px] z-10">
            <input
              id="dictionary-search-input"
              type="text"
              placeholder={t('common.searchWords', 'Search words...')}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setSelectedLetter('')
              }}
              className="w-full rounded-lg border border-gray-600 bg-transparent py-2 pl-10 pr-20 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffe6b0]"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowKeyboard(!showKeyboard)}
                className="h-5 w-5 text-gray-400 hover:text-gray-200 transition-colors"
                aria-label="Toggle keyboard"
                title="Virtual Keyboard"
              >
                <Keyboard className="h-5 w-5" />
              </button>
              {(searchTerm || selectedLetter) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedLetter('')
                    if (typeof window !== 'undefined') {
                      localStorage.setItem(STORAGE_KEY_ALL_WORDS_SEARCH, '')
                    }
                  }}
                  className="h-5 w-5 text-gray-400 hover:text-gray-200 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Add Word Button */}
          {(isSuperAdmin || hasPermission('add_word')) && (
            <Button
              onClick={() => router.push('/dictionary/addNewWord')}
              className="whitespace-nowrap w-full sm:w-auto"
            >
              {t('common.addWord', 'Add New Word')}
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-4 overflow-x-auto no-scrollbar w-full grid grid-cols-1">
          <TabsList className="inline-flex lg:grid lg:grid-cols-4 bg-[#1E1E1E] border border-white/10 lg:w-full w-max min-w-full text-white!">
            <TabsTrigger value="all-words" className="data-[state=active]:bg-[#F5DEB3]! data-[state=active]:text-[#1e1e1e]! text-white! whitespace-nowrap px-4 lg:w-full shrink-0 font-medium">
              {t('common.all', 'All')}
            </TabsTrigger>
            <TabsTrigger value="approved" className="data-[state=active]:bg-[#F5DEB3]! data-[state=active]:text-[#1e1e1e]! text-white! whitespace-nowrap px-4 lg:w-full shrink-0 font-medium">
              {t('common.approved', 'Approved')}
            </TabsTrigger>
            <TabsTrigger value="my-words" className="data-[state=active]:bg-[#F5DEB3]! data-[state=active]:text-[#1e1e1e]! text-white! whitespace-nowrap px-4 lg:w-full shrink-0 font-medium">
              {t('common.myWords', 'My Words')}
            </TabsTrigger>
            {(isSuperAdmin || hasPermission('moderate_word')) && (
              <TabsTrigger value="moderate" className="data-[state=active]:bg-[#F5DEB3]! data-[state=active]:text-[#1e1e1e]! text-white! whitespace-nowrap px-4 lg:w-full shrink-0 font-medium">
                {t('common.moderateWords', 'Moderate Words')}
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        {/* Urhobo letter strip - filter words by first letter */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 px-0 sm:px-1">
          {URHOBO_LETTERS.map((letter) => {
            const isActive = selectedLetter === letter
            return (
              <button
                key={letter}
                type="button"
                onClick={() => {
                  if (isActive) {
                    setSelectedLetter('')
                  } else {
                    setSelectedLetter(letter)
                    setSearchTerm('')
                    setPage(1)
                  }
                }}
                className={`
                  min-w-8 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border text-sm font-medium
                  transition-colors focus:outline-none focus:ring-2 focus:ring-[#ffe6b0] focus:ring-offset-2 focus:ring-offset-[#18191f]
                  ${isActive
                    ? 'bg-[#F5DEB3] text-[#1e1e1e] border-[#F5DEB3]'
                    : 'bg-[#1E1E1E] text-gray-200 border-white/10 hover:bg-[#2a2a2a] hover:border-white/20'
                  }
                `}
                aria-pressed={isActive}
                aria-label={isActive ? `Filter by ${letter} (click to clear)` : `Filter by ${letter}`}
              >
                {letter}
              </button>
            )
          })}
        </div>

        {/* Media filter: hasAudio, noAudio, hasImage, noImage */}
        <div className="flex flex-wrap gap-2 mb-4 px-0 sm:px-1">
          <Button
            onClick={() => {
              setMediaFilter('all')
              setPage(1)
            }}
            variant={mediaFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            className={mediaFilter === 'all' ? 'bg-[#F5DEB3] text-[#1e1e1e] hover:bg-[#F5DEB3]/90' : 'bg-[#1E1E1E] text-gray-300 hover:bg-[#2a2a2a] border-white/10'}
          >
            {t('common.all', 'All')}
          </Button>
          <Button
            onClick={() => {
              setMediaFilter('hasAudio')
              setPage(1)
            }}
            variant={mediaFilter === 'hasAudio' ? 'default' : 'outline'}
            size="sm"
            className={mediaFilter === 'hasAudio' ? 'bg-[#F5DEB3] text-[#1e1e1e] hover:bg-[#F5DEB3]/90' : 'bg-[#1E1E1E] text-gray-300 hover:bg-[#2a2a2a] border-white/10'}
          >
            {t('common.hasAudio', 'Has Audio')}
          </Button>
          <Button
            onClick={() => {
              setMediaFilter('noAudio')
              setPage(1)
            }}
            variant={mediaFilter === 'noAudio' ? 'default' : 'outline'}
            size="sm"
            className={mediaFilter === 'noAudio' ? 'bg-[#F5DEB3] text-[#1e1e1e] hover:bg-[#F5DEB3]/90' : 'bg-[#1E1E1E] text-gray-300 hover:bg-[#2a2a2a] border-white/10'}
          >
            {t('common.noAudio', 'No Audio')}
          </Button>
          <Button
            onClick={() => {
              setMediaFilter('hasImage')
              setPage(1)
            }}
            variant={mediaFilter === 'hasImage' ? 'default' : 'outline'}
            size="sm"
            className={mediaFilter === 'hasImage' ? 'bg-[#F5DEB3] text-[#1e1e1e] hover:bg-[#F5DEB3]/90' : 'bg-[#1E1E1E] text-gray-300 hover:bg-[#2a2a2a] border-white/10'}
          >
            {t('common.hasImage', 'Has Image')}
          </Button>
          <Button
            onClick={() => {
              setMediaFilter('noImage')
              setPage(1)
            }}
            variant={mediaFilter === 'noImage' ? 'default' : 'outline'}
            size="sm"
            className={mediaFilter === 'noImage' ? 'bg-[#F5DEB3] text-[#1e1e1e] hover:bg-[#F5DEB3]/90' : 'bg-[#1E1E1E] text-gray-300 hover:bg-[#2a2a2a] border-white/10'}
          >
            {t('common.noImage', 'No Image')}
          </Button>
        </div>

        {/* Approved Words Tab */}
        <TabsContent value="approved" className="mt-6">
          <div className="space-y-4">
            {/* Words List */}
            <Accordion
              type="single"
              collapsible
              className="w-full space-y-4"
              value={openAccordionValue || undefined}
              onValueChange={handleAccordionValueChange}
            >
              {getApprovedWords().length > 0 ? (
                getApprovedWords().map((word: Word) => (
                  <AccordionItem
                    key={word.id}
                    value={word.id}
                    className="bg-[#1E1E1E] border border-white/10 rounded-lg overflow-hidden"
                  >
                    <AccordionTrigger
                      className="relative px-4 py-3 flex items-center w-full transition-colors cursor-pointer"
                      onClick={() => {
                        // If accordion is already open, mark for navigation on close
                        if (openAccordionValue === word.id) {
                          pendingNavigationRef.current = word.id
                        }
                      }}
                    >
                      <div className="flex flex-col text-left flex-1 pr-10">
                        <p className="text-[16px] font-semibold text-white inline-flex items-center gap-1.5 flex-wrap">
                          {word.word}
                          {word.allImages?.length ? (
                            <span title={t('common.hasImage', 'Has image in sense')}>
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />
                            </span>
                          ) : null}
                          {word.sensesCount && word.sensesCount > 0 && (
                            <sup className="text-xs text-gray-400 ml-0.5">{word.sensesCount}</sup>
                          )}
                          {word.isStandard ? (
                            <span className="inline-flex items-center shrink-0 text-blue-400" title={t('common.standard', 'Standard')}>
                              <BadgeCheck className="h-4 w-4" />
                            </span>
                          ) : null}
                        </p>
                        {!word.isStandard && word.dialect ? (
                          <div className="flex items-center gap-3 mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-medium">
                              {word.dialect}
                            </span>
                          </div>
                        ) : null}
                        <div className="flex items-center gap-4 mt-1">
                          {renderStarRating(word.averageRating)}
                          <span className="text-xs text-white">
                            {word.totalReviews} reviews
                          </span>
                        </div>
                      </div>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Eye
                          className="h-4 w-4 cursor-pointer hover:text-[#F5DEB3] transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewWordDetails(word.id, 'view')
                          }}
                        />
                        {(isSuperAdmin || hasPermission('edit_word') || hasPermission('add_media') || hasPermission('delete_media')) && (
                          <Edit
                            className="h-4 w-4 cursor-pointer hover:text-[#F5DEB3] transition-colors"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewWordDetails(word.id, 'edit')
                            }}
                          />
                        )}
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-4 py-3">
                      <p className="text-sm text-gray-400">
                        Added by {word.creatorUsername || word.author} on {new Date(word.createdAt).toLocaleDateString()}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))
              ) : (
                <p className="text-center text-gray-400 py-8">
                  {searchTerm ? t('common.noWordsFoundSearch', 'No words found matching your search.') : t('common.noApprovedWordsFound', 'No approved words found.')}
                </p>
              )}
            </Accordion>
          </div>
        </TabsContent>

        {/* My Words Tab */}
        <TabsContent value="my-words" className="mt-6">
          <div className="space-y-6">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
              <Button
                onClick={() => setMyWordsFilter('all')}
                variant={myWordsFilter === 'all' ? 'default' : 'outline'}
                className={myWordsFilter === 'all' ? '' : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a] border-white/10'}
              >
                All
              </Button>
              <Button
                onClick={() => setMyWordsFilter('pending')}
                variant={myWordsFilter === 'pending' ? 'default' : 'outline'}
                className={myWordsFilter === 'pending' ? '' : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a] border-white/10'}
              >
                {t('common.pending', 'Pending')}
              </Button>
              <Button
                onClick={() => setMyWordsFilter('rejected')}
                variant={myWordsFilter === 'rejected' ? 'default' : 'outline'}
                className={myWordsFilter === 'rejected' ? '' : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a] border-white/10'}
              >
                {t('common.rejected', 'Rejected')}
              </Button>
              <Button
                onClick={() => setMyWordsFilter('approved')}
                variant={myWordsFilter === 'approved' ? 'default' : 'outline'}
                className={myWordsFilter === 'approved' ? '' : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a] border-white/10'}
              >
                {t('common.approved', 'Approved')}
              </Button>
              <Button
                onClick={() => setMyWordsFilter('in-review')}
                variant={myWordsFilter === 'in-review' ? 'default' : 'outline'}
                className={myWordsFilter === 'in-review' ? '' : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a] border-white/10'}
              >
                {t('common.inReview', 'In Review')}
              </Button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <div className="bg-[#1E1E1E] border border-white/10 rounded-lg p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-400">{statsData?.data?.pagination?.statusCounts?.approved || 0}</div>
                <div className="text-xs sm:text-sm text-gray-400">{t('common.approved', 'Approved')}</div>
              </div>
              <div className="bg-[#1E1E1E] border border-white/10 rounded-lg p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-red-400">{statsData?.data?.pagination?.statusCounts?.rejected || 0}</div>
                <div className="text-xs sm:text-sm text-gray-400">{t('common.rejected', 'Rejected')}</div>
              </div>
              <div className="bg-[#1E1E1E] border border-white/10 rounded-lg p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-yellow-400">{statsData?.data?.pagination?.statusCounts?.pending || 0}</div>
                <div className="text-xs sm:text-sm text-gray-400">{t('common.pendingReview', 'Pending Review')}</div>
              </div>
              <div className="bg-[#1E1E1E] border border-white/10 rounded-lg p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-400">{statsData?.data?.pagination?.statusCounts?.['in-review'] || 0}</div>
                <div className="text-xs sm:text-sm text-gray-400">{t('common.inReview', 'In Review')}</div>
              </div>
              <div className="bg-[#1E1E1E] border border-white/10 rounded-lg p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {(statsData?.data?.pagination?.statusCounts?.approved || 0) +
                    (statsData?.data?.pagination?.statusCounts?.rejected || 0) +
                    (statsData?.data?.pagination?.statusCounts?.pending || 0) +
                    (statsData?.data?.pagination?.statusCounts?.['in-review'] || 0)}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">{t('common.total', 'Total')}</div>
              </div>
            </div>

            {/* My Words List */}
            <div className="space-y-4">
              {getMyWords().map((word: Word) => (
                <div
                  key={word.id}
                  className="bg-[#1E1E1E] border border-white/10 rounded-lg p-4"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white inline-flex items-center gap-1.5 flex-wrap">
                        {word.word}
                        {word.allImages?.length ? (
                          <span title={t('common.hasImage', 'Has image in sense')}>
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />
                          </span>
                        ) : null}
                        {word.sensesCount && word.sensesCount > 0 && (
                          <sup className="text-xs text-gray-400 ml-0.5">{word.sensesCount}</sup>
                        )}
                        {word.isStandard ? (
                          <span className="inline-flex items-center shrink-0 text-blue-400" title={t('common.standard', 'Standard')}>
                            <BadgeCheck className="h-4 w-4" />
                          </span>
                        ) : null}
                        {" "}
                        <span className="text-white text-sm">- {word.partOfSpeech.toLowerCase()}</span>
                      </h3>
                      {!word.isStandard && word.dialect ? (
                        <div className="flex items-center gap-3 mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-medium">
                            {word.dialect}
                          </span>
                        </div>
                      ) : null}
                      <div className="flex items-center gap-4 mt-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${word.status === 'approved'
                          ? 'bg-green-500/20 text-green-400'
                          : word.status === 'rejected'
                            ? 'bg-red-500/20 text-red-400'
                            : word.status === 'in-review'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                          {word.status === 'in-review'
                            ? t('common.inReview', 'In Review')
                            : word.status.charAt(0).toUpperCase() + word.status.slice(1)}
                        </span>
                        {word.totalRatings > 0 && renderStarRating(word.averageRating)}
                        <span className="text-xs text-white">
                          {word.totalReviews} {word.totalReviews === 1 ? t('common.review', 'review') : t('common.reviews', 'reviews')}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 self-start sm:self-center">
                      <Eye
                        className="h-4 w-4 cursor-pointer hover:text-[#F5DEB3] transition-colors"
                        onClick={() => handleViewWordDetails(word.id, 'view')}
                      />
                      {(isSuperAdmin || hasPermission('edit_word') || hasPermission('add_media') || hasPermission('delete_media')) && (
                        <Edit
                          className="h-4 w-4 cursor-pointer hover:text-[#F5DEB3] transition-colors"
                          onClick={() => handleViewWordDetails(word.id, 'edit')}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="sm:gap-2 mt-6 w-full overflow-x-auto scrollbar-hidden mx-auto">
                  <div className="flex flex-row items-center justify-center gap-1 sm:gap-2 max-w-[100px] mx-auto">
                    <Button
                      onClick={() => setPage(1)}
                      disabled={page === 1}
                      variant="outline"
                      className="shrink-0 border-white/10 hover:bg-[#2a2a2a] text-gray-300 text-xs sm:text-sm px-2 sm:px-3 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      &lt;&lt;&lt;
                    </Button>
                    <Button
                      onClick={() => setPage(page - 1)}
                      disabled={!pagination.hasPrev}
                      variant="outline"
                      className="shrink-0 border-white/10 hover:bg-[#2a2a2a] text-gray-300 text-xs sm:text-sm px-2 sm:px-3 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      &lt;&lt;
                    </Button>
                    {getPageNumbers(page, pagination.totalPages).map((pageNum, index) => (
                      pageNum === '...' ? (
                        <span key={`ellipsis-${index}`} className="text-gray-400 px-1 sm:px-2 text-xs sm:text-sm">
                          ...
                        </span>
                      ) : (
                        <Button
                          key={pageNum}
                          onClick={() => setPage(pageNum as number)}
                          variant={page === pageNum ? "default" : "outline"}
                          className={`shrink-0 border-white/10 text-xs sm:text-sm px-2 sm:px-3 min-w-[32px] sm:min-w-[40px] ${page === pageNum
                            ? "bg-[#F5DEB3] text-[#1e1e1e] hover:bg-[#f5deb3]/90"
                            : "hover:bg-[#2a2a2a] text-gray-300"
                            }`}
                        >
                          {pageNum}
                        </Button>
                      )
                    ))}
                    <Button
                      onClick={() => setPage(page + 1)}
                      disabled={!pagination.hasNext}
                      variant="outline"
                      className="shrink-0 border-white/10 hover:bg-[#2a2a2a] text-gray-300 text-xs sm:text-sm px-2 sm:px-3 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      &gt;&gt;
                    </Button>
                    <Button
                      onClick={() => setPage(pagination.totalPages)}
                      disabled={page === pagination.totalPages}
                      variant="outline"
                      className="shrink-0 border-white/10 hover:bg-[#2a2a2a] text-gray-300 text-xs sm:text-sm px-2 sm:px-3 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      &gt;&gt;&gt;
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* All Words Tab */}
        <TabsContent value="all-words" className="mt-6">
          <div className="space-y-6">
            {/* Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <div className="bg-[#1E1E1E] border border-white/10 rounded-lg p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-400">{allWordsStats.approved}</div>
                <div className="text-xs sm:text-sm text-gray-400">{t('common.approved', 'Approved')}</div>
              </div>
              <div className="bg-[#1E1E1E] border border-white/10 rounded-lg p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-red-400">{allWordsStats.rejected}</div>
                <div className="text-xs sm:text-sm text-gray-400">{t('common.rejected', 'Rejected')}</div>
              </div>
              <div className="bg-[#1E1E1E] border border-white/10 rounded-lg p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-yellow-400">{allWordsStats.pending}</div>
                <div className="text-xs sm:text-sm text-gray-400">{t('common.pendingReview', 'Pending Review')}</div>
              </div>
              <div className="bg-[#1E1E1E] border border-white/10 rounded-lg p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-400">{allWordsStats.inReview}</div>
                <div className="text-xs sm:text-sm text-gray-400">{t('common.inReview', 'In Review')}</div>
              </div>
              <div className="bg-[#1E1E1E] border border-white/10 rounded-lg p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-white">{allWordsStats.total}</div>
                <div className="text-xs sm:text-sm text-gray-400">{t('common.total', 'Total')}</div>
              </div>
            </div>

            {/* Loading State */}
            {(isLoadingAllWords || isFetchingAllWords) && (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            )}

            {/* All Words List */}
            {!isLoadingAllWords && !isFetchingAllWords && (
              <>
                {getAllWords().length > 0 ? (
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-4"
                    value={openAccordionValue || undefined}
                    onValueChange={handleAccordionValueChange}
                  >
                    {getAllWords().map((word: Word) => (
                      <AccordionItem
                        key={word.id}
                        value={word.id}
                        className="bg-[#1E1E1E] border border-white/10 rounded-lg overflow-hidden"
                      >
                        <AccordionTrigger
                          className="relative px-4 py-3 flex items-center w-full transition-colors cursor-pointer"
                          onClick={() => {
                            // If accordion is already open, mark for navigation on close
                            if (openAccordionValue === word.id) {
                              pendingNavigationRef.current = word.id
                            }
                          }}
                        >
                          <div className="flex flex-col text-left flex-1 pr-10">
                            <p className="text-[16px] font-semibold text-white inline-flex items-center gap-1.5 flex-wrap">
                              {word.word}
                              {word.allImages?.length ? (
                                <span title={t('common.hasImage', 'Has image in sense')}>
                                  <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />
                                </span>
                              ) : null}
                              {word.sensesCount && word.sensesCount > 0 && (
                                <sup className="text-xs text-gray-400 ml-0.5">{word.sensesCount}</sup>
                              )}
                              {word.isStandard ? (
                                <span className="inline-flex items-center shrink-0 text-blue-400" title={t('common.standard', 'Standard')}>
                                  <BadgeCheck className="h-4 w-4" />
                                </span>
                              ) : null}
                            </p>
                            {!word.isStandard && word.dialect ? (
                              <div className="flex items-center gap-3 mt-1">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-medium">
                                  {word.dialect}
                                </span>
                              </div>
                            ) : null}
                            {/* Ratings - shown under word in mobile view */}
                            <div className="flex items-center gap-4 mt-1 sm:hidden">
                              {word.totalRatings > 0 && renderStarRating(word.averageRating)}
                              {word.totalRatings > 0 && (
                                <span className="text-xs text-white">
                                  {word.totalReviews} {word.totalReviews === 1 ? t('common.review', 'review') : t('common.reviews', 'reviews')}
                                </span>
                              )}
                              {word.totalRatings === 0 && (
                                <span className="text-xs text-gray-500">
                                  {t('common.noReviewsYet', 'No reviews yet')}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            {/* Ratings - shown on right in desktop view */}
                            <div className="hidden sm:flex items-center gap-4 mt-1">
                              {word.totalRatings > 0 && renderStarRating(word.averageRating)}
                              {word.totalRatings > 0 && (
                                <span className="text-xs text-white">
                                  {word.totalReviews} {word.totalReviews === 1 ? 'review' : 'reviews'}
                                </span>
                              )}
                            </div>
                            {word.totalRatings === 0 && (
                              <span className="hidden sm:inline text-xs text-gray-500">
                                No reviews yet
                              </span>
                            )}
                            <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${word.status === 'approved'
                              ? 'bg-green-500/20 text-green-400'
                              : word.status === 'rejected'
                                ? 'bg-red-500/20 text-red-400'
                                : word.status === 'in-review'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : 'bg-yellow-500/20 text-yellow-400'
                              }`}>
                              {word.status === 'in-review'
                                ? t('common.inReview', 'In Review')
                                : word.status.charAt(0).toUpperCase() + word.status.slice(1)}
                            </span>
                            <Eye
                              className="h-4 w-4 cursor-pointer hover:text-[#F5DEB3] transition-colors"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewWordDetails(word.id, 'view')
                              }}
                            />
                            {(isSuperAdmin || hasPermission('edit_word') || hasPermission('add_media') || hasPermission('delete_media')) && (
                              <Edit
                                className="h-4 w-4 cursor-pointer hover:text-[#F5DEB3] transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleViewWordDetails(word.id, 'edit')
                                }}
                              />
                            )}
                          </div>
                        </AccordionTrigger>

                        <AccordionContent className="px-4 py-3">
                          <p className="text-sm text-gray-400">
                            {t('common.addedBy', 'Added by')} {word.creatorUsername || word.author} {t('common.on', 'on')} {new Date(word.createdAt).toLocaleDateString()}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    {t('common.noWordsFound', 'No words found.')}
                  </div>
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="sm:gap-2 mt-6 w-full overflow-x-auto scrollbar-hidden mx-auto">
                    <div className="flex flex-row items-center justify-center gap-1 sm:gap-2 max-w-[100px] mx-auto">
                      <Button
                        onClick={() => setPage(1)}
                        disabled={page === 1}
                        variant="outline"
                        className="shrink-0 border-white/10 hover:bg-[#2a2a2a] text-gray-300 text-xs sm:text-sm px-2 sm:px-3 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        &lt;&lt;&lt;
                      </Button>
                      <Button
                        onClick={() => setPage(page - 1)}
                        disabled={!pagination.hasPrev}
                        variant="outline"
                        className="shrink-0 border-white/10 hover:bg-[#2a2a2a] text-gray-300 text-xs sm:text-sm px-2 sm:px-3 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        &lt;&lt;
                      </Button>
                      {getPageNumbers(page, pagination.totalPages).map((pageNum, index) => (
                        pageNum === '...' ? (
                          <span key={`ellipsis-${index}`} className="text-gray-400 px-1 sm:px-2 text-xs sm:text-sm">
                            ...
                          </span>
                        ) : (
                          <Button
                            key={pageNum}
                            onClick={() => setPage(pageNum as number)}
                            variant={page === pageNum ? "default" : "outline"}
                            className={`shrink-0 border-white/10 text-xs sm:text-sm px-2 sm:px-3 min-w-[32px] sm:min-w-[40px] ${page === pageNum
                              ? "bg-[#F5DEB3] text-[#1e1e1e] hover:bg-[#f5deb3]/90"
                              : "hover:bg-[#2a2a2a] text-gray-300"
                              }`}
                          >
                            {pageNum}
                          </Button>
                        )
                      ))}
                      <Button
                        onClick={() => setPage(page + 1)}
                        disabled={!pagination.hasNext}
                        variant="outline"
                        className="shrink-0 border-white/10 hover:bg-[#2a2a2a] text-gray-300 text-xs sm:text-sm px-2 sm:px-3 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        &gt;&gt;
                      </Button>
                      <Button
                        onClick={() => setPage(pagination.totalPages)}
                        disabled={page === pagination.totalPages}
                        variant="outline"
                        className="shrink-0 border-white/10 hover:bg-[#2a2a2a] text-gray-300 text-xs sm:text-sm px-2 sm:px-3 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        &gt;&gt;&gt;
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>

        {/* Moderate Words Tab */}
        {(isSuperAdmin || hasPermission('moderate_word')) && (
          <TabsContent value="moderate" className="mt-6">
            <div className="space-y-4">
              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Button
                  onClick={() => setModerateFilter('all')}
                  variant={moderateFilter === 'all' ? 'default' : 'outline'}
                  className={moderateFilter === 'all' ? '' : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a] border-white/10'}
                >
                  All
                </Button>
                <Button
                  onClick={() => setModerateFilter('hasAudio')}
                  variant={moderateFilter === 'hasAudio' ? 'default' : 'outline'}
                  className={moderateFilter === 'hasAudio' ? '' : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a] border-white/10'}
                >
                  {t('common.hasAudio', 'Has Audio')}
                </Button>
                <Button
                  onClick={() => setModerateFilter('hasNoAudio')}
                  variant={moderateFilter === 'hasNoAudio' ? 'default' : 'outline'}
                  className={moderateFilter === 'hasNoAudio' ? '' : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a] border-white/10'}
                >
                  {t('common.hasNoAudio', 'No Audio')}
                </Button>
                <Button
                  onClick={() => setModerateFilter('in-review')}
                  variant={moderateFilter === 'in-review' ? 'default' : 'outline'}
                  className={moderateFilter === 'in-review' ? '' : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a] border-white/10'}
                >
                  {t('common.inReview', 'In Review')}
                </Button>
                <Button
                  onClick={() => setModerateFilter('rejected')}
                  variant={moderateFilter === 'rejected' ? 'default' : 'outline'}
                  className={moderateFilter === 'rejected' ? '' : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a] border-white/10'}
                >
                  {t('common.rejected', 'Rejected')}
                </Button>
              </div>

              {/* Filtered Words List */}
              {getModerateWords().length > 0 ? (
                getModerateWords().map((word: Word) => (
                  <div
                    key={word.id}
                    className="bg-[#1E1E1E] border border-white/10 rounded-lg p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white inline-flex items-center gap-1.5 flex-wrap">
                          {word.word}
                          {word.allImages?.length ? (
                            <span title={t('common.hasImage', 'Has image in sense')}>
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />
                            </span>
                          ) : null}
                          {word.sensesCount && word.sensesCount > 0 && (
                            <sup className="text-xs text-gray-400 ml-0.5">{word.sensesCount}</sup>
                          )}
                          {word.isStandard ? (
                            <span className="inline-flex items-center shrink-0 text-blue-400" title={t('common.standard', 'Standard')}>
                              <BadgeCheck className="h-4 w-4" />
                            </span>
                          ) : null}
                          {" "}
                          <span className="text-white text-sm">- {word.partOfSpeech.toLowerCase()}</span>
                        </h3>
                        {!word.isStandard && word.dialect ? (
                          <div className="flex items-center gap-3 mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-medium">
                              {word.dialect}
                            </span>
                          </div>
                        ) : null}
                        <div className="flex items-center flex-wrap gap-2 sm:gap-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium w-fit ${word.status === 'approved'
                            ? 'bg-green-500/20 text-green-400'
                            : word.status === 'rejected'
                              ? 'bg-red-500/20 text-red-400'
                              : word.status === 'in-review'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                            {word.status === 'in-review'
                              ? t('common.inReview', 'In Review')
                              : word.status.charAt(0).toUpperCase() + word.status.slice(1)}
                          </span>
                          <span className="text-sm text-white">{t('common.by', 'By:')} {word.author}</span>
                          {word.totalRatings > 0 && renderStarRating(word.averageRating)}
                          <span className="text-xs text-white">
                            {word.totalReviews} {word.totalReviews === 1 ? t('common.review', 'review') : t('common.reviews', 'reviews')}
                          </span>
                          <span className="text-xs text-white">
                            {new Date(word.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 lg:ml-4 flex-wrap items-center ">
                        <Eye
                          className="h-4 w-4 cursor-pointer text-white hover:text-[#F5DEB3] transition-colors"
                          onClick={() => handleViewWordDetails(word.id, 'view')}
                        />
                        {(isSuperAdmin || hasPermission('edit_word') || hasPermission('add_media') || hasPermission('delete_media')) && (
                          <Edit
                            className="h-4 w-4 cursor-pointer text-white hover:text-[#F5DEB3] transition-colors"
                            onClick={() => handleViewWordDetails(word.id, 'edit')}
                          />
                        )}
                        {(isSuperAdmin || hasPermission('moderate_word')) &&
                          word.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleSetWordToReview(word.id)}
                              className="bg-yellow-600 hover:bg-yellow-700 text-white"
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              {t('common.review', 'Review')}
                            </Button>
                          )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  {t('common.noWordsFoundFilter', 'No words found for the selected filter.')}
                </div>
              )}
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Virtual Keyboard */}
      {showKeyboard && (
        <VirtualUrhoboKeyboard
          targetInputId="dictionary-search-input"
          onInput={() => {
            const targetInput = document.getElementById('dictionary-search-input') as HTMLInputElement;
            if (targetInput) {
              setSearchTerm(targetInput.value);
              if (typeof window !== 'undefined') {
                localStorage.setItem(STORAGE_KEY_ALL_WORDS_SEARCH, targetInput.value);
              }
            }
          }}
          onClose={() => setShowKeyboard(false)}
        />
      )}
    </div>
  )
}