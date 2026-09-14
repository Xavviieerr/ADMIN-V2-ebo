"use client";

import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  return (
    <div className="flex flex-col w-full text-center items-center mt-20 px-4 font-plus-sans pt-20">
      <h1 className="text-5xl">Oops!</h1>
      <p className="text-base font-normal mt-4 text-gray-500 max-w-md">
        Something went wrong on our end. <br /> If the problem keeps happening,
        reach out to our support team and we&apos;ll sort it out.
      </p>
      <div className="flex gap-4 mt-8">
        <button className="primary-btn" onClick={() => reset()}>
          Try Again
        </button>
        <button onClick={() => router.back()} className="secondary-btn">
          Go Back
        </button>
      </div>
      {error?.digest && (
        <p className="text-xs text-gray-400 mt-6">
          Error reference: {error.digest}
        </p>
      )}
    </div>
  );
}
