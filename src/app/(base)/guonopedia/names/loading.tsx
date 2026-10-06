import { LocaleWrapper } from "@/features/shared";

export default function NamesLoading() {
  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 bg-[#18191f] text-white pb-20" aria-busy="true">
      <span className="sr-only">
        <LocaleWrapper item="common.loading" fallback="Loading..." />
      </span>
      <div className="flex flex-col gap-4 w-full animate-pulse">
        <div className="h-8 w-56 rounded bg-white/10" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl p-5 bg-secondary-bg h-28" />
          ))}
        </div>
        <div className="h-12 w-full rounded bg-white/10 mt-10" />
        <div className="h-64 w-full rounded bg-white/10 mt-8" />
      </div>
    </div>
  );
}
