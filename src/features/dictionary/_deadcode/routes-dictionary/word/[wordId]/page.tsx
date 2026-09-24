'use client'	
import { use } from "react";
import WordDetails from "../../../../../components/dictionary/wordDetails";


export default function WordDetailsPage({ params }: { params: Promise<{ wordId: string }> }) {
  const { wordId } = use(params);
  return (
    <div className="min-h-screen p-4 md:p-4 bg-[#18191f] text-white relative">
      <WordDetails wordId={wordId} />
    </div>
  );
}
