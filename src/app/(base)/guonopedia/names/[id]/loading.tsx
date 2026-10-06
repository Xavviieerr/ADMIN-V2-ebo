import { LocaleWrapper } from "@/features/shared";

export default function SingleNameLoading() {
  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 text-white" aria-busy="true">
      <span className="sr-only">
        <LocaleWrapper item="common.loading" fallback="Loading..." />
      </span>
      <div className="dark-box px-4 w-full space-y-6 pb-20 animate-pulse">
        <div className="h-8 w-48 rounded bg-white/10" />
        <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-10">
          <div className="h-96 rounded-md bg-white/10" />
          <div className="h-96 rounded-md bg-white/10" />
        </div>
      </div>
    </div>
  );
}
