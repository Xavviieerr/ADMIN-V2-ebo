// Single ownership area for Places domain types.
// Verified against live backend responses (see audit lifecycle probes).
// Backend envelopes: success { data, message }; validation 400 { message: string[], error, statusCode }.
// Nearby shape differs: { data: { data, total, totalPages }, message }.

export type PlaceType =
  | "business"
  | "landmark"
  | "school"
  | "hospital"
  | "church"
  | "government_office"
  | "historical_site"
  | "cultural_institution"
  | "community"
  | "village"
  | "city"
  | "river"
  | "park"
  | "mountain"
  | "beach"
  | "island"
  | "other";

export type PlaceStatus = "pending" | "approved" | "rejected" | "in-review";

export type VerificationStatus = "unverified" | "community_verified" | "guono_verified";

export type BusinessCategory =
  | "restaurant"
  | "hotel"
  | "pharmacy"
  | "store"
  | "company"
  | "salon"
  | "clinic"
  | "bank"
  | "school"
  | "hospital"
  | "other";

export type ClaimStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "deleted"
  | "archived"
  | "in_review";

export type DayHours = { open?: string; close?: string; closed?: boolean };

export type OpeningHours = Record<string, DayHours>;

export type PlaceLocation = {
  id?: string;
  placeId?: string;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  address?: string | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
  createdAt?: string;
  updatedAt?: string;
};

export type BusinessProfile = {
  id: string;
  placeId: string;
  phoneNumber?: string | null;
  email?: string | null;
  website?: string | null;
  category: string;
  openingHours?: OpeningHours | null;
  logo?: string | null;
  businessVerificationLevel?: string;
  averageRating?: string;
  reviewCount?: number;
  ownerId?: string | null;
  isClaimed?: boolean;
  claimedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type PlaceCreator = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
};

// List item shape: summary subset returned by GET /places.
export type PlaceListItem = {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  createdBy: PlaceCreator | null;
  location: PlaceLocation | null;
  businessProfile: BusinessProfile | null;
  createdAt: string;
  updatedAt: string;
};

export type PlacesPage = {
  items: PlaceListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

// Full detail shape returned by GET /places/:id and write responses.
export type RelatedPlaceEntry = {
  id: string;
  placeId: string;
  relatedPlaceId: string;
  relationNote?: string | null;
  createdAt?: string;
  relatedPlace?: PlaceListItem;
};

export type PlaceDetail = {
  id: string;
  name: string;
  description: string;
  type: string;
  coverImage?: string | null;
  images?: string[];
  verificationStatus?: string;
  tags?: string[];
  viewCount?: number;
  status: string;
  submissionType?: string;
  suggestedById?: string | null;
  createdById?: string | null;
  approvedBy?: string | null;
  rejectedBy?: string | null;
  rejectionReason?: string | null;
  metadata?: unknown[];
  location?: PlaceLocation | null;
  businessProfile?: BusinessProfile | null;
  relatedPlaces?: RelatedPlaceEntry[];
  rowVersion?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
};

export type PlaceStats = {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  businesses: number;
  claimed: number;
  pendingClaims: number;
};

export type OwnershipClaim = {
  id: string;
  businessProfileId: string;
  userId: string;
  proofDocuments?: string[];
  note?: string | null;
  status: string;
  reviewedBy?: string | null;
  rejectionReason?: string | null;
  createdAt?: string;
  updatedAt?: string;
  businessProfile?: { id: string; phoneNumber?: string | null; email?: string | null };
  user?: { id: string; email?: string; username?: string };
};

export type ClaimsPage = {
  items: OwnershipClaim[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type PlaceReview = {
  id: string;
  businessProfileId: string;
  userId: string;
  rating: number;
  comment: string;
  ownerResponse?: string | null;
  ownerRespondedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ReviewsPage = {
  items: PlaceReview[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type RelatedLink = {
  id: string;
  placeId: string;
  relatedPlaceId: string;
  relationNote?: string | null;
  createdAt?: string;
};

// List URL-filter contract (client toolbar + server feature read the same keys).
export type PlacesToolbarFilters = {
  search: string;
  type: string;
  status: string;
  sortDir: string;
};

// Route contract for /guonopedia/places searchParams.
export type PlacesSearchParams = {
  page?: string;
  search?: string;
  type?: string;
  status?: string;
  sortBy?: string;
  sortDir?: string;
  createdBy?: string;
};
