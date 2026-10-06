import { LocaleWrapper } from "@/features/shared";
import Link from "next/link";

export default function NameNotFound() {
  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 text-white">
      <div className="dark-box px-4 w-full py-16 flex flex-col items-center gap-4 text-center">
        <h2 className="text-xl font-medium">
          <LocaleWrapper item="names.notfound.title" fallback="Name not found" />
        </h2>
        <p className="text-sm text-gray-300">
          <LocaleWrapper
            item="names.notfound.body"
            fallback="The requested name does not exist or may have been deleted."
          />
        </p>
        <Link href="/guonopedia/names" className="secondary-btn">
          <LocaleWrapper item="names.notfound.back" fallback="Back to names" />
        </Link>
      </div>
    </div>
  );
}
