'use client'
// import { useDictionaryEntries } from '@/hooks/useApi';
import React, { useEffect, useState } from 'react'
import LoadingSpinner from '../ui/LoadingSpinner';
import { ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon, PencilIcon, PlusIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';

export default function Welcome() {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);
    const { data, loading, execute: fetchEntries } = useDictionaryEntries();

    useEffect(() => {
        fetchEntries({ search: searchTerm });
    }, [fetchEntries, searchTerm]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleEdit = (entryId: string) => {
        console.log('Edit entry:', entryId);
        // Implement edit logic here
    };

    const handleSound = (entryId: string) => {
        console.log('Play sound for entry:', entryId);
        // Implement sound playback logic here
    };

    const handleExpand = (entryId: string) => {
        setExpandedEntryId(expandedEntryId === entryId ? null : entryId);
    };

    const handleAddEntry = () => {
        console.log('Add new entry');
        // Implement logic to add new entry (e.g., open modal)
    };

    if (loading) {
        return (
            <div className="min-h-screen p-4 md:p-8 bg-[#18191f] flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    const entries = data?.entries || [];

    return (
        <div className="min-h-screen p-4 md:p-8 bg-[#18191f] text-white relative">
            {/* Header with Title and Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <h1 className="text-2xl font-semibold">Dictionary</h1>
                <div className="relative w-full max-w-xs">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full rounded-lg border border-gray-600 bg-transparent py-2 pl-10 pr-4 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffe6b0]"
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
            </div>

            {/* Dictionary Entries List */}
            <div className="space-y-6">
                {entries.length === 0 ? (
                    <div className="text-center text-gray-400 py-12">
                        {searchTerm ? 'No entries found matching your search.' : 'No dictionary entries available.'}
                    </div>
                ) : (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    entries.map((entry: { id: React.Key | null | undefined; word: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; category: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; description: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; details: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
                        <div key={entry.id} className="rounded-2xl bg-[#191920] p-6 shadow flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">{entry.word} - {entry.category}</h3>
                                    <p className="text-gray-400 text-sm mt-1">{entry.description}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => entry.id != null ? handleEdit(String(entry.id)) : undefined}
                                        className="p-2 rounded-full hover:bg-[#23232a]"
                                    >
                                        <PencilIcon className="h-5 w-5 text-gray-400" />
                                    </button>
                                    <button
                                        onClick={() => entry.id != null ? handleSound(String(entry.id)) : undefined}
                                        className="p-2 rounded-full hover:bg-[#23232a]"
                                    >
                                        <SpeakerWaveIcon className="h-5 w-5 text-gray-400" />
                                    </button>
                                    <button
                                        onClick={() => entry.id != null ? handleExpand(String(entry.id)) : undefined}
                                        className="p-2 rounded-full hover:bg-[#23232a]"
                                    >
                                        {expandedEntryId === String(entry.id)
                                            ? <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                                            : <ChevronDownIcon className="h-5 w-5 text-gray-400" />}
                                    </button>
                                </div>
                            </div>
                            {expandedEntryId === entry.id && (
                                <div className="mt-4 pt-4 border-t border-[#23232a] text-gray-300">
                                    {entry.details}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Floating Action Button */}
            <button onClick={handleAddEntry} className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#ffe6b0] text-black flex items-center justify-center shadow-lg hover:bg-[#ffd78f] transition">
                <PlusIcon className="h-7 w-7" />
            </button>
        </div>
    )
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useDictionaryEntries(): { data: any; loading: any; error: any; execute: any; } {
    throw new Error('Function not implemented.');
}

