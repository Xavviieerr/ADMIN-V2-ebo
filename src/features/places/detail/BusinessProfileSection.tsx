import React from "react";
import { LocaleWrapper } from "@/features/shared";
import type { BusinessProfile } from "../model/types";

// Read-only business-profile display. Rendered only when a profile exists;
// the dashboard never edits profiles (owner-controlled).
const BusinessProfileSection = ({ profile }: { profile: BusinessProfile | null }) => {
  if (!profile) return null;

  const hoursEntries = profile.openingHours ? Object.entries(profile.openingHours) : [];

  return (
    <div className="flex flex-col md:px-8 px-4 py-6 gap-3 bg-gray-txt-100 rounded-md w-full">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-base font-medium">
          <div className="h-3 w-3 rounded-full bg-yellow-600" />
          <h2>
            <LocaleWrapper item="places.detail.businessTitle" fallback="Business Profile" />
          </h2>
        </div>
        <span
          className={`text-xs px-3 py-1 rounded-full ${
            profile.isClaimed ? "bg-green-600/20 text-green-400" : "bg-yellow-600/20 text-yellow-400"
          }`}
        >
          <LocaleWrapper
            item={profile.isClaimed ? "places.detail.claimedBadge" : "places.detail.unclaimedBadge"}
            fallback={profile.isClaimed ? "Claimed" : "Unclaimed"}
          />
        </span>
      </div>

      <ProfileRow label="Category" value={profile.category} />
      <ProfileRow label="Phone" value={profile.phoneNumber} />
      <ProfileRow label="Email" value={profile.email} />
      <ProfileRow label="Website" value={profile.website} />
      {typeof profile.reviewCount === "number" && (
        <ProfileRow label="Reviews" value={String(profile.reviewCount)} />
      )}
      {profile.averageRating !== undefined && (
        <ProfileRow label="Rating" value={String(profile.averageRating)} />
      )}

      {hoursEntries.length > 0 && (
        <div className="flex flex-col gap-1 mt-1">
          <p className="text-sm font-medium">Opening hours</p>
          {hoursEntries.map(([day, hours]) => (
            <p key={day} className="text-sm text-gray-300 capitalize">
              {day}:{" "}
              {hours.closed
                ? "Closed"
                : [hours.open, hours.close].filter(Boolean).join(" – ") || "N/A"}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

function ProfileRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <p className="flex flex-wrap gap-2 max-md:text-sm">
      <span className="shrink-0">{label}:</span>{" "}
      <span className="text-gray-txt-50 break-words min-w-0">{value || "N/A"}</span>
    </p>
  );
}

export default BusinessProfileSection;
