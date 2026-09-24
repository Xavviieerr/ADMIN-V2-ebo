'use client'

import React, { useState } from 'react'
import { Pencil, Volume2 } from 'lucide-react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '../ui/LoadingSpinner'
import { usePermissions } from '@/hooks/usePermissions'

export default function ListOfWord() {
    const [, setPage] = useState(1)
    const [isLoading] = useState(false)
    const router = useRouter()
    const { hasPermission, isSuperAdmin } = usePermissions()

    // ✅ Dummy data
    const dummyWords = [
        {
            id: '1',
            word: 'Eloquent',
            meaning: 'Fluent or persuasive in speaking or writing.',
            example: 'She gave an eloquent speech about education reform.',
            partOfSpeech: 'Adjective',
            createdAt: '2025-10-05',
        },
        {
            id: '2',
            word: 'Tenacity',
            meaning: 'The quality of being able to grip something firmly; persistence.',
            example: 'His tenacity helped him overcome many obstacles.',
            partOfSpeech: 'Noun',
            createdAt: '2025-09-30',
        },
        {
            id: '3',
            word: 'Ameliorate',
            meaning: 'To make something better or more tolerable.',
            example: 'The reforms were designed to ameliorate living conditions.',
            partOfSpeech: 'Verb',
            createdAt: '2025-09-25',
        },
    ]

    const pagination = {
        page: 1,
        totalPages: 1,
        totalItems: dummyWords.length,
        hasPrev: false,
        hasNext: false,
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6 text-white">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h1 className="text-xl sm:text-2xl font-semibold text-center sm:text-left">
                    Dictionary Overview
                </h1>
                <div className="flex justify-center sm:justify-end">
                    {(isSuperAdmin || hasPermission('add_word')) && (
                        <button
                            onClick={() => router.push(`/dictionary/addNewWord`)}
                            className="bg-[#F5DEB3] text-[#1e1e1e] px-4 py-2 rounded-md font-medium hover:bg-[#f5deb3]/90 transition-colors text-sm sm:text-base"
                        >
                            Add New Word
                        </button>
                    )}
                </div>
            </div>

            {/* Accordion List */}
            <div className="space-y-4">
                <Accordion type="single" collapsible className="w-full space-y-4">
                    {dummyWords.length > 0 ? (
                        dummyWords.map((word) => (
                            <AccordionItem
                                key={word.id}
                                value={word.id}
                                className="bg-[#1E1E1E] border border-white/10 rounded-lg overflow-hidden"
                            >
                                <AccordionTrigger className="relative px-4 py-3 flex items-center w-full transition-colors">
                                    <div className="flex flex-col text-left flex-1 pr-10">
                                        <p className="text-[16px] font-semibold">
                                            {word.word}{" "}
                                            <span className="text-gray-400 text-sm">- {word.partOfSpeech}</span>
                                        </p>
                                        <p className="text-gray-400 text-sm line-clamp-1">{word.meaning}</p>
                                    </div>
                                    <div
                                        className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2"
                                        onClick={(e) => e.stopPropagation()} // Prevents accordion toggle when clicking icons
                                    >
                                        <Pencil
                                            className="h-4 w-4 cursor-pointer hover:text-[#F5DEB3] transition-colors"
                                        />
                                        <Volume2
                                            className="h-4 w-4 cursor-pointer hover:text-[#F5DEB3] transition-colors"
                                        />
                                    </div>
                                </AccordionTrigger>

                                <AccordionContent className="px-4 py-3 ">
                                    <p className="mb-2 text-sm">
                                        <span className="text-[#F5DEB3] font-semibold">Meaning:</span> {word.meaning}
                                    </p>
                                    <p className="mb-2 text-sm">
                                        <span className="text-[#F5DEB3] font-semibold">Example:</span> &quot;{word.example}&quot;
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Added on: {new Date(word.createdAt).toLocaleDateString()}
                                    </p>
                                </AccordionContent>
                            </AccordionItem>
                        ))
                    ) : (
                        <p className="text-center text-gray-400 py-8">
                            No words found. Add a new word to get started.
                        </p>
                    )}
                </Accordion>
            </div>

            {/* Pagination */}
            {pagination && (
                <div className="flex flex-col sm:flex-row items-center justify-between mt-8 text-gray-300 gap-4">
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={!pagination.hasPrev}
                        className="px-4 py-2 rounded-md border border-white/10 hover:bg-[#2a2a2a] disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-center">
                        Page {pagination.page} of {pagination.totalPages} — Total: {pagination.totalItems}
                    </span>
                    <button
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={!pagination.hasNext}
                        className="px-4 py-2 rounded-md border border-white/10 hover:bg-[#2a2a2a] disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}
